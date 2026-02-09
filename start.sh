#!/usr/bin/env bash

# Start api and frontend
(cd ./api && bun run ./src/index.ts) & (cd ./front && bun run dev) & (sleep 2 && xdg-open http://localhost:5173) & wait
