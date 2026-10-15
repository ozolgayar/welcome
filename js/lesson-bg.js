(function () {
  var CONFIG = {
    ZOOM: 0.94,
    WAVE_AMP: 1.0,
    WAVE_SPD: 1.0,
    GAMMA: 1.3,
    SAT: 0.95,
    VIGNETTE: 0.35,
    DEEP: [0.055, 0.031, 0.22]
  };

  var lesson = document.getElementById("screen-module");
  var canvas = lesson && lesson.querySelector(".bg-canvas");
  if (!lesson || !canvas) {
    return;
  }

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "high-performance"
  });
  if (!gl) {
    return;
  }

  var vertSrc = [
    "attribute vec2 aPos;",
    "varying vec2 vUv;",
    "void main() {",
    "  vUv = aPos * 0.5 + 0.5;",
    "  gl_Position = vec4(aPos, 0.0, 1.0);",
    "}"
  ].join("\n");

  var fragSrc = [
    "precision highp float;",
    "uniform sampler2D uTex;",
    "uniform vec2 uRes, uTexRes, uMouse;",
    "uniform float uTime, uMouseStrength;",
    "uniform float uZoom, uWaveAmp, uWaveSpd, uGamma, uSat, uVignette;",
    "uniform vec3 uDeep;",
    "varying vec2 vUv;",
    "",
    "vec3 rgb2hsv(vec3 c){",
    "  vec4 K = vec4(0.0, -1.0/3.0, 2.0/3.0, -1.0);",
    "  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));",
    "  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));",
    "  float d = q.x - min(q.w, q.y);",
    "  float e = 1.0e-10;",
    "  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);",
    "}",
    "vec3 hsv2rgb(vec3 c){",
    "  vec3 p = abs(fract(c.xxx + vec3(0.0, 2.0/3.0, 1.0/3.0)) * 6.0 - 3.0);",
    "  return c.z * mix(vec3(1.0), clamp(p - 1.0, 0.0, 1.0), c.y);",
    "}",
    "",
    "float remapHue(float h){",
    "  if (h <  50.0) return mix(300.0, 290.0,  h          / 50.0);",
    "  if (h < 120.0) return mix(290.0, 235.0, (h -  50.0) / 70.0);",
    "  if (h < 190.0) return mix(235.0, 228.0, (h - 120.0) / 70.0);",
    "  if (h < 225.0) return mix(228.0, 250.0, (h - 190.0) / 35.0);",
    "  if (h < 270.0) return mix(250.0, 282.0, (h - 225.0) / 45.0);",
    "  if (h < 330.0) return mix(282.0, 300.0, (h - 270.0) / 60.0);",
    "  return 300.0;",
    "}",
    "",
    "vec2 coverUv(vec2 uv){",
    "  float rs = uRes.x / uRes.y;",
    "  float ri = uTexRes.x / uTexRes.y;",
    "  vec2 s = rs > ri ? vec2(1.0, ri / rs) : vec2(rs / ri, 1.0);",
    "  return (uv - 0.5) * s * uZoom + 0.5;",
    "}",
    "",
    "void main(){",
    "  vec2 uv = coverUv(vUv);",
    "  float t = uTime * uWaveSpd;",
    "",
    "  vec2 d;",
    "  d.x = sin(uv.y * 5.0 + t * 0.35) * 0.0060",
    "      + sin(uv.y * 11.0 - t * 0.22) * 0.0020;",
    "  d.y = sin(uv.x * 4.0 + t * 0.30) * 0.0080",
    "      + sin(uv.x * 9.0 + uv.y * 3.0 + t * 0.18) * 0.0030;",
    "  d *= uWaveAmp;",
    "",
    "  vec2 aspect = vec2(uRes.x / uRes.y, 1.0);",
    "  vec2 diff = (vUv - uMouse) * aspect;",
    "  float dist = length(diff);",
    "  float fall = exp(-dist * dist * 10.0) * uMouseStrength;",
    "  vec2 dir = diff / (dist + 1e-4);",
    "  d += dir / aspect * fall * 0.010;",
    "  d += dir / aspect * sin(dist * 28.0 - uTime * 2.5) * fall * 0.0035;",
    "",
    "  vec3 col = texture2D(uTex, uv + d).rgb;",
    "",
    "  vec3 hsv = rgb2hsv(col);",
    "  hsv.x = remapHue(hsv.x * 360.0) / 360.0;",
    "  hsv.y *= uSat;",
    "  hsv.z = pow(hsv.z, uGamma);",
    "  col = hsv2rgb(hsv);",
    "",
    "  float v = smoothstep(0.35, 1.05, length((vUv - 0.5) * vec2(1.2, 1.0)) * 1.4);",
    "  col = mix(col, uDeep, v * uVignette);",
    "",
    "  gl_FragColor = vec4(col, 1.0);",
    "}"
  ].join("\n");

  function compile(type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  var vert = compile(gl.VERTEX_SHADER, vertSrc);
  var frag = compile(gl.FRAGMENT_SHADER, fragSrc);
  if (!vert || !frag) {
    return;
  }
  var program = gl.createProgram();
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    return;
  }
  gl.useProgram(program);

  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1, 1, -1, -1, 1,
    -1, 1, 1, -1, 1, 1
  ]), gl.STATIC_DRAW);
  var aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  var loc = {
    tex: gl.getUniformLocation(program, "uTex"),
    res: gl.getUniformLocation(program, "uRes"),
    texRes: gl.getUniformLocation(program, "uTexRes"),
    time: gl.getUniformLocation(program, "uTime"),
    mouse: gl.getUniformLocation(program, "uMouse"),
    strength: gl.getUniformLocation(program, "uMouseStrength"),
    zoom: gl.getUniformLocation(program, "uZoom"),
    waveAmp: gl.getUniformLocation(program, "uWaveAmp"),
    waveSpd: gl.getUniformLocation(program, "uWaveSpd"),
    gamma: gl.getUniformLocation(program, "uGamma"),
    sat: gl.getUniformLocation(program, "uSat"),
    vignette: gl.getUniformLocation(program, "uVignette"),
    deep: gl.getUniformLocation(program, "uDeep")
  };

  function clampTexture() {
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  }

  var tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  clampTexture();
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([14, 8, 56, 255]));

  var texW = 1;
  var texH = 1;
  var ready = false;
  var onScreen = false;
  var running = false;
  var mouseX = 0.5;
  var mouseY = 0.5;
  var targetX = 0.5;
  var targetY = 0.5;
  var lastTargetX = 0.5;
  var lastTargetY = 0.5;
  var strength = 0;
  var touching = false;
  var lastNow = 0;

  function resize() {
    var width = lesson.clientWidth || window.innerWidth;
    var height = lesson.clientHeight || window.innerHeight;
    if (!width || !height) {
      return;
    }
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var nextW = Math.round(width * dpr);
    var nextH = Math.round(height * dpr);
    if (canvas.width !== nextW || canvas.height !== nextH) {
      canvas.width = nextW;
      canvas.height = nextH;
    }
  }

  function draw(now) {
    if (!canvas.width || !canvas.height) {
      resize();
    }
    if (!canvas.width || !canvas.height) {
      return;
    }
    var dt = lastNow ? Math.min(0.05, (now - lastNow) / 1000) : 0.016;
    lastNow = now;
    if (!reduce) {
      var moved = Math.hypot(targetX - lastTargetX, targetY - lastTargetY) > 0.0004;
      lastTargetX = targetX;
      lastTargetY = targetY;
      mouseX += (targetX - mouseX) * 0.06;
      mouseY += (targetY - mouseY) * 0.06;
      if (moved || touching) {
        strength += (1 - strength) * 0.18;
      } else {
        strength *= Math.exp(-dt / 0.5);
        if (strength < 0.001) {
          strength = 0;
        }
      }
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(program);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.uniform1i(loc.tex, 0);
    gl.uniform2f(loc.res, canvas.width, canvas.height);
    gl.uniform2f(loc.texRes, texW, texH);
    gl.uniform1f(loc.time, reduce ? 0 : now * 0.001);
    gl.uniform2f(loc.mouse, mouseX, mouseY);
    gl.uniform1f(loc.strength, reduce ? 0 : strength);
    gl.uniform1f(loc.zoom, CONFIG.ZOOM);
    gl.uniform1f(loc.waveAmp, CONFIG.WAVE_AMP);
    gl.uniform1f(loc.waveSpd, CONFIG.WAVE_SPD);
    gl.uniform1f(loc.gamma, CONFIG.GAMMA);
    gl.uniform1f(loc.sat, CONFIG.SAT);
    gl.uniform1f(loc.vignette, CONFIG.VIGNETTE);
    gl.uniform3f(loc.deep, CONFIG.DEEP[0], CONFIG.DEEP[1], CONFIG.DEEP[2]);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    if (!canvas.classList.contains("is-ready")) {
      canvas.classList.add("is-ready");
    }
  }

  function frame(now) {
    if (!running) {
      return;
    }
    if (document.hidden || !onScreen) {
      running = false;
      return;
    }
    draw(now);
    if (reduce) {
      running = false;
      return;
    }
    window.requestAnimationFrame(frame);
  }

  function start() {
    if (!ready || running || document.hidden || !onScreen) {
      return;
    }
    running = true;
    window.requestAnimationFrame(frame);
  }

  function setVisible(visible) {
    onScreen = visible && !lesson.hidden;
    if (onScreen) {
      resize();
      start();
    }
  }

  var resizeTimer = 0;
  if (typeof ResizeObserver === "function") {
    var observer = new ResizeObserver(function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        resize();
        if (reduce && ready && onScreen) {
          draw(performance.now());
        }
      }, 80);
    });
    observer.observe(lesson);
  } else {
    window.addEventListener("resize", function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 80);
    });
  }

  if (typeof IntersectionObserver === "function") {
    var io = new IntersectionObserver(function (entries) {
      setVisible(entries[0].isIntersecting);
    }, { threshold: 0.01 });
    io.observe(lesson);
  }

  var attrObserver = new MutationObserver(function () {
    setVisible(!lesson.hidden);
  });
  attrObserver.observe(lesson, { attributes: true, attributeFilter: ["hidden"] });

  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) {
      start();
    }
  });

  function setTarget(clientX, clientY) {
    var box = lesson.getBoundingClientRect();
    if (!box.width || !box.height) {
      return;
    }
    targetX = (clientX - box.left) / box.width;
    targetY = 1 - (clientY - box.top) / box.height;
  }

  if (!reduce) {
    lesson.addEventListener("pointermove", function (event) {
      setTarget(event.clientX, event.clientY);
    });
    lesson.addEventListener("touchmove", function (event) {
      var touch = event.touches[0];
      if (!touch) {
        return;
      }
      touching = true;
      setTarget(touch.clientX, touch.clientY);
    }, { passive: true });
    lesson.addEventListener("touchend", function () {
      touching = false;
    });
    lesson.addEventListener("touchcancel", function () {
      touching = false;
    });
  }

  var image = new Image();
  image.decoding = "async";
  image.onload = function () {
    texW = image.naturalWidth;
    texH = image.naturalHeight;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    clampTexture();
    ready = true;
    setVisible(!lesson.hidden);
  };
  image.src = "img/bg-source.png";
})();
