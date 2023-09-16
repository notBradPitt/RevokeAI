---
title: RevokeAI Binary Installer
---

The RevokeAI binary installer is a shell script that will install RevokeAI onto a stock
computer running recent versions of Linux, MacOSX or Windows. It will leave you
with a version that runs a stable version of RevokeAI. When a new version of
RevokeAI is released, you will download and reinstall the new version.

If you wish to tinker with unreleased versions of RevokeAI that introduce
potentially unstable new features, you should consider using the
[source installer](INSTALL_SOURCE.md) or one of the
[manual install](../020_INSTALL_MANUAL.md) methods.

**Important Caveats**
  - This script does not support AMD GPUs. For Linux AMD support,
    please use the manual or source code installer methods.

  - This script has difficulty on some Macintosh machines
    that have previously been used for Python development due to
    conflicting development tools versions. Mac developers may wish
    to try the source code installer or one of the manual methods instead.

!!! todo

    Before you begin, make sure that you meet
    the[hardware requirements](/#hardware-requirements) and has the
    appropriate GPU drivers installed. In particular, if you are a Linux user with
    an AMD GPU installed, you may need to install the
    [ROCm-driver](https://rocmdocs.amd.com/en/latest/Installation_Guide/Installation-Guide.html).

Installation requires roughly 18G of free disk space to load the libraries and
recommended model weights files.

## Steps to Install

1. Download the
   [latest release](https://github.com/revoke-ai/RevokeAI/releases/latest) of
   RevokeAI's installer for your platform. Look for a file named `RevokeAI-binary-<your platform>.zip`

2. Place the downloaded package someplace where you have plenty of HDD space,
   and have full permissions (i.e. `~/` on Lin/Mac; your home folder on Windows)

3. Extract the 'RevokeAI' folder from the downloaded package

4. Open the extracted 'RevokeAI' folder

5. Double-click 'install.bat' (Windows), or 'install.sh' (Lin/Mac) (or run from
   a terminal)

6. Follow the prompts

7. After installation, please run the 'revoke.bat' file (on Windows) or
   'revoke.sh' file (on Linux/Mac) to start RevokeAI.

## Troubleshooting

If you run into problems during or after installation, the RevokeAI team is
available to help you. Either create an
[Issue](https://github.com/revoke-ai/RevokeAI/issues) at our GitHub site, or
make a request for help on the "bugs-and-support" channel of our
[Discord server](https://discord.gg/ZmtBAhwWhy). We are a 100% volunteer
organization, but typically somebody will be available to help you within 24
hours, and often much sooner.