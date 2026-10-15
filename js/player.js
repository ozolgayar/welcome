(function () {
  var root = document.getElementById("screen-film");
  var video = root.querySelector(".player__video");
  var gate = document.querySelector(".player__gate");
  var scrim = document.getElementById("film-scrim");
  var bar = document.querySelector(".player__bar");
  var watch = document.querySelector(".player__card-go");
  var play = document.querySelector(".player__btn--play");
  var sound = document.querySelector(".player__btn--sound");
  var range = document.querySelector(".player__range");
  var lastVolume = 1;

  function syncPlay() {
    var on = !video.paused && !video.ended;
    root.classList.toggle("is-playing", on);
    bar.classList.toggle("is-playing", on);
    play.setAttribute("aria-label", on ? "Пауза" : "Воспроизвести");
  }

  function syncSound() {
    var off = video.muted || video.volume === 0;
    root.classList.toggle("is-muted", off);
    bar.classList.toggle("is-muted", off);
    sound.setAttribute("aria-label", off ? "Включить звук" : "Выключить звук");
    range.value = String(off ? 0 : video.volume);
  }

  watch.addEventListener("click", function () {
    gate.hidden = true;
    scrim.hidden = true;
    if (video.ended) {
      video.currentTime = 0;
    }
    video.play();
    play.focus({ preventScroll: true });
  });

  play.addEventListener("click", function () {
    if (video.paused || video.ended) {
      if (video.ended) {
        video.currentTime = 0;
      }
      video.play();
      return;
    }
    video.pause();
  });

  video.addEventListener("click", function () {
    play.click();
  });

  video.addEventListener("play", syncPlay);
  video.addEventListener("pause", syncPlay);
  video.addEventListener("ended", syncPlay);

  sound.addEventListener("click", function () {
    if (video.muted || video.volume === 0) {
      video.muted = false;
      video.volume = lastVolume || 1;
    } else {
      lastVolume = video.volume;
      video.muted = true;
    }
    syncSound();
  });

  range.addEventListener("input", function () {
    var level = Number(range.value);
    video.volume = level;
    video.muted = level === 0;
    if (level > 0) {
      lastVolume = level;
    }
    syncSound();
  });
})();
