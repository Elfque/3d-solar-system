import * as three from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  EffectComposer,
  RenderPass,
  UnrealBloomPass,
} from "three/examples/jsm/Addons.js";
import { Pane } from "tweakpane";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";

const pane = new Pane();
const raycaster = new three.Raycaster();
const mouse = new three.Vector2();

const scene = new three.Scene();
const canvas = document.querySelector(".renderer");
const labelRenderer = new CSS2DRenderer();
document.body.appendChild(labelRenderer.domElement);

const dime = { width: window.innerWidth, height: window.innerHeight };

const textureLoader = new three.TextureLoader();
// TEXTURES
const mercuryTexture = textureLoader.load("/img/mercury.jpg");
const venusTexture = textureLoader.load("/img/venus.jpg");
const earthTexture = textureLoader.load("/img/earth.jpg");
const marsTexture = textureLoader.load("/img/mars.jpg");
const jupiterTexture = textureLoader.load("/img/jupiter.jpg");
const saturnTexture = textureLoader.load("/img/saturn.jpg");
const uranusTexture = textureLoader.load("/img/uranus.jpg");
const neptuneTexture = textureLoader.load("/img/neptune.jpg");
const plutoTexture = textureLoader.load("/img/pluto.jpg");

const sunTexture = textureLoader.load("/img/sun.jpg");

const starTexture = textureLoader.load("/texture/star.png");

const sunGeometry = new three.SphereGeometry(2.5, 32, 16);
const sunMaterial = new three.MeshBasicMaterial({ map: sunTexture });
const sunObject = new three.Mesh(sunGeometry, sunMaterial);
scene.add(sunObject);

const createSphere = (radius, far, texture, planetName) => {
  const orbitGeometry = new three.CircleGeometry(far, 64);
  const edges = new three.EdgesGeometry(orbitGeometry);
  const orbitMaterial = new three.LineBasicMaterial({
    color: 0xffffff,
    opacity: 0.3,
    transparent: true,
  });
  const orbitPath = new three.Line(edges, orbitMaterial);
  scene.add(orbitPath);

  const planetGroup = new three.Group();

  const planetGeometry = new three.SphereGeometry(radius, 32, 16);
  const planetMaterial = new three.MeshBasicMaterial({ map: texture });
  const planetMesh = new three.Mesh(planetGeometry, planetMaterial);
  planetMesh.position.x = far;
  planetMesh.name = planetName.toLowerCase();
  planetGroup.add(planetMesh);
  scene.add(planetGroup);
  return { planetMesh, far };
};

const mercury = createSphere(1.2, 5, mercuryTexture, "Mercury");
const venus = createSphere(1.5, 9, venusTexture, "Venus");
const earth = createSphere(1.5, 13, earthTexture, "Earth");
const mars = createSphere(1.8, 18, marsTexture, "Mars");
const jupiter = createSphere(2.5, 24, jupiterTexture, "Jupiter");
const saturn = createSphere(2.3, 31, saturnTexture, "Saturn");
const uranus = createSphere(2.3, 37, uranusTexture, "Uranus");
const neptune = createSphere(2.5, 44, neptuneTexture, "Neptune");
const pluto = createSphere(2.5, 50, plutoTexture, "Pluto");

const planetsArray = [
  mercury.planetMesh,
  venus.planetMesh,
  earth.planetMesh,
  mars.planetMesh,
  jupiter.planetMesh,
  saturn.planetMesh,
  uranus.planetMesh,
  neptune.planetMesh,
  pluto.planetMesh,
];

const param = {
  speed: 1,
};
pane.addBinding(param, "speed", {
  min: 1,
  max: 10,
  step: 0.1,
});

// STARS
const createStars = () => {
  const vertices = [];

  for (let i = 0; i < 1000; i++) {
    const x = three.MathUtils.randFloatSpread(200);
    const y = three.MathUtils.randFloatSpread(200);
    const z = three.MathUtils.randFloatSpread(200);

    vertices.push(x, y, z);
  }

  const geometry = new three.BufferGeometry();
  geometry.setAttribute(
    "position",
    new three.Float32BufferAttribute(vertices, 3),
  );
  const material = new three.PointsMaterial({ map: starTexture });
  const points = new three.Points(geometry, material);
  scene.add(points);
};

createStars();

const camera = new three.PerspectiveCamera(
  40,
  dime.width / dime.height,
  1,
  300,
);
camera.position.z = 200;
camera.position.y = -80;
camera.lookAt(0);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);

const renderer = new three.WebGLRenderer({ canvas });
renderer.setSize(dime.width, dime.height);
renderer.render(scene, camera);

// GLOW
// const bloomScene = new three.Scene
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
const bloomPass = new UnrealBloomPass(
  new three.Vector2(window.innerWidth, window.innerHeight),
  4.5,
  0.4,
  0.85,
);
bloomPass.strength = 2;
bloomPass.threshold = 0;
bloomPass.radius = 0;
composer.setSize(window.innerWidth, window.innerHeight);
composer.renderToScreen = true;
composer.addPass(bloomPass);

let isPaused = false;

const planetData = {
  mercury: "Mercury 🌡️\nClosest to the Sun",
  venus: "Venus 🌡️\nClosest to the Sun",
  earth: "Earth 🌍\nOnly known planet with life",
  mars: "Mars 🌡️\nClosest to the Sun",
  jupiter: "Jupiter 🌡️\nClosest to the Sun",
  saturn: "Saturn 🌡️\nClosest to the Sun",
  uranus: "Uranus 🌡️\nClosest to the Sun",
  neptune: "Neptune 🌡️\nClosest to the Sun",
  pluto: "Pluto 🌡️\nClosest to the Sun",
};

function createLabel(text) {
  const div = document.createElement("div");
  div.className = "planet-label";
  div.textContent = text;

  return new CSS2DObject(div);
}

function showPlanetDetails(planetMesh) {
  if (planetMesh.userData.label) {
    planetMesh.remove(planetMesh.userData.label);
  }
  const label = createLabel(planetData[planetMesh.name]);
  label.position.set(0, 3, 0);
  planetMesh.add(label);
  planetMesh.userData.label = label;
}

window.addEventListener("click", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(planetsArray);
  if (intersects.length > 0) {
    isPaused = !isPaused;
    const clickedPlanet = intersects[0].object;
    showPlanetDetails(clickedPlanet);
  }
});

const clock = new three.Clock();
let mercuryAngle = 0;

const tick = () => {
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);

  const delta = clock.getDelta();

  if (!isPaused) {
    mercuryAngle += delta * 0.5 * param.speed;
  }

  mercury.planetMesh.position.y = Math.sin(mercuryAngle) * mercury.far;
  mercury.planetMesh.position.x = Math.cos(mercuryAngle) * mercury.far;
  venus.planetMesh.position.y = Math.sin(mercuryAngle / 1.5) * venus.far;
  venus.planetMesh.position.x = Math.cos(mercuryAngle / 1.5) * venus.far;
  earth.planetMesh.position.y = Math.sin(mercuryAngle / 2) * earth.far;
  earth.planetMesh.position.x = Math.cos(mercuryAngle / 2) * earth.far;
  mars.planetMesh.position.y = Math.sin(mercuryAngle / 2.5) * mars.far;
  mars.planetMesh.position.x = Math.cos(mercuryAngle / 2.5) * mars.far;
  jupiter.planetMesh.position.y = Math.sin(mercuryAngle / 3) * jupiter.far;
  jupiter.planetMesh.position.x = Math.cos(mercuryAngle / 3) * jupiter.far;
  saturn.planetMesh.position.y = Math.sin(mercuryAngle / 3.5) * saturn.far;
  saturn.planetMesh.position.x = Math.cos(mercuryAngle / 3.5) * saturn.far;
  uranus.planetMesh.position.y = Math.sin(mercuryAngle / 4) * uranus.far;
  uranus.planetMesh.position.x = Math.cos(mercuryAngle / 4) * uranus.far;
  neptune.planetMesh.position.y = Math.sin(mercuryAngle / 4.5) * neptune.far;
  neptune.planetMesh.position.x = Math.cos(mercuryAngle / 4.5) * neptune.far;
  pluto.planetMesh.position.y = Math.sin(mercuryAngle / 5) * pluto.far;
  pluto.planetMesh.position.x = Math.cos(mercuryAngle / 5) * pluto.far;

  controls.update();
  window.requestAnimationFrame(tick);
};
tick();

window.addEventListener("resize", () => {
  dime.height = window.innerHeight;
  dime.width = window.innerWidth;

  renderer.setSize(dime.width, dime.height);
  camera.aspect = dime.width / dime.height;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(dime.width, dime.height);
});
