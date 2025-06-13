const darkestS = { img: 'img/common/darkest.webp', x: 6, y: 7, zone: 'darkest' };
const darkestS2 = { img: 'img/common/monstersF.webp', x: 10, y: 7, zone: 'darkest' };
const darkestL = { img: 'img/common/Bosses.webp', x: 4, y: 3, zone: 'darkest' };

const darkest = {
  ascended_brawler: { level: 3, copies: 3, front: true, large: false, index: 63, ...darkestS2 },
  ascended_witch: { level: 3, copies: 3, front: false, large: false, index: 66, ...darkestS2 },
  rapturous_cultist: { level: 3, copies: 3, front: true, large: false, index: 69, ...darkestS2 },
  cultist_priest: { level: 3, copies: 3, front: true, large: false, index: 2, ...darkestS },
  malignant_growth: { level: 3, copies: 3, front: true, large: false, index: 5, ...darkestS },
  flesh_hound: { level: 3, copies: 2, front: true, large: false, index: 8, ...darkestS },
  polyp: { level: 3, copies: 3, front: false, large: false, index: 10, ...darkestS },
  antibody: { level: 3, copies: 3, front: false, large: false, index: 13, ...darkestS },
  defensive_growth: { level: 3, copies: 3, front: false, large: false, index: 16, ...darkestS },
};

const darkestBosses = {
  ascended_brawler: { level: 3, copies: 3, front: true, large: false, index: 19, ...darkestS },
};
