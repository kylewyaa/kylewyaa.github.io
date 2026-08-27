$(function () {
  // initialize canvas and context when able to
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  window.addEventListener("load", loadJson);

  function setup() {
    if (firstTimeSetup) {
      halleImage = document.getElementById("player");
      projectileImage = document.getElementById("projectile");
      cannonImage = document.getElementById("cannon");
      $(document).on("keydown", handleKeyDown);
      $(document).on("keyup", handleKeyUp);
      firstTimeSetup = false;
      //start game
      setInterval(main, 1000 / frameRate);
    }

    // Create walls - do not delete or modify this code
    createPlatform(-50, -50, canvas.width + 100, 50); // top wall
    createPlatform(
      -50,
      canvas.height - 10,
      canvas.width + 100,
      200,
      "rgb(118, 0, 233)",
    ); // bottom wall
    createPlatform(-50, -50, 50, canvas.height + 500); // left wall
    createPlatform(canvas.width, -50, 50, canvas.height + 100); // right wall

    //////////////////////////////////
    // ONLY CHANGE BELOW THIS POINT //
    //////////////////////////////////

    // TODO 1 - Enable the Grid
    // toggleGrid();

    // TODO 2 - Create Platforms
    createPlatform(90, 610, 230, 22, "#5b8c85");
    createPlatform(390, 510, 190, 22, "#7aa095");
    createPlatform(650, 405, 190, 22, "#9ab7a9");
    createPlatform(870, 545, 190, 22, "#7aa095");
    createPlatform(1110, 430, 180, 22, "#5b8c85");
    createPlatform(590, 250, 170, 22, "#c4d7c1", 500, 760, 1.5);

    // TODO 3 - Create Collectables
    createCollectable("star", 170, 565);
    createCollectable("star", 465, 465);
    createCollectable("star", 725, 360);

    // TODO 4 - Create Cannons
    createCannon("right", 180, 2200);
    createCannon("top", 760, 3000);
    createCannon("left", 500, 2600);

    //////////////////////////////////
    // ONLY CHANGE ABOVE THIS POINT //
    //////////////////////////////////
  }

  registerSetup(setup);
});
