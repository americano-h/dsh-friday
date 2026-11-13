#!/usr/bin/env python3
"""Minimal Electron ASAR reader: list paths or print one file."""
import sys, json, struct

ASAR = "/Applications/DeepSeek Harness.app/Contents/Resources/app.asar"

def load():
    with open(ASAR, 'rb') as f:
        f.read(4)
        header_size = struct.unpack('<I', f.read(4))[0]
        f.read(4)
        json_size = struct.unpack('<I', f.read(4))[0]
        header = json.loads(f.read(json_size))
        data_start = 8 + header_size
        return header, data_start

def walk(node, prefix=''):
    for name, child in node.get('files', {}).items():
        p = prefix + '/' + name if prefix else name
        if 'files' in child:
            yield from walk(child, p)
        else:
            yield p, child

def main():
    header, data_start = load()
    if len(sys.argv) < 2:
        print('usage: asar_tool.py list [substr] | cat <path>')
        return
    cmd = sys.argv[1]
    if cmd == 'list':
        sub = sys.argv[2] if len(sys.argv) > 2 else ''
        for p, meta in walk(header):
            if sub in p:
                print(p)
    elif cmd == 'cat':
        target = sys.argv[2].lstrip('/')
        for p, meta in walk(header):
            if p == target:
                off = int(meta.get('offset', 0))
                size = meta.get('size', 0)
                with open(ASAR, 'rb') as f:
                    f.seek(data_start + off)
                    sys.stdout.write(f.read(size).decode('utf8', 'replace'))
                return
        print('not found', file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
