export const EDGE_SAMPLES = 65;

export const MAX_EMBERS = 60;

export const FIRE_VERTEX = `
void main() {
  gl_Position = vec4(position.xy * 2.0, 0.0, 1.0);
}
`;

export const FIRE_FRAGMENT = `
uniform vec2 uCanvas;
uniform vec2 uFrame;
uniform vec2 uOrigin;
uniform vec2 uInvX;
uniform vec2 uInvY;
uniform float uZoom;
uniform vec2 uPaper;
uniform float uEdge[${EDGE_SAMPLES}];
uniform vec4 uBounds;
uniform float uTime;
uniform float uStrength;
uniform float uHeight;
uniform float uWidth;
uniform float uTurbulence;
uniform float uIntensity;
uniform float uGlow;
uniform float uEmbers;
uniform float uSmoke;
uniform float uSeed;
uniform float uSpread;
uniform vec3 uCore;
uniform vec3 uMid;
uniform vec3 uOuter;
uniform vec3 uTip;
uniform vec3 uEmber;
uniform vec3 uSmokeColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float total = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    total += noise(p) * amplitude;
    p = p * 2.03 + vec2(1.7, 9.2);
    amplitude *= 0.5;
  }
  return total / 0.97;
}

float edgeAt(float y) {
  float t = clamp(y / uPaper.y, 0.0, 1.0) * ${EDGE_SAMPLES - 1}.0;
  int i = int(min(floor(t), ${EDGE_SAMPLES - 2}.0));
  return mix(uEdge[i], uEdge[i + 1], t - float(i));
}

float fuel(float y) {
  float inside = smoothstep(-4.0, 10.0, y) * (1.0 - smoothstep(uPaper.y - 10.0, uPaper.y + 4.0, y));
  float along = y / uPaper.y;
  float patchy = noise(vec2(y * 0.011 + uSeed, uTime * 0.55)) - 0.5;
  float body = 1.0 - smoothstep(uSpread - 0.3, uSpread + 0.25, along + patchy * 0.45);
  float onPaper = 1.0 - smoothstep(uPaper.x - 10.0, uPaper.x + 40.0, edgeAt(y));
  return inside * body * onPaper;
}

vec3 ramp(float x) {
  vec3 c = mix(uTip, uOuter, smoothstep(0.02, 0.32, x));
  c = mix(c, uMid, smoothstep(0.3, 0.62, x));
  return mix(c, uCore, smoothstep(0.7, 1.0, x));
}

float segment(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-4), 0.0, 1.0);
  return length(pa - ba * h);
}

float envelope(float y) {
  float total = 0.0;
  for (int j = 0; j <= 28; j++) {
    float root = uPaper.y * float(j) / 28.0;
    float w = (root - y) / uHeight;
    float reach = w >= 0.0 ? 1.0 - smoothstep(0.0, 1.0, w) : exp(-w * w * 40.0);
    total += fuel(root) * reach;
  }
  return 1.0 - exp(-total * 9.0 / 28.0 * uPaper.y / uHeight);
}

vec3 flameBody(vec2 p, float t) {
  float env = envelope(p.y);
  if (env <= 0.001) {
    return vec3(0.0);
  }
  float above = max(0.0, -p.y);
  float lift = above / uHeight;
  float cx = edgeAt(clamp(p.y, 0.0, uPaper.y));
  float sway = (fbm(vec2(p.y * 0.004 + t * 0.7, uSeed * 1.3)) - 0.5) * uTurbulence * (0.5 + lift * 2.4);
  float center = cx + uWidth * 0.42 + sway + above * 0.05;
  float sigma = uWidth * (0.3 + 0.6 * env);
  float dx = (p.x - center) / (p.x < center ? sigma * 0.7 : sigma);
  float band = exp(-dx * dx * 0.5);
  vec2 q = vec2((p.x - sway * 0.6) / 24.0, (p.y + t * 300.0) / 96.0);
  vec2 warp = vec2(fbm(q * 0.55 + vec2(0.0, t * 0.5)), fbm(q * 0.55 + vec2(5.2, 1.3 - t * 0.4)));
  float n = fbm(q + (warp - 0.5) * 2.4);
  n = clamp((n - 0.5) * 1.9 + 0.5, 0.0, 1.0);
  float flame = band * env * mix(1.05, 1.5, uStrength) - (1.0 - n) * (0.72 + 0.85 * (1.0 - env));
  flame = clamp(flame, 0.0, 1.0);
  vec3 color = ramp(flame) * smoothstep(0.02, 0.22, flame) * (0.48 + flame * 0.5);
  float wide = exp(-dx * dx * 0.09);
  color += uOuter * wide * env * env * uGlow * 0.22;
  color += uTip * exp(-dx * dx * 0.03) * env * uGlow * 0.08;
  return color * uIntensity;
}

vec3 emberLine(vec2 p, float t) {
  if (p.y < -3.0 || p.y > uPaper.y + 3.0) {
    return vec3(0.0);
  }
  float ex = edgeAt(clamp(p.y, 0.0, uPaper.y));
  float onPaper = 1.0 - smoothstep(uPaper.x - 4.0, uPaper.x + 18.0, ex);
  float ends = smoothstep(-3.0, 4.0, p.y) * (1.0 - smoothstep(uPaper.y - 4.0, uPaper.y + 3.0, p.y));
  float de = p.x - ex;
  float px = 1.0 / max(uZoom, 0.2);
  float w = 1.1 * px + 0.7;
  float line = exp(-de * de / (2.0 * w * w));
  float hot = noise(vec2(p.y * 0.07 + uSeed, t * 1.6));
  float sparkle = pow(noise(vec2(p.y * 0.23 - t * 0.8, t * 3.1 + uSeed)), 4.0) * 3.2;
  float pulse = 0.55 + hot * 0.7 + sparkle;
  float halo = exp(-de * de / (2.0 * 49.0)) * (0.22 + hot * 0.2);
  float charZone = smoothstep(-20.0, -3.0, de) * (1.0 - smoothstep(-3.0, 0.5, de));
  float speck = smoothstep(0.66, 0.92, noise(vec2(p.x * 0.3 + uSeed, p.y * 0.3 + t * 0.5))) * charZone;
  vec3 color = uEmber * (line * pulse + halo + speck * 0.85);
  color += uCore * line * max(0.0, sparkle - 1.2) * 0.45;
  return color * onPaper * ends;
}

vec3 smoke(vec2 p, float t) {
  float rise = -p.y - uHeight * 0.4;
  if (rise <= 0.0) {
    return vec3(0.0);
  }
  float lift = rise / uHeight;
  float source = max(fuel(12.0), fuel(uPaper.y * 0.25));
  float env = smoothstep(0.0, 0.6, lift) * (1.0 - smoothstep(0.8, 2.3, lift)) * source;
  float drift = (fbm(vec2(p.y * 0.003 - t * 0.18, 8.1 + uSeed)) - 0.5) * uTurbulence * 5.0;
  float center = edgeAt(0.0) + uWidth * 0.3 + drift + rise * 0.1;
  float spread = uWidth * (0.8 + lift * 1.6);
  float band = exp(-pow((p.x - center) / spread, 2.0));
  vec2 q = vec2(p.x / 52.0, (p.y + t * 120.0) / 110.0);
  float n = fbm(q + vec2(fbm(q * 0.7 + vec2(t * 0.12, 0.0)), 0.0) * 1.8);
  float strand = pow(1.0 - abs(n * 2.0 - 1.0), 3.0);
  float body = smoothstep(0.3, 0.8, fbm(q * 0.5 + vec2(3.3, t * 0.1)));
  return vec3(strand * body * 0.55 + body * 0.2) * band * env;
}

vec3 sparks(vec2 p, float t) {
  vec3 color = vec3(0.0);
  for (int i = 0; i < ${MAX_EMBERS}; i++) {
    float fi = float(i);
    if (fi >= uEmbers) {
      break;
    }
    float h1 = hash(vec2(fi, uSeed));
    float h2 = hash(vec2(fi * 1.7 + 3.1, uSeed * 0.3));
    float h3 = hash(vec2(fi * 0.37 + 9.2, 2.6));
    float period = 1.3 + h1 * 1.5;
    float cycle = t / period + h2;
    float phase = fract(cycle);
    float generation = floor(cycle);
    float g1 = hash(vec2(fi + 0.5, generation));
    float g2 = hash(vec2(generation * 1.3 + 0.7, fi * 2.3));
    float y0 = uPaper.y * (0.04 + 0.55 * g1);
    float source = fuel(y0);
    if (source <= 0.02) {
      continue;
    }
    float x0 = edgeAt(y0) + 3.0;
    float age = phase * period;
    vec2 velocity = vec2(18.0 + 70.0 * g2, -(80.0 + 150.0 * h3));
    vec2 swirl = vec2(sin(age * 2.6 + fi) * 14.0, 0.0);
    vec2 pos = vec2(x0, y0) + velocity * age + swirl + vec2(0.0, -age * age * 30.0);
    vec2 heading = velocity + vec2(cos(age * 2.6 + fi) * 36.0, -age * 60.0);
    float radius = (0.9 + 1.5 * h1) * mix(1.0, 0.5, phase);
    float d = segment(p, pos, pos - heading * 0.035);
    float life = smoothstep(0.0, 0.12, phase) * (1.0 - smoothstep(0.45, 1.0, phase));
    float flick = 0.7 + 0.3 * sin(t * 19.0 + fi * 4.1);
    float core = exp(-d * d / (radius * radius));
    float halo = exp(-d * d / (radius * radius * 9.0)) * 0.25;
    color += mix(uEmber, uCore, 0.25 + 0.5 * h2) * (core + halo) * life * flick * source * 1.5;
  }
  return color;
}

void main() {
  vec2 screen = vec2(gl_FragCoord.x / uCanvas.x * uFrame.x, (1.0 - gl_FragCoord.y / uCanvas.y) * uFrame.y);
  vec2 rel = screen - uOrigin;
  vec2 p = vec2(dot(uInvX, rel), dot(uInvY, rel));
  if (uStrength <= 0.0 || p.x < uBounds.x || p.x > uBounds.z || p.y < uBounds.y || p.y > uBounds.w) {
    gl_FragColor = vec4(0.0);
    return;
  }
  float t = uTime;
  float window = smoothstep(uBounds.x, uBounds.x + 90.0, p.x) * (1.0 - smoothstep(uBounds.z - 90.0, uBounds.z, p.x))
    * smoothstep(uBounds.y, uBounds.y + 120.0, p.y) * (1.0 - smoothstep(uBounds.w - 30.0, uBounds.w, p.y));
  vec3 fire = flameBody(p, t) + emberLine(p, t) + sparks(p, t) * uStrength;
  fire *= smoothstep(0.0, 0.45, uStrength) * window;
  float haze = clamp(length(smoke(p, t)) * 0.58, 0.0, 1.0) * uSmoke * uStrength * window;
  float dither = (hash(gl_FragCoord.xy + fract(t)) - 0.5) / 255.0;
  fire = max(fire + dither, 0.0);
  float glow = max(fire.r, max(fire.g, fire.b));
  float alpha = clamp(glow + haze, 0.0, 1.0);
  vec3 color = min(fire, vec3(1.0)) + uSmokeColor * haze;
  gl_FragColor = vec4(min(color, vec3(alpha)), alpha);
}
`;
