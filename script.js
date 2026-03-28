import * as three from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Pane } from "tweakpane";
import { planetsData, getFunFact, getPlanetDetails } from "./constants";

const pane = new Pane();
const raycaster = new three.Raycaster();
const mouse = new three.Vector2();

const scene = new three.Scene();
scene.fog = new three.FogExp2(0x050b1a, 0.0005);
const glowLayer = 1;
const canvas = document.querySelector(".renderer");
const tooltip = document.getElementById("planetTooltip");
let currentPlanet = null;

const dime = { width: window.innerWidth, height: window.innerHeight };

// TEXTURES
const textureLoader = new three.TextureLoader();
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

const sunGeometry = new three.SphereGeometry(2.5, 32, 16);
const sunMaterial = new three.MeshBasicMaterial({ map: sunTexture });
const sunObject = new three.Mesh(sunGeometry, sunMaterial);
sunObject.layers.enable(glowLayer);
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
  planetMesh.name = planetName;
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
  const starGeometry = new three.BufferGeometry();
  const starCount = 3000;
  const starPositions = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    starPositions[i * 3] = (Math.random() - 0.5) * 2000;
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * 1000;
    starPositions[i * 3 + 2] = (Math.random() - 0.5) * 500 - 100;
  }
  starGeometry.setAttribute(
    "position",
    new three.BufferAttribute(starPositions, 3),
  );
  const starMaterial = new three.PointsMaterial({
    color: 0xffffff,
    size: 0.3,
    transparent: true,
    opacity: 0.8,
  });
  const stars = new three.Points(starGeometry, starMaterial);
  scene.add(stars);
};

createStars();

const camera = new three.PerspectiveCamera(
  40,
  dime.width / dime.height,
  1,
  1000,
);
camera.position.z = 80;
camera.position.y = -110;
camera.lookAt(0, 0, 0);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableZoom = false;
controls.enablePan = false;

const renderer = new three.WebGLRenderer({ canvas });
renderer.setSize(dime.width, dime.height);
renderer.render(scene, camera);

let isPaused = false;

function updateTooltipPosition(planetMesh) {
  const worldPosition = planetMesh.getWorldPosition(new three.Vector3());
  const vector = worldPosition.project(camera);
  const x = (vector.x * 0.5 + 0.5) * renderer.domElement.clientWidth;
  const y = -(vector.y * 0.5 - 0.5) * renderer.domElement.clientHeight;
  tooltip.style.left = `${x + 20}px`;
  tooltip.style.top = `${y - 80}px`;
}

function showTooltip(planet) {
  const planetName = planet.name;
  const planetData = planetsData.find((p) => p.name === planetName);
  isPaused = true;
  const planetEmoji = planetData.emoji;
  const planetInfo = planetData.info;

  document.getElementById("tooltipEmoji").textContent = planetEmoji;
  document.getElementById("tooltipName").textContent = planetName;

  const details = getPlanetDetails(planetName);
  const funFact = getFunFact(planetName);

  document.getElementById("tooltipBody").innerHTML = `
                <p style="margin: 0 0 10px 0;">${planetInfo}</p>
                ${details}
                <div class="fun-fact">
                    <strong>✨ Fun Fact:</strong><br>
                    ${funFact}
                </div>
            `;

  // Position tooltip near the planet
  updateTooltipPosition(planet);

  tooltip.style.display = "block";
  currentPlanet = planet;
}

function hideTooltip() {
  tooltip.style.display = "none";
  currentPlanet = null;
  isPaused = false;
}

function onMouseClick(event) {
  // Calculate mouse position in normalized coordinates
  mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(planetsArray);

  if (intersects.length > 0) {
    const clickedPlanet = intersects[0].object;
    const planetData = planetsArray.find((p) => p.mesh === clickedPlanet);

    if (currentPlanet === planetData && tooltip.style.display === "block") {
      hideTooltip();
    } else {
      showTooltip(clickedPlanet);
    }
  } else {
    hideTooltip();
  }
}

window.addEventListener("click", onMouseClick, false);

const clock = new three.Clock();
let mercuryAngle = 0;

const tick = () => {
  renderer.render(scene, camera);

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
  mars.planetMesh.position.y = Math.sin(mercuryAngle / 3) * mars.far;
  mars.planetMesh.position.x = Math.cos(mercuryAngle / 3) * mars.far;
  jupiter.planetMesh.position.y = Math.sin(mercuryAngle / 4) * jupiter.far;
  jupiter.planetMesh.position.x = Math.cos(mercuryAngle / 4) * jupiter.far;
  saturn.planetMesh.position.y = Math.sin(mercuryAngle / 5) * saturn.far;
  saturn.planetMesh.position.x = Math.cos(mercuryAngle / 5) * saturn.far;
  uranus.planetMesh.position.y = Math.sin(mercuryAngle / 7) * uranus.far;
  uranus.planetMesh.position.x = Math.cos(mercuryAngle / 7) * uranus.far;
  neptune.planetMesh.position.y = Math.sin(mercuryAngle / 8.5) * neptune.far;
  neptune.planetMesh.position.x = Math.cos(mercuryAngle / 8.5) * neptune.far;
  pluto.planetMesh.position.y = Math.sin(mercuryAngle / 10) * pluto.far;
  pluto.planetMesh.position.x = Math.cos(mercuryAngle / 10) * pluto.far;

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
