
let shards = 0;
let income = 0;
let tapPower = 1;

const upgrades = [
  {
    id: 1,
    name: "⚡ Stronger Core",
    description: "Double your tap power.",
    cost: 25,
    buy() {
      tapPower *= 2;
    }
  },
  {
    id: 2,
    name: "💎 Shard Generator",
    description: "Generate 1 shard every second.",
    cost: 75,
    buy() {
      income += 1;
    }
  },
  {
    id: 3,
    name: "🔮 Energy Engine",
    description: "Generate 5 shards every second.",
    cost: 250,
    buy() {
      income += 5;
    }
  },
  {
    id: 4,
    name: "🌌 Power Surge",
    description: "Triple your tap power.",
    cost: 600,
    buy() {
      tapPower *= 3;
    }
  }
];

const shardsDisplay = document.getElementById("shards");
const incomeDisplay = document.getElementById("income");
const tapButton = document.getElementById("tapButton");
const upgradeTree = document.getElementById("upgradeTree");

function updateUI() {
  shardsDisplay.textContent = Math.floor(shards);
  incomeDisplay.textContent = income;

  document.querySelectorAll(".upgrade").forEach((element, index) => {
    const button = element.querySelector("button");
    button.disabled = shards < upgrades[index].cost;
  });
}

function renderUpgrades() {
  upgradeTree.innerHTML = "";

  upgrades.forEach((upgrade, index) => {
    const card = document.createElement("div");
    card.className = "upgrade";

    card.innerHTML = `
      <h3>${upgrade.name}</h3>
      <p>${upgrade.description}</p>
      <p>Cost: ${upgrade.cost} shards</p>
      <button>Unlock</button>
    `;

    card.querySelector("button").addEventListener("click", () => {
      if (shards >= upgrade.cost) {
        shards -= upgrade.cost;
        upgrade.buy();

        upgrades.splice(index, 1);
        renderUpgrades();
        updateUI();
      }
    });

    upgradeTree.appendChild(card);
  });
}

tapButton.addEventListener("click", () => {
  shards += tapPower;
  updateUI();
});

setInterval(() => {
  shards += income;
  updateUI();
}, 1000);

renderUpgrades();
updateUI();
