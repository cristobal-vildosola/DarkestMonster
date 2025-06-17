const { createApp } = Vue;

const LOCAL_STORAGE_KEY = 'DarkestMonsters';

function baseMonster() {
  return { wounds: 0, conditions: [], stunned: false, playing: false };
}

createApp({
  data() {
    return {
      monsters: [],
      deck: Object.entries({ ...common, ...ruins }).map(([name, info]) => ({
        name: name,
        copies: info.copies,
        spawned: 0,
      })),
      zone: 'ruins',
      act: 1,
      round: 1,

      editingConditions: 0,
      condition: '',
      turns: 0,

      spawning: false,
      spawningBoss: false,
      zones,
      monster: '',
      copies: 0,

      editingDeck: false,
      zonePool: Object.keys(zones).filter((x) => x !== 'common'),

      conditions,
      allMonsters,
      bosses,
      zoom: 0.98,
      music: 'The Hamlet',
      videos,
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
    zone() {
      this.saveGame();
    },
    act() {
      this.saveGame();
    },
    round() {
      this.saveGame();
    },
  },

  computed: {
    numberSpawned() {
      return this.monsters.reduce((acc, m) => acc + (allMonsters[m.name].large ? 2 : 1), 0);
    },
    fillers() {
      return 4 - this.numberSpawned;
    },
    opened() {
      return this.editingConditions || this.spawning || this.spawningBoss || this.editingDeck;
    },
    zoneMonsters() {
      const monsters = { ...zones[this.zone], ...common };
      return Object.entries(monsters)
        .filter(([_, info]) => info.level <= this.act)
        .map(([name, _]) => name);
    },
    zoneBosses() {
      if (!this.zone) return Object.keys(allBosses);

      const pool = Object.keys(this.bosses[this.zone] || {});
      if (this.zone == 'darkest_dungeon' || !this.act) return pool;

      return pool.filter((x) => x.includes(this.act || ''));
    },
    videoId() {
      return videos[this.music];
    },
    save() {
      return {
        monsters: this.monsters,
        deck: this.deck,
        zone: this.zone,
        act: this.act,
        round: this.round,
      };
    },
  },

  methods: {
    conditionCard(condition) {
      return {
        backgroundImage: `url(img/tokens/${condition}.webp)`,
      };
    },
    monsterCard(index) {
      const monster = this.monsters[index];
      if (!allMonsters[monster.name]) return;

      let card = allMonsters[monster.name];
      if (monster.name == 'rapturous_cultist' && monster.rep == 2) card = rapturous_cultist_extra;

      return {
        backgroundImage: `url('${card.img}')`,
        backgroundPosition: this.position(card.index + monster.rep, card.x, card.y),
        backgroundSize: `${card.x * 100}%`,
      };
    },
    // sprite position
    position(index, x_n, y_n) {
      const x = ((index % x_n) * 100) / (x_n - 1);
      const y = y_n == 1 ? 1 : (Math.floor(index / x_n) * 100) / (y_n - 1);
      return `${x}% ${y}%`;
    },

    format(text) {
      return text
        .split('_')
        .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
        .join(' ');
    },
    formatBoss(text) {
      return this.format(text).substring(0, text.length - (this.zone == 'darkest_dungeon' ? 0 : 2));
    },

    addCondition() {
      const index = this.editingConditions - 1;

      if (['push', 'pull'].includes(this.condition)) {
        const removed = this.monsters.splice(index, 1);
        const dest = this.clamp(index + (this.condition == 'push' ? this.turns : -this.turns), 0, this.monsters.length);
        this.monsters.splice(dest, 0, ...removed);
        this.editingConditions = dest + 1;
        return;
      }

      this.monsters[index].conditions.push({
        condition: this.condition,
        turns: this.turns,
      });
      this.monsters[index].conditions.sort((a, b) => (a.condition < b.condition ? -1 : 1));
    },
    nextTurn() {
      if (!this.monsters.length) return;

      this.monsters.forEach((m) => {
        m.playing = false;
        m.stunned = false;
      });
      const index = this.monsters.findIndex((m) => m.turns > 0);

      // start next round
      if (index < 0) {
        this.round += 1;
        this.monsters.forEach((m) => (m.turns = allMonsters[m.name].actions || 1));

        // update baron actions
        this.monsters.filter((m) => m.name.startsWith('baron')).forEach((m) => (m.turns = 5 - this.monsters.length));
        return this.nextTurn();
      }
      this.startTurn(index);
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
      this.monsters[i].turns -= 1;
      this.monsters[i].playing = true;
    },
    removeCondition(i) {
      this.monsters[this.editingConditions - 1].conditions.splice(i, 1);
    },
    clearConditions() {
      this.monsters[this.editingConditions - 1].conditions = [];
      this.editingConditions = 0;
    },

    wound(i, x) {
      this.monsters[i].wounds = this.clamp(this.monsters[i].wounds + x);
    },
    kill(i) {
      this.monsters.splice(i, 1);
      if (!this.monsters.length) this.round = 1;
    },
    clamp(x, min = 0, max = 1000) {
      return Math.max(Math.min(x, max), min);
    },

    monsterInfo(name) {
      const turns = allMonsters[name].actions || 1;
      return { name, rep: this.monsterRep(name), turns, ...baseMonster() };
    },
    monsterRep(name) {
      let rep = 0;
      while (this.monsters.find((x) => x.name == name && x.rep == rep)) rep++;
      return rep;
    },
    enterRoom() {
      this.round = 1;
      let name,
        index,
        back = 0,
        front = 0,
        lastSpawned = '';

      while (this.numberSpawned < 4) {
        name = this.randomMonster();
        const monster = this.monsterInfo(name);

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

        this.monsters.push(this.monsterInfo(name));
        this.deck.forEach((x) => (x.spawned += x.name === name ? 1 : 0));

        // update baron actions
        this.monsters.filter((m) => m.name.startsWith('baron')).forEach((m) => (m.turns = this.clamp(m.turns - 1)));
      }
      this.closeModal();
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
    spawnBoss() {
      this.monsters.push(this.monsterInfo(this.monster));
    },

    setUp() {
      let monsters = { ...zones[this.zone], ...common };
      if (this.zone == 'darkest_dungeon') {
        monsters = darkest_dungeon;
        this.act = 3;
      }

      this.deck = Object.entries(monsters)
        .filter(([_, info]) => info.level <= this.act)
        .map(([name, info]) => ({ name: name, copies: info.copies, spawned: 0 }));
    },
    resetDeck() {
      this.deck.forEach((m) => (m.spawned = 0));
    },
    addToDeck() {
      this.deck.push({ name: this.monster, copies: this.copies, spawned: 0 });
      this.monster = '';
    },
    remove(index) {
      this.deck.splice(index, 1);
    },
    removeLevel1() {
      this.deck.forEach((m) => {
        const info = allMonsters[m.name];
        if (info.level === 1 && !info.large) m.copies = this.clamp(m.copies - 1, 1);
      });
    },

    closeModal() {
      this.editingConditions = 0;
      this.spawning = false;
      this.spawningBoss = false;
      this.editingDeck = false;
      this.monster = '';
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
      this.zone = save.zone;
      this.act = save.act;
      this.round = save.round;
    },
  },
}).mount('#app');
