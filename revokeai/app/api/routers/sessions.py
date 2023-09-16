# Copyright (c) 2022 Kyle Schouviller (https://github.com/kyle0654)

from typing import Annotated, Optional, Union

from fastapi import Body, HTTPException, Path, Query, Response
from fastapi.routing import APIRouter
from pydantic.fields import Field

# Importing * is bad karma but needed here for node detection
from ...invocations import *  # noqa: F401 F403
from ...invocations.baseinvocation import BaseInvocation
from ...services.graph import Edge, EdgeConnection, Graph, GraphExecutionState, NodeAlreadyExecutedError
from ...services.item_storage import PaginatedResults
from ..dependencies import ApiDependencies

session_router = APIRouter(prefix="/v1/sessions", tags=["sessions"])


@session_router.post(
    "/",
    operation_id="create_session",
    responses={
        200: {"model": GraphExecutionState},
        400: {"description": "Invalid json"},
    },
)
async def create_session(
    graph: Optional[Graph] = Body(default=None, description="The graph to initialize the session with")
) -> GraphExecutionState:
    """Creates a new session, optionally initializing it with an invocation graph"""
    session = ApiDependencies.revoker.create_execution_state(graph)
    return session


@session_router.get(
    "/",
    operation_id="list_sessions",
    responses={200: {"model": PaginatedResults[GraphExecutionState]}},
)
async def list_sessions(
    page: int = Query(default=0, description="The page of results to get"),
    per_page: int = Query(default=10, description="The number of results per page"),
    query: str = Query(default="", description="The query string to search for"),
) -> PaginatedResults[GraphExecutionState]:
    """Gets a list of sessions, optionally searching"""
    if query == "":
        result = ApiDependencies.revoker.services.graph_execution_manager.list(page, per_page)
    else:
        result = ApiDependencies.revoker.services.graph_execution_manager.search(query, page, per_page)
    return result


@session_router.get(
    "/{session_id}",
    operation_id="get_session",
    responses={
        200: {"model": GraphExecutionState},
        404: {"description": "Session not found"},
    },
)
async def get_session(
    session_id: str = Path(description="The id of the session to get"),
) -> GraphExecutionState:
    """Gets a session"""
    session = ApiDependencies.revoker.services.graph_execution_manager.get(session_id)
    if session is None:
        raise HTTPException(status_code=404)
    else:
        return session


@session_router.post(
    "/{session_id}/nodes",
    operation_id="add_node",
    responses={
        200: {"model": str},
        400: {"description": "Invalid node or link"},
        404: {"description": "Session not found"},
    },
)
async def add_node(
    session_id: str = Path(description="The id of the session"),
    node: Annotated[Union[BaseInvocation.get_invocations()], Field(discriminator="type")] = Body(  # type: ignore
        description="The node to add"
    ),
) -> str:
    """Adds a node to the graph"""
    session = ApiDependencies.revoker.services.graph_execution_manager.get(session_id)
    if session is None:
        raise HTTPException(status_code=404)

    try:
        session.add_node(node)
        ApiDependencies.revoker.services.graph_execution_manager.set(
            session
        )  # TODO: can this be done automatically, or add node through an API?
        return session.id
    except NodeAlreadyExecutedError:
        raise HTTPException(status_code=400)
    except IndexError:
        raise HTTPException(status_code=400)


@session_router.put(
    "/{session_id}/nodes/{node_path}",
    operation_id="update_node",
    responses={
        200: {"model": GraphExecutionState},
        400: {"description": "Invalid node or link"},
        404: {"description": "Session not found"},
    },
)
async def update_node(
    session_id: str = Path(description="The id of the session"),
    node_path: str = Path(description="The path to the node in the graph"),
    node: Annotated[Union[BaseInvocation.get_invocations()], Field(discriminator="type")] = Body(  # type: ignore
        description="The new node"
    ),
) -> GraphExecutionState:
    """Updates a node in the graph and removes all linked edges"""
    session = ApiDependencies.revoker.services.graph_execution_manager.get(session_id)
    if session is None:
        raise HTTPException(status_code=404)

    try:
        session.update_node(node_path, node)
        ApiDependencies.revoker.services.graph_execution_manager.set(
            session
        )  # TODO: can this be done automatically, or add node through an API?
        return session
    except NodeAlreadyExecutedError:
        raise HTTPException(status_code=400)
    except IndexError:
        raise HTTPException(status_code=400)


@session_router.delete(
    "/{session_id}/nodes/{node_path}",
    operation_id="delete_node",
    responses={
        200: {"model": GraphExecutionState},
        400: {"description": "Invalid node or link"},
        404: {"description": "Session not found"},
    },
)
async def delete_node(
    session_id: str = Path(description="The id of the session"),
    node_path: str = Path(description="The path to the node to delete"),
) -> GraphExecutionState:
    """Deletes a node in the graph and removes all linked edges"""
    session = ApiDependencies.revoker.services.graph_execution_manager.get(session_id)
    if session is None:
        raise HTTPException(status_code=404)

    try:
        session.delete_node(node_path)
        ApiDependencies.revoker.services.graph_execution_manager.set(
            session
        )  # TODO: can this be done automatically, or add node through an API?
        return session
    except NodeAlreadyExecutedError:
        raise HTTPException(status_code=400)
    except IndexError:
        raise HTTPException(status_code=400)


@session_router.post(
    "/{session_id}/edges",
    operation_id="add_edge",
    responses={
        200: {"model": GraphExecutionState},
        400: {"description": "Invalid node or link"},
        404: {"description": "Session not found"},
    },
)
async def add_edge(
    session_id: str = Path(description="The id of the session"),
    edge: Edge = Body(description="The edge to add"),
) -> GraphExecutionState:
    """Adds an edge to the graph"""
    session = ApiDependencies.revoker.services.graph_execution_manager.get(session_id)
    if session is None:
        raise HTTPException(status_code=404)

    try:
        session.add_edge(edge)
        ApiDependencies.revoker.services.graph_execution_manager.set(
            session
        )  # TODO: can this be done automatically, or add node through an API?
        return session
    except NodeAlreadyExecutedError:
        raise HTTPException(status_code=400)
    except IndexError:
        raise HTTPException(status_code=400)


# TODO: the edge being in the path here is really ugly, find a better solution
@session_router.delete(
    "/{session_id}/edges/{from_node_id}/{from_field}/{to_node_id}/{to_field}",
    operation_id="delete_edge",
    responses={
        200: {"model": GraphExecutionState},
        400: {"description": "Invalid node or link"},
        404: {"description": "Session not found"},
    },
)
async def delete_edge(
    session_id: str = Path(description="The id of the session"),
    from_node_id: str = Path(description="The id of the node the edge is coming from"),
    from_field: str = Path(description="The field of the node the edge is coming from"),
    to_node_id: str = Path(description="The id of the node the edge is going to"),
    to_field: str = Path(description="The field of the node the edge is going to"),
) -> GraphExecutionState:
    """Deletes an edge from the graph"""
    session = ApiDependencies.revoker.services.graph_execution_manager.get(session_id)
    if session is None:
        raise HTTPException(status_code=404)

    try:
        edge = Edge(
            source=EdgeConnection(node_id=from_node_id, field=from_field),
            destination=EdgeConnection(node_id=to_node_id, field=to_field),
        )
        session.delete_edge(edge)
        ApiDependencies.revoker.services.graph_execution_manager.set(
            session
        )  # TODO: can this be done automatically, or add node through an API?
        return session
    except NodeAlreadyExecutedError:
        raise HTTPException(status_code=400)
    except IndexError:
        raise HTTPException(status_code=400)


@session_router.put(
    "/{session_id}/revoke",
    operation_id="revoke_session",
    responses={
        200: {"model": None},
        202: {"description": "The invocation is queued"},
        400: {"description": "The session has no invocations ready to revoke"},
        404: {"description": "Session not found"},
    },
)
async def revoke_session(
    session_id: str = Path(description="The id of the session to revoke"),
    all: bool = Query(default=False, description="Whether or not to revoke all remaining invocations"),
) -> Response:
    """Revokes a session"""
    session = ApiDependencies.revoker.services.graph_execution_manager.get(session_id)
    if session is None:
        raise HTTPException(status_code=404)

    if session.is_complete():
        raise HTTPException(status_code=400)

    ApiDependencies.revoker.revoke(session, revoke_all=all)
    return Response(status_code=202)


@session_router.delete(
    "/{session_id}/revoke",
    operation_id="cancel_session_revoke",
    responses={202: {"description": "The invocation is canceled"}},
)
async def cancel_session_revoke(
    session_id: str = Path(description="The id of the session to cancel"),
) -> Response:
    """Revokes a session"""
    ApiDependencies.revoker.cancel(session_id)
    return Response(status_code=202)
