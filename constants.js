export const planetsData = [
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
  {
    name: "Pluto",
    emoji: "🌑",
    color: 0xdddddd,
    size: 0.18,
    distance: 39,
    speed: 0.003,
    info: "Once considered the ninth planet, now classified as a dwarf planet in the Kuiper belt.",
  },
];

export function getFunFact(planetName) {
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
    Pluto:
      "Pluto has a large heart-shaped region made of nitrogen and carbon monoxide ice called Tombaugh Regio.",
  };
  return facts[planetName] || "No fun fact available.";
}

export function getPlanetDetails(planetName) {
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
    Pluto:
      '<div class="planet-detail"><span class="planet-detail-label">Diameter:</span> 2,376 km</div><div class="planet-detail"><span class="planet-detail-label">Day Length:</span> 153.3 hours</div><div class="planet-detail"><span class="planet-detail-label">Year Length:</span> 248 Earth years</div>',
  };
  return details[planetName] || "";
}
