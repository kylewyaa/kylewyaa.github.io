(function () {
  var savedBackground = localStorage.getItem("home-background");
  var savedNavColor = localStorage.getItem("home-nav-color");
  var savedNavText = localStorage.getItem("home-nav-text");

  if (savedBackground) {
    document.body.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.58), rgba(0, 0, 0, 0.72)), url('" + savedBackground + "')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
  }

  if (savedNavColor) {
    document.querySelectorAll("nav").forEach(function (nav) {
      nav.style.backgroundColor = savedNavColor;
      nav.setAttribute("data-theme-text", savedNavText === "#ffffff" ? "light" : "dark");
      nav.querySelectorAll("h1, a").forEach(function (item) {
        item.style.setProperty("color", savedNavText, "important");
      });
    });
  }
}());
