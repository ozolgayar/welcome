(function () {
  var root = document.getElementById("screen-buddy");
  var avatar = root.querySelector(".welcome__avatar");
  var hint = root.querySelector(".welcome__hint");
  var hello = root.querySelector(".welcome__hello");
  var chat = document.getElementById("buddy-chat");
  var backdrop = root.querySelector(".welcome__backdrop");
  var closeChat = root.querySelector(".welcome__close");
  var log = root.querySelector(".welcome__log");
  var prompts = root.querySelector(".welcome__prompts");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var sheetQuery = window.matchMedia("(max-width: 1023px), (orientation: landscape) and (max-height: 500px)");
  var greeted = false;
  var typed = false;
  var open = false;
  var dragY = null;

  var replies = {
    about: "Это знакомство с ГЕРОФАРМ. Я покажу, кто мы, чем живёт компания и как устроена команда, в которую ты только что вошёл. Экраны короткие — можно идти в своём темпе.",
    finish: "Курс завершён, когда ты дойдёшь до последнего экрана. Останавливаться можно в любой момент: я остаюсь рядом, если захочешь спросить ещё."
  };

  var story = "Меня зовут Поджик, я — маскот ГЕРОФАРМ. Да-да, я похож на поджелудочную железу — именно она вырабатывает инсулин и помогает миллионам людей. Теперь ты — часть нашей команды, и я приглашаю тебя в увлекательное путешествие по ГЕРОФАРМ!";

  function addMessage(kind, node) {
    var item = document.createElement("article");
    item.className = "buddy__msg buddy__msg--" + kind;
    item.appendChild(node);
    log.appendChild(item);
    log.scrollTop = log.scrollHeight;
  }

  function showTyping() {
    var box = document.createElement("div");
    box.className = "welcome__typing";
    box.setAttribute("aria-hidden", "true");
    box.innerHTML = "<span></span><span></span><span></span>";
    addMessage("bot", box);
    return box;
  }

  function showStory() {
    if (typed) {
      return;
    }
    typed = true;
    var paragraph = document.createElement("p");
    paragraph.appendChild(document.createTextNode(story));
    var hover = document.createElement("span");
    hover.className = "buddy__msg-hint buddy__msg-hint--hover";
    hover.textContent = "Крути колесико мыши, чтобы двигаться далее";
    var touch = document.createElement("span");
    touch.className = "buddy__msg-hint buddy__msg-hint--touch";
    touch.textContent = "Свайпни вверх, чтобы двигаться далее";
    paragraph.appendChild(hover);
    paragraph.appendChild(touch);
    var item = document.createElement("article");
    item.className = "buddy__msg buddy__msg--bot";
    item.appendChild(paragraph);
    var dots = log.querySelector(".welcome__typing");
    if (dots) {
      dots.closest(".buddy__msg").replaceWith(item);
    } else {
      log.appendChild(item);
    }
    log.scrollTop = log.scrollHeight;
  }

  function setOpen(next) {
    if (next === open) {
      return;
    }
    open = next;
    root.classList.add("is-read");
    avatar.setAttribute("aria-expanded", next ? "true" : "false");
    chat.setAttribute("aria-modal", next && sheetQuery.matches ? "true" : "false");
    document.documentElement.classList.toggle("is-chat-lock", next);
    hello.hidden = true;
    if (next) {
      hint.hidden = false;
      backdrop.hidden = !sheetQuery.matches;
      chat.hidden = false;
      chat.getBoundingClientRect();
      root.classList.add("is-chat");
      closeChat.focus({ preventScroll: true });
      if (!typed) {
        showTyping();
        window.setTimeout(showStory, reduceMotion ? 0 : 700);
      }
      return;
    }
    root.classList.remove("is-chat");
    window.setTimeout(function () {
      if (!open) {
        chat.hidden = true;
        backdrop.hidden = true;
      }
    }, reduceMotion ? 0 : 320);
    avatar.focus({ preventScroll: true });
  }

  window.setTimeout(function () {
    if (open || greeted) {
      return;
    }
    greeted = true;
    hello.hidden = false;
  }, reduceMotion ? 0 : 1500);

  avatar.addEventListener("click", function () {
    setOpen(true);
  });

  closeChat.addEventListener("click", function () {
    setOpen(false);
  });

  backdrop.addEventListener("click", function () {
    setOpen(false);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && open) {
      setOpen(false);
    }
  });

  prompts.addEventListener("click", function (event) {
    var button = event.target.closest(".buddy__prompt");
    if (!button || button.disabled) {
      return;
    }
    var kind = button.getAttribute("data-reply");
    var user = document.createElement("p");
    user.textContent = button.textContent;
    addMessage("user", user);
    var bot = document.createElement("p");
    bot.textContent = replies[kind];
    addMessage("bot", bot);
    button.disabled = true;
  });

  chat.addEventListener("touchstart", function (event) {
    if (!sheetQuery.matches || !event.target.closest(".welcome__handle, .welcome__chat-head")) {
      dragY = null;
      return;
    }
    dragY = event.touches[0].clientY;
  }, { passive: true });

  chat.addEventListener("touchend", function (event) {
    if (dragY === null) {
      return;
    }
    var delta = event.changedTouches[0].clientY - dragY;
    dragY = null;
    if (delta > 70) {
      setOpen(false);
    }
  }, { passive: true });
})();
