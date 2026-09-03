(function () {
  var savedBackground = localStorage.getItem("home-background");
  var savedTheme = localStorage.getItem("home-theme") || "midnight";
  var themes = {
    midnight: ["#111318", "#ffffff", "#c7f36b", "#eef2f5"],
    open: ["#d8e5ee", "#18211c", "#e06b4f", "#f4f7f8"],
    still: ["#5c756d", "#ffffff", "#f2c46d", "#edf3ef"],
    form: ["#e8e8e8", "#18211c", "#d05a42", "#f7f7f4"],
    studio: ["#3d4248", "#ffffff", "#ff9b62", "#eef0f1"],
    flow: ["#b7d5df", "#18211c", "#147d91", "#f1f8fa"]
  };
  var theme = themes[savedTheme] || themes.midnight;

  document.documentElement.style.setProperty("--theme-nav", theme[0]);
  document.documentElement.style.setProperty("--theme-nav-text", theme[1]);
  document.documentElement.style.setProperty("--theme-accent", theme[2]);
  document.documentElement.style.setProperty("--theme-surface", theme[3]);

  if (savedBackground) {
    document.body.setAttribute("data-wallpaper-theme", savedTheme);
    document.body.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.58), rgba(0, 0, 0, 0.72)), url('" + savedBackground + "')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
  }

}());
