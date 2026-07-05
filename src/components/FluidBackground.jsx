import { useEffect, useRef } from "react";

const THEME_COLORS = {
  light: {
    bg: [0.925, 0.906, 0.839],      // #ECE7D6 Warm Sage Paper
    colorA: [0.486, 0.561, 0.427],  // #7C8F6D Sage Green
    colorB: [0.710, 0.282, 0.180],  // #B5482E Clay Red
  },
  dark: {
    bg: [0.110, 0.122, 0.082],      // #1A1D16 Starry Dark
    colorA: [0.431, 0.314, 0.490],  // #6E507D Purple Mist
    colorB: [0.282, 0.408, 0.478],  // #48687A Starry Blue
  }
};

export default function FluidBackground({ theme, opacity = 1.0 }) {
  const canvasRef = useRef(null);
  const themeRef = useRef(theme);

  const currentBgRef = useRef([...THEME_COLORS[theme].bg]);
  const currentColorARef = useRef([...THEME_COLORS[theme].colorA]);
  const currentColorBRef = useRef([...THEME_COLORS[theme].colorB]);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
      console.warn("WebGL not supported in FluidBackground.");
      return;
    }

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // CPU Fluid Simulation Grid (64x64)
    const GRID_W = 64;
    const GRID_H = 64;
    const totalCells = GRID_W * GRID_H;

    let u = new Float32Array(totalCells);
    let v = new Float32Array(totalCells);

    let dSage = new Float32Array(totalCells);
    let dSagePrev = new Float32Array(totalCells);
    let dSageInit = new Float32Array(totalCells);

    let dPurple = new Float32Array(totalCells);
    let dPurplePrev = new Float32Array(totalCells);
    let dPurpleInit = new Float32Array(totalCells);

    const clearBoundaries = (d) => {
      for (let cx = 0; cx < GRID_W; cx++) {
        d[cx] = 0.0;
        d[cx + (GRID_H - 1) * GRID_W] = 0.0;
      }
      for (let cy = 0; cy < GRID_H; cy++) {
        d[cy * GRID_W] = 0.0;
        d[(GRID_W - 1) + cy * GRID_W] = 0.0;
      }
    };

    const initDensities = () => {
      for (let cy = 0; cy < GRID_H; cy++) {
        for (let cx = 0; cx < GRID_W; cx++) {
          const idx = cx + cy * GRID_W;
          const nx = cx / (GRID_W - 1);
          const ny = cy / (GRID_H - 1);

          const distToCenter = Math.sqrt((nx - 0.5) * (nx - 0.5) + (ny - 0.5) * (ny - 0.5));
          const centerMask = Math.min(1.0, distToCenter * 2.5);

          const dSage1 = Math.sqrt((nx - 0.2) * (nx - 0.2) + (ny - 0.25) * (ny - 0.25));
          const dSage2 = Math.sqrt((nx - 0.8) * (nx - 0.8) + (ny - 0.75) * (ny - 0.75));
          const dSage3 = Math.sqrt((nx - 0.15) * (nx - 0.15) + (ny - 0.6) * (ny - 0.6));
          const sageBase = Math.max(0, 0.9 - Math.min(dSage1, dSage2, dSage3) * 2.2);

          const dPurple1 = Math.sqrt((nx - 0.2) * (nx - 0.2) + (ny - 0.75) * (ny - 0.75));
          const dPurple2 = Math.sqrt((nx - 0.8) * (nx - 0.8) + (ny - 0.25) * (ny - 0.25));
          const dPurple3 = Math.sqrt((nx - 0.5) * (nx - 0.5) + (ny - 0.85) * (ny - 0.85));
          const purpleBase = Math.max(0, 0.85 - Math.min(dPurple1, dPurple2, dPurple3) * 2.0);

          dSageInit[idx] = sageBase * centerMask;
          dPurpleInit[idx] = purpleBase * centerMask;

          dSage[idx] = dSageInit[idx];
          dPurple[idx] = dPurpleInit[idx];
        }
      }
    };
    initDensities();
    clearBoundaries(dSageInit);
    clearBoundaries(dPurpleInit);
    clearBoundaries(dSage);
    clearBoundaries(dPurple);

    // Shaders
    const vsSource = `
      attribute vec2 position;
      varying vec2 v_uv;
      void main() {
        v_uv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision mediump float;
      varying vec2 v_uv;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform sampler2D u_fluid_texture;

      uniform vec3 u_bg_color;
      uniform vec3 u_color_a;
      uniform vec3 u_color_b;

      float hash(vec3 p) {
        return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453123);
      }

      float noise(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);
        vec3 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(
            mix(hash(i + vec3(0.0, 0.0, 0.0)), hash(i + vec3(1.0, 0.0, 0.0)), u.x),
            mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), u.x),
            u.y
          ),
          mix(
            mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), u.x),
            mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), u.x),
            u.y
          ),
          u.z
        );
      }

      float fbm(vec3 p) {
        float v = 0.0;
        float a = 0.5;
        vec3 shift = vec3(100.0);
        for (int i = 0; i < 4; i++) {
          v += a * noise(p);
          p = p * 2.0 + shift;
          a *= 0.5;
        }
        return v;
      }

      vec2 warp(vec2 uv, float t, float aspect) {
        vec2 aspectUv = vec2(uv.x * aspect, uv.y);
        vec3 p = vec3(aspectUv * 2.8, t * 0.02);
        vec2 q = vec2(
          fbm(p),
          fbm(p + vec3(5.2, 1.3, 10.0))
        );
        vec3 p2 = vec3(aspectUv * 2.8, t * 0.01);
        vec2 r = vec2(
          fbm(p2 + vec3(4.0 * q + vec2(1.7, 9.2), 20.0)),
          fbm(p2 + vec3(4.0 * q + vec2(8.3, 2.8), 30.0))
        );
        return uv + 0.018 * r;
      }

      void main() {
        float aspect = u_resolution.x / u_resolution.y;
        vec2 aspectUv = vec2(v_uv.x * aspect, v_uv.y);

        vec2 warpedUv = warp(v_uv, u_time, aspect);
        vec4 fluidSample = texture2D(u_fluid_texture, warpedUv);

        float n = fbm(vec3(aspectUv * 5.0, u_time * 0.03));
        
        float sageDensity = fluidSample.r + (n - 0.5) * 0.12;
        float purpleDensity = fluidSample.g + (n - 0.5) * 0.12;

        float sageVal = smoothstep(0.04, 0.62, sageDensity);
        float purpleVal = smoothstep(0.04, 0.62, purpleDensity);

        vec3 color = u_bg_color;
        color = mix(color, u_color_a, sageVal);
        color = mix(color, u_color_b, purpleVal);

        float grain = (noise(vec3(aspectUv * 600.0, 0.0)) - 0.5) * 0.024;
        color += vec3(grain);

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const compileShader = (source, type) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compiler error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(vsSource, gl.VERTEX_SHADER);
    const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program linking error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const quadPositions = new Float32Array([
      -1.0, -1.0,  1.0, -1.0, -1.0,  1.0,
      -1.0,  1.0,  1.0, -1.0,  1.0,  1.0,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, quadPositions, gl.STATIC_DRAW);

    const posAttrLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posAttrLoc);
    gl.vertexAttribPointer(posAttrLoc, 2, gl.FLOAT, false, 0, 0);

    const uTimeLoc = gl.getUniformLocation(program, "u_time");
    const uResLoc = gl.getUniformLocation(program, "u_resolution");
    const uBgColorLoc = gl.getUniformLocation(program, "u_bg_color");
    const uColorALoc = gl.getUniformLocation(program, "u_color_a");
    const uColorBLoc = gl.getUniformLocation(program, "u_color_b");

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const textureBuffer = new Uint8Array(GRID_W * GRID_H * 4);

    const advect = (d, d0, velX, velY, dt) => {
      const dtX = dt * (GRID_W - 2);
      const dtY = dt * (GRID_H - 2);
      for (let cy = 1; cy < GRID_H - 1; cy++) {
        for (let cx = 1; cx < GRID_W - 1; cx++) {
          const idx = cx + cy * GRID_W;
          let srcX = cx - velX[idx] * dtX;
          let srcY = cy - velY[idx] * dtY;

          if (srcX < 0.5) srcX = 0.5;
          if (srcX > GRID_W - 1.5) srcX = GRID_W - 1.5;
          if (srcY < 0.5) srcY = 0.5;
          if (srcY > GRID_H - 1.5) srcY = GRID_H - 1.5;

          const cx0 = Math.floor(srcX);
          const cx1 = cx0 + 1;
          const cy0 = Math.floor(srcY);
          const cy1 = cy0 + 1;

          const s1 = srcX - cx0;
          const s0 = 1 - s1;
          const t1 = srcY - cy0;
          const t0 = 1 - t1;

          d[idx] =
            s0 * (t0 * d0[cx0 + cy0 * GRID_W] + t1 * d0[cx0 + cy1 * GRID_W]) +
            s1 * (t0 * d0[cx1 + cy0 * GRID_W] + t1 * d0[cx1 + cy1 * GRID_W]);
        }
      }
    };

    let lastMouseX = 0;
    let lastMouseY = 0;
    let lastTime = Date.now();

    const handleMouseMove = (e) => {
      const now = Date.now();
      const dt = now - lastTime;
      if (dt === 0) return;

      let mx = 0, my = 0;
      if (e.clientX !== undefined) {
        mx = e.clientX;
        my = e.clientY;
      } else if (e.touches && e.touches.length > 0) {
        mx = e.touches[0].clientX;
        my = e.touches[0].clientY;
      } else {
        return;
      }

      const dx = mx - lastMouseX;
      const dy = my - lastMouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const cx = Math.floor((mx / width) * GRID_W);
      const cy = Math.floor(((height - my) / height) * GRID_H);

      if (dist > 1.0 && cx > 1 && cx < GRID_W - 2 && cy > 1 && cy < GRID_H - 2) {
        const radius = 3;
        for (let ny = -radius; ny <= radius; ny++) {
          for (let nx = -radius; nx <= radius; nx++) {
            const tx = cx + nx;
            const ty = cy + ny;
            const idx = tx + ty * GRID_W;

            const dDist = Math.sqrt(nx * nx + ny * ny);
            const force = Math.max(0, 1 - dDist / radius);

            u[idx] += (dx / dt) * force * 0.95;
            v[idx] += (-dy / dt) * force * 0.95;

            dSage[idx] = Math.max(0, dSage[idx] - force * 1.6);
            dPurple[idx] = Math.max(0, dPurple[idx] - force * 1.6);
          }
        }
      }

      lastMouseX = mx;
      lastMouseY = my;
      lastTime = now;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleMouseMove, { passive: true });

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    let time = 0;
    const tick = () => {
      time += 0.015;

      // 1. Viscous diffusion loop
      const nextU = new Float32Array(totalCells);
      const nextV = new Float32Array(totalCells);
      const drag = 0.95;

      for (let cy = 1; cy < GRID_H - 1; cy++) {
        for (let cx = 1; cx < GRID_W - 1; cx++) {
          const idx = cx + cy * GRID_W;
          const uForce = Math.sin(time * 0.4) * 0.003;
          const vForce = Math.cos(time * 0.5 + cx * 0.2) * 0.003;

          const uAvg = (u[idx] * 4 + u[idx - 1] + u[idx + 1] + u[idx - GRID_W] + u[idx + GRID_W]) / 8 + uForce;
          const vAvg = (v[idx] * 4 + v[idx - 1] + v[idx + 1] + v[idx - GRID_W] + v[idx + GRID_W]) / 8 + vForce;

          nextU[idx] = uAvg * drag;
          nextV[idx] = vAvg * drag;
        }
      }
      u = nextU;
      v = nextV;

      // 2. Advection solver
      dSagePrev.set(dSage);
      advect(dSage, dSagePrev, u, v, 0.08);

      dPurplePrev.set(dPurple);
      advect(dPurple, dPurplePrev, u, v, 0.08);

      clearBoundaries(dSage);
      clearBoundaries(dPurple);

      // 3. Bleed densities back and write texture buffer
      const bleedRate = 0.012;
      for (let i = 0; i < totalCells; i++) {
        dSage[i] += (dSageInit[i] - dSage[i]) * bleedRate;
        dPurple[i] += (dPurpleInit[i] - dPurple[i]) * bleedRate;

        const s = Math.min(255, Math.max(0, Math.floor(dSage[i] * 255)));
        const p = Math.min(255, Math.max(0, Math.floor(dPurple[i] * 255)));

        const texIdx = i * 4;
        textureBuffer[texIdx] = s;
        textureBuffer[texIdx + 1] = p;
        textureBuffer[texIdx + 2] = 0;
        textureBuffer[texIdx + 3] = 255;
      }

      // Zero-out borders on texture
      for (let cx = 0; cx < GRID_W; cx++) {
        const idxBottom = cx * 4;
        const idxTop = (cx + (GRID_H - 1) * GRID_W) * 4;
        textureBuffer[idxBottom] = 0;
        textureBuffer[idxBottom + 1] = 0;
        textureBuffer[idxTop] = 0;
        textureBuffer[idxTop + 1] = 0;
      }
      for (let cy = 0; cy < GRID_H; cy++) {
        const idxLeft = (cy * GRID_W) * 4;
        const idxRight = ((GRID_W - 1) + cy * GRID_W) * 4;
        textureBuffer[idxLeft] = 0;
        textureBuffer[idxLeft + 1] = 0;
        textureBuffer[idxRight] = 0;
        textureBuffer[idxRight + 1] = 0;
      }

      // Color LERP towards target theme
      const targetColors = THEME_COLORS[themeRef.current] || THEME_COLORS.light;
      const lerpSpeed = 0.05;
      for (let i = 0; i < 3; i++) {
        currentBgRef.current[i] += (targetColors.bg[i] - currentBgRef.current[i]) * lerpSpeed;
        currentColorARef.current[i] += (targetColors.colorA[i] - currentColorARef.current[i]) * lerpSpeed;
        currentColorBRef.current[i] += (targetColors.colorB[i] - currentColorBRef.current[i]) * lerpSpeed;
      }

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, GRID_W, GRID_H, 0, gl.RGBA, gl.UNSIGNED_BYTE, textureBuffer);

      gl.useProgram(program);
      gl.uniform1f(uTimeLoc, time);
      
      // CRITICAL viewport alignment correction:
      // Ensure WebGL always draws to the drawing buffer's dimensions, avoiding corner scaling locks.
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uResLoc, canvas.width, canvas.height);
      
      gl.uniform3fv(uBgColorLoc, currentBgRef.current);
      gl.uniform3fv(uColorALoc, currentColorARef.current);
      gl.uniform3fv(uColorBLoc, currentColorBRef.current);

      gl.clearColor(currentBgRef.current[0], currentBgRef.current[1], currentBgRef.current[2], 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      gl.deleteTexture(texture);
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        display: "block",
        opacity: opacity,
        transform: "scale(1.15)",
        transformOrigin: "center center",
        transition: "opacity 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
      }}
    />
  );
}
