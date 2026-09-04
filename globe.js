import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

const canvas = document.querySelector("#globe");

if (canvas) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
  camera.position.z = 4.2;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

  const globe = new THREE.Group();
  scene.add(globe);

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.45, 48, 32),
    new THREE.MeshBasicMaterial({ color: 0x111111, wireframe: true, transparent: true, opacity: 0.72 })
  );
  globe.add(sphere);

  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.53, 32, 24),
    new THREE.MeshBasicMaterial({ color: 0x777777, wireframe: true, transparent: true, opacity: 0.2 })
  );
  globe.add(atmosphere);

  const points = new THREE.Points(
    new THREE.SphereGeometry(1.48, 24, 16),
    new THREE.PointsMaterial({ color: 0x111111, size: 0.025, transparent: true, opacity: 0.8 })
  );
  globe.add(points);

  let dragging = false;
  let previousX = 0;
  let previousY = 0;
  let velocity = 0.0025;

  canvas.addEventListener("pointerdown", (event) => {
    dragging = true;
    previousX = event.clientX;
    previousY = event.clientY;
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    const horizontalMovement = event.clientX - previousX;
    const verticalMovement = event.clientY - previousY;
    globe.rotation.y += horizontalMovement * 0.01;
    globe.rotation.x += verticalMovement * 0.01;
    velocity = horizontalMovement * 0.0008;
    previousX = event.clientX;
    previousY = event.clientY;
  });

  canvas.addEventListener("pointerup", () => {
    dragging = false;
  });

  function animate() {
    requestAnimationFrame(animate);
    if (!dragging) globe.rotation.y += velocity;
    velocity *= 0.985;
    velocity += (0.0025 - velocity) * 0.01;
    renderer.render(scene, camera);
  }

  animate();
}