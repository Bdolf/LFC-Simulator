/**
 * Lamor Sim -henkinen valtameri WebGL:lle: Gerstner-aallot, Schlick-fresnel-
 * taivasheijastus, syvyyssävy (turkoosi -> navy), aallonharjavaahto, runkonauha
 * ja perävana. Syvyys luetaan maaston korkeustekstuurista.
 */
import * as THREE from 'three';

const VERT = /* glsl */ `
uniform float uTime;
uniform vec2 uShipPos;
uniform float uHeading;
uniform float uMaskRadius;
uniform float uHs;
varying vec3 vWorld;
varying vec3 vNormalW;
varying float vCrest;

const float G = 9.81;

// yksi Gerstner-komponentti: palauttaa siirtymän ja normalin kertoimet
vec3 gw(vec2 p, vec2 dir, float wl, float amp, float t, inout vec2 slope) {
  float k = 6.28318 / wl;
  float c = sqrt(G / k);
  float f = k * (dot(dir, p) - c * t);
  float s = sin(f), co = cos(f);
  slope += dir * (k * amp * co);
  float q = 0.55; // jyrkkyys
  return vec3(q * amp * dir.x * co, amp * s, q * amp * dir.y * co);
}

void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vec2 xz = wp.xz;
  float distC = length(xz - uShipPos);
  float mask = 1.0 - smoothstep(uMaskRadius * 0.45, uMaskRadius, distC);
  vec2 slope = vec2(0.0);
  float hs = uHs * mask;
  vec3 d = vec3(0.0);
  d += gw(xz, normalize(vec2(-0.81, -0.59)), 130.0, 0.60 * hs, uTime, slope);
  d += gw(xz, normalize(vec2(-0.66, -0.75)), 62.0, 0.34 * hs, uTime, slope);
  d += gw(xz, normalize(vec2(-0.93, -0.36)), 31.0, 0.18 * hs, uTime, slope);
  d += gw(xz, normalize(vec2(-0.55, -0.83)), 16.0, 0.10 * hs, uTime, slope);
  d += gw(xz, normalize(vec2(-0.88, -0.47)), 8.5, 0.05 * hs, uTime, slope);
  wp.xyz += d;
  vWorld = wp.xyz;
  vNormalW = normalize(vec3(-slope.x, 1.0, -slope.y));
  vCrest = clamp(d.y / max(0.25 * uHs, 0.05), 0.0, 1.5);
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

const FRAG = /* glsl */ `
uniform float uTime;
uniform vec3 uSunDir;
uniform vec3 uSunCol;
uniform vec3 uZenith;
uniform vec3 uHorizon;
uniform vec2 uShipPos;
uniform float uHeading;
uniform float uSpeedK;
uniform sampler2D uDepthTex;
uniform vec4 uTerrainUv; // x0, z0, 1/w, 1/h (maailma -> uv)
varying vec3 vWorld;
varying vec3 vNormalW;
varying float vCrest;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p) { return noise(p) * 0.55 + noise(p * 3.7) * 0.3 + noise(p * 11.1) * 0.15; }

void main() {
  vec3 V = normalize(cameraPosition - vWorld);
  vec3 N = normalize(vNormalW);
  // hienoripple normaalille kaukana (Gerstner-tarkkuus ei riitä)
  float rip = fbm(vWorld.xz * 0.35 + vec2(uTime * 0.35, uTime * 0.22));
  N = normalize(N + vec3((rip - 0.5) * 0.22, 0.0, (fbm(vWorld.xz * 0.27 - uTime * 0.18) - 0.5) * 0.22));

  // syvyys maastotekstuurista (metriä, positiivinen alas)
  vec2 uv = (vWorld.xz - uTerrainUv.xy) * uTerrainUv.zw;
  float terr = texture2D(uDepthTex, clamp(uv, 0.0, 1.0)).r;
  float depth = max(-terr, 0.0);
  float deep = smoothstep(12.0, 70.0, depth);

  // fresnel (Schlick, F0 = 0.02)
  float cosV = clamp(dot(N, V), 0.0, 1.0);
  float fres = 0.02 + 0.98 * pow(1.0 - cosV, 5.0);

  // perusväri: turkoosi matala -> navy syvä; harjat vaalenevat
  vec3 shallowC = vec3(0.06, 0.34, 0.38);
  vec3 deepC = vec3(0.012, 0.055, 0.105);
  float crest = clamp(vCrest, 0.0, 1.2);
  vec3 body = mix(shallowC, deepC, deep) * (0.45 + 0.55 * crest);

  // auringon läpipaistavuus harjoissa (sss)
  float back = pow(clamp(dot(V, -normalize(uSunDir + N * 0.6)), 0.0, 1.0), 4.0);
  vec3 sss = vec3(0.10, 0.55, 0.50) * uSunCol * (back * crest * 1.6 + crest * 0.25) * (1.0 - deep * 0.6);

  // taivasheijastus
  vec3 R = reflect(-V, N);
  float up = clamp(R.y, 0.0, 1.0);
  vec3 sky = mix(uHorizon, uZenith, pow(up, 0.6));
  // auringon kimallus
  float spec = pow(clamp(dot(R, uSunDir), 0.0, 1.0), 380.0) * 3.2;

  // --- vaahto ---
  // laivan runko: etu-/takakoordinaatit aluksen kehyksessä
  vec2 rel = vWorld.xz - uShipPos;
  vec2 fwd = vec2(sin(uHeading), cos(uHeading));
  vec2 side = vec2(fwd.y, -fwd.x);
  float along = dot(rel, fwd);
  float lateral = abs(dot(rel, side));
  float foamAmt = 0.0;
  // runkonauha (ragged reunat)
  if (along > -60.0 && along < 60.0) {
    float band = 11.0 + 5.0 * fbm(vec2(along * 0.35, lateral * 0.7) + uTime * 0.15);
    float core = 1.0 - smoothstep(band * 0.5, band, lateral);
    float feather = (1.0 - smoothstep(band, band * 2.6, lateral)) * 0.45;
    foamAmt = max(core, feather) * (0.35 + 0.65 * uSpeedK);
  }
  // keulavaahto
  float bowK = smoothstep(30.0, 55.0, along) * (1.0 - smoothstep(8.0, 20.0, lateral));
  foamAmt = max(foamAmt, bowK * (0.5 + 0.5 * uSpeedK) * (0.6 + 0.4 * fbm(vec2(along * 0.5, lateral * 1.3))));
  // perävana: levenee ja haalistuu
  if (along < -50.0) {
    float waken = -along;
    float wwidth = 16.0 + waken * 0.16;
    float wk = (1.0 - smoothstep(wwidth * 0.3, wwidth, lateral));
    wk *= exp(-waken / 520.0) * (0.35 + 0.65 * uSpeedK);
    wk *= 0.45 + 0.55 * fbm(vec2(along * 0.10 + uTime * 0.35, lateral * 0.30));
    foamAmt = max(foamAmt, wk);
  }
  // aallonharjavaahto
  float crestFoam = smoothstep(0.75, 1.1, crest) * (0.35 + 0.65 * fbm(vWorld.xz * 0.55 + uTime * 0.4));
  foamAmt = max(foamAmt, crestFoam);
  // ranta-/matalikkovaahto
  foamAmt = max(foamAmt, (1.0 - smoothstep(2.0, 7.0, depth)) * (0.4 + 0.6 * fbm(vWorld.xz * 0.8 + uTime * 0.5)));

  vec3 foamCol = vec3(0.88, 0.92, 0.94);
  vec3 col = mix(body + sss, sky, fres) + uSunCol * spec;
  col = mix(col, foamCol * (0.55 + 0.45 * dot(N, uSunDir)), clamp(foamAmt, 0.0, 1.0) * 0.9);
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}
`;

export interface OceanUniforms {
  uTime: { value: number };
  uSunDir: { value: THREE.Vector3 };
  uSunCol: { value: THREE.Color };
  uZenith: { value: THREE.Color };
  uHorizon: { value: THREE.Color };
  uShipPos: { value: THREE.Vector2 };
  uHeading: { value: number };
  uSpeedK: { value: number };
  uHs: { value: number };
  uMaskRadius: { value: number };
  uDepthTex: { value: THREE.Texture | null };
  uTerrainUv: { value: THREE.Vector4 };
}

export function createOceanMaterial(): { material: THREE.ShaderMaterial; uniforms: OceanUniforms } {
  const uniforms: OceanUniforms = {
    uTime: { value: 0 },
    uSunDir: { value: new THREE.Vector3(0.6, 0.55, -0.35).normalize() },
    uSunCol: { value: new THREE.Color(1.0, 0.97, 0.92) },
    uZenith: { value: new THREE.Color(0x5d81a3) },
    uHorizon: { value: new THREE.Color(0xc9d9e6) },
    uShipPos: { value: new THREE.Vector2() },
    uHeading: { value: 0 },
    uSpeedK: { value: 0.6 },
    uHs: { value: 0.7 },
    uMaskRadius: { value: 6000 },
    uDepthTex: { value: null },
    uTerrainUv: { value: new THREE.Vector4(0, 0, 0, 0) },
  };
  const material = new THREE.ShaderMaterial({
    uniforms: uniforms as unknown as Record<string, THREE.IUniform>,
    vertexShader: VERT,
    fragmentShader: FRAG,
  });
  return { material, uniforms };
}
