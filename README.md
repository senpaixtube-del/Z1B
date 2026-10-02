# ZYNYX — browser 3D studio

Professional WebGL DCC (TanStack Start + React Three Fiber + three.js).

## Run

```bash
npm install
npm run dev
```

Opens on **http://0.0.0.0:8080** (App Builder preview).

Requires **Node.js 20+**.

Full source is in `Z1B.zip` (extract → folder `Z1`).

## Features

- Import: GLB / GLTF / FBX / OBJ+MTL / STL / folder (textures)
- Local characters under `public/models/`
- Timeline-synced skeletal animation + clip crossfade
- DRACO / Meshopt / KTX2 loaders
- IndexedDB asset persistence (survives refresh)
- Export: GLB (skeleton + clips), STL, OBJ, Blender Python, PNG, project JSON
- In-app bpy-style Python console (browser only — not a desktop Python app)

## Scripts

| Command | What |
|---------|------|
| `npm run dev` | Dev server :8080 |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript check |
