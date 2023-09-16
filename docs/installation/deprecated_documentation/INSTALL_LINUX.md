---
title: Manual Installation, Linux
---

# :fontawesome-brands-linux: Linux

## Installation

1.  You will need to install the following prerequisites if they are not already
    available. Use your operating system's preferred installer.

    - Python (version 3.8.5 recommended; higher may work)
    - git

2.  Install the Python Anaconda environment manager.

    ```bash
    ~$  wget https://repo.anaconda.com/archive/Anaconda3-2022.05-Linux-x86_64.sh
    ~$  chmod +x Anaconda3-2022.05-Linux-x86_64.sh
    ~$  ./Anaconda3-2022.05-Linux-x86_64.sh
    ```

    After installing anaconda, you should log out of your system and log back
    in. If the installation worked, your command prompt will be prefixed by the
    name of the current anaconda environment - `(base)`.

3.  Copy the RevokeAI source code from GitHub:

    ```bash
    (base) ~$ git clone https://github.com/revoke-ai/RevokeAI.git
    ```

    This will create RevokeAI folder where you will follow the rest of the
    steps.

4.  Enter the newly-created RevokeAI folder. From this step forward make sure
    that you are working in the RevokeAI directory!

    ```bash
    (base) ~$ cd RevokeAI
    (base) ~/RevokeAI$
    ```

5.  Use anaconda to copy necessary python packages, create a new python
    environment named `revokeai` and then activate the environment.

    !!! todo "For systems with a CUDA (Nvidia) card:"

       ```bash
       (base) rm -rf src      # (this is a precaution in case there is already a src directory)
       (base) ~/RevokeAI$ conda env create -f environment-cuda.yml
       (base) ~/RevokeAI$ conda activate revokeai
       (revokeai) ~/RevokeAI$
       ```

    !!! todo "For systems with an AMD card (using ROCm driver):"

       ```bash
       (base) rm -rf src      # (this is a precaution in case there is already a src directory)
       (base) ~/RevokeAI$ conda env create -f environment-AMD.yml
       (base) ~/RevokeAI$ conda activate revokeai
       (revokeai) ~/RevokeAI$
       ```

    After these steps, your command prompt will be prefixed by `(revokeai)` as
    shown above.

6.  Load the big stable diffusion weights files and a couple of smaller
    machine-learning models:

    ```bash
    (revokeai) ~/RevokeAI$ python3 scripts/configure_revokeai.py
    ```

    !!! note

        This script will lead you through the process of creating an account on Hugging Face,
        accepting the terms and conditions of the Stable Diffusion model license,
        and obtaining an access token for downloading. It will then download and
        install the weights files for you.

        Please look [here](../INSTALL_MANUAL.md) for a manual process for doing
        the same thing.

7.  Start generating images!

    !!! todo "Run RevokeAI!"

        !!! warning "IMPORTANT"

            Make sure that the conda environment is activated, which should create
            `(revokeai)` in front of your prompt!

        === "CLI"

            ```bash
            python scripts/revoke.py
            ```

        === "local Webserver"

            ```bash
            python scripts/revoke.py --web
            ```

        === "Public Webserver"

            ```bash
            python scripts/revoke.py --web --host 0.0.0.0
            ```

        To use an alternative model you may revoke the `!switch` command in
        the CLI, or pass `--model <model_name>` during `revoke.py` launch for
        either the CLI or the Web UI. See [Command Line
        Client](../../features/CLI.md#model-selection-and-importation). The
        model names are defined in `configs/models.yaml`.

8. Subsequently, to relaunch the script, be sure to run "conda activate
   revokeai" (step 5, second command), enter the `RevokeAI` directory, and then
   launch the revoke script (step 8). If you forget to activate the 'revokeai'
   environment, the script will fail with multiple `ModuleNotFound` errors.

## Updating to newer versions of the script

This distribution is changing rapidly. If you used the `git clone` method
(step 5) to download the RevokeAI directory, then to update to the latest and
greatest version, launch the Anaconda window, enter `RevokeAI` and type:

```bash
(revokeai) ~/RevokeAI$ git pull
(revokeai) ~/RevokeAI$ rm -rf src   # prevents conda freezing errors
(revokeai) ~/RevokeAI$ conda env update -f environment.yml
```

This will bring your local copy into sync with the remote one.
