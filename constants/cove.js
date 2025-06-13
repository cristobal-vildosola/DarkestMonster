const coveS = { img: "original_img/cove/Monsters.png", x: 8, y: 4, zone: "cove" };
const coveL = { img: "original_img/cove/Bosses.png", x: 4, y: 3, zone: "cove" };

const cove = {
  pelagic_shaman: { level: 1, copies: 3, front: false, large: false, index: 0, ...coveS },
  drowned_thrall: { level: 1, copies: 3, front: true, large: false, index: 3, ...coveS },
  pelagic_grouper: { level: 1, copies: 3, front: true, large: false, index: 6, ...coveS },
  deep_stinger: { level: 1, copies: 3, front: false, large: false, index: 9, ...coveS },
  sea_maggot: { level: 1, copies: 3, front: true, large: false, index: 12, ...coveS },
  pelagic_guardian: { level: 1, copies: 2, front: true, large: false, index: 15, ...coveS },
  uca_major: { level: 2, copies: 2, front: true, large: true, index: 0, ...coveL },
  squiffy_gast: { level: 3, copies: 3, front: false, large: false, index: 19, ...coveS },
};
