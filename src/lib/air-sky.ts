// Air's cloud texture and rendering rules: docs/research/air-inc-sky/findings.md.
// A native WebGL implementation keeps the decorative background independent of the UI.
import { getAirSceneColors, getAirSceneMode, subscribeAirSceneMode } from "./air-scene-mode";
const cloudTexture = "/sites/air-inc-sky/images/cloud.png";
const fieldOfView = 50 * Math.PI / 180;
const cameraZ = 50;
const groupCount = 20;
const sideGroupCount = 18;
const cloudsPerGroup = 20;
const vertexCount = (groupCount + sideGroupCount) * cloudsPerGroup * 6;
const floatsPerVertex = 7;

type Cloud = {
  x: number;
  y: number;
  z: number;
  scale: number;
  rotation: number;
  direction: number;
  speed: number;
  animated: boolean;
};

const vertexShader = `
  attribute vec3 aPosition;
  attribute vec2 aUv;
  attribute vec2 aFlatUv;
  uniform float uAspect;
  varying vec2 vUv;
  varying vec2 vFlatUv;
  varying vec2 vViewportUV;
  varying float vDepth;

  void main() {
    float distance = 50.0 - aPosition.z;
    float focalLength = 2.14450692;
    vec4 projected = vec4(
      aPosition.x * focalLength / uAspect,
      aPosition.y * focalLength,
      1.00020002 * distance - 0.20002000,
      distance
    );
    vViewportUV = projected.xy / projected.w * 0.5 + 0.5;
    gl_Position = projected;
    vUv = aUv;
    vFlatUv = aFlatUv;
    vDepth = clamp((aPosition.z + 100.0) / 150.0, 0.0, 1.0);
  }
`;

// Same depth fade, cloud tint, and vertical shadow used by Air's cloud material.
const cloudFragmentShader = `
  precision mediump float;
  uniform sampler2D uCloud;
  uniform vec3 uSkyColor;
  uniform vec3 uSkyColorBottom;
  uniform float uIntro;
  varying vec2 vUv;
  varying vec2 vFlatUv;
  varying vec2 vViewportUV;
  varying float vDepth;

  void main() {
    vec4 tex = texture2D(uCloud, vUv);
    tex.a *= 1.0 - pow(1.0 - vDepth, 1.5);
    tex.a *= 1.0 - pow(vDepth, 10.0);
    vec3 averageSkyColour = (uSkyColor + uSkyColorBottom) / 2.0;
    float skyBrightness = dot(averageSkyColour, vec3(0.2126, 0.7152, 0.0722));
    vec3 cloudColour = mix(
      averageSkyColour,
      tex.rgb * clamp(skyBrightness * 3.0, 0.0, 1.0),
      clamp(skyBrightness * 2.0, 0.0, 1.0)
    );
    vec3 skyColor = mix(uSkyColor, uSkyColorBottom, 1.0 - vViewportUV.y);
    vec3 greyGradient = mix(cloudColour * 0.5, cloudColour, smoothstep(0.2, 0.6, vFlatUv.y));
    vec3 color = mix(
      greyGradient,
      mix(skyColor, cloudColour, 0.1),
      1.0 - smoothstep(0.1, 0.6, vFlatUv.y)
    );
    gl_FragColor = vec4(color, tex.a * uIntro);
  }
`;

const skyVertexShader = `
  attribute vec2 aPosition;
  varying vec2 vUv;
  void main() {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const skyFragmentShader = `
  precision mediump float;
  uniform vec3 uSkyColor;
  uniform vec3 uSkyColorBottom;
  varying vec2 vUv;
  void main() {
    gl_FragColor = vec4(mix(uSkyColorBottom, uSkyColor, vUv.y), 1.0);
  }
`;

function createProgram(gl: WebGLRenderingContext, vertex: string, fragment: string): WebGLProgram | null {
  const shaders: WebGLShader[] = [];
  const program = gl.createProgram();
  if (!program) return null;
  for (const [type, source] of [[gl.VERTEX_SHADER, vertex], [gl.FRAGMENT_SHADER, fragment]] as const) {
    const shader = gl.createShader(type);
    if (!shader) break;
    shaders.push(shader);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) break;
    gl.attachShader(program, shader);
  }
  gl.linkProgram(program);
  for (const shader of shaders) gl.deleteShader(shader);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function makeClouds(width: number, height: number, planeSize: number, pageRatio: number): Cloud[] {
  let seed = 23;
  const random = () => {
    const value = 10000 * Math.sin(seed++);
    return value - Math.floor(value);
  };
  const mix = (start: number, end: number, amount: number) => start * (1 - amount) + end * amount;
  const clouds: Cloud[] = [];
  const addBank = (x: number, y: number, z: number, spreadScale: number, animated: boolean) => {
    const spread = planeSize * spreadScale * 0.5;
    for (let index = 0; index < cloudsPerGroup; index++) {
      const offset = (1 - Math.pow(1 - index / cloudsPerGroup, 3)) * spread
        * Math.cos(Math.PI / 2 + 2 * Math.PI / cloudsPerGroup * (index % 2 === 0 ? 1 : -1) * index);
      const scale = (mix(0.5, 1.25, Math.pow(1 - Math.abs(offset) / spread, 2))
        + (random() - 0.5) * 0.5) * (animated ? 1 : 0.5);
      const rotation = random() * Math.PI * 2;
      const direction = random() < 0.5 ? 1 : -1;
      const speed = 0.5 + 0.5 * random();
      clouds.push({
        x: x + offset,
        y: y + scale * planeSize / 2 - (random() - 0.5),
        z: z + random() - 0.5,
        scale,
        rotation,
        direction,
        speed,
        animated,
      });
    }
  };
  for (let group = 0; group < groupCount; group++) {
    const angle = Math.PI / 2 + (random() - 0.5) * Math.PI * 1.75;
    const x = Math.cos(angle) * mix(width / 2, width, random());
    const y = Math.sin(angle) * mix(height / 2, height / 1.5, random());
    const z = mix(-100, 50, group / groupCount);
    addBank(x, y, z, mix(1, 3, random()), true);
  }
  // Air's additional side banks are distributed along the document, not stretched in a page-sized canvas.
  seed += 5;
  const firstSide = random() > 0.5 ? 1 : 0;
  const bankSpacing = height * Math.max(pageRatio - 0.5, 1) / sideGroupCount;
  for (let group = 0; group < sideGroupCount; group++) {
    const x = width / 2 * (group % 2 === firstSide ? 1 : -1);
    const y = height / 3 - bankSpacing * group - (random() - 0.5) * bankSpacing / 2;
    const z = -(random() - 0.5) * 100;
    addBank(x * mix(1, 2, -z / 100), y, z, 1, false);
  }
  return clouds;
}

export function mountAirSky(canvas: HTMLCanvasElement): () => void {
  const gl = canvas.getContext("webgl", { alpha: false, antialias: false, depth: false, stencil: false });
  if (!gl) return () => {};
  const cloudProgram = createProgram(gl, vertexShader, cloudFragmentShader);
  const skyProgram = createProgram(gl, skyVertexShader, skyFragmentShader);
  if (!cloudProgram || !skyProgram) {
    if (cloudProgram) gl.deleteProgram(cloudProgram);
    if (skyProgram) gl.deleteProgram(skyProgram);
    return () => {};
  }
  const skyBuffer = gl.createBuffer();
  const cloudBuffer = gl.createBuffer();
  const texture = gl.createTexture();
  if (!skyBuffer || !cloudBuffer || !texture) {
    gl.deleteBuffer(skyBuffer);
    gl.deleteBuffer(cloudBuffer);
    gl.deleteTexture(texture);
    gl.deleteProgram(skyProgram);
    gl.deleteProgram(cloudProgram);
    return () => {};
  }
  const uniforms = (program: WebGLProgram) => ({
    top: gl.getUniformLocation(program, "uSkyColor"),
    bottom: gl.getUniformLocation(program, "uSkyColorBottom"),
  });
  const skyUniforms = uniforms(skyProgram);
  const cloudUniforms = { ...uniforms(cloudProgram), aspect: gl.getUniformLocation(cloudProgram, "uAspect"), intro: gl.getUniformLocation(cloudProgram, "uIntro") };
  const skyPosition = gl.getAttribLocation(skyProgram, "aPosition");
  const attributes = ["aPosition", "aUv", "aFlatUv"].map(name => gl.getAttribLocation(cloudProgram, name));
  const corners = [[-0.5, -0.5], [0.5, -0.5], [-0.5, 0.5], [-0.5, 0.5], [0.5, -0.5], [0.5, 0.5]] as const;
  const vertices = new Float32Array(vertexCount * floatsPerVertex);
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let clouds: Cloud[] = [];
  let planeSize = 17;
  let aspect = 1;
  let worldPerPixel = 1;
  let intro = 0;
  let frame = 0;
  let lastTime = 0;
  let textureReady = false;
  let disposed = false;

  gl.bindBuffer(gl.ARRAY_BUFFER, skyBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const render = (time: number) => {
    frame = 0;
    if (disposed || document.hidden) return;
    const delta = motion.matches || !lastTime ? 0 : Math.min((time - lastTime) / 1000, 1 / 30);
    lastTime = time;
    const colors = getAirSceneColors(motion.matches);
    gl.disable(gl.BLEND);
    gl.useProgram(skyProgram);
    gl.uniform3fv(skyUniforms.top, colors.top);
    gl.uniform3fv(skyUniforms.bottom, colors.bottom);
    for (const attribute of attributes) gl.disableVertexAttribArray(attribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, skyBuffer);
    gl.enableVertexAttribArray(skyPosition);
    gl.vertexAttribPointer(skyPosition, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    canvas.dataset.loaded = "true";
    canvas.dataset.skyMode = getAirSceneMode();

    if (textureReady) {
      intro = motion.matches ? 1 : Math.min(1, intro + delta * 0.2);
      clouds.sort((a, b) => a.z - b.z);
      let offset = 0;
      const scrollOffset = window.scrollY * worldPerPixel;
      for (const cloud of clouds) {
        if (cloud.animated) {
          cloud.z += delta * 10;
          if (cloud.z > 50) cloud.z = -100;
        }
        cloud.rotation += delta * cloud.speed * cloud.direction * 0.05;
        const scale = cloud.scale + 0.1 * Math.sin(10 * cloud.rotation);
        const yPosition = cloud.y + scrollOffset;
        const halfView = Math.tan(fieldOfView / 2) * (cameraZ - cloud.z);
        const radius = planeSize * scale * Math.SQRT1_2;
        if (Math.abs(yPosition) > halfView + radius || Math.abs(cloud.x) > halfView * aspect + radius) continue;
        const cosine = Math.cos(cloud.rotation);
        const sine = Math.sin(cloud.rotation);
        for (const [x, y] of corners) {
          vertices[offset++] = cloud.x + (x * cosine - y * sine) * planeSize * scale;
          vertices[offset++] = yPosition + (x * sine + y * cosine) * planeSize * scale;
          vertices[offset++] = cloud.z;
          vertices[offset++] = x + 0.5;
          vertices[offset++] = y + 0.5;
          vertices[offset++] = (x * cosine - y * sine) * scale + 0.5;
          vertices[offset++] = (x * sine + y * cosine) * scale + 0.5;
        }
      }
      gl.useProgram(cloudProgram);
      gl.uniform3fv(cloudUniforms.top, colors.top);
      gl.uniform3fv(cloudUniforms.bottom, colors.bottom);
      gl.uniform1f(cloudUniforms.aspect, aspect);
      gl.uniform1f(cloudUniforms.intro, intro);
      gl.bindBuffer(gl.ARRAY_BUFFER, cloudBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices.subarray(0, offset), gl.DYNAMIC_DRAW);
      for (let index = 0; index < attributes.length; index++) {
        gl.enableVertexAttribArray(attributes[index]);
        gl.vertexAttribPointer(attributes[index], index === 0 ? 3 : 2, gl.FLOAT, false, floatsPerVertex * 4, (index === 0 ? 0 : index === 1 ? 3 : 5) * 4);
      }
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.drawArrays(gl.TRIANGLES, 0, offset / floatsPerVertex);
    }
    if (!motion.matches && textureReady) frame = requestAnimationFrame(render);
  };
  const resume = () => {
    cancelAnimationFrame(frame);
    lastTime = 0;
    if (!document.hidden) frame = requestAnimationFrame(render);
  };
  const page = canvas.closest<HTMLElement>(".air-sky-page");
  const resize = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    const dpr = width < 768 ? 1.5 : Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    aspect = width / height;
    const worldHeight = 2 * Math.tan(fieldOfView / 2) * cameraZ;
    const worldWidth = worldHeight * aspect;
    worldPerPixel = worldHeight / height;
    planeSize = Math.max(worldWidth / 32 * 12, 17);
    clouds = makeClouds(worldWidth, worldHeight, planeSize, (page?.scrollHeight ?? document.documentElement.scrollHeight) / height);
    resume();
  };
  const image = new Image();
  image.onload = () => {
    if (disposed) return;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    textureReady = true;
    resume();
  };
  image.src = cloudTexture;
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  observer.observe(page ?? document.documentElement);
  const onScroll = () => {
    if (!frame && !document.hidden) frame = requestAnimationFrame(render);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("visibilitychange", resume);
  motion.addEventListener("change", resume);
  const unsubscribeMode = subscribeAirSceneMode(resume);
  resize();

  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    window.removeEventListener("scroll", onScroll);
    document.removeEventListener("visibilitychange", resume);
    motion.removeEventListener("change", resume);
    unsubscribeMode();
    image.onload = null;
    gl.deleteTexture(texture);
    gl.deleteBuffer(skyBuffer);
    gl.deleteBuffer(cloudBuffer);
    gl.deleteProgram(skyProgram);
    gl.deleteProgram(cloudProgram);
  };
}
