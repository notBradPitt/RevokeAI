#!/usr/bin/env python
# Copyright (c) 2022 Lincoln D. Stein (https://github.com/lstein)

import warnings

from revokeai.frontend.install.revokeai_configure import revokeai_configure as configure

if __name__ == "__main__":
    warnings.warn("configure_revokeai.py is deprecated, running 'revokeai-configure'...", DeprecationWarning)
    configure()
