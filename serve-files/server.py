#!/usr/bin/env python
"""
Serve files for download using FastAPI

CAUTION: THIS SERVER IS NOT SECURE AND SHOULD NOT BE USED IN PRODUCTION

This server is intended for development and testing purposes only. It is not
secure and does not include any authentication or authorization mechanisms, and exposes
all files on the server to the external network. DO NOT USE THIS IN PRODUCTION.
"""
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import aiofiles
import uvicorn

# from fastapi.responses import FileResponse

app = FastAPI()

# Setup CORS to allow any host
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.api_route("/get/", methods=["GET", "HEAD"])
async def download_file(file_path: str):
    """
    Serve file_path for download.

    Args:
        file_path (str): The path to the file to be served for download.
    """
    # Remove leading and trailing quotes
    file_path = file_path.strip('"')
    file_path = file_path.strip("'")
    file_path = file_path.strip()
    # Check if the file exists
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail=f"File not found: {file_path}")

    # Open the file asynchronously and serve it as a streaming response
    async def file_iterator(file_path):
        async with aiofiles.open(file_path, "rb") as file:
            chunk_size = 4 * 1024 * 1024  # 4 MB per chunk
            while chunk := await file.read(chunk_size):
                yield chunk

    return StreamingResponse(
        file_iterator(file_path),
        media_type="application/octet-stream",
        headers={
            "Content-Disposition": f"attachment; filename={os.path.basename(file_path)}"
        },
    )


# @app.api_route("/get/", methods=["GET", "HEAD"])
# async def download_file(file_path: str):
#     """
#     Serve the file for download in one step.
#     """
#     # Remove leading/trailing quotes and whitespace
#     file_path = file_path.strip("\"").strip("\'")

#     # Check if the file exists
#     if not os.path.exists(file_path):
#         raise HTTPException(status_code=404, detail=f"File not found: {file_path}")

#     # Use FileResponse for simpler file delivery
#     return FileResponse(
#         path=file_path,
#         media_type='application/gzip',  # Include appropriate media type for .nii.gz files
#         filename=os.path.basename(file_path),
#     )


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=11000)
