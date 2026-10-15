(function () {
  var reel = document.getElementById("reel");
  var buddy = document.getElementById("screen-buddy");
  var next = document.getElementById("screen-next");
  var lesson = document.getElementById("screen-module");
  var film = document.getElementById("screen-film");
  var after = document.getElementById("screen-after");
  var facts = document.getElementById("screen-facts");
  var steps = document.getElementById("module-steps");
  var stepItems = steps.querySelectorAll(".steps__item");
  var start = document.getElementById("cover-start");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var flights = [
    { coin: ".doodle--heart", slot: ".buddy__slot--heart", spin: 360 },
    { coin: ".doodle--hand", slot: ".buddy__slot--hand", spin: -360 },
    { coin: ".doodle--brain", slot: ".buddy__slot--brain", spin: 360 },
    { coin: ".glass--down-left", slot: ".buddy__glass-slot--down-left", spin: 0, flat: true },
    { coin: ".glass--up-right", slot: ".buddy__glass-slot--up-right", spin: 0, flat: true, flip: true },
    { coin: ".glass--down-right", slot: ".buddy__glass-slot--down-right", spin: 0, flat: true }
  ];
  var moving = false;
  var settled = false;
  var lockedUntil = 0;
  var placeKey = "geropharm-place";
  var gate = document.querySelector(".player__gate");
  var scrim = document.getElementById("film-scrim");
  var filmBar = document.querySelector(".player__bar");

  function remember(place) {
    try {
      sessionStorage.setItem(placeKey, place);
    } catch (error) {
      return;
    }
  }

  function savedPlace() {
    try {
      return sessionStorage.getItem(placeKey) || "";
    } catch (error) {
      return "";
    }
  }

  function showGate() {
    gate.hidden = false;
    scrim.hidden = false;
    filmBar.hidden = false;
    film.querySelector(".player__video").pause();
  }

  function hideFilmChrome() {
    gate.hidden = true;
    scrim.hidden = true;
    filmBar.hidden = true;
  }

  function showProgress(index) {
    steps.hidden = false;
    for (var i = 0; i < stepItems.length; i++) {
      stepItems[i].classList.toggle("is-done", i < index);
      stepItems[i].classList.toggle("is-current", i === index);
    }
  }

  function hideProgress() {
    steps.hidden = true;
  }
  var homes = [];
  for (var h = 0; h < flights.length; h++) {
    var homeCoin = document.querySelector(flights[h].coin);
    homes.push({
      el: homeCoin,
      parent: homeCoin.parentNode,
      spin: flights[h].spin,
      flat: flights[h].flat,
      flip: flights[h].flip
    });
  }

  function settleCoins() {
    if (settled) {
      return;
    }
    settled = true;
    moving = false;
    for (var i = 0; i < flights.length; i++) {
      var coin = document.querySelector(flights[i].coin);
      var slot = document.querySelector(flights[i].slot);
      coin.classList.remove("is-flying");
      coin.removeAttribute("style");
      slot.appendChild(coin);
    }
    window.dispatchEvent(new Event("resize"));
  }

  function pinCoin(coin, box, flat, zIndex, flip) {
    coin.classList.add("is-flying");
    coin.style.transition = "none";
    coin.style.position = "fixed";
    coin.style.margin = "0";
    coin.style.zIndex = zIndex || (flat ? "1" : "40");
    coin.style.left = box.left + "px";
    coin.style.top = box.top + "px";
    coin.style.width = box.width + "px";
    coin.style.height = box.height + "px";
    if (flip) {
      coin.style.transform = "scaleX(1) rotate(-8deg)";
    } else {
      coin.style.transform = flat ? "rotate(-8deg)" : "rotateY(0deg) rotateX(14deg)";
    }
    document.body.appendChild(coin);
  }

  function goDown() {
    if (moving || settled) {
      return;
    }
    remember("buddy");
    if (reduceMotion) {
      reel.classList.add("is-next");
      settleCoins();
      return;
    }
    moving = true;
    var coins = [];
    for (var i = 0; i < flights.length; i++) {
      var coin = document.querySelector(flights[i].coin);
      var from = coin.getBoundingClientRect();
      if (from.width < 2) {
        continue;
      }
      coins.push({
        el: coin,
        slot: document.querySelector(flights[i].slot),
        spin: flights[i].spin,
        flat: flights[i].flat,
        flip: flights[i].flip,
        z: flights[i].z,
        from: from
      });
    }
    var shift = reel.getBoundingClientRect().height / 2;
    for (var n = 0; n < coins.length; n++) {
      var slotBox = coins[n].slot.getBoundingClientRect();
      coins[n].to = {
        left: slotBox.left,
        top: slotBox.top - shift,
        width: slotBox.width,
        height: slotBox.height
      };
      pinCoin(coins[n].el, coins[n].from, coins[n].flat, coins[n].z, coins[n].flip);
    }
    window.requestAnimationFrame(function () {
      for (var k = 0; k < coins.length; k++) {
        coins[k].el.style.transition = "";
      }
      window.requestAnimationFrame(function () {
        reel.classList.add("is-next");
        for (var j = 0; j < coins.length; j++) {
          coins[j].el.style.left = coins[j].to.left + "px";
          coins[j].el.style.top = coins[j].to.top + "px";
          coins[j].el.style.width = coins[j].to.width + "px";
          coins[j].el.style.height = coins[j].to.height + "px";
          if (coins[j].flip) {
            coins[j].el.style.transform = "scaleX(-1) rotate(0deg)";
          } else {
            coins[j].el.style.transform = coins[j].flat ? "rotate(0deg)" : "rotateY(" + coins[j].spin + "deg) rotateX(0deg)";
          }
        }
      });
    });
    function finish(event) {
      if (event && (event.target !== reel || event.propertyName !== "transform")) {
        return;
      }
      reel.removeEventListener("transitionend", finish);
      settleCoins();
    }
    reel.addEventListener("transitionend", finish);
    window.setTimeout(function () {
      finish();
    }, 1700);
  }

  function showNext() {
    reel.hidden = true;
    next.hidden = false;
    remember("toc");
  }

  function showBuddy() {
    next.hidden = true;
    reel.hidden = false;
    remember("buddy");
  }

  function restoreHomes() {
    for (var i = 0; i < homes.length; i++) {
      homes[i].el.classList.remove("is-flying");
      homes[i].el.removeAttribute("style");
      homes[i].parent.appendChild(homes[i].el);
    }
    settled = false;
    moving = false;
    window.dispatchEvent(new Event("resize"));
  }

  function goUp() {
    if (moving || !settled) {
      return;
    }
    remember("cover");
    for (var i = 0; i < homes.length; i++) {
      homes[i].el.classList.remove("is-flying");
      homes[i].el.removeAttribute("style");
      homes[i].parent.appendChild(homes[i].el);
    }
    settled = false;
    if (reduceMotion) {
      reel.classList.remove("is-next");
      moving = false;
      window.dispatchEvent(new Event("resize"));
      return;
    }
    moving = true;
    reel.classList.remove("is-next");
    function finish(event) {
      if (event && (event.target !== reel || event.propertyName !== "transform")) {
        return;
      }
      reel.removeEventListener("transitionend", finish);
      moving = false;
      window.dispatchEvent(new Event("resize"));
    }
    reel.addEventListener("transitionend", finish);
    window.setTimeout(function () {
      finish();
    }, 1700);
  }

  function openLesson() {
    lesson.classList.remove("is-enter");
    next.hidden = true;
    lesson.hidden = false;
    remember("lesson");
    window.requestAnimationFrame(function () {
      lesson.classList.add("is-enter");
    });
  }

  function openFilm() {
    film.classList.remove("is-enter");
    lesson.hidden = true;
    film.hidden = false;
    showGate();
    showProgress(0);
    remember("film");
    window.requestAnimationFrame(function () {
      film.classList.add("is-enter");
    });
  }

  function closeFilm() {
    film.querySelector(".player__video").pause();
    film.hidden = true;
    film.classList.remove("is-enter");
    hideFilmChrome();
    lesson.hidden = false;
    hideProgress();
    remember("lesson");
  }

  function openSheet() {
    film.querySelector(".player__video").pause();
    after.hidden = false;
    after.classList.remove("is-in", "is-settled");
    showProgress(0);
    hideFilmChrome();
    remember("after");
    if (reduceMotion) {
      after.classList.add("is-in", "is-settled");
      return;
    }
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        after.classList.add("is-in");
      });
    });
  }

  function closeSheet() {
    if (reduceMotion) {
      after.hidden = true;
      after.classList.remove("is-in", "is-settled");
      showProgress(0);
      filmBar.hidden = false;
      remember("film");
      return;
    }
    after.classList.remove("is-in", "is-settled");
    function done(event) {
      if (event && (event.target !== after || event.propertyName !== "transform")) {
        return;
      }
      after.removeEventListener("transitionend", done);
      after.hidden = true;
    }
    after.addEventListener("transitionend", done);
    window.setTimeout(done, 1200);
    showProgress(0);
    filmBar.hidden = false;
    remember("film");
  }

  function glassBox() {
    var card = after.querySelector(".sheet__card");
    var box = card.getBoundingClientRect();
    facts.style.setProperty("--gx", box.left + "px");
    facts.style.setProperty("--gy", box.top + "px");
    facts.style.setProperty("--gw", box.width + "px");
    facts.style.setProperty("--gh", box.height + "px");
  }

  function openFacts() {
    facts.querySelector(".facts__card").hidden = true;
    facts.classList.remove("is-open");
    glassBox();
    facts.hidden = false;
    facts.classList.remove("is-in", "is-ready");
    showProgress(0);
    remember("facts");
    if (reduceMotion) {
      facts.classList.add("is-in", "is-ready");
      after.hidden = true;
      return;
    }
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        facts.classList.add("is-in");
      });
    });
    window.setTimeout(function () {
      facts.classList.add("is-ready");
      after.hidden = true;
    }, 880);
  }

  function closeFacts() {
    facts.classList.remove("is-ready", "is-open");
    facts.querySelector(".facts__card").hidden = true;
    showProgress(0);
    after.hidden = false;
    after.classList.add("is-in", "is-settled");
    glassBox();
    if (reduceMotion) {
      facts.hidden = true;
      facts.classList.remove("is-in");
      remember("after");
      return;
    }
    facts.classList.remove("is-in");
    window.setTimeout(function () {
      facts.hidden = true;
      remember("after");
    }, 880);
  }

  function step(dir) {
    if (moving || Date.now() < lockedUntil) {
      return;
    }
    if (!next.hidden) {
      if (dir < 0) {
        lockedUntil = Date.now() + 700;
        showBuddy();
      }
      return;
    }
    if (!facts.hidden) {
      if (dir < 0) {
        lockedUntil = Date.now() + 1000;
        closeFacts();
      }
      return;
    }
    if (!after.hidden) {
      if (dir < 0) {
        lockedUntil = Date.now() + 1100;
        closeSheet();
      } else {
        lockedUntil = Date.now() + 1000;
        openFacts();
      }
      return;
    }
    if (!film.hidden) {
      lockedUntil = Date.now() + 700;
      if (dir < 0) {
        closeFilm();
      } else {
        lockedUntil = Date.now() + 1100;
        openSheet();
      }
      return;
    }
    if (!lesson.hidden) {
      if (dir < 0) {
        lockedUntil = Date.now() + 700;
        lesson.hidden = true;
        lesson.classList.remove("is-enter");
        next.hidden = false;
        remember("toc");
      } else {
        lockedUntil = Date.now() + 700;
        openFilm();
      }
      return;
    }
    var onToc = !next.hidden;
    var onBuddy = !onToc && reel.classList.contains("is-next");
    if (dir > 0) {
      if (!onToc && !onBuddy) {
        lockedUntil = Date.now() + 1400;
        goDown();
      } else if (onBuddy) {
        lockedUntil = Date.now() + 700;
        showNext();
      }
      return;
    }
    if (onToc) {
      lockedUntil = Date.now() + 700;
      showBuddy();
    } else if (onBuddy) {
      lockedUntil = Date.now() + 1400;
      goUp();
    }
  }

  if (!reduceMotion) {
    var lessonAimX = 0;
    var lessonAimY = 0;
    var lessonX = 0;
    var lessonY = 0;
    lesson.addEventListener("pointermove", function (event) {
      var box = lesson.getBoundingClientRect();
      lessonAimX = (event.clientX - box.left) / box.width * 2 - 1;
      lessonAimY = (event.clientY - box.top) / box.height * 2 - 1;
    });
    lesson.addEventListener("pointerleave", function () {
      lessonAimX = 0;
      lessonAimY = 0;
    });
    (function followLesson() {
      lessonX += (lessonAimX - lessonX) * 0.08;
      lessonY += (lessonAimY - lessonY) * 0.08;
      lesson.style.setProperty("--lx", lessonX.toFixed(3));
      lesson.style.setProperty("--ly", lessonY.toFixed(3));
      window.requestAnimationFrame(followLesson);
    })();

    var aimX = 0;
    var aimY = 0;
    var flowX = 0;
    var flowY = 0;
    buddy.addEventListener("pointermove", function (event) {
      var box = buddy.getBoundingClientRect();
      aimX = (event.clientX - box.left) / box.width * 2 - 1;
      aimY = (event.clientY - box.top) / box.height * 2 - 1;
    });
    buddy.addEventListener("pointerleave", function () {
      aimX = 0;
      aimY = 0;
    });
    (function followPointer() {
      flowX += (aimX - flowX) * 0.06;
      flowY += (aimY - flowY) * 0.06;
      buddy.style.setProperty("--mx", flowX.toFixed(3));
      buddy.style.setProperty("--my", flowY.toFixed(3));
      window.requestAnimationFrame(followPointer);
    })();
  }

  var place = savedPlace();
  if (place === "buddy" || location.hash === "#buddy") {
    reel.classList.add("is-next");
    settleCoins();
  } else if (place === "toc") {
    reel.classList.add("is-next");
    settleCoins();
    reel.hidden = true;
    next.hidden = false;
  } else if (place === "lesson") {
    reel.classList.add("is-next");
    settleCoins();
    reel.hidden = true;
    next.hidden = true;
    lesson.hidden = false;
  } else if (place === "film") {
    reel.classList.add("is-next");
    settleCoins();
    reel.hidden = true;
    next.hidden = true;
    lesson.hidden = true;
    film.hidden = false;
    showGate();
    showProgress(0);
  } else if (place === "after") {
    reel.classList.add("is-next");
    settleCoins();
    reel.hidden = true;
    next.hidden = true;
    lesson.hidden = true;
    film.hidden = false;
    after.hidden = false;
    after.classList.add("is-in", "is-settled");
    showProgress(0);
  } else if (place === "facts") {
    reel.classList.add("is-next");
    settleCoins();
    reel.hidden = true;
    next.hidden = true;
    lesson.hidden = true;
    film.hidden = false;
    after.hidden = true;
    facts.hidden = false;
    facts.classList.add("is-in", "is-ready");
    showProgress(0);
  }

  start.addEventListener("click", goDown);

  document.querySelector(".toc__card--01").addEventListener("click", function (event) {
    event.preventDefault();
    openLesson();
  });

  document.querySelector(".player__next").addEventListener("click", function () {
    step(1);
  });

  window.addEventListener("wheel", function (event) {
    var node = event.target;
    if (node && node.closest && node.closest(".buddy__chat, .player__range")) {
      return;
    }
    if (Math.abs(event.deltaY) < 12) {
      return;
    }
    event.preventDefault();
    step(event.deltaY > 0 ? 1 : -1);
  }, { passive: false });

  var touchStartY = null;
  window.addEventListener("touchstart", function (event) {
    if (event.target.closest(".buddy__chat, .doodle")) {
      touchStartY = null;
      return;
    }
    touchStartY = event.touches[0].clientY;
  }, { passive: true });

  window.addEventListener("touchend", function (event) {
    if (touchStartY === null) {
      return;
    }
    var delta = touchStartY - event.changedTouches[0].clientY;
    touchStartY = null;
    if (Math.abs(delta) < 48) {
      return;
    }
    step(delta > 0 ? 1 : -1);
  }, { passive: true });

})();
