import os
from pathlib import Path
from typing import Any

import pytest
from omegaconf import OmegaConf
from pydantic import ValidationError


@pytest.fixture
def patch_rootdir(tmp_path: Path, monkeypatch: Any) -> None:
    """This may be overkill since the current tests don't need the root dir to exist"""
    monkeypatch.setenv("REVOKEAI_ROOT", str(tmp_path))


init1 = OmegaConf.create(
    """
RevokeAI:
  Features:
    always_use_cpu: false
  Memory/Performance:
    max_cache_size: 5
    tiled_decode: false
"""
)

init2 = OmegaConf.create(
    """
RevokeAI:
  Features:
    always_use_cpu: true
  Memory/Performance:
    max_cache_size: 2
    tiled_decode: true
"""
)

init3 = OmegaConf.create(
    """
RevokeAI:
  Generation:
    sequential_guidance: true
    attention_type: xformers
    attention_slice_size: 7
    forced_tiled_decode: True
  Device:
    device: cpu
  Model Cache:
    ram: 1.25
"""
)


def test_use_init(patch_rootdir):
    # note that we explicitly set omegaconf dict and argv here
    # so that the values aren't read from ~revokeai/revokeai.yaml and
    # sys.argv respectively.
    from revokeai.app.services.config import RevokeAIAppConfig

    conf1 = RevokeAIAppConfig.get_config()
    assert conf1
    conf1.parse_args(conf=init1, argv=[])
    assert not conf1.tiled_decode
    assert conf1.max_cache_size == 5
    assert not conf1.always_use_cpu

    conf2 = RevokeAIAppConfig.get_config()
    assert conf2
    conf2.parse_args(conf=init2, argv=[])
    assert conf2.tiled_decode
    assert conf2.max_cache_size == 2
    assert not hasattr(conf2, "invalid_attribute")


def test_legacy():
    from revokeai.app.services.config import RevokeAIAppConfig

    conf = RevokeAIAppConfig.get_config()
    assert conf
    conf.parse_args(conf=init3, argv=[])
    assert conf.xformers_enabled
    assert conf.device == "cpu"
    assert conf.use_cpu
    assert conf.ram == 1.25
    assert conf.ram_cache_size == 1.25


def test_argv_override():
    from revokeai.app.services.config import RevokeAIAppConfig

    conf = RevokeAIAppConfig.get_config()
    conf.parse_args(conf=init1, argv=["--always_use_cpu", "--max_cache=10"])
    assert conf.always_use_cpu
    assert conf.max_cache_size == 10
    assert conf.outdir == Path("outputs")  # this is the default


def test_env_override(patch_rootdir):
    from revokeai.app.services.config import RevokeAIAppConfig

    # argv overrides
    conf = RevokeAIAppConfig()
    conf.parse_args(conf=init1, argv=["--max_cache=10"])
    assert conf.always_use_cpu is False
    os.environ["REVOKEAI_always_use_cpu"] = "True"
    conf.parse_args(conf=init1, argv=["--max_cache=10"])
    assert conf.always_use_cpu is True

    # environment variables should be case insensitive
    os.environ["RevokeAI_Max_Cache_Size"] = "15"
    conf = RevokeAIAppConfig()
    conf.parse_args(conf=init1, argv=[])
    assert conf.max_cache_size == 15

    conf = RevokeAIAppConfig()
    conf.parse_args(conf=init1, argv=["--no-always_use_cpu", "--max_cache=10"])
    assert conf.always_use_cpu is False
    assert conf.max_cache_size == 10

    conf = RevokeAIAppConfig.get_config(max_cache_size=20)
    conf.parse_args(conf=init1, argv=[])
    assert conf.max_cache_size == 20


def test_root_resists_cwd(patch_rootdir):
    from revokeai.app.services.config import RevokeAIAppConfig

    previous = os.environ["REVOKEAI_ROOT"]
    cwd = Path(os.getcwd()).resolve()

    os.environ["REVOKEAI_ROOT"] = "."
    conf = RevokeAIAppConfig.get_config()
    conf.parse_args([])
    assert conf.root_path == cwd

    os.chdir("..")
    assert conf.root_path == cwd
    os.environ["REVOKEAI_ROOT"] = previous
    os.chdir(cwd)


def test_type_coercion(patch_rootdir):
    from revokeai.app.services.config import RevokeAIAppConfig

    conf = RevokeAIAppConfig().get_config()
    conf.parse_args(argv=["--root=/tmp/foobar"])
    assert conf.root == Path("/tmp/foobar")
    assert isinstance(conf.root, Path)
    conf = RevokeAIAppConfig.get_config(root="/tmp/different")
    conf.parse_args(argv=["--root=/tmp/foobar"])
    assert conf.root == Path("/tmp/different")
    assert isinstance(conf.root, Path)


@pytest.mark.xfail(
    reason="""
    This test fails when run as part of the full test suite.

    This test needs to deny nodes from being included in the InvocationsUnion by providing
    an app configuration as a test fixture. Pytest executes all test files before running
    tests, so the app configuration is already initialized by the time this test runs, and
    the InvocationUnion is already created and the denied nodes are not omitted from it.

    This test passes when `test_config.py` is tested in isolation.

    Perhaps a solution would be to call `RevokeAIAppConfig.get_config().parse_args()` in
    other test files?
    """
)
def test_deny_nodes(patch_rootdir):
    from revokeai.app.services.config import RevokeAIAppConfig

    # Allow integer, string and float, but explicitly deny float
    allow_deny_nodes_conf = OmegaConf.create(
        """
        RevokeAI:
          Nodes:
            allow_nodes:
              - integer
              - string
              - float
            deny_nodes:
              - float
        """
    )
    # must parse config before importing Graph, so its nodes union uses the config
    conf = RevokeAIAppConfig().get_config()
    conf.parse_args(conf=allow_deny_nodes_conf, argv=[])
    from revokeai.app.services.graph import Graph

    # confirm graph validation fails when using denied node
    Graph(nodes={"1": {"id": "1", "type": "integer"}})
    Graph(nodes={"1": {"id": "1", "type": "string"}})

    with pytest.raises(ValidationError):
        Graph(nodes={"1": {"id": "1", "type": "float"}})

    from revokeai.app.invocations.baseinvocation import BaseInvocation

    # confirm invocations union will not have denied nodes
    all_invocations = BaseInvocation.get_invocations()

    has_integer = len([i for i in all_invocations if i.__fields__.get("type").default == "integer"]) == 1
    has_string = len([i for i in all_invocations if i.__fields__.get("type").default == "string"]) == 1
    has_float = len([i for i in all_invocations if i.__fields__.get("type").default == "float"]) == 1

    assert has_integer
    assert has_string
    assert not has_float
