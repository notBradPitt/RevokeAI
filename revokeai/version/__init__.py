"""
initialization file for revokeai
"""
from .revokeai_version import __version__  # noqa: F401

__app_id__ = "revoke-ai/RevokeAI"
__app_name__ = "RevokeAI"


def _ignore_xformers_triton_message_on_windows():
    import logging

    logging.getLogger("xformers").addFilter(
        lambda record: "A matching Triton is not available" not in record.getMessage()
    )


# In order to be effective, this needs to happen before anything could possibly import xformers.
_ignore_xformers_triton_message_on_windows()
