(function () {
  var header = document.querySelector("#lms-header, .platform-header, [data-lms-header]");
  if (header) {
    document.documentElement.style.setProperty("--header-offset", header.offsetHeight + "px");
  }

  var SLICE_COUNT = 28;
  var DEPTH = 0.14;
  var drag = null;
  var spinFrame = 0;

  function readAngle(body, name) {
    var value = parseFloat(body.getAttribute(name));
    return value === value ? value : 0;
  }

  function applyRotation(body) {
    body.style.transform =
      "rotateZ(" + body.rotZ.toFixed(2) + "deg) rotateY(" + body.rotY.toFixed(2) + "deg) rotateX(" + body.rotX.toFixed(2) + "deg)";
  }

  function layoutCoins() {
    var coins = document.querySelectorAll(".coin__body");
    for (var c = 0; c < coins.length; c++) {
      var body = coins[c];
      var size = body.clientWidth;
      if (!size) {
        continue;
      }
      if (body.rotX === undefined) {
        body.rotX = readAngle(body, "data-rotate-x");
        body.rotY = readAngle(body, "data-rotate-y");
        body.rotZ = readAngle(body, "data-rotate-z");
        applyRotation(body);
      }
      var slices = body.querySelectorAll(".coin__slice");
      if (slices.length === 0) {
        var face = body.querySelector(".coin__face");
        for (var i = 0; i < SLICE_COUNT; i++) {
          var slice = document.createElement("div");
          slice.className = i > SLICE_COUNT * 0.82 ? "coin__slice coin__slice--lip" : "coin__slice";
          body.insertBefore(slice, face);
        }
        slices = body.querySelectorAll(".coin__slice");
      }
      var depth = size * DEPTH;
      for (var s = 0; s < slices.length; s++) {
        var z = (depth * s) / (slices.length - 1);
        slices[s].style.transform = "translateZ(" + z.toFixed(2) + "px)";
      }
      var front = body.querySelector(".coin__face");
      if (front) {
        front.style.transform = "translateZ(" + depth.toFixed(2) + "px)";
      }
    }
  }

  function stopSpin() {
    if (spinFrame) {
      cancelAnimationFrame(spinFrame);
      spinFrame = 0;
    }
  }

  function onPointerDown(event) {
    if (event.button !== undefined && event.button !== 0) {
      return;
    }
    var doodle = event.currentTarget;
    var body = doodle.querySelector(".coin__body");
    if (!body || body.rotY === undefined) {
      return;
    }
    stopSpin();
    drag = {
      doodle: doodle,
      body: body,
      pointerId: event.pointerId,
      lastX: event.clientX,
      lastY: event.clientY,
      vx: 0,
      vy: 0
    };
    doodle.classList.add("is-dragging");
    if (doodle.setPointerCapture) {
      doodle.setPointerCapture(event.pointerId);
    }
  }

  function turnBy(body, dx, dy) {
    var size = body.clientWidth || 160;
    var yaw = 240 / size;
    var pitch = 200 / size;
    body.rotY += dx * yaw;
    body.rotX -= dy * pitch;
    applyRotation(body);
    return { vx: dx * yaw, vy: -dy * pitch };
  }

  function onPointerMove(event) {
    if (!drag || event.pointerId !== drag.pointerId) {
      return;
    }
    var dx = event.clientX - drag.lastX;
    var dy = event.clientY - drag.lastY;
    if (!dx && !dy) {
      return;
    }
    drag.lastX = event.clientX;
    drag.lastY = event.clientY;
    var velocity = turnBy(drag.body, dx, dy);
    drag.vx = velocity.vx;
    drag.vy = velocity.vy;
  }

  function onPointerUp(event) {
    if (!drag || event.pointerId !== drag.pointerId) {
      return;
    }
    var body = drag.body;
    var vx = drag.vx;
    var vy = drag.vy;
    drag.doodle.classList.remove("is-dragging");
    drag = null;
    if (Math.abs(vx) < 0.2 && Math.abs(vy) < 0.2) {
      return;
    }
    function step() {
      vx *= 0.9;
      vy *= 0.9;
      if (Math.abs(vx) < 0.08 && Math.abs(vy) < 0.08) {
        spinFrame = 0;
        return;
      }
      body.rotY += vx;
      body.rotX += vy;
      applyRotation(body);
      spinFrame = requestAnimationFrame(step);
    }
    spinFrame = requestAnimationFrame(step);
  }

  var doodles = document.querySelectorAll(".doodle");
  for (var d = 0; d < doodles.length; d++) {
    doodles[d].addEventListener("pointerdown", onPointerDown);
  }
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", onPointerUp);

  layoutCoins();
  window.addEventListener("resize", layoutCoins);
})();
