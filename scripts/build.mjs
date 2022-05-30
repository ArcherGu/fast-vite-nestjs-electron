#!/usr/bin/env node

import { build as electron } from 'electron-builder'
import { build } from 'vite'

await build({ configFile: 'packages/main/vite.config.ts' })
await build({ configFile: 'packages/preload/vite.config.ts' })
await build({ configFile: 'packages/renderer/vite.config.ts' })
await electron({ config: './electron-builder.config.js' })
