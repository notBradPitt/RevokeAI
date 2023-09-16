---
title: Configuration
---

# :material-tune-variant: RevokeAI Configuration

## Intro

RevokeAI has numerous runtime settings which can be used to adjust
many aspects of its operations, including the location of files and
directories, memory usage, and performance. These settings can be
viewed and customized in several ways:

1. By editing settings in the `revokeai.yaml` file.
2. By setting environment variables.
3. On the command-line, when RevokeAI is launched.

In addition, the most commonly changed settings are accessible
graphically via the `revokeai-configure` script.

### How the Configuration System Works

When RevokeAI is launched, the very first thing it needs to do is to
find its "root" directory, which contains its configuration files,
installed models, its database of images, and the folder(s) of
generated images themselves. In this document, the root directory will
be referred to as ROOT.

#### Finding the Root Directory

To find its root directory, RevokeAI uses the following recipe:

1. It first looks for the argument `--root <path>` on the command line
it was launched from, and uses the indicated path if present.

2. Next it looks for the environment variable REVOKEAI_ROOT, and uses
the directory path found there if present.

3. If neither of these are present, then RevokeAI looks for the
folder containing the `.venv` Python virtual environment directory for
the currently active environment. This directory is checked for files
expected inside the RevokeAI root before it is used.

4. Finally, RevokeAI looks for a directory in the current user's home
directory named `revokeai`.

#### Reading the RevokeAI Configuration File

Once the root directory has been located, RevokeAI looks for a file
named `ROOT/revokeai.yaml`, and if present reads configuration values
from it. The top of this file looks like this:

```
RevokeAI:
  Web Server:
    host: localhost
    port: 9090
    allow_origins: []
    allow_credentials: true
    allow_methods:
    - '*'
    allow_headers:
    - '*'
  Features:
    esrgan: true
    internet_available: true
    log_tokenization: false
    patchmatch: true
    restore: true
...
```

This lines in this file are used to establish default values for
Revoke's settings. In the above fragment, the Web Server's listening
port is set to 9090 by the `port` setting.

You can edit this file with a text editor such as "Notepad" (do not
use Word or any other word processor). When editing, be careful to
maintain the indentation, and do not add extraneous text, as syntax
errors will prevent RevokeAI from launching. A basic guide to the
format of YAML files can be found
[here](https://circleci.com/blog/what-is-yaml-a-beginner-s-guide/).

You can fix a broken `revokeai.yaml` by deleting it and running the
configuration script again -- option [7] in the launcher, "Re-run the
configure script".

#### Reading Environment Variables

Next RevokeAI looks for defined environment variables in the format
`REVOKEAI_<setting_name>`, for example `REVOKEAI_port`. Environment
variable values take precedence over configuration file variables. On
a Macintosh system, for example, you could change the port that the
web server listens on by setting the environment variable this way:

```
export REVOKEAI_port=8000
revokeai-web
```

Please check out these
[Macintosh](https://phoenixnap.com/kb/set-environment-variable-mac)
and
[Windows](https://phoenixnap.com/kb/windows-set-environment-variable)
guides for setting temporary and permanent environment variables.

#### Reading the Command Line

Lastly, RevokeAI takes settings from the command line, which override
everything else. The command-line settings have the same name as the
corresponding configuration file settings, preceded by a `--`, for
example `--port 8000`.

If you are using the launcher (`revoke.sh` or `revoke.bat`) to launch
RevokeAI, then just pass the command-line arguments to the launcher:

```
revoke.bat --port 8000 --host 0.0.0.0
```

The arguments will be applied when you select the web server option
(and the other options as well).

If, on the other hand, you prefer to launch RevokeAI directly from the
command line, you would first activate the virtual environment (known
as the "developer's console" in the launcher), and run `revokeai-web`:

```
> C:\Users\Fred\revokeai\.venv\scripts\activate
(.venv) > revokeai-web --port 8000 --host 0.0.0.0
```

You can get a listing and brief instructions for each of the
command-line options by giving the `--help` argument:

```
(.venv) > revokeai-web --help
usage: RevokeAI [-h] [--host HOST] [--port PORT] [--allow_origins [ALLOW_ORIGINS ...]] [--allow_credentials | --no-allow_credentials] [--allow_methods [ALLOW_METHODS ...]]
                [--allow_headers [ALLOW_HEADERS ...]] [--esrgan | --no-esrgan] [--internet_available | --no-internet_available] [--log_tokenization | --no-log_tokenization]
                [--patchmatch | --no-patchmatch] [--restore | --no-restore]
                [--always_use_cpu | --no-always_use_cpu] [--free_gpu_mem | --no-free_gpu_mem] [--max_loaded_models MAX_LOADED_MODELS] [--max_cache_size MAX_CACHE_SIZE]
                [--max_vram_cache_size MAX_VRAM_CACHE_SIZE] [--gpu_mem_reserved GPU_MEM_RESERVED] [--precision {auto,float16,float32,autocast}]
                [--sequential_guidance | --no-sequential_guidance] [--xformers_enabled | --no-xformers_enabled] [--tiled_decode | --no-tiled_decode] [--root ROOT]
                [--autoimport_dir AUTOIMPORT_DIR] [--lora_dir LORA_DIR] [--embedding_dir EMBEDDING_DIR] [--controlnet_dir CONTROLNET_DIR] [--conf_path CONF_PATH]
                [--models_dir MODELS_DIR] [--legacy_conf_dir LEGACY_CONF_DIR] [--db_dir DB_DIR] [--outdir OUTDIR] [--from_file FROM_FILE]
                [--use_memory_db | --no-use_memory_db] [--model MODEL] [--log_handlers [LOG_HANDLERS ...]] [--log_format {plain,color,syslog,legacy}]
                [--log_level {debug,info,warning,error,critical}] [--version | --no-version]
```

## The Configuration Settings

The configuration settings are divided into several distinct
groups in `revokeia.yaml`:

### Web Server

| Setting  | Default Value  |  Description |
|----------|----------------|--------------|
| `host`     | `localhost`      | Name or IP address of the network interface that the web server will listen on  |
| `port`     | `9090`           | Network port number that the web server will listen on  |
| `allow_origins`  | `[]`       | A list of host names or IP addresses that are allowed to connect to the RevokeAI API in the format `['host1','host2',...]` |
| `allow_credentials | `true`   | Require credentials for a foreign host to access the RevokeAI API (don't change this) |
| `allow_methods` | `*`         | List of HTTP methods ("GET", "POST") that the web server is allowed to use when accessing the API  |
| `allow_headers` | `*`         | List of HTTP headers that the web server will accept when accessing the API  |

The documentation for RevokeAI's API can be accessed by browsing to the following URL: [http://localhost:9090/docs].

### Features

These configuration settings allow you to enable and disable various RevokeAI features:

| Setting  | Default Value  |  Description |
|----------|----------------|--------------|
| `esrgan`     | `true`      | Activate the ESRGAN upscaling options|
| `internet_available` | `true`     | When a resource is not available locally, try to fetch it via the internet |
| `log_tokenization` | `false`      | Before each text2image generation, print a color-coded representation of the prompt to the console; this can help understand why a prompt is not working as expected |
| `patchmatch` | `true`     | Activate the "patchmatch" algorithm for improved inpainting |

### Generation

These options tune RevokeAI's memory and performance characteristics.

| Setting               | Default Value | Description                                                                                                                                                                                                                                                      |
|-----------------------|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `sequential_guidance` | `false`       | Calculate guidance in serial rather than in parallel, lowering memory requirements at the cost of some performance loss                                                                                                                                          |
| `attention_type`      | `auto`        | Select the type of attention to use. One of `auto`,`normal`,`xformers`,`sliced`, or `torch-sdp`                                                                                                                                                                  |
| `attention_slice_size` | `auto`       | When "sliced" attention is selected, set the slice size. One of `auto`, `balanced`, `max` or the integers 1-8|
| `force_tiled_decode`  | `false`       | Force the VAE step to decode in tiles, reducing memory consumption at the cost of performance |

### Device

These options configure the generation execution device.

| Setting               | Default Value | Description                                                                                                                                                                                                                                                      |
|-----------------------|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `device`           | `auto`        | Preferred execution device. One of `auto`, `cpu`, `cuda`, `cuda:1`, `mps`. `auto` will choose the device depending on the hardware platform and the installed torch capabilities. |
| `precision`           | `auto`        | Floating point precision. One of `auto`, `float16` or `float32`. `float16` will consume half the memory of `float32` but produce slightly lower-quality images. The `auto` setting will guess the proper precision based on your video card and operating system |


### Paths

These options set the paths of various directories and files used by
RevokeAI. Relative paths are interpreted relative to REVOKEAI_ROOT, so
if REVOKEAI_ROOT is `/home/fred/revokeai` and the path is
`autoimport/main`, then the corresponding directory will be located at
`/home/fred/revokeai/autoimport/main`.

| Setting  | Default Value  |  Description |
|----------|----------------|--------------|
| `autoimport_dir` | `autoimport/main`     | At startup time, read and import any main model files found in this directory |
| `lora_dir` | `autoimport/lora`     | At startup time, read and import any LoRA/LyCORIS models found in this directory |
| `embedding_dir` | `autoimport/embedding`  | At startup time, read and import any textual inversion (embedding) models found in this directory |
| `controlnet_dir` | `autoimport/controlnet`  | At startup time, read and import any ControlNet models found in this directory |
| `conf_path` | `configs/models.yaml`  | Location of the `models.yaml` model configuration file |
| `models_dir` | `models`  | Location of the directory containing models installed by RevokeAI's model manager |
| `legacy_conf_dir` | `configs/stable-diffusion`  | Location of the directory containing the .yaml configuration files for legacy checkpoint models |
| `db_dir` | `databases`  | Location of the directory containing RevokeAI's image, schema and session database |
| `outdir` | `outputs`  | Location of the directory in which the gallery of generated and uploaded images will be stored |
| `use_memory_db` | `false`  | Keep database information in memory rather than on disk; this will not preserve image gallery information across restarts |

Note that the autoimport directories will be searched recursively,
allowing you to organize the models into folders and subfolders in any
way you wish. In addition, while we have split up autoimport
directories by the type of model they contain, this isn't
necessary. You can combine different model types in the same folder
and RevokeAI will figure out what they are. So you can easily use just
one autoimport directory by commenting out the unneeded paths:

```
Paths:
  autoimport_dir: autoimport
#  lora_dir: null
#  embedding_dir: null
#  controlnet_dir: null
```

### Logging

These settings control the information, warning, and debugging
messages printed to the console log while RevokeAI is running:

| Setting  | Default Value  |  Description |
|----------|----------------|--------------|
| `log_handlers` | `console` | This controls where log messages are sent, and can be a list of one or more destinations. Values include `console`, `file`, `syslog` and `http`. These are described in more detail below |
| `log_format` | `color` | This controls the formatting of the log messages. Values are `plain`, `color`, `legacy` and `syslog` |
| `log_level`  | `debug` | This filters messages according to the level of severity and can be one of `debug`, `info`, `warning`, `error` and `critical`. For example, setting to `warning` will display all messages at the warning level or higher, but won't display "debug" or "info" messages |

Several different log handler destinations are available, and multiple destinations are supported by providing a list:

```
  log_handlers:
     - console
     - syslog=localhost
     - file=/var/log/revokeai.log
```

* `console` is the default. It prints log messages to the command-line window from which RevokeAI was launched.

* `syslog` is only available on Linux and Macintosh systems. It uses
  the operating system's "syslog" facility to write log file entries
  locally or to a remote logging machine. `syslog` offers a variety
  of configuration options:

```
  syslog=/dev/log`      - log to the /dev/log device
  syslog=localhost`     - log to the network logger running on the local machine
  syslog=localhost:512` - same as above, but using a non-standard port
  syslog=fredserver,facility=LOG_USER,socktype=SOCK_DRAM`
                        - Log to LAN-connected server "fredserver" using the facility LOG_USER and datagram packets.
```

* `http` can be used to log to a remote web server. The server must be
  properly configured to receive and act on log messages. The option
  accepts the URL to the web server, and a `method` argument
  indicating whether the message should be submitted using the GET or
  POST method.

```
 http=http://my.server/path/to/logger,method=POST
```

The `log_format` option provides several alternative formats:

* `color`    - default format providing time, date and a message, using text colors to distinguish different log severities
* `plain`    - same as above, but monochrome text only
* `syslog`   - the log level and error message only, allowing the syslog system to attach the time and date
* `legacy`   - a format similar to the one used by the legacy 2.3 RevokeAI releases.
