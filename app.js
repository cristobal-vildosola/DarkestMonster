const { createApp } = Vue;

const LOCAL_STORAGE_KEY = 'DarkestMonsters';

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

      editingConditions: 0,
      condition: '',
      turns: 0,

      spawning: false,
      zones: zones,
      monster: '',
      copies: 0,

      editingDeck: false,
      zone: '',
      zonePool: Object.keys(zones),
      act: 0,

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
      return this.editingConditions || this.spawning || this.editingDeck;
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
      const index = this.editingConditions - 1;

      if (['push', 'pull'].includes(this.condition)) {
        const removed = this.monsters.splice(index, 1);
        const dest = index + (this.condition == 'push' ? this.turns : -this.turns);
        this.monsters.splice(dest, 0, ...removed);
        this.editingConditions = Math.max(Math.min(dest + 1, this.monsters.length), 1);
        return;
      }

      this.monsters[index].conditions.push({
        condition: this.condition,
        turns: this.turns,
      });
      this.monsters[index].conditions.sort((a, b) => (a.condition < b.condition ? -1 : 1));
    },
    startTurn(i) {
      this.monsters[i].stunned = false;
      this.monsters[i].conditions.forEach((c) => {
        if (c.condition.startsWith('bl')) {
          this.wound(i, parseInt(c.condition.slice(-1)));
        }
        if (c.condition == 'stun') {
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

    enterRoom() {
      let name,
        index,
        back = 0,
        front = 0,
        lastSpawned = '';

      while (this.numberSpawned < 4) {
        name = this.randomMonster();
        const monster = { name, ...baseMonster() };

        // remove last small added if necessary
        if (allMonsters[name].large && this.numberSpawned == 3) {
          if (allMonsters[lastSpawned].front) {
            index = this.monsters.findLastIndex((x) => x.name === lastSpawned);
            front -= 1;
          } else {
            index = this.monsters.findIndex((x) => x.name === lastSpawned);
            back -= 1;
          }
          this.monsters.splice(index, 1);
        }

        if (allMonsters[name].front) {
          this.monsters.splice(front, 0, monster);
          front += 1;
        } else {
          this.monsters.splice(this.monsters.length - back, 0, monster);
          back += 1;
        }

        this.deck.forEach((x) => (x.spawned += x.name === name ? 1 : 0));
        if (!allMonsters[name].large) lastSpawned = name;
      }
    },
    spawn() {
      if (this.numberSpawned < 4) {
        let name = this.monster ? this.monster : this.randomMonster();

        // avoid large monsters when no more room available
        while (!this.monster && allMonsters[name].large && this.numberSpawned > 2) {
          name = this.randomMonster();
        }

        this.monsters.push({ name, ...baseMonster() });
        this.deck.forEach((x) => (x.spawned += x.name === name ? 1 : 0));
      }
      this.spawning = false;
      this.monster = '';
    },
    randomMonster() {
      const monsters = this.deck.reduce(
        (acc, monster) => acc.concat(Array(monster.copies - monster.spawned).fill(monster.name)),
        []
      );
      if (monsters.length == 0) {
        this.resetDeck();
        return this.randomMonster();
      }
      return monsters[(Math.random() * (monsters.length - 1)) | 0];
    },

    setUp() {
      let monsters = { ...common, ...zones[this.zone] };
      if (this.zone == 'darkest') {
        monsters = darkest;
        this.level = 3;
      }

      this.deck = Object.entries(monsters)
        .filter(([_, info]) => info.level <= this.act)
        .map(([name, info]) => ({ name: name, copies: info.copies, spawned: 0 }));

      this.zone = '';
      this.act = 0;
    },
    resetDeck() {
      this.deck.forEach((m) => (m.spawned = 0));
    },
    addToDeck() {
      this.deck.push({ name: this.monster, copies: this.copies, spawned: 0 });
      this.monster = '';
      this.copies = 0;
    },
    remove(index) {
      this.deck.splice(index, 1);
    },
    removeLevel1() {
      this.deck.forEach((m) => {
        const info = allMonsters[m.name];
        if (info.level === 1 && !info.large) m.copies = Math.max(1, m.copies - 1);
      });
    },
    resetSpawned() {
      this.deck.forEach((m) => (m.spawned = 0));
    },

    closeModal() {
      this.editingConditions = 0;
      this.spawning = false;
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
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(save);
      const dlAnchorElem = document.getElementById('export');
      dlAnchorElem.setAttribute('href', dataStr);
      dlAnchorElem.setAttribute('download', `${LOCAL_STORAGE_KEY}.json`);
      dlAnchorElem.click();
    },
    importSave() {
      document.getElementById('import').click();
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
}).mount('#app');
