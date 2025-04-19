#!/bin/bash

# Custom image name
IMAGE_NAME="kali:v1"
# Custom container name
CONTAINER_NAME="kali"

# Setup X11 forwarding for macOS
xhost + $(hostname)

# Check if container already exists
if docker ps -a --format '{{.Names}}' | grep -Eq "^${CONTAINER_NAME}\$"; then
  echo "[+] Starting existing container '${CONTAINER_NAME}'..."
  docker start -ai $CONTAINER_NAME
else
  echo "[+] Running new container from image '${IMAGE_NAME}'..."
  docker run -it \
    --rm --name $CONTAINER_NAME \
    --cap-add=NET_ADMIN \
    --cap-add=NET_RAW \
    --privileged \
    -v ~/Desktop/AiBB/Backend/RAG/logs:/root/logs \
    $IMAGE_NAME
fi


 
  