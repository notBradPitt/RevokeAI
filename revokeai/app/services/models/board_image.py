from pydantic import Field

from revokeai.app.util.model_exclude_null import BaseModelExcludeNull


class BoardImage(BaseModelExcludeNull):
    board_id: str = Field(description="The id of the board")
    image_name: str = Field(description="The name of the image")
