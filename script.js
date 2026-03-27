import * as three from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  EffectComposer,
  RenderPass,
  UnrealBloomPass,
} from "three/examples/jsm/Addons.js";
import { Pane } from "tweakpane";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";

const fontLoader = new FontLoader();
const pane = new Pane();

const scene = new three.Scene();
const canvas = document.querySelector(".renderer");

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

const material = new three.MeshBasicMaterial({ color: 0xffffff });
const renderText = (text) => {
  let textMesh;
  fontLoader.load("/fonts/font.json", (font) => {
    const textGeometry = new TextGeometry(text, {
      font,
      size: 1,
      height: 0.2,
    });
    textGeometry.center();
    textMesh = new three.Mesh(textGeometry, material);
  });
  return textMesh;
};

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
  const planetObject = new three.Mesh(planetGeometry, planetMaterial);
  planetObject.position.x = far;

  // fontLoader.load("/fonts/font.json", (font) => {
  //   const textGeometry = new TextGeometry(planetName ?? "Planet", {
  //     font,
  //     size: 1,
  //     height: 0.2,
  //     depth: 0.5,
  //   });

  //   const textMesh = new three.Mesh(textGeometry, material);
  //   textMesh.lookAt(0, 0, 0);
  //   textMesh.position.x = far;
  //   textMesh.position.z = 3;
  //   planetGroup.add(textMesh);
  // });

  planetGroup.add(planetObject);
  scene.add(planetGroup);
  return planetGroup;
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

const tick = () => {
  renderer.render(scene, camera);
  mercury.rotation.z += 0.01 * param.speed;
  venus.rotation.z += 0.0085 * param.speed;
  earth.rotation.z += 0.007 * param.speed;
  mars.rotation.z += 0.0055 * param.speed;
  jupiter.rotation.z += 0.004 * param.speed;
  saturn.rotation.z += 0.0025 * param.speed;
  uranus.rotation.z += 0.0015 * param.speed;
  neptune.rotation.z += 0.001 * param.speed;
  pluto.rotation.z += 0.0009 * param.speed;

  controls.update();

  // composer.render();
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
