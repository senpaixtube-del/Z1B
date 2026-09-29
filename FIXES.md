# ZYNYX remaining fixes (STL/OBJ + shadows + import isolation)

Apply these changes on top of the Z1B app source (same tree as the uploaded `Z1B.zip`).

## 1. `src/lib/studio/export.ts`

- Factor scene assembly into `buildExportRoot(withClips)`.
- Add `exportSceneStl()` via `STLExporter` (binary).
- Add `exportSceneObj()` via `OBJExporter`.
- Keep `exportSceneGlb()` using `buildExportRoot(true)` for skeleton + clips.

## 2. `src/components/studio/StudioApp.tsx`

- Import `exportSceneStl`, `exportSceneObj`.
- File menu items already have i18n keys `exportStl` / `exportObj` — wire both next to Export GLB.

## 3. `src/components/studio/Viewport.tsx`

```tsx
shadows={{ type: THREE.PCFShadowMap }}
onCreated={({ gl }) => {
  gl.shadowMap.enabled = true;
  gl.shadowMap.type = THREE.PCFShadowMap;
}}
```

Removes the r186 `PCFSoftShadowMap has been removed` warning.

## 4. `src/lib/studio/importers.ts`

Wrap each `commitModel` in try/catch so one bad file does not abort the whole multi-select batch.

---
Full ready-to-drop files were prepared offline; copy from the patch zip if you have it, or re-open the App Builder session with this repo.
