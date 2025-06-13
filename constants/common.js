const commonS = { img: "img/common/monsters.webp", x: 10, y: 7, zone: "common" };
const CommonSFrench = { img: "img/common/monstersF.webp", x: 10, y: 7, zone: "common" };
const commonL = { img: "img/common/big.webp", x: 2, y: 2, zone: "common" };
const original = (name) => ({ img: `img/common/${name}.webp`, x: 1, y: 1, zone: "common" });

const common = {
  cultist_brawler: { level: 1, copies: 3, front: true, large: false, index: 18, ...commonS },
  cultist_acolyte: { level: 1, copies: 3, front: false, large: false, index: 21, ...commonS },
  brigand_cutthroat: { level: 1, copies: 3, front: true, large: false, index: 24, ...commonS },
  brigand_fusilier: { level: 1, copies: 3, front: false, large: false, index: 27, ...commonS },
  brigand_bloodletter: { level: 1, copies: 1, front: true, large: true, index: 0, ...original("bloodletter") },
  maggot: { level: 1, copies: 3, front: true, large: false, index: 31, ...commonS },
  webber: { level: 1, copies: 3, front: false, large: false, index: 34, ...commonS },
  spitter: { level: 1, copies: 3, front: false, large: false, index: 37, ...commonS },
  bone_rabble: { level: 1, copies: 3, front: true, large: false, index: 40, ...commonS },
  madman: { level: 1, copies: 3, front: false, large: false, index: 43, ...commonS },
  pliskin: { level: 1, copies: 3, front: true, large: false, index: 46, ...commonS },
  ghoul: { level: 2, copies: 1, front: true, large: true, index: 0, ...original("ghoul") },
  gargoyle: { level: 2, copies: 3, front: true, large: false, index: 0, ...original("gargoyle") },
  rattler: { level: 2, copies: 3, front: true, large: false, index: 0, ...original("rattler") },
  brigand_raider: { level: 3, copies: 3, front: true, large: false, index: 56, ...CommonSFrench },
  brigand_hunter: { level: 3, copies: 3, front: false, large: false, index: 59, ...CommonSFrench },
  adler: { level: 3, copies: 1, front: true, large: true, index: 3, ...commonL },
};
