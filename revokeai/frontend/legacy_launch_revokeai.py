import argparse
import sys


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--web", action="store_true")
    opts, _ = parser.parse_known_args()

    if opts.web:
        sys.argv.pop(sys.argv.index("--web"))
        from revokeai.app.api_app import revoke_api

        revoke_api()
    else:
        from revokeai.app.cli_app import revoke_cli

        revoke_cli()


if __name__ == "__main__":
    main()
