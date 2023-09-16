#!/usr/bin/env python

# Copyright (c) 2022 Kyle Schouviller (https://github.com/kyle0654)

import logging
import os

logging.getLogger("xformers").addFilter(lambda record: "A matching Triton is not available" not in record.getMessage())


def main():
    # Change working directory to the repo root
    os.chdir(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

    # TODO: Parse some top-level args here.
    from revokeai.app.cli_app import revoke_cli

    revoke_cli()


if __name__ == "__main__":
    main()
