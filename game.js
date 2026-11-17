// ==========================================
// BRANCHBOUND 2.1
// Upgrade Tree + Auto Save + Sound + Effects
// ==========================================

const SAVE_KEY = "branchbound_save_v2";

let shards = 0;
let income = 0;
let tapPower = 1;
let selectedNode = "origin";
let unlocked = ["origin"];

// ==========================================
// UPGRADE TREE
// ==========================================

const upgrades = [
  {
    id: "origin", name: "✦ ORIGIN", branch: "Core",
    x: 450, y: 900, cost: 0,
    description: "Every great network starts somewhere.",
    effect: "+1 shard per tap",
    parents: [], type: "origin", value: 0
  },

  // ENERGY
  {
    id: "spark", name: "⚡ SPARK", branch: "Energy",
    x: 150, y: 760, cost: 25,
    description: "Awaken a small spark of energy.",
    effect: "Double tap power",
    parents: ["origin"], type: "tapMult", value: 2
  },
  {
    id: "pulse", name: "💥 PULSE", branch: "Energy",
    x: 150, y: 620, cost: 150,
    description: "A powerful pulse runs through the network.",
    effect: "+3 shards per second",
    parents: ["spark"], type: "income", value: 3
  },
  {
    id: "surge", name: "🌊 SURGE", branch: "Energy",
    x: 150, y: 480, cost: 800,
    description: "Unleash a wave of concentrated energy.",
    effect: "Triple tap power",
    parents: ["pulse"], type: "tapMult", value: 3
  },
  {
    id: "reactor", name: "☢️ REACTOR", branch: "Energy",
    x: 150, y: 340, cost: 4500,
    description: "A reactor powers your entire operation.",
    effect: "+35 shards per second",
    parents: ["surge"], type: "income", value: 35
  },
  {
    id: "supernova", name: "🌟 SUPERNOVA", branch: "Energy",
    x: 150, y: 200, cost: 25000,
    description: "Release an incredible burst of energy.",
    effect: "Multiply tap power by 10",
    parents: ["reactor"], type: "tapMult", value: 10
  },

  // AUTOMATION
  {
    id: "drip", name: "💧 DRIP", branch: "Automation",
    x: 300, y: 760, cost: 40,
    description: "Start generating shards automatically.",
    effect: "+2 shards per second",
    parents: ["origin"], type: "income", value: 2
  },
  {
    id: "collector", name: "🧲 COLLECTOR", branch: "Automation",
    x: 300, y: 620, cost: 220,
    description: "Collect energy from nearby sources.",
    effect: "+8 shards per second",
    parents: ["drip"], type: "income", value: 8
  },
  {
    id: "drone", name: "🚁 DRONE", branch: "Automation",
    x: 300, y: 480, cost: 1200,
    description: "A drone handles the collection for you.",
    effect: "Double passive income",
    parents: ["collector"], type: "incomeMult", value: 2
  },
  {
    id: "factory", name: "🏭 FACTORY", branch: "Automation",
    x: 300, y: 340, cost: 7000,
    description: "Build a factory dedicated to shard production.",
    effect: "+100 shards per second",
    parents: ["drone"], type: "income", value: 100
  },
  {
    id: "quantum", name: "🌀 QUANTUM", branch: "Automation",
    x: 300, y: 200, cost: 40000,
    description: "Automate production at a quantum scale.",
    effect: "Triple passive income",
    parents: ["factory"], type: "incomeMult", value: 3
  },

  // EXPANSION
  {
    id: "roots", name: "🌱 ROOTS", branch: "Expansion",
    x: 450, y: 760, cost: 60,
    description: "Extend your network beneath the surface.",
    effect: "+5 shards per second",
    parents: ["origin"], type: "income", value: 5
  },
  {
    id: "deep", name: "🌳 DEEP ROOTS", branch: "Expansion",
    x: 450, y: 620, cost: 350,
    description: "Reach deeper and discover new energy.",
    effect: "Double tap power",
    parents: ["roots"], type: "tapMult", value: 2
  },
  {
    id: "grove", name: "🍃 GROVE", branch: "Expansion",
    x: 450, y: 480, cost: 2000,
    description: "Your growing network becomes a thriving grove.",
    effect: "+25 shards per second",
    parents: ["deep"], type: "income", value: 25
  },
  {
    id: "worldtree", name: "🌲 WORLD TREE", branch: "Expansion",
    x: 450, y: 340, cost: 12000,
    description: "A tree connecting distant worlds.",
    effect: "Multiply tap power by 5",
    parents: ["grove"], type: "tapMult", value: 5
  },
  {
    id: "realm", name: "🌌 NEW REALM", branch: "Expansion",
    x: 450, y: 200, cost: 65000,
    description: "Discover an entirely new realm.",
    effect: "+250 shards per second",
    parents: ["worldtree"], type: "income", value: 250
  },

  // RESEARCH
  {
    id: "focus", name: "🔮 FOCUS", branch: "Research",
    x: 600, y: 760, cost: 75,
    description: "Concentrate your energy into every action.",
    effect: "Double tap power",
    parents: ["origin"], type: "tapMult", value: 2
  },
  {
    id: "echo", name: "🔊 ECHO", branch: "Research",
    x: 600, y: 620, cost: 450,
    description: "Make every action resonate through the network.",
    effect: "+15 shards per second",
    parents: ["focus"], type: "income", value: 15
  },
  {
    id: "amplifier", name: "📡 AMPLIFIER", branch: "Research",
    x: 600, y: 480, cost: 2600,
    description: "Amplify the power of your entire core.",
    effect: "Quadruple tap power",
    parents: ["echo"], type: "tapMult", value: 4
  },
  {
    id: "overclock", name: "⏱️ OVERCLOCK", branch: "Research",
    x: 600, y: 340, cost: 15000,
    description: "Push your systems beyond their limits.",
    effect: "Double passive income",
    parents: ["amplifier"], type: "incomeMult", value: 2
  },
  {
    id: "infinity", name: "♾️ INFINITY", branch: "Research",
    x: 600, y: 200, cost: 85000,
    description: "Research the limits of endless growth.",
    effect: "Multiply tap power by 10",
    parents: ["overclock"], type: "tapMult", value: 10
  },

  // ASCENSION
  {
    id: "crystal", name: "💠 CRYSTAL", branch: "Ascension",
    x: 750, y: 760, cost: 100,
    description: "Discover a rare and powerful crystal.",
    effect: "+10 shards per second",
    parents: ["origin"], type: "income", value: 10
  },
  {
    id: "enlighten", name: "✨ ENLIGHTEN", branch: "Ascension",
    x: 750, y: 620, cost: 600,
    description: "Understand the deeper nature of energy.",
    effect: "Triple tap power",
    parents: ["crystal"], type: "tapMult", value: 3
  },
  {
    id: "eternal", name: "♟️ ETERNAL", branch: "Ascension",
    x: 750, y: 480, cost: 3500,
    description: "Make your production everlasting.",
    effect: "+50 shards per second",
    parents: ["enlighten"], type: "income", value: 50
  },
  {
    id: "transcend", name: "🪐 TRANSCEND", branch: "Ascension",
    x: 750, y: 340, cost: 20000,
    description: "Rise beyond the limits of your network.",
    effect: "Double tap power and income",
    parents: ["eternal"], type: "bothMult", value: 2
  },
  {
    id: "singularity", name: "🌠 SINGULARITY", branch: "Ascension",
    x: 750, y: 200, cost: 120000,
    description: "Bring every branch together into one point.",
    effect: "Multiply all production by 5",
    parents: ["transcend"], type: "bothMult", value: 5
  }
];

// ==========================================
// GAME ELEMENTS
// ==========================================

const shardsDisplay = document.getElementById("shards");
const incomeDisplay = document.getElementById("income");
const tree = document.getElementById("nodes");
const connections = document.getElementById("connections");

// ==========================================
// SOUND SYSTEM
// ==========================================

let soundEnabled =
  localStorage.getItem("branchbound_sound") !== "off";

let audioContext = null;

function playSound(type) {
  if (!soundEnabled) return;

  try {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) return;

    if (!audioContext) {
      audioContext = new AudioContextClass();
    }

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    const sounds = {
      tap: [520, 760, 0.07],
      unlock: [440, 880, 0.2],
      menu: [330, 440, 0.1],
      error: [180, 120, 0.13]
    };

    const [start, end, duration] =
      sounds[type] || sounds.tap;

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";

    oscillator.frequency.setValueAtTime(
      start,
      audioContext.currentTime
    );

    oscillator.frequency.exponentialRampToValueAtTime(
      end,
      audioContext.currentTime + duration
    );

    gain.gain.setValueAtTime(
      0.0001,
      audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
      0.12,
      audioContext.currentTime + 0.01
    );

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      audioContext.currentTime + duration
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);

  } catch (error) {
    console.warn("Sound unavailable:", error);
  }
}

// Sound toggle
const soundButton = document.createElement("button");
soundButton.id = "soundToggle";
document.body.appendChild(soundButton);

function updateSoundButton() {
  soundButton.textContent =
    soundEnabled ? "🔊 SOUND ON" : "🔇 SOUND OFF";
}

soundButton.addEventListener("click", () => {
  soundEnabled = !soundEnabled;

  localStorage.setItem(
    "branchbound_sound",
    soundEnabled ? "on" : "off"
  );

  updateSoundButton();

  if (soundEnabled) playSound("menu");
});

updateSoundButton();

// ==========================================
// ANIMATIONS
// ==========================================

function animateTap() {
  const button = document.getElementById("tapButton");

  button.classList.remove("tap-pop");
  void button.offsetWidth;
  button.classList.add("tap-pop");
}

function showFloatingShards(amount) {
  const button = document.getElementById("tapButton");
  const float = document.createElement("span");

  float.className = "shard-float";
  float.textContent = `+${formatNumber(amount)} 💎`;

  button.appendChild(float);

  setTimeout(() => float.remove(), 850);
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function getNode(id) {
  return upgrades.find(node => node.id === id);
}

function isUnlocked(id) {
  return unlocked.includes(id);
}

function isAvailable(node) {
  return node.parents.length > 0 &&
    node.parents.every(isUnlocked) &&
    !isUnlocked(node.id);
}

function formatNumber(number) {
  if (number >= 1e12) {
    return (number / 1e12).toFixed(2) + "T";
  }

  if (number >= 1e9) {
    return (number / 1e9).toFixed(2) + "B";
  }

  if (number >= 1e6) {
    return (number / 1e6).toFixed(2) + "M";
  }

  if (number >= 1e3) {
    return (number / 1e3).toFixed(2) + "K";
  }

  return Math.floor(number).toLocaleString();
}

// ==========================================
// SAVE SYSTEM
// ==========================================

function saveGame() {
  const save = {
    shards,
    unlocked
  };

  localStorage.setItem(
    SAVE_KEY,
    JSON.stringify(save)
  );
}

function loadGame() {
  try {
    const save = JSON.parse(
      localStorage.getItem(SAVE_KEY)
    );

    if (!save) return;

    shards = Math.max(0, Number(save.shards) || 0);

    unlocked = Array.isArray(save.unlocked)
      ? save.unlocked.filter(id =>
          upgrades.some(node => node.id === id)
        )
      : ["origin"];

    if (!unlocked.includes("origin")) {
      unlocked.unshift("origin");
    }

    recalculateStats();

  } catch (error) {
    console.warn("Save could not be loaded:", error);
  }
}

// ==========================================
// UPGRADE CALCULATIONS
// ==========================================

function recalculateStats() {
  income = 0;
  tapPower = 1;

  upgrades.forEach(node => {
    if (!isUnlocked(node.id)) return;

    if (node.type === "income") {
      income += node.value;
    }

    if (node.type === "tapMult") {
      tapPower *= node.value;
    }

    if (node.type === "incomeMult") {
      income *= node.value;
    }

    if (node.type === "bothMult") {
      income *= node.value;
      tapPower *= node.value;
    }
  });
}

// ==========================================
// UPGRADE TREE RENDERING
// ==========================================

function renderTree() {
  tree.innerHTML = "";
  connections.innerHTML = "";

  // Draw connecting lines
  upgrades.forEach(node => {
    node.parents.forEach(parentId => {
      const parent = getNode(parentId);
      if (!parent) return;

      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );

      line.setAttribute("x1", parent.x);
      line.setAttribute("y1", parent.y);
      line.setAttribute("x2", node.x);
      line.setAttribute("y2", node.y);

      line.setAttribute(
        "class",
        isUnlocked(node.id) ? "edge active" : "edge"
      );

      connections.appendChild(line);
    });
  });

  // Create upgrade buttons
  upgrades.forEach(node => {
    const button = document.createElement("button");

    button.className = "node";
    button.textContent = node.name;
    button.style.left = node.x + "px";
    button.style.top = node.y + "px";

    button.title =
      `${node.branch} — ${node.description}`;

    if (isUnlocked(node.id)) {
      button.classList.add("unlocked");
    } else if (isAvailable(node)) {
      button.classList.add("available");
    } else {
      button.classList.add("locked");
    }

    button.addEventListener("click", () => {
      playSound("menu");
      selectedNode = node.id;
      showDetails();
    });

    tree.appendChild(button);
  });
}

// ==========================================
// UPGRADE DETAILS
// ==========================================

function showDetails() {
  const node = getNode(selectedNode);
  if (!node) return;

  let details = document.getElementById("details");

  if (!details) {
    details = document.createElement("section");
    details.id = "details";
    details.className = "details";

    document.querySelector("main").appendChild(details);
  }

  details.innerHTML = `
    <small>${node.branch.toUpperCase()} BRANCH</small>
    <h3>${node.name}</h3>
    <p>${node.description}</p>
    <p class="effect">${node.effect}</p>
    <p>Cost: <strong>${formatNumber(node.cost)}</strong> shards</p>
    <button id="buyButton">UNLOCK UPGRADE</button>
  `;

  const button = document.getElementById("buyButton");

  if (isUnlocked(node.id)) {
    button.textContent = "✓ UNLOCKED";
    button.disabled = true;

  } else if (!isAvailable(node)) {
    button.textContent = "LOCKED — UNLOCK PARENT FIRST";
    button.disabled = true;

  } else if (shards < node.cost) {
    button.textContent = "NOT ENOUGH SHARDS";
    button.disabled = true;

  } else {
    button.textContent = "UNLOCK UPGRADE";
    button.disabled = false;
  }

  button.addEventListener("click", () => {
    buyUpgrade(node);
  });
}

// ==========================================
// BUY UPGRADES
// ==========================================

function buyUpgrade(node) {
  if (!isAvailable(node) || shards < node.cost) {
    playSound("error");
    return;
  }

  shards -= node.cost;
  unlocked.push(node.id);

  playSound("unlock");

  recalculateStats();
  updateUI();
  renderTree();
  showDetails();
  saveGame();
}

// ==========================================
// UI UPDATES
// ==========================================

function updateUI() {
  shardsDisplay.textContent = formatNumber(shards);
  incomeDisplay.textContent = formatNumber(income);

  const tapButton = document.getElementById("tapButton");

  if (tapButton) {
    tapButton.textContent =
      `✦ GATHER SHARDS (+${formatNumber(tapPower)})`;
  }

  const buyButton = document.getElementById("buyButton");
  const node = getNode(selectedNode);

  if (buyButton && node && !isUnlocked(node.id)) {
    buyButton.disabled =
      !isAvailable(node) || shards < node.cost;

    if (!isAvailable(node)) {
      buyButton.textContent =
        "LOCKED — UNLOCK PARENT FIRST";

    } else if (shards < node.cost) {
      buyButton.textContent = "NOT ENOUGH SHARDS";

    } else {
      buyButton.textContent = "UNLOCK UPGRADE";
    }
  }
}

// ==========================================
// GATHER SHARDS
// ==========================================

document.getElementById("tapButton").addEventListener("click", () => {
  shards += tapPower;

  playSound("tap");
  animateTap();
  showFloatingShards(tapPower);

  updateUI();
  saveGame();
});

// ==========================================
// PASSIVE PRODUCTION
// ==========================================

setInterval(() => {
  shards += income;
  updateUI();
}, 1000);

// ==========================================
// AUTOMATIC SAVING
// ==========================================

setInterval(saveGame, 5000);

// ==========================================
// DEVELOPER MENU
// ==========================================

function createDeveloperMenu() {
  const devButton = document.createElement("button");

  devButton.id = "devToggle";
  devButton.textContent = "⚙ DEV";

  document.body.appendChild(devButton);

  const panel = document.createElement("section");

  panel.id = "devPanel";

  panel.innerHTML = `
    <h2>⚙ Developer Tools</h2>
    <p>Give yourself resources and test upgrades.</p>

    <input
      id="devAmount"
      type="number"
      min="0"
      value="10000"
      placeholder="Amount of shards"
    >

    <button id="devGive">Give Shards</button>
    <button id="devUnlock">Unlock Everything</button>
    <button id="devReset">Reset Progress</button>
    <button id="devClose">Close Menu</button>
  `;

  document.body.appendChild(panel);

  devButton.addEventListener("click", () => {
    playSound("menu");
    panel.classList.toggle("open");
  });

  document.getElementById("devClose").addEventListener("click", () => {
    playSound("menu");
    panel.classList.remove("open");
  });

  document.getElementById("devGive").addEventListener("click", () => {
    const amount = Math.max(
      0,
      Number(document.getElementById("devAmount").value) || 0
    );

    shards += amount;

    playSound("tap");
    updateUI();
    saveGame();
  });

  document.getElementById("devUnlock").addEventListener("click", () => {
    unlocked = upgrades.map(node => node.id);

    playSound("unlock");

    recalculateStats();
    updateUI();
    renderTree();
    showDetails();
    saveGame();
  });

  document.getElementById("devReset").addEventListener("click", () => {
    if (!confirm("Reset all Branchbound progress?")) return;

    shards = 0;
    unlocked = ["origin"];
    selectedNode = "origin";

    playSound("error");

    recalculateStats();
    updateUI();
    renderTree();
    showDetails();
    saveGame();
  });
}

// ==========================================
// START GAME
// ==========================================

loadGame();
createDeveloperMenu();
renderTree();
updateUI();
showDetails();
  
