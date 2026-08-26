(function () {
  function startLoadingScreen() {
    var screen = document.querySelector(".startup-screen");

    if (!screen) {
      return;
    }

    screen.addEventListener("animationend", function (event) {
      if (event.animationName === "startup-exit") {
        screen.classList.add("is-hidden");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startLoadingScreen);
  } else {
    startLoadingScreen();
  }
})();