const canvas = document.getElementById("glCanvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

const vertexShader = `
  void main() { gl_Position = vec4(position, 1.0); }
`;

const fragmentShader = `
  precision highp float;
  uniform vec2  iResolution;
  uniform float iTime;
  uniform float uScrollSpeed;
  uniform float uWaveFreq;
  uniform float uWaveAmp;
  uniform float uCameraRoll;
  uniform float uSpiral1Strength;
  uniform float uSpiral1Radius;
  uniform float uSpiral2Strength;
  uniform float uSpiral2Radius;
  uniform float uSpiralBlendLow;
  uniform float uSpiralBlendHigh;
  uniform float uBlockScale;
  uniform float uBlockRounding;
  uniform float uBlockInset;
  uniform float uBlockRimWidth;
  uniform float uBlockLineWidth;
  uniform float uExtrusion;
  uniform float uHueShift;
  uniform float uSaturation;
  uniform float uPalette1Spread;
  uniform float uPalette2Spread;
  uniform float uPalette2Offset;
  uniform float uFloorColor;
  uniform float uLightX;
  uniform float uLightY;
  uniform float uLightZ;
  uniform float uAmbientStrength;
  uniform float uSpecPower;
  uniform float uSpecStrength;
  uniform float uShadowSharpness;
  uniform float uAoStrength;
  uniform float uRimInner;
  uniform float uRimOuter;
  uniform float uCamY;
  uniform float uCamZ;
  uniform float uFov;

  #define FAR 10.0
  const vec2 rDim = vec2(1.0, 4.0);

  float objID;
  vec2  gP;
  float tempR;
  vec4  gID;

  mat2 rot2(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c, -s, s, c);
  }

  float opExtrusion(float sdf, float pz, float h) {
    vec2 w = vec2(sdf, abs(pz) - h);
    return min(max(w.x, w.y), 0.0) + length(max(w, 0.0));
  }

  float hm(vec2 p) {
    return sin(6.2831 * (p.y * uWaveFreq + p.x) + iTime * 2.0) * uWaveAmp + uWaveAmp;
  }

  float sBoxS(vec2 p, vec2 b, float sf) {
    vec2 d = abs(p) - b + sf;
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - sf;
  }

  vec2 cMul(vec2 z, vec2 w) { return mat2(z.x, z.y, -z.y, z.x) * w; }
  vec2 cInv(vec2 z) { return vec2(z.x, -z.y) / dot(z, z); }
  vec2 cDiv(vec2 z, vec2 w) { return cMul(z, cInv(w)); }
  vec2 cLog(vec2 z) { return vec2(log(length(z)), atan(z.y, z.x)); }
  vec2 caTanh(vec2 z, float sc) {
    return cLog(cDiv(vec2(sc, 0.0) + z, vec2(sc, 0.0) - z));
  }

  vec4 blocks(vec3 q3) {
    vec2 scale = vec2(uBlockScale);
    vec2 l = scale;
    vec2 s = scale * 2.0;
    float d = 1e5;
    float data = 0.0;
    vec4 bestID = vec4(0.0);

    vec2 ps4[4];
    ps4[0] = vec2(-0.25,  0.25);
    ps4[1] = vec2( 0.25,  0.25);
    ps4[2] = vec2( 0.5,  -0.25);
    ps4[3] = vec2( 0.0,  -0.25);

    for (int i = 0; i < 24; i++) {
      vec2 p = q3.xy;
      vec2 ip = floor(p / s - ps4[i]);
      vec2 idi = (ip + 0.5 + ps4[i]) * s;
      p -= idi;
      vec2 index = mod(idi, rDim.yx) / rDim.yx;
      float h = hm(index) * tempR * 0.1;
      float di2D = sBoxS(p, l * 0.5 - uBlockInset, uBlockRounding);
      float di = opExtrusion(di2D, q3.z + h - 1.0, (h + 1.0) * uExtrusion);
      if (di < d) {
        d = di;
        bestID = vec4(d, idi, di2D);
        data = di2D;
        gP = p;
      }
    }
    return vec4(d, bestID.yz, data);
  }

  float map(vec3 p) {
    float fl = -p.z + 0.01;
    vec2 z = rot2(-sin(iTime / 3.0) * uSpiral1Strength) * p.xy;
    float r = min(length(z - vec2(uSpiral1Radius, 0.0)), length(z - vec2(-uSpiral1Radius, 0.0)));
    tempR = r;
    z = caTanh(-z, uSpiral1Radius) / 6.2831;
    vec2 z2 = rot2(-cos(iTime / 3.0) * uSpiral2Strength) * p.xy;
    float r2 = min(length(z2 - vec2(uSpiral2Radius, 0.0)), length(z2 - vec2(-uSpiral2Radius, 0.0)));
    tempR = min(tempR, r2);
    z += caTanh(z2, uSpiral2Radius) / 6.2831;
    tempR = smoothstep(uSpiralBlendLow, uSpiralBlendHigh, tempR);
    z.y = fract(z.y + iTime * uScrollSpeed);
    z = cMul(rDim, z);
    p.xy = z;
    vec4 d4 = blocks(p);
    gID = d4;
    objID = d4.x < fl ? 0.0 : 1.0;
    return min(d4.x, fl);
  }

  float trace(vec3 ro, vec3 rd) {
    float t = 0.0;
    for (int i = 0; i < 128; i++) {
      float d = map(ro + rd * t);
      if (abs(d) < 0.001 || t > FAR) break;
      t += d * 0.8;
    }
    return min(t, FAR);
  }

  vec3 getNormal(vec3 p) {
    float sgn = 1.0;
    vec3 e = vec3(0.001, 0.0, 0.0);
    vec3 mp = vec3(0.0);
    for (int i = 0; i < 6; i++) {
      mp.x += map(p + sgn * e) * sgn;
      sgn = -sgn;
      if ((i & 1) == 1) { mp = mp.yzx; e = e.zxy; }
    }
    return normalize(mp);
  }

  float softShadow(vec3 ro, vec3 lp, vec3 n, float k) {
    ro += n * 0.015;
    vec3 rd = lp - ro;
    float shade = 1.0;
    float end = max(length(rd), 0.0001);
    rd /= end;
    float t = 0.02;
    for (int i = 0; i < 16; i++) {
      float d = map(ro + rd * t);
      shade = min(shade, k * d / t);
      t += clamp(d, 0.01, 0.1);
      if (d < 0.0 || t > end) break;
    }
    return max(shade, 0.0);
  }

  float calcAO(vec3 p, vec3 n) {
    float occ = 1.0;
    float ds = 0.01;
    float k = 0.05 / ds;
    float dst = ds * 2.0;
    for (int i = 0; i < 5; i++) {
      occ -= (dst - map(p + n * dst)) * k;
      dst += ds;
      k *= 0.5;
    }
    return clamp(occ, 0.0, 1.0);
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - iResolution.xy * 0.5) / iResolution.y;
    vec3 ro  = vec3(0.0, uCamY, uCamZ);
    vec3 lk  = ro + vec3(0.0, 0.1, 0.5);
    vec3 lp  = ro + vec3(uLightX, uLightY, uLightZ);
    vec3 fwd = normalize(lk - ro);
    vec3 rgt = normalize(vec3(fwd.z, 0.0, -fwd.x));
    vec3 up  = cross(fwd, rgt);
    vec3 rd  = normalize(uv.x * rgt + uv.y * up + fwd / uFov);
    rd.xy = rot2(sin(iTime) / 32.0 * uCameraRoll) * rd.xy;

    float t = trace(ro, rd);
    vec4  svGID   = gID;
    float svObjID = objID;
    float svTempR = tempR;
    vec3 col = vec3(0.0);

    if (t < FAR) {
      vec3 sp = ro + rd * t;
      vec3 sn = getNormal(sp);
      vec3 ld = lp - sp;
      float lDist = max(length(ld), 0.001);
      ld /= lDist;
      float sh    = softShadow(sp, lp, sn, uShadowSharpness);
      float ao    = calcAO(sp, sn);
      float atten = 1.0 / (1.0 + lDist * 0.05);
      float diff  = max(dot(sn, ld), 0.0);
      float spec  = pow(max(dot(reflect(-ld, sn), -rd), 0.0), uSpecPower);
      float Schlick = pow(1.0 - max(dot(rd, normalize(rd + ld)), 0.0), 5.0);
      float freS  = mix(0.15, 1.0, Schlick);
      vec3 texCol = vec3(0.6);

      if (svObjID < 0.5) {
        vec2 index = mod(svGID.yz, rDim.yx) / rDim.yx;
        float hueBase = index.y + uHueShift;
        vec3 col1 = 0.5 + uSaturation * cos(6.2831 * hueBase + vec3(0.0, 1.0, 2.0) * uPalette1Spread);
        vec3 col2 = 0.5 + uSaturation * cos(6.2831 * hueBase + uPalette2Offset + vec3(0.0, 1.0, 2.0) * uPalette2Spread);
        texCol = col1;

        float di2D = svGID.w;
        vec3 spOff;
        spOff = sp - vec3(3.0 / 150.0, 0.0, 0.0);
        map(spOff);
        float di2DX = gID.w;
        spOff = sp - vec3(0.0, 3.0 / 150.0, 0.0);
        map(spOff);
        float di2DY = gID.w;
        float sf = length(vec2(di2DX, di2DY) - di2D);

        texCol = mix(texCol, vec3(0.0), (1.0 - smoothstep(0.0, sf, svGID.w + uBlockRimWidth)) * uRimInner);
        texCol = mix(texCol, col2,      (1.0 - smoothstep(0.0, sf, svGID.w + uBlockRimWidth + 0.005)));

        float dS = abs(svGID.w) - uBlockLineWidth * 0.5;
        texCol = mix(texCol, texCol / 3.0, (1.0 - smoothstep(0.0, sf, dS)));

        float h2 = hm(index);
        dS = max(dS, abs(sp.z + h2 * 0.1 * svTempR * 2.0) - uBlockLineWidth * 0.5);
        texCol = mix(texCol, vec3(0.0), (1.0 - smoothstep(0.0, sf, dS)) * uRimOuter);
      } else {
        texCol = vec3(uFloorColor);
      }

      col = texCol * (diff * sh + uAmbientStrength + vec3(1.0, 0.87, 0.82) * spec * freS * uSpecStrength * sh);
      col *= mix(1.0, ao, uAoStrength) * atten;
    }

    gl_FragColor = vec4(sqrt(max(col, 0.0)), 1.0);
  }
`;

const uniforms = {
  iResolution:      { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  iTime:            { value: 0.0 },
  uScrollSpeed:     { value: 0.1 },
  uWaveFreq:        { value: 2.0 },
  uWaveAmp:         { value: 0.5 },
  uCameraRoll:      { value: 1.0 },
  uSpiral1Strength: { value: 0.65 },
  uSpiral1Radius:   { value: 1.5 },
  uSpiral2Strength: { value: 0.8 },
  uSpiral2Radius:   { value: 0.75 },
  uSpiralBlendLow:  { value: 0.1 },
  uSpiralBlendHigh: { value: 0.5 },
  uBlockScale:      { value: 0.25 },
  uBlockRounding:   { value: 0.02 },
  uBlockInset:      { value: 0.0035 },
  uBlockRimWidth:   { value: 0.04 },
  uBlockLineWidth:  { value: 0.0035 },
  uExtrusion:       { value: 1.0 },
  uHueShift:        { value: 0.0 },
  uSaturation:      { value: 0.75 },
  uPalette1Spread:  { value: 1.0 },
  uPalette2Spread:  { value: 3.35 },
  uPalette2Offset:  { value: 2.257 },
  uFloorColor:      { value: 0.0 },
  uLightX:          { value: -0.75 },
  uLightY:          { value: 1.0 },
  uLightZ:          { value: 1.0 },
  uAmbientStrength: { value: 0.7 },
  uSpecPower:       { value: 32.0 },
  uSpecStrength:    { value: 3.0 },
  uShadowSharpness: { value: 16.0 },
  uAoStrength:      { value: 1.0 },
  uRimInner:        { value: 0.95 },
  uRimOuter:        { value: 1.0 },
  uCamY:            { value: -1.5 },
  uCamZ:            { value: -3.3 },
  uFov:             { value: 1.0 },
};

const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms });
scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

const morphRanges = {
  uWaveFreq:        { min: 0.0,  max: 1.0  },
  uWaveAmp:         { min: 0.0,  max: 1.0  },
  uSpiral1Strength: { min: 1.0,  max: 2.0  },
  uSpiral1Radius:   { min: 1.0,  max: 2.0  },
  uSpiral2Strength: { min: 0.5,  max: 1.0  },
  uSpiral2Radius:   { min: 0.0,  max: 1.0  },
  uBlockScale:      { min: 0.3,  max: 0.6  },
  uBlockRounding:   { min: 0.0,  max: 0.3  },
  uBlockInset:      { min: 0.0,  max: 0.02 },
  uBlockRimWidth:   { min: 0.0,  max: 0.15 },
  uBlockLineWidth:  { min: 0.0,  max: 0.2 },
  uHueShift:        { min: 0.0,  max: 1.6  },
  uPalette1Spread:  { min: 0.5,  max: 5.0  },
  uPalette2Spread:  { min: 0.5,  max: 7.0  },
  uExtrusion:       { min: 1.1,  max: 1.7  },
  uFov:             { min: 0.4,  max: 1.3  },
};

function randomInRange(min, max) { return min + Math.random() * (max - min); }

function generateTarget() {
  const target = {};
  for (const key in morphRanges) {
    target[key] = randomInRange(morphRanges[key].min, morphRanges[key].max);
  }
  return target;
}

const morphState = {
  from: {},
  to: generateTarget(),
  progress: 0.0,
  duration: 8.0,
};

for (const key in morphRanges) {
  morphState.from[key] = uniforms[key].value;
}

function easeInOut(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }

function updateMorph(delta) {
  morphState.progress += delta / morphState.duration;

  if (morphState.progress >= 1.0) {
    for (const key in morphRanges) {
      morphState.from[key] = uniforms[key].value;
    }
    morphState.progress = 0.0;
    morphState.to = generateTarget();
    morphState.duration = 8.0 + Math.random() * 8.0;
  }

  const t = easeInOut(Math.min(morphState.progress, 1.0));

  for (const key in morphRanges) {
    uniforms[key].value = morphState.from[key] + (morphState.to[key] - morphState.from[key]) * t;
  }
}

const clock = new THREE.Clock();
let elapsed = 0;

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  elapsed += delta * 0.1;
  uniforms.iTime.value = elapsed;
  updateMorph(delta);
  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  uniforms.iResolution.value.set(window.innerWidth, window.innerHeight);
});