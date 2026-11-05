import {
  AdditiveBlending,
  AnimationAction,
  AnimationMixer,
  BufferGeometry,
  Color,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  InstancedBufferAttribute,
  InstancedMesh,
  LoopOnce,
  Material,
  Mesh,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { getAirSceneColors, getAirSceneMode, subscribeAirSceneMode } from "./air-scene-mode";
import {
  grassFragmentShader,
  grassVertexShader,
  objectFragmentShader,
  objectVertexShader,
  pollenFragmentShader,
  pollenVertexShader,
  terrainFragmentShader,
  terrainVertexShader,
} from "./air-meadow-shaders";

// Air's actual grass and models, adapted to a transparent footer canvas.
// Provenance and original rendering rules: docs/research/air-inc-footer/source/FINDINGS.md.
const assets = "/sites/air-inc-footer";
const cameraZ = 50;
const nearGrassZ = 30;
const farGrassZ = -50;
const terrainOffset = 15.42;

type ModelKind = "mushroom" | "flower" | "butterfly";
type MeadowModel = {
  kind: "mushroom" | "flower";
  group: Group;
  model: Group;
  mixer: AnimationMixer;
  actions: AnimationAction[];
  duration: number;
  age: number;
  cycle: number;
  scale: number;
  direction: number;
};
type Butterfly = {
  group: Group;
  body: Group;
  left: Group;
  right: Group;
  phase: number;
  speed: number;
  target: Vector3;
  previous: Vector3;
};

function fract(value: number): number {
  return value - Math.floor(value);
}

function mix(start: number, end: number, progress: number): number {
  return start + (end - start) * progress;
}

function randomGenerator(seed: number): () => number {
  return () => fract(10000 * Math.sin(seed++));
}

function valueNoise(x: number, y: number, z: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const iz = Math.floor(z);
  const smooth = (value: number) => value * value * (3 - 2 * value);
  const ux = smooth(fract(x));
  const uy = smooth(fract(y));
  const uz = smooth(fract(z));
  const hash = (dx: number, dy: number, dz: number) => fract(43758.5453 * Math.fround(Math.sin(Math.fround(
    (ix + dx) * 127.1 + (iy + dy) * 311.7 + (iz + dz) * 74.7,
  ))));
  return mix(
    mix(mix(hash(0, 0, 0), hash(1, 0, 0), ux), mix(hash(0, 1, 0), hash(1, 1, 0), ux), uy),
    mix(mix(hash(0, 0, 1), hash(1, 0, 1), ux), mix(hash(0, 1, 1), hash(1, 1, 1), ux), uy),
    uz,
  );
}

export function mountAirMeadow(canvas: HTMLCanvasElement): () => void {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, stencil: false, powerPreference: "low-power" });
  } catch {
    return () => {};
  }
  renderer.setClearColor(0x000000, 0);
  const scene = new Scene();
  const camera = new PerspectiveCamera(50, 1, 0.1, 1000);
  camera.position.set(0, 0, cameraZ);
  const meadow = new Group();
  scene.add(meadow);
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const geometries = new Set<BufferGeometry>();
  const materials = new Set<Material>();
  const shaderMaterials: ShaderMaterial[] = [];
  const templates = new Map<ModelKind, GLTF>();
  const models: MeadowModel[] = [];
  const butterflies: Butterfly[] = [];
  const modelRandom = randomGenerator(127);
  const top = new Color();
  const bottom = new Color();
  const sharedUniforms = () => ({ uSkyColor: { value: top }, uSkyColorBottom: { value: bottom } });
  const createMaterial = (vertexShader: string, fragmentShader: string, uniforms: ShaderMaterial["uniforms"], transparent = false) => {
    const material = new ShaderMaterial({ vertexShader, fragmentShader, uniforms, transparent, depthWrite: !transparent });
    materials.add(material);
    shaderMaterials.push(material);
    return material;
  };
  const grassMaterial = createMaterial(grassVertexShader, grassFragmentShader, {
    ...sharedUniforms(),
    uDepth: { value: new Vector2(farGrassZ, nearGrassZ) },
    uHeight: { value: 1 },
    uFrequency: { value: 0.23 },
    uOffset: { value: terrainOffset },
    uColour: { value: new Color("#0d9e0a") },
    uColourTop: { value: new Color("#56d756") },
    uTime: { value: 0 },
    uShadow: { value: 1 },
    uViewportWidth: { value: 1 },
  }, true);
  const terrainMaterial = createMaterial(terrainVertexShader, terrainFragmentShader, {
    ...sharedUniforms(), uDepth: { value: new Vector2(farGrassZ, nearGrassZ) }, uColour: { value: new Color("#0d9e0a") },
  });
  const pollenMaterial = createMaterial(pollenVertexShader, pollenFragmentShader, { uTime: { value: 0 } }, true);
  const objectMaterials = new Map<string, ShaderMaterial>();
  const objectMaterial = (color: string, baseColor = color) => {
    const key = `${color}/${baseColor}`;
    const existing = objectMaterials.get(key);
    if (existing) return existing;
    const material = createMaterial(objectVertexShader, objectFragmentShader, {
      ...sharedUniforms(),
      uDepth: { value: new Vector2(farGrassZ, nearGrassZ) },
      uColour: { value: new Color(color) },
      uBaseColour: { value: new Color(baseColor) },
    });
    material.side = DoubleSide;
    objectMaterials.set(key, material);
    return material;
  };
  const fireflyMaterial = createMaterial(`
    attribute float aPhase;
    uniform float uTime;
    varying float vPulse;
    void main() {
      vec3 p = position;
      p.x += sin(uTime * 0.25 + aPhase) * 5.0;
      p.y += cos(uTime * 0.2 + aPhase) * 3.0;
      vec4 viewPosition = modelViewMatrix * vec4(p, 1.0);
      gl_Position = projectionMatrix * viewPosition;
      gl_PointSize = 700.0 / -viewPosition.z;
      vPulse = 0.35 + 0.65 * pow(sin(uTime * 0.7 + aPhase) * 0.5 + 0.5, 2.0);
    }
  `, `
    varying float vPulse;
    void main() {
      float distance = length(gl_PointCoord - 0.5) * 2.0;
      float glow = pow(max(1.0 - distance, 0.0), 3.0) * vPulse;
      gl_FragColor = vec4(vec3(1.0, 0.84, 0.44), glow);
    }
  `, { uTime: { value: 0 } }, true);
  fireflyMaterial.blending = AdditiveBlending;
  let grass: InstancedMesh<PlaneGeometry, ShaderMaterial> | undefined;
  let terrain: Mesh<PlaneGeometry, ShaderMaterial> | undefined;
  let pollen: Points<BufferGeometry, ShaderMaterial> | undefined;
  let fireflies: Points<BufferGeometry, ShaderMaterial> | undefined;
  let worldWidth = 1;
  let worldHeight = 1;
  let frontWidth = 1;
  let backWidth = 1;
  let frequency = 0.23;
  let width = 0;
  let height = 0;
  let frame = 0;
  let lastTime = 0;
  let time = 0;
  let wind = 1;
  let pointerX: number | null = null;
  let visible = false;
  let disposed = false;

  const placement = (index: number) => {
    const z = 20 - 60 * modelRandom();
    // Keep the larger foreground mushrooms off the central wordmark/links.
    const side = index % 2 === 0 ? -1 : 1;
    const extent = mix(frontWidth, backWidth, -(z - 20) / 60);
    const x = side * mix(0.08, 0.45, modelRandom()) * extent;
    const y = valueNoise(x * frequency * 0.1, z * frequency * 0.1, terrainOffset) * worldHeight / 2 - 0.3;
    const scale = 3 * (0.2 + 0.15 * modelRandom()) / Math.min(Math.max(85 / worldWidth, 1), 1.5);
    return { x, y, z, scale };
  };
  const placeModel = (model: MeadowModel, index: number) => {
    const next = placement(index);
    model.group.position.set(next.x, next.y, next.z);
    model.scale = next.scale;
    model.group.scale.setScalar(next.scale);
  };
  const applyModelMaterials = (group: Group, kind: ModelKind, alternate = false) => {
    group.traverse(object => {
      if (!(object instanceof Mesh)) return;
      const name = object.name.toLowerCase();
      const originals = Array.isArray(object.material) ? object.material : [object.material];
      const replacement = originals.map(material => {
        materials.add(material);
        if (kind === "mushroom") return material.name === "Material.001" ? objectMaterial("#e8102b")
          : name.includes("top") ? objectMaterial("#e9e6bc") : objectMaterial("#e9e6bc", "#0d9e0a");
        if (kind === "flower") return name === "centre" ? objectMaterial("#8791be") : name.startsWith("stem") ? objectMaterial("#0d9e0a") : objectMaterial("#e8102b");
        return name.includes("wing") && !name.includes("outer") ? objectMaterial(alternate ? "#f9d9a7" : "#64ccea") : objectMaterial("#8791be");
      });
      object.material = Array.isArray(object.material) ? replacement : replacement[0];
      object.frustumCulled = false;
      object.renderOrder = 2;
      geometries.add(object.geometry);
    });
  };
  const addModels = (kind: "mushroom" | "flower", gltf: GLTF) => {
    for (let index = 0; index < 3; index++) {
      const model = gltf.scene.clone(true);
      applyModelMaterials(model, kind);
      if (kind === "flower") {
        model.scale.setScalar(0.7);
        model.rotation.y = 0.5;
      }
      const group = new Group();
      group.add(model);
      meadow.add(group);
      const mixer = new AnimationMixer(model);
      const actions = gltf.animations.map(clip => {
        const action = mixer.clipAction(clip);
        action.setLoop(LoopOnce, 1);
        action.clampWhenFinished = true;
        action.play();
        return action;
      });
      mixer.setTime(0);
      const item: MeadowModel = {
        kind, group, model, mixer, actions,
        duration: Math.max(0.1, ...gltf.animations.map(clip => clip.duration)),
        age: index * 3 + modelRandom() * 2,
        cycle: 15 + modelRandom() * 9,
        scale: 1,
        direction: modelRandom() < 0.5 ? -1 : 1,
      };
      models.push(item);
      placeModel(item, models.length - 1);
    }
  };
  const addButterflies = (gltf: GLTF) => {
    for (let index = 0; index < 4; index++) {
      const body = gltf.scene.clone(true);
      applyModelMaterials(body, "butterfly", index % 2 === 0);
      const left = new Group();
      const right = new Group();
      for (const name of ["butterfly-wing-l", "butterfly-wing-l-outer"]) {
        const object = body.getObjectByName(name);
        if (object) left.add(object);
      }
      for (const name of ["butterfly-wing-r", "butterfly-wing-r-outer"]) {
        const object = body.getObjectByName(name);
        if (object) right.add(object);
      }
      body.add(left, right);
      body.scale.setScalar(1.2);
      body.rotation.x = -Math.PI / 2;
      const group = new Group();
      group.add(body);
      meadow.add(group);
      const phase = modelRandom() * Math.PI * 2;
      group.position.set(Math.sin(phase) * worldWidth / 3, worldHeight * 0.65, -15);
      butterflies.push({ group, body, left, right, phase, speed: mix(0.3, 0.7, modelRandom()), target: new Vector3(), previous: group.position.clone() });
    }
  };
  const removeGeometry = (object: Object3D | undefined) => {
    if (!object) return;
    meadow.remove(object);
    object.traverse(child => {
      if (child instanceof Mesh || child instanceof Points) {
        child.geometry.dispose();
        geometries.delete(child.geometry);
      }
    });
  };
  const buildGeometry = () => {
    removeGeometry(grass);
    removeGeometry(terrain);
    removeGeometry(pollen);
    removeGeometry(fireflies);
    const random = randomGenerator(23);
    const count = Math.floor(Math.min(80 * backWidth * 1.25, width < 768 ? 4200 : 6000));
    const geometry = new PlaneGeometry(2, 2);
    geometry.translate(0, 1, 0);
    geometries.add(geometry);
    const bladeUnit = Math.max(width / 40, 30) * worldWidth / width;
    const blades = Array.from({ length: count }, () => {
      const z = nearGrassZ + (farGrassZ - nearGrassZ) * random();
      const x = mix(frontWidth, backWidth, -(z - nearGrassZ) / 80) * (2 * random() - 1) * 0.5 * 1.15;
      const scale = mix(0.5 * bladeUnit, 1.2 * bladeUnit, random());
      const y = valueNoise(x * frequency * 0.1, z * frequency * 0.1, terrainOffset) * worldHeight / 2;
      // Consume the same random fields that Air reserves for individual blade motion.
      random(); random(); random(); random();
      return { x, y, z, scale };
    }).sort((a, b) => a.z - b.z);
    grass = new InstancedMesh(geometry, grassMaterial, count);
    grass.frustumCulled = false;
    grass.renderOrder = 1;
    const offsets = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const transform = new Object3D();
    blades.forEach((blade, index) => {
      transform.position.set(blade.x, blade.y, blade.z);
      transform.scale.setScalar(blade.scale);
      transform.updateMatrix();
      grass?.setMatrixAt(index, transform.matrix);
      offsets.set([blade.x, blade.y, blade.z], index * 3);
      scales[index] = blade.scale;
    });
    geometry.setAttribute("instanceOffset", new InstancedBufferAttribute(offsets, 3));
    geometry.setAttribute("instanceScale", new InstancedBufferAttribute(scales, 1));
    grass.instanceMatrix.needsUpdate = true;
    meadow.add(grass);

    const groundGeometry = new PlaneGeometry(backWidth, 80, width < 768 ? 72 : 100, width < 768 ? 72 : 100);
    const positions = groundGeometry.getAttribute("position");
    for (let index = 0; index < positions.count; index++) {
      const x = positions.getX(index);
      const z = -10 - positions.getY(index);
      positions.setZ(index, valueNoise(x * frequency * 0.1, z * frequency * 0.1, terrainOffset) * worldHeight / 2);
    }
    groundGeometry.computeVertexNormals();
    geometries.add(groundGeometry);
    terrain = new Mesh(groundGeometry, terrainMaterial);
    terrain.rotation.x = -Math.PI / 2;
    terrain.position.z = -10;
    terrain.renderOrder = 0;
    meadow.add(terrain);

    const pollenCount = width < 768 ? 160 : 300;
    const pollenGeometry = new BufferGeometry();
    const pollenPositions = new Float32Array(pollenCount * 3);
    const pollenScales = new Float32Array(pollenCount * 2);
    const pollenDepths = new Float32Array(pollenCount);
    for (let index = 0; index < pollenCount; index++) {
      const depth = random() * 80;
      const x = (random() - 0.5) * mix(frontWidth, backWidth, depth / 80) * 2;
      pollenPositions.set([x, worldHeight / 2 + (random() - 0.5) * worldHeight / 2, 50 - depth], index * 3);
      pollenScales.set([random(), random()], index * 2);
      pollenDepths[index] = Math.abs(50 - depth) / 80;
    }
    pollenGeometry.setAttribute("position", new Float32BufferAttribute(pollenPositions, 3));
    pollenGeometry.setAttribute("aScale", new Float32BufferAttribute(pollenScales, 2));
    pollenGeometry.setAttribute("aDepth", new Float32BufferAttribute(pollenDepths, 1));
    geometries.add(pollenGeometry);
    pollen = new Points(pollenGeometry, pollenMaterial);
    pollen.frustumCulled = false;
    pollen.renderOrder = 3;
    meadow.add(pollen);

    const fireflyGeometry = new BufferGeometry();
    const fireflyPositions = new Float32Array(8 * 3);
    const fireflyPhases = new Float32Array(8);
    for (let index = 0; index < 8; index++) {
      fireflyPositions.set([(random() - 0.5) * worldWidth, worldHeight / 2 + random() * worldHeight / 3, -20 + random() * 40], index * 3);
      fireflyPhases[index] = random() * Math.PI * 2;
    }
    fireflyGeometry.setAttribute("position", new Float32BufferAttribute(fireflyPositions, 3));
    fireflyGeometry.setAttribute("aPhase", new Float32BufferAttribute(fireflyPhases, 1));
    geometries.add(fireflyGeometry);
    fireflies = new Points(fireflyGeometry, fireflyMaterial);
    fireflies.frustumCulled = false;
    fireflies.renderOrder = 4;
    meadow.add(fireflies);
    models.forEach(placeModel);
  };
  const refreshPalette = () => {
    const mode = getAirSceneMode();
    const colors = getAirSceneColors(motion.matches);
    top.setRGB(...colors.top);
    bottom.setRGB(...colors.bottom);
    canvas.dataset.skyMode = mode;
    if (fireflies) fireflies.visible = mode === "night";
    butterflies.forEach(butterfly => { butterfly.group.visible = mode !== "night"; });
  };
  const render = (timestamp: number) => {
    frame = 0;
    if (disposed || document.hidden || !visible) return;
    const delta = motion.matches || lastTime === 0 ? 0 : Math.min((timestamp - lastTime) / 1000, 1 / 30);
    lastTime = timestamp;
    time += delta * wind;
    wind = Math.max(1, wind * Math.pow(0.99, 60 * delta));
    grassMaterial.uniforms.uTime.value = time;
    pollenMaterial.uniforms.uTime.value = time;
    fireflyMaterial.uniforms.uTime.value = time;
    refreshPalette();
    for (const [index, item] of models.entries()) {
      item.age += delta;
      const phase = item.age % item.cycle;
      const growTime = item.duration;
      for (const action of item.actions) action.reset().play();
      if (motion.matches) item.mixer.setTime(0);
      else if (phase < growTime) item.mixer.setTime(item.duration - phase);
      else if (phase > item.cycle - growTime) item.mixer.setTime(phase - (item.cycle - growTime));
      else item.mixer.setTime(0);
      if (phase < delta) placeModel(item, index);
      item.group.rotation.z = 0.08 * Math.sin(time * 0.45 + index) * item.direction;
    }
    for (const butterfly of butterflies) {
      const phase = time * butterfly.speed + butterfly.phase;
      butterfly.target.set(Math.sin(phase * 0.7) * worldWidth * 0.45, worldHeight * (0.65 + Math.cos(phase * 0.65) * 0.22), Math.cos(phase * 0.5) * 18);
      butterfly.group.position.lerp(butterfly.target, motion.matches ? 1 : Math.min(1, delta * 3));
      butterfly.body.rotation.y = Math.sin(phase * 0.7) * 0.6;
      const wing = motion.matches ? 0.2 : Math.sin(phase * 36) * 0.6;
      butterfly.left.rotation.z = wing;
      butterfly.right.rotation.z = -wing;
    }
    renderer.render(scene, camera);
    canvas.dataset.loaded = "true";
    if (!motion.matches) frame = requestAnimationFrame(render);
  };
  const wake = () => {
    cancelAnimationFrame(frame);
    lastTime = 0;
    if (!disposed && visible && !document.hidden) frame = requestAnimationFrame(render);
  };
  const resize = () => {
    const nextWidth = canvas.clientWidth;
    const nextHeight = canvas.clientHeight;
    if (!nextWidth || !nextHeight || (nextWidth === width && nextHeight === height)) return;
    width = nextWidth;
    height = nextHeight;
    renderer.setPixelRatio(width < 768 ? 1.5 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    worldHeight = 2 * Math.tan(25 * Math.PI / 180) * cameraZ;
    worldWidth = worldHeight * camera.aspect;
    frontWidth = worldWidth * (cameraZ - 29) / cameraZ;
    backWidth = worldWidth * (cameraZ + 50) / cameraZ;
    frequency = 0.23 * Math.min(85 / worldWidth, 1.5);
    meadow.position.y = -worldHeight / 2;
    grassMaterial.uniforms.uHeight.value = worldHeight / 2;
    grassMaterial.uniforms.uFrequency.value = frequency;
    grassMaterial.uniforms.uViewportWidth.value = worldWidth;
    buildGeometry();
    wake();
  };
  const pointerMove = (event: PointerEvent) => {
    if (!visible || motion.matches) return;
    const next = event.clientX / Math.max(width, 1);
    if (pointerX !== null) wind = Math.min(8, wind + Math.abs(next - pointerX) * 2);
    pointerX = next;
  };
  const draco = new DRACOLoader();
  draco.setDecoderPath(`${assets}/draco/`);
  draco.setDecoderConfig({ type: "wasm" });
  draco.setWorkerLimit(1);
  const loader = new GLTFLoader();
  loader.setDRACOLoader(draco);
  for (const kind of ["mushroom", "flower", "butterfly"] as const) {
    void loader.loadAsync(`${assets}/models/${kind}.glb`).then(gltf => {
      if (disposed) {
        gltf.scene.traverse(object => {
          if (!(object instanceof Mesh)) return;
          object.geometry.dispose();
          const objectMaterials = Array.isArray(object.material) ? object.material : [object.material];
          objectMaterials.forEach(material => material.dispose());
        });
        return;
      }
      templates.set(kind, gltf);
      if (kind === "butterfly") addButterflies(gltf);
      else addModels(kind, gltf);
      wake();
    }).catch(() => {
      // Grass/terrain remain complete if a decorative model cannot be decoded.
    });
  }
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  const intersection = new IntersectionObserver(entries => {
    visible = entries[0]?.isIntersecting ?? false;
    wake();
  });
  intersection.observe(canvas);
  document.addEventListener("visibilitychange", wake);
  motion.addEventListener("change", wake);
  const unsubscribeMode = subscribeAirSceneMode(wake);
  window.addEventListener("pointermove", pointerMove, { passive: true });
  resize();

  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    intersection.disconnect();
    document.removeEventListener("visibilitychange", wake);
    motion.removeEventListener("change", wake);
    unsubscribeMode();
    window.removeEventListener("pointermove", pointerMove);
    models.forEach(model => {
      model.mixer.stopAllAction();
      model.mixer.uncacheRoot(model.model);
    });
    geometries.forEach(geometry => geometry.dispose());
    materials.forEach(material => material.dispose());
    shaderMaterials.length = 0;
    templates.clear();
    draco.dispose();
    renderer.dispose();
  };
}
