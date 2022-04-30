#!/bin/sh

TAG_TIMESTAMP=$(date +"%d%m%Y%H%M")
REPO=$1
# OSXVer=$(sw_vers)
# LinuxVer=$(cat /etc/os-release)


# Build for ARM
docker buildx build --platform linux/arm/v7 -t "$REPO/planner-api:armv7-$TAG_TIMESTAMP" -t "$REPO/planner-api:armv7-latest" --push .
# Build for X86
docker buildx build -t "$REPO/planner-api:x86-$TAG_TIMESTAMP" -t "$REPO/planner-api:x86-latest" --push .

