/** Paste into export.ts — replaces exportSceneGlb body */

async function buildExportRoot(withClips: boolean): Promise<{ root: THREE.Group; animations: THREE.AnimationClip[] }> {
  const root = new THREE.Group();
  root.name = "ZYNYX";
  const animations: THREE.AnimationClip[] = [];
  const s = useStudio.getState();
  for (const obj of s.objects) {
    if (!obj.visible) continue;
    if ((obj.kind === "asset" || obj.primitive === "asset") && obj.assetUrl && obj.assetFormat) {
      try {
        const loaded = await loadRuntime(obj.assetUrl, obj.assetFormat);
        const clone = cloneSkinned(loaded.root);
        clone.name = obj.name;
        clone.position.set(...obj.position);
        clone.rotation.set(...obj.rotation);
        clone.scale.set(...obj.scale);
        root.add(clone);
        if (withClips) {
          for (const clip of loaded.clips) {
            const c = clip.clone();
            if (animations.some((a) => a.name === c.name)) c.name = `${obj.name}_${c.name || "clip"}`;
            animations.push(c);
          }
        }
      } catch (err) {
        s.log({ kind: "err", text: String(err) });
      }
      continue;
    }
    const node = meshFromObject(obj);
    if (node) root.add(node);
  }
  return { root, animations };
}

export async function exportSceneGlb(filename = "zynyx.glb") {
  const s = useStudio.getState();
  const { root, animations } = await buildExportRoot(true);
  const exporter = new GLTFExporter();
  await new Promise<void>((resolve, reject) => {
    exporter.parse(
      root,
      (res) => {
        if (res instanceof ArrayBuffer) {
          downloadBlob(filename, new Blob([res], { type: "model/gltf-binary" }));
        } else {
          downloadText(filename.replace(/\.glb$/, ".gltf"), JSON.stringify(res, null, 2), "model/gltf+json");
        }
        resolve();
      },
      (err) => {
        s.log({ kind: "err", text: String(err) });
        reject(err);
      },
      { binary: true, animations },
    );
  });
}

export async function exportSceneStl(filename = "zynyx.stl") {
  const { root } = await buildExportRoot(false);
  root.updateMatrixWorld(true);
  const { STLExporter } = await import("three/addons/exporters/STLExporter.js");
  const data = new STLExporter().parse(root, { binary: true }) as DataView;
  const bytes = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
  downloadBlob(filename, new Blob([bytes], { type: "model/stl" }));
}

export async function exportSceneObj(filename = "zynyx.obj") {
  const { root } = await buildExportRoot(false);
  root.updateMatrixWorld(true);
  const { OBJExporter } = await import("three/addons/exporters/OBJExporter.js");
  downloadText(filename, new OBJExporter().parse(root), "text/plain");
}
