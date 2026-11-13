#!/bin/bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SOURCE="$ROOT/native/FridayNative.swift"
OUTPUT="$ROOT/native/friday-native"
TEMP="$OUTPUT.tmp.$$"
trap 'rm -f "$TEMP"' EXIT
swiftc -O -swift-version 5 -target "$(uname -m)-apple-macosx13.0" -framework AppKit -framework WebKit -framework Carbon "$SOURCE" -o "$TEMP"
chmod 755 "$TEMP"
mv "$TEMP" "$OUTPUT"
trap - EXIT
printf 'built native/friday-native (%s)\n' "$(uname -m)"
