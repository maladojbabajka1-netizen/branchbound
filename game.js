
let shards = 0;
let income = 0;
let tapPower = 1;
let selectedNode = "origin";

const upgrades = [
  {
    id: "origin",
    name: "✦ ORIGIN",
    x: 300, y: 430,
    cost: 0,
    description: "The beginning of your progression.",
    effect: "+1 shard per tap",
    parents: [],
    apply() {}
  },
  {
    id: "spark",
    name: "⚡ SPARK",
    x: 300, y: 310,
    cost: 25,
    description: "Strengthen your core.",
    effect: "Double tap power",
    parents: ["origin"],
    apply() { tapPower *= 2; }
  },
  {
    id: "drip",
    name: "💎 DRIP",
    x: 150, y: 190,
    cost: 75,
    description: "Create a passive shard stream.",
    effect: "+1 shard per second",
    parents: ["spark"],
    apply() { income += 1; }
  },
  {
    id: "focus",
    name: "🔮 FOCUS",
    x: 450, y: 190,
    cost: 100,
    description: "Increase your core's energy.",
    effect: "Triple tap power",
    parents: ["spark"],
    apply() { tapPower *= 3; }
  },
  {
    id: "engine",
    name: "⚙️ ENGINE",
    x: 150, y: 70,
    cost: 250,
    description: "Boost passive production.",
    effect: "+5 shards per second",
    parents: ["drip"],
    apply() { income += 5; }
  },
  {
    id: "echo",
    name: "✧ ECHO",
    x: 450, y: 70,
    cost: 300,
    description: "Make every tap more powerful.",
    effect: "Double tap power",
    parents: ["focus"],
    apply() { tapPower *= 2; }
  }
];

let unlocked = ["origin"];

const shardsDisplay = document.getElementById("shards");
const incomeDisplay = document.getElementById("income");
const tree = document.getElementById("nodes");
const connections = document.getElementById("connections");
const buyButton = document.getElementById("buyButton");

function getNode(id) {
  return upgrades.find(node => node.id === id);
}

function isUnlocked(id) {
  return unlocked.includes(id);
}

function isAvailable(node) {
  return node.parents.length > 0 &&
    node.parents.every(parent => isUnlocked(parent)) &&
    !isUnlocked(node.id);
}

function renderTree() {
  tree.innerHTML = "";
  connections.innerHTML = "";

  upgrades.forEach(node => {
    node.parents.forEach(parentId => {
      const parent = getNode(parentId);

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

  upgrades.forEach(node => {
    const button = document.createElement("button");

    button.className = "node";
    button.textContent = node.name;

    button.style.left = node.x + "px";
    button.style.top = node.y + "px";

    if (isUnlocked(node.id)) {
      button.classList.add("unlocked");
    } else if (isAvailable(node)) {
      button.classList.add("available");
    } else {
      button.disabled = true;
    }

    button.addEventListener("click", () => {
      selectedNode = node.id;
      showDetails();
    });

    tree.appendChild(button);
  });
}

function showDetails() {
  const node = getNode(selectedNode);

  document.getElementById("details")?.remove();

  const details = document.createElement("section");
  details.id = "details";
  details.className = "details";

  details.innerHTML = `
    <h3>${node.name}</h3>
    <p>${node.description}</p>
    <p>${node.effect}</p>
    <p>Cost: ${node.cost} shards</p>
    <button id="buyButton">Unlock</button>
  `;

  document.querySelector("main").appendChild(details);

  const button = document.getElementById("buyButton");

  if (isUnlocked(node.id)) {
    button.textContent = "Unlocked";
    button.disabled = true;
  } else if (!isAvailable(node) || shards < node.cost) {
    button.textContent = "Locked";
    button.disabled = true;
  }

  button.addEventListener("click", () => buyUpgrade(node));
}

function buyUpgrade(node) {
  if (!isAvailable(node) || shards < node.cost) return;

  shards -= node.cost;
  unlocked.push(node.id);
  node.apply();

  updateUI();
  renderTree();
  showDetails();
}

function updateUI() {
  shardsDisplay.textContent = Math.floor(shards);
  incomeDisplay.textContent = income;
}

document.getElementById("tapButton").addEventListener("click", () => {
  shards += tapPower;
  updateUI();
  showDetails();
});

setInterval(() => {
  shards += income;
  updateUI();
  showDetails();
}, 1000);

renderTree();
updateUI();
showDetails();
