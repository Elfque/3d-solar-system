import * as three from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Pane } from "tweakpane";
import {
  CSS2DObject,
  CSS2DRenderer,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";

const pane = new Pane();
const raycaster = new three.Raycaster();
const mouse = new three.Vector2();

const scene = new three.Scene();
scene.fog = new three.FogExp2(0x050b1a, 0.0005);
const canvas = document.querySelector(".renderer");
const tooltip = document.getElementById("planetTooltip");
const tooltipClose = document.getElementById("tooltipClose");
let currentPlanet = null;

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

const planetsData = [
  {
    name: "Mercury",
    emoji: "☿️",
    color: 0xbc9a6c,
    size: 0.4,
    distance: 3.5,
    speed: 0.04,
    info: "The smallest and fastest planet. Mercury has extreme temperature variations from -173°C to 427°C.",
  },
  {
    name: "Venus",
    emoji: "♀️",
    color: 0xe6b800,
    size: 0.5,
    distance: 5,
    speed: 0.025,
    info: 'Often called Earth\'s "sister planet" due to similar size. Has a toxic atmosphere and is the hottest planet.',
  },
  {
    name: "Earth",
    emoji: "🌍",
    color: 0x2288ff,
    size: 0.55,
    distance: 6.8,
    speed: 0.02,
    info: "Our home planet. The only place we know of that harbors life. 71% covered by water.",
  },
  {
    name: "Mars",
    emoji: "♂️",
    color: 0xcc6644,
    size: 0.5,
    distance: 8.5,
    speed: 0.017,
    info: "The Red Planet. Home to Olympus Mons, the largest volcano in the solar system.",
  },
  {
    name: "Jupiter",
    emoji: "♃",
    color: 0xd8a27a,
    size: 1.2,
    distance: 12,
    speed: 0.009,
    info: "The largest planet. A gas giant with a Great Red Spot, a massive storm larger than Earth.",
  },
  {
    name: "Saturn",
    emoji: "🪐",
    color: 0xf0e6d0,
    size: 1.0,
    distance: 15,
    speed: 0.007,
    info: "Famous for its beautiful ring system. A gas giant with 82 confirmed moons.",
  },
  {
    name: "Uranus",
    emoji: "⛢",
    color: 0xb0e0e6,
    size: 0.85,
    distance: 18.5,
    speed: 0.005,
    info: "Rotates on its side. An ice giant with a pale blue color from methane in its atmosphere.",
  },
  {
    name: "Neptune",
    emoji: "♆",
    color: 0x4169e1,
    size: 0.85,
    distance: 22,
    speed: 0.004,
    info: "Deep blue color. Strongest winds in the solar system, reaching speeds of 2,100 km/h.",
  },
];

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
camera.position.z = 200;
camera.position.y = -80;
camera.lookAt(0);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);

const renderer = new three.WebGLRenderer({ canvas });
renderer.setSize(dime.width, dime.height);
renderer.render(scene, camera);

let isPaused = false;

function getPlanetDetails(planetName) {
  const details = {
    Mercury:
      '<div class="planet-detail"><span class="planet-detail-label">Diameter:</span> 4,879 km</div><div class="planet-detail"><span class="planet-detail-label">Day Length:</span> 59 Earth days</div><div class="planet-detail"><span class="planet-detail-label">Year Length:</span> 88 Earth days</div>',
    Venus:
      '<div class="planet-detail"><span class="planet-detail-label">Diameter:</span> 12,104 km</div><div class="planet-detail"><span class="planet-detail-label">Day Length:</span> 243 Earth days</div><div class="planet-detail"><span class="planet-detail-label">Year Length:</span> 225 Earth days</div>',
    Earth:
      '<div class="planet-detail"><span class="planet-detail-label">Diameter:</span> 12,742 km</div><div class="planet-detail"><span class="planet-detail-label">Day Length:</span> 24 hours</div><div class="planet-detail"><span class="planet-detail-label">Year Length:</span> 365.25 days</div>',
    Mars: '<div class="planet-detail"><span class="planet-detail-label">Diameter:</span> 6,779 km</div><div class="planet-detail"><span class="planet-detail-label">Day Length:</span> 24.6 hours</div><div class="planet-detail"><span class="planet-detail-label">Year Length:</span> 687 Earth days</div>',
    Jupiter:
      '<div class="planet-detail"><span class="planet-detail-label">Diameter:</span> 139,820 km</div><div class="planet-detail"><span class="planet-detail-label">Day Length:</span> 9.9 hours</div><div class="planet-detail"><span class="planet-detail-label">Year Length:</span> 11.9 Earth years</div><div class="planet-detail"><span class="planet-detail-label">Moons:</span> 79+</div>',
    Saturn:
      '<div class="planet-detail"><span class="planet-detail-label">Diameter:</span> 116,460 km</div><div class="planet-detail"><span class="planet-detail-label">Day Length:</span> 10.7 hours</div><div class="planet-detail"><span class="planet-detail-label">Year Length:</span> 29.5 Earth years</div><div class="planet-detail"><span class="planet-detail-label">Rings:</span> Yes, beautiful rings!</div>',
    Uranus:
      '<div class="planet-detail"><span class="planet-detail-label">Diameter:</span> 50,724 km</div><div class="planet-detail"><span class="planet-detail-label">Day Length:</span> 17.2 hours</div><div class="planet-detail"><span class="planet-detail-label">Year Length:</span> 84 Earth years</div>',
    Neptune:
      '<div class="planet-detail"><span class="planet-detail-label">Diameter:</span> 49,244 km</div><div class="planet-detail"><span class="planet-detail-label">Day Length:</span> 16.1 hours</div><div class="planet-detail"><span class="planet-detail-label">Year Length:</span> 165 Earth years</div>',
  };
  return details[planetName] || "";
}

function getFunFact(planetName) {
  const facts = {
    Mercury:
      "A year on Mercury is only 88 Earth days long because it orbits the Sun so quickly.",
    Venus:
      "Venus rotates in the opposite direction to most other planets (retrograde rotation).",
    Earth:
      "Earth is the only planet in our solar system not named after a Roman or Greek deity.",
    Mars: "Mars has the largest volcano in the solar system, Olympus Mons, which is three times the height of Mount Everest.",
    Jupiter:
      "Jupiter's Great Red Spot is a giant storm that has been raging for at least 350 years.",
    Saturn:
      "Saturn's rings are made mostly of ice particles with a smaller amount of rocky debris and dust.",
    Uranus:
      "Uranus rotates on its side, with its axis tilted at about 98 degrees.",
    Neptune:
      "Neptune has the fastest winds in the solar system, reaching speeds of over 2,100 km/h (1,300 mph).",
  };
  return facts[planetName] || "No fun fact available.";
}

function updateTooltipPosition(planetMesh) {
  // Get the 3D position of the planet in world coordinates
  const worldPosition = planetMesh.getWorldPosition(new three.Vector3());

  // Project 3D position to screen coordinates
  const vector = worldPosition.project(camera);

  // Convert to CSS coordinates
  const x = (vector.x * 0.5 + 0.5) * renderer.domElement.clientWidth;
  const y = -(vector.y * 0.5 - 0.5) * renderer.domElement.clientHeight;

  // Position tooltip near the planet (slightly above and to the side)
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

  // Add a temporary glow effect to the planet
  //   if (planet.material) {
  //     // planet.userData.originalEmissive = planet.material.emissiveIntensity || 0;
  //     planet.material.emissiveIntensity = 0.3;
  //     planet.material.emissive = new three.Color(planetData.color);
  //     // planet.material.emissive = new three.Color(planet.color);
  //   }
}

function hideTooltip() {
  tooltip.style.display = "none";

  // Remove glow effect
  //   if (currentPlanet && currentPlanet.mesh.material) {
  //     currentPlanet.mesh.material.emissiveIntensity =
  //       currentPlanet.mesh.userData.originalEmissive || 0;
  //     if (currentPlanet.mesh.userData.originalEmissive === undefined) {
  //       currentPlanet.mesh.material.emissiveIntensity = 0;
  //     }
  //   }
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
    // if (planetData) {
    // If clicking the same planet, hide the tooltip
    if (currentPlanet === planetData && tooltip.style.display === "block") {
      hideTooltip();
    } else {
      console.log("yes");
      showTooltip(clickedPlanet);
    }
    // }
  } else {
    // Clicked on empty space, hide tooltip
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
