# File Server

This is a simple file server, that serves files from the local file system.

> [!CAUTION]
> THIS SERVER IS NOT SECURE AND SHOULD NOT BE USED IN PRODUCTION.
> THIS EXPOSES YOUR FILE SYSTEM TO EXTERNAL NETWORK.

## Usage

```bash
python server.py
```

This will start the server on port 11000.

You can access the files using the following URL:

```
http://localhost:11000/get/?file_path=<path_to_file>
```
