const { createApp } = Vue;

const LOCAL_STORAGE_KEY = "DarkestMonsters";

function baseMonster() {
  return { wounds: 0, conditions: [], stunned: false };
}

createApp({
  data() {
    return {
      monsters: [],
      deck: Object.entries(allMonsters).map(([name, info]) => ({
        name: name,
        copies: info.copies,
        spawned: 0,
      })),

      addingConditions: 0,
      condition: "",
      turns: 0,
      editingConditions: 0,

      spawning: false,
      monster: "",

      settingDeck: false,
      zone: "",
      zonePool: Object.keys(zones),
      act: 0,
      editingDeck: false,

      conditions: conditions,
      monstersPool: Object.keys(allMonsters),
      allMonsters: allMonsters,
      zoom: 0.98,
    };
  },

  mounted() {
    this.loadGame();
  },
  watch: {
    monsters: {
      handler() {
        this.saveGame();
      },
      deep: true,
    },
    deck: {
      handler() {
        this.saveGame();
      },
      deep: true,
    },
  },

  computed: {
    numberSpawned() {
      return this.monsters.reduce((acc, m) => acc + (allMonsters[m.name].large ? 2 : 1), 0);
    },
    fillers() {
      return 4 - this.numberSpawned;
    },
    save() {
      return {
        monsters: this.monsters,
        deck: this.deck,
      };
    },
    opened() {
      return this.addingConditions || this.editingConditions || this.spawning || this.settingDeck || this.editingDeck;
    },
  },

  methods: {
    conditionCard(condition) {
      return {
        backgroundImage: `url(img/tokens/${condition}.webp)`,
      };
    },
    monsterCard(name) {
      if (!allMonsters[name]) return;
      const card = allMonsters[name];
      return {
        backgroundImage: `url('${card.img}')`,
        backgroundPosition: this.position(card.index, card.x, card.y),
        backgroundSize: `${card.x * 100}%`,
      };
    },
    // sprite position
    position(index, x_n, y_n) {
      const x = ((index % x_n) * 100) / (x_n - 1);
      const y = y_n == 1 ? 1 : (Math.floor(index / x_n) * 100) / (y_n - 1);
      return `${x}% ${y}%`;
    },

    addCondition() {
      this.monsters[this.addingConditions - 1].conditions.push({
        condition: this.condition,
        turns: this.turns,
      });
      this.monsters[this.addingConditions - 1].conditions.sort((a, b) => (a.condition < b.condition ? -1 : 1));
    },
    startTurn(i) {
      this.monsters[i].stunned = false;
      this.monsters[i].conditions.forEach((c) => {
        if (c.condition.startsWith("bl")) {
          this.wound(i, parseInt(c.condition.slice(-1)));
        }
        if (c.condition == "stun") {
          this.monsters[i].stunned = true;
        }
      });
      this.monsters[i].conditions = this.monsters[i].conditions
        .map((c) => ({ ...c, turns: c.turns - 1 }))
        .filter((c) => c.turns > 0);
    },
    removeCondition(i) {
      this.monsters[this.editingConditions - 1].conditions.splice(i, 1);
    },
    clearConditions() {
      this.monsters[this.editingConditions - 1].conditions = [];
      this.editingConditions = 0;
    },

    wound(i, x) {
      this.monsters[i].wounds = Math.max(this.monsters[i].wounds + x, 0);
    },
    kill(i) {
      this.monsters.splice(i, 1);
    },

    spawn() {
      if (this.numberSpawned < 4) {
        const name = this.monster ? this.monster : this.randomMonster();
        this.monsters.push({ name, ...baseMonster() });
        this.deck.forEach((x) => (x.spawned += x.name === name ? 1 : 0));
      }
      this.spawning = false;
      this.monster = "";
    },
    randomMonster() {
      const monsters = this.deck
        .filter((monster) => !allMonsters[monster.name].large || this.numberSpawned <= 2)
        .reduce((acc, monster) => acc.concat(Array(monster.copies - monster.spawned).fill(monster.name)), []);

      if (monsters.length == 0) {
        this.resetDeck();
        return this.randomMonster();
      }

      return monsters[(Math.random() * (monsters.length - 1)) | 0];
    },

    setUp() {
      this.deck = Object.entries({ ...common, ...zones[this.zone] })
        .filter(([_, info]) => info.level <= this.act)
        .map(([name, info]) => ({ name: name, copies: info.copies, spawned: 0 }));

      this.zone = "";
      this.act = 0;
      this.settingDeck = false;
    },
    resetDeck() {
      this.deck.forEach((m) => (m.spawned = 0));
    },

    closeModal() {
      this.addingConditions = 0;
      this.editingConditions = 0;
      this.spawning = false;
      this.settingDeck = false;
      this.editingDeck = false;
    },
    saveGame() {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.save));
    },
    loadGame() {
      const save = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
      if (save) {
        this.load(save);
      }
    },
    exportSave() {
      const save = JSON.stringify(this.save, null, 2);
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(save);
      const dlAnchorElem = document.getElementById("export");
      dlAnchorElem.setAttribute("href", dataStr);
      dlAnchorElem.setAttribute("download", `${LOCAL_STORAGE_KEY}.json`);
      dlAnchorElem.click();
    },
    importSave() {
      document.getElementById("import").click();
    },
    onFileUpload(event) {
      if (!event.target.files[0]) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const save = JSON.parse(event.target.result);
        this.load(save);
      };
      reader.readAsText(event.target.files[0]);
    },
    load(save) {
      this.monsters = save.monsters;
      this.deck = save.deck;
    },
  },
}).mount("#app");
