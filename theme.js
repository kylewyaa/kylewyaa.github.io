(function () {
  var savedBackground = localStorage.getItem("home-background");

  if (savedBackground) {
    document.body.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.58), rgba(0, 0, 0, 0.72)), url('" + savedBackground + "')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
  }

}());
