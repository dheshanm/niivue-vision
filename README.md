# NiiVue - Vision

[NiiVue](https://github.com/niivue/niivue) is web-based visualization tool for neuroimaging that can run on any operating system and any web device (phone, tablet, computer).

NiiVue Vision utilizes the NiiVue, to create a simple Vite + React wrapper around the NiiVue library, together with a simple file server to quickly visualize local files.

## Installation

```bash
cd niivue-vision
npm install
```

## Usage

```bash
cd niivue-vision
npm run dev
```

This will start the server on port 5000.

You can visualize the files using the following URL:

```
http://localhost:5000/?payload=<url_to_file>
```

You can also use the bundled file server to serve local files. (See below).

With the file server running, you can visualize the files using the following URL:

```
http://localhost:5000/?payload="http://localhost:11000/get/?file_path=<path_to_file>"
```

## File Server

This repository contains a simple file server, that serves files from the local file system. 

> [!CAUTION]
> THIS SERVER IS NOT SECURE AND SHOULD NOT BE USED IN PRODUCTION.
> THIS EXPOSES YOUR FILE SYSTEM TO EXTERNAL NETWORK.

### Usage

```bash
cd serve-files
python server.py
```

This will start the server on port 11000, and will serve any file from the local file system to niivue-vision.