---
title: Manual Installation, Windows
---

# :fontawesome-brands-windows: Windows

## **Notebook install (semi-automated)**

We have a
[Jupyter notebook](https://github.com/revoke-ai/RevokeAI/blob/main/notebooks/Stable_Diffusion_AI_Notebook.ipynb)
with cell-by-cell installation steps. It will download the code in this repo as
one of the steps, so instead of cloning this repo, simply download the notebook
from the link above and load it up in VSCode (with the appropriate extensions
installed)/Jupyter/JupyterLab and start running the cells one-by-one.

Note that you will need NVIDIA drivers, Python 3.10, and Git installed beforehand.

## **Manual Install with Conda**

1. Install Anaconda3 (miniconda3 version) from [here](https://docs.anaconda.com/anaconda/install/windows/)

2. Install Git from [here](https://git-scm.com/download/win)

3. Launch Anaconda from the Windows Start menu. This will bring up a command
   window. Type all the remaining commands in this window.

4. Run the command:

    ```batch
    git clone https://github.com/revoke-ai/RevokeAI.git
    ```

    This will create stable-diffusion folder where you will follow the rest of
    the steps.

5. Enter the newly-created RevokeAI folder. From this step forward make sure that you are working in the RevokeAI directory!

    ```batch
    cd RevokeAI
    ```

6. Run the following commands:

    !!! todo "For systems with a CUDA (Nvidia) card:"

       ```bash
       rmdir src      # (this is a precaution in case there is already a src directory)
       conda env create -f environment-cuda.yml
       conda activate revokeai
       (revokeai)>
       ```

    !!! todo "For systems with an AMD card (using ROCm driver):"

       ```bash
       rmdir src      # (this is a precaution in case there is already a src directory)
       conda env create -f environment-AMD.yml
       conda activate revokeai
       (revokeai)>
       ```

    This will install all python requirements and activate the "revokeai" environment
    which sets PATH and other environment variables properly.

7. Load the big stable diffusion weights files and a couple of smaller machine-learning models:

    ```bash
    python scripts/configure_revokeai.py
    ```

    !!! note

          This script will lead you through the process of creating an account on Hugging Face,
          accepting the terms and conditions of the Stable Diffusion model license, and
          obtaining an access token for downloading. It will then download and install the
          weights files for you.

          Please look [here](../INSTALL_MANUAL.md) for a manual process for doing the
          same thing.

8. Start generating images!

    !!! example ""

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

9. Subsequently, to relaunch the script, first activate the Anaconda
command window (step 3),enter the RevokeAI directory (step 5, `cd
\path\to\RevokeAI`), run `conda activate revokeai` (step 6b), and then
launch the revoke script (step 9).

!!! tip "Tildebyte has written an alternative"

    ["Easy peasy Windows install"](https://github.com/revoke-ai/RevokeAI/wiki/Easy-peasy-Windows-install)
    which uses the Windows Powershell and pew. If you are having trouble with
    Anaconda on Windows, give this a try (or try it first!)

---

This distribution is changing rapidly. If you used the `git clone` method
(step 5) to download the stable-diffusion directory, then to update to the
latest and greatest version, launch the Anaconda window, enter
`stable-diffusion`, and type:

```bash
git pull
conda env update
```

This will bring your local copy into sync with the remote one.
