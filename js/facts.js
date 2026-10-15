(function () {
  var root = document.getElementById("screen-facts");
  if (!root) {
    return;
  }
  var card = root.querySelector(".facts__card");
  var title = card.querySelector(".facts__card-title");
  var copy = card.querySelector(".facts__card-copy");
  var nodes = root.querySelectorAll(".facts__node");
  var current = "";
  var stories = {
    "1": {
      title: "1 место на рынке инсулинов в России*",
      html: "<p>*По доле в денежном и натуральном выражении (МЕ) в сегментах присутствия.</p><p class=\"facts__source\">Источник: IQVIA, бюджетный рынок за 2023&nbsp;г.</p>"
    },
    "3": {
      title: "Площадки мирового уровня:",
      html: "<ul><li>R&amp;D</li><li>Завод в Пушкине</li><li>Завод в Оболенске</li></ul>",
      align: "left"
    },
    "5": {
      title: "Нозологий:",
      html: "<ul><li>Эндокринология</li><li>Неврология</li><li>Офтальмология</li><li>Гинекология</li><li>Урология</li></ul>",
      align: "left"
    },
    "25": {
      title: "Препаратов в портфеле",
      html: ""
    },
    "1600": {
      title: "Специалистов высокого уровня",
      html: ""
    },
    "14": {
      title: "Стран экспорта",
      html: ""
    }
  };

  function clearOf(x, y, width, height, nodeBox) {
    var gap = 18;
    var left = x - width / 2;
    var top = y - height / 2;
    var right = x + width / 2;
    var bottom = y + height / 2;
    return right < nodeBox.left - gap || left > nodeBox.right + gap || bottom < nodeBox.top - gap || top > nodeBox.bottom + gap;
  }

  function outsideRing(x, y, width, height, cx, cy, orbit) {
    var left = x - width / 2;
    var top = y - height / 2;
    var closestX = Math.max(left, Math.min(cx, left + width));
    var closestY = Math.max(top, Math.min(cy, top + height));
    return Math.hypot(closestX - cx, closestY - cy) >= orbit + 14;
  }

  function placeCard(nx, ny, width, height, nodeBox) {
    var padX = 16;
    var padTop = 16;
    var padBottom = 16 + 75;
    var minX = padX + width / 2;
    var maxX = window.innerWidth - padX - width / 2;
    var minY = padTop + height / 2;
    var maxY = window.innerHeight - padBottom - height / 2;
    var cx = window.innerWidth / 2;
    var cy = window.innerHeight / 2;
    var orbit = Math.hypot(nx - cx, ny - cy);
    var best = null;
    var bestDist = Infinity;
    var x;
    var y;
    for (x = minX; x <= maxX; x += 20) {
      for (y = minY; y <= maxY; y += 20) {
        if (!clearOf(x, y, width, height, nodeBox)) {
          continue;
        }
        if (!outsideRing(x, y, width, height, cx, cy, orbit)) {
          continue;
        }
        var buttons = root.querySelectorAll(".facts__node");
        var blocked = false;
        var b;
        for (b = 0; b < buttons.length; b++) {
          if (!clearOf(x, y, width, height, buttons[b].getBoundingClientRect())) {
            blocked = true;
            break;
          }
        }
        if (blocked) {
          continue;
        }
        var dist = Math.hypot(x - nx, y - ny);
        if (dist < bestDist) {
          bestDist = dist;
          best = { x: x, y: y };
        }
      }
    }
    if (best) {
      return best;
    }
    return { x: nx < cx ? minX : maxX, y: ny < cy ? minY : maxY };
  }

  function closeCard() {
    current = "";
    card.classList.remove("is-shown");
    root.classList.remove("is-open");
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].classList.remove("is-on");
      nodes[i].setAttribute("aria-expanded", "false");
    }
    window.setTimeout(function () {
      if (!card.classList.contains("is-shown")) {
        card.hidden = true;
      }
    }, 420);
  }

  function openCard(node) {
    var id = node.getAttribute("data-fact");
    var story = stories[id];
    if (!story) {
      return;
    }
    if (current === id) {
      closeCard();
      return;
    }
    var first = current === "";
    current = id;
    title.textContent = story.title;
    copy.innerHTML = story.html;
    copy.hidden = story.html === "";
    card.classList.toggle("facts__card--left", story.align === "left");
    for (var i = 0; i < nodes.length; i++) {
      var on = nodes[i] === node;
      nodes[i].classList.toggle("is-on", on);
      nodes[i].setAttribute("aria-expanded", on ? "true" : "false");
    }
    var box = node.getBoundingClientRect();
    var nx = box.left + box.width / 2;
    var ny = box.top + box.height / 2;
    card.hidden = false;
    if (first) {
      card.style.transition = "none";
      card.style.left = nx + "px";
      card.style.top = ny + "px";
      card.classList.remove("is-shown");
      card.offsetWidth;
      card.style.transition = "";
    }
    var width = card.offsetWidth;
    var height = card.offsetHeight;
    var spot = placeCard(nx, ny, width, height, box);
    card.style.left = spot.x + "px";
    card.style.top = spot.y + "px";
    window.requestAnimationFrame(function () {
      card.classList.add("is-shown");
      root.classList.add("is-open");
    });
  }

  for (var n = 0; n < nodes.length; n++) {
    nodes[n].setAttribute("aria-expanded", "false");
    nodes[n].addEventListener("click", function (event) {
      event.stopPropagation();
      openCard(event.currentTarget);
    });
  }

  root.addEventListener("click", function (event) {
    if (event.target.closest(".facts__node, .facts__card")) {
      return;
    }
    closeCard();
  });
})();
