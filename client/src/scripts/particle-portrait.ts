/**
 * Hand-written WebGL particle portrait.
 * Samples a small grayscale+alpha map (public/portrait-map.png) into points that
 * assemble from a rotating "core", react to the pointer and scatter on scroll.
 */

const VERTEX = /* glsl */ `
attribute vec3 aTarget;
attribute vec3 aStart;
attribute vec4 aData; // brightness, random, delay, size

uniform float uTime;
uniform float uIntro;
uniform float uScatter;
uniform float uAspect;
uniform float uFocal;
uniform float uPixel;
uniform vec2 uMouse;
uniform float uMouseStrength;
uniform vec2 uRot;

varying float vBright;
varying float vAlpha;
varying float vHover;

vec3 rotY(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z); }
vec3 rotX(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z); }

void main() {
  float bright = aData.x;
  float rnd = aData.y;

  float t = clamp((uIntro - aData.z) / 0.7, 0.0, 1.0);
  t = 1.0 - pow(1.0 - t, 3.0);

  vec3 start = rotX(rotY(aStart, uTime * 0.35 + rnd), 0.35);
  vec3 p = mix(start, aTarget, t);

  p.z += sin(aTarget.y * 7.0 - uTime * 1.4 + aTarget.x * 2.5) * 0.018 * t;
  p += vec3(sin(uTime * 0.7 + rnd * 40.0), cos(uTime * 0.6 + rnd * 25.0), sin(uTime * 0.5 + rnd * 13.0)) * 0.005;
  p += normalize(aStart + 0.0001) * uScatter * (0.5 + rnd * 1.6);

  p = rotX(rotY(p, uRot.x), uRot.y);

  float z = 3.2 - p.z;
  vec2 ndc = vec2(p.x * uFocal / uAspect, p.y * uFocal) / z;

  vec2 d = ndc - uMouse;
  d.x *= uAspect;
  float dist = length(d);
  float push = smoothstep(0.3, 0.0, dist) * uMouseStrength * t;
  ndc += normalize(d + 0.00001) * push * 0.075 * vec2(1.0 / uAspect, 1.0);

  gl_Position = vec4(ndc, 0.0, 1.0);
  gl_PointSize = uPixel * aData.w * (0.7 + bright * 0.6) * (3.2 / z) * (1.0 + push);

  vBright = bright;
  vAlpha = mix(0.35, 1.0, t) * (1.0 - min(uScatter, 1.0) * 0.9);
  vHover = push;
}
`;

const FRAGMENT = /* glsl */ `
precision mediump float;

uniform vec3 uLow;
uniform vec3 uHigh;
uniform vec3 uAccent;
uniform float uLight;

varying float vBright;
varying float vAlpha;
varying float vHover;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float soft = smoothstep(0.5, 0.12, d);

  vec3 color = mix(uLow, uHigh, smoothstep(0.1, 0.9, vBright));
  color = mix(color, uAccent, clamp(vHover * 1.6, 0.0, 1.0));

  float ink = mix(mix(0.42, 1.0, vBright), mix(1.0, 0.32, vBright), uLight);
  gl_FragColor = vec4(color, soft * vAlpha * ink);
}
`;

const PALETTES = {
  dark: { low: [1.0, 0.36, 0.16], high: [1.0, 0.95, 0.91], accent: [1.0, 0.62, 0.35], light: 0 },
  light: { low: [0.07, 0.07, 0.08], high: [0.88, 0.3, 0.09], accent: [0.88, 0.3, 0.09], light: 1 },
} as const;

type Theme = keyof typeof PALETTES;

interface Options {
  canvas: HTMLCanvasElement;
  mapUrl: string;
  theme: Theme;
  scrollContainer: HTMLElement;
  reducedMotion: boolean;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? 'shader');
  return shader;
}

function samplePortrait(img: HTMLImageElement, step: number) {
  const { width: w, height: h } = img;
  const scratch = document.createElement('canvas');
  scratch.width = w;
  scratch.height = h;
  const ctx = scratch.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0);
  const { data } = ctx.getImageData(0, 0, w, h);

  const target: number[] = [];
  const start: number[] = [];
  const meta: number[] = [];

  for (let fy = 0; fy < h; fy += step) {
    for (let fx = 0; fx < w; fx += step) {
      const x = Math.floor(fx);
      const y = Math.floor(fy);
      const i = (y * w + x) * 4;
      if (data[i + 3] < 128) continue;

      const fade = Math.min(1, (1 - y / h) / 0.18);
      if (Math.random() > fade) continue;

      const bright = Math.max(0.12, data[i] / 255);
      const jx = (Math.random() - 0.5) * step;
      const jy = (Math.random() - 0.5) * step;
      target.push(((x + jx - w / 2) / h) * 2, (-(y + jy - h / 2) / h) * 2, (bright - 0.5) * 0.35 + (Math.random() - 0.5) * 0.03);

      const u = Math.random() * Math.PI * 2;
      const v = Math.acos(2 * Math.random() - 1);
      const r = 0.55 + Math.pow(Math.random(), 3) * 0.25;
      start.push(r * Math.sin(v) * Math.cos(u), r * Math.sin(v) * Math.sin(u), r * Math.cos(v));

      meta.push(bright, Math.random(), Math.random() * 0.55 + (y / h) * 0.45, 0.8 + Math.random() * 0.45);
    }
  }

  return { target, start, meta, count: meta.length / 4, aspect: w / h, rows: h / step };
}

export async function mountPortrait({ canvas, mapUrl, theme, scrollContainer, reducedMotion }: Options) {
  const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: false, powerPreference: 'high-performance' });
  if (!gl) throw new Error('WebGL unavailable');

  // Software rasterisers (no GPU) can't hold 60fps with thousands of blended points.
  const debug = gl.getExtension('WEBGL_debug_renderer_info');
  const renderer = String(gl.getParameter(debug ? debug.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
  if (/swiftshader|llvmpipe|software|basic render/i.test(renderer)) throw new Error(`Software WebGL: ${renderer}`);

  const img = await loadImage(mapUrl);
  const small = innerWidth < 768;
  const points = samplePortrait(img, small ? 1.35 : 1);

  const program = gl.createProgram()!;
  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX));
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('link failed');
  gl.useProgram(program);

  const attribute = (name: string, values: number[], size: number) => {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(values), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
  };
  attribute('aTarget', points.target, 3);
  attribute('aStart', points.start, 3);
  attribute('aData', points.meta, 4);

  const u = (name: string) => gl.getUniformLocation(program, name);
  const uniforms = {
    time: u('uTime'),
    intro: u('uIntro'),
    scatter: u('uScatter'),
    aspect: u('uAspect'),
    focal: u('uFocal'),
    pixel: u('uPixel'),
    mouse: u('uMouse'),
    mouseStrength: u('uMouseStrength'),
    rot: u('uRot'),
    low: u('uLow'),
    high: u('uHigh'),
    accent: u('uAccent'),
    light: u('uLight'),
  };

  gl.disable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.clearColor(0, 0, 0, 0);

  const applyTheme = (next: Theme) => {
    const p = PALETTES[next];
    gl.uniform3fv(uniforms.low, p.low);
    gl.uniform3fv(uniforms.high, p.high);
    gl.uniform3fv(uniforms.accent, p.accent);
    gl.uniform1f(uniforms.light, p.light);
    if (next === 'dark') gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    else gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  };
  applyTheme(theme);

  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 1.75);
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);

    const aspect = width / height;
    const focal = Math.min(0.92 * 3.2, (0.92 * 3.2 * aspect) / points.aspect);
    const spacing = ((focal / 3.2) * canvas.height) / points.rows;
    gl.uniform1f(uniforms.aspect, aspect);
    gl.uniform1f(uniforms.focal, focal);
    gl.uniform1f(uniforms.pixel, Math.max(1.5, spacing * 1.05));
  };
  resize();

  const state = { mx: 0, my: 0, tmx: 0, tmy: 0, strength: 0, tStrength: 0, yaw: 0, pitch: 0, scatter: 0 };

  const onPointer = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    state.tmx = x;
    state.tmy = y;
    state.tStrength = Math.abs(x) < 1.15 && Math.abs(y) < 1.15 ? 1 : 0;
  };
  const onLeave = () => (state.tStrength = 0);
  if (!reducedMotion) {
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('pointerleave', onLeave);
  }

  let visible = true;
  let raf = 0;
  const began = performance.now();

  const frame = (now: number) => {
    const t = (now - began) / 1000;
    const scrollProgress = Math.min(1, Math.max(0, -scrollContainer.getBoundingClientRect().top / (scrollContainer.offsetHeight * 0.8)));

    state.mx += (state.tmx - state.mx) * 0.08;
    state.my += (state.tmy - state.my) * 0.08;
    state.strength += (state.tStrength - state.strength) * 0.06;
    state.yaw += (state.mx * 0.32 + Math.sin(t * 0.35) * 0.1 - state.yaw) * 0.05;
    state.pitch += (-state.my * 0.16 - state.pitch) * 0.05;
    const scatterTarget = Math.pow(Math.max(0, scrollProgress - 0.2) / 0.8, 1.8) * 1.3;
    state.scatter += (scatterTarget - state.scatter) * 0.12;

    gl.uniform1f(uniforms.time, reducedMotion ? 0 : t);
    gl.uniform1f(uniforms.intro, reducedMotion ? 3 : Math.min(3, t * 0.72));
    gl.uniform1f(uniforms.scatter, reducedMotion ? 0 : state.scatter);
    gl.uniform2f(uniforms.mouse, state.mx, state.my);
    gl.uniform1f(uniforms.mouseStrength, state.strength);
    gl.uniform2f(uniforms.rot, reducedMotion ? 0 : state.yaw, reducedMotion ? 0 : state.pitch);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, points.count);

    if (!reducedMotion && visible && !document.hidden) raf = requestAnimationFrame(frame);
  };

  const play = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(frame);
  };

  new ResizeObserver(() => {
    resize();
    play();
  }).observe(canvas);

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) play();
  });
  io.observe(canvas);
  document.addEventListener('visibilitychange', () => !document.hidden && visible && play());

  play();

  return {
    count: points.count,
    setTheme(next: Theme) {
      applyTheme(next);
      play();
    },
  };
}
