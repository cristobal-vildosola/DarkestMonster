const warrensS = { img: 'img/warrens/warren_monster.webp', x: 7, y: 5, zone: 'warrens' };
const warrensL = { img: 'img/warrens/warren_Boss.webp', x: 4, y: 2, zone: 'warrens' };

const warrens = {
  swine_chopper: { level: 1, copies: 3, front: true, large: false, index: 0, ...warrensS },
  swine_slasher: { level: 1, copies: 3, front: true, large: false, index: 3, ...warrensS },
  swine_wretch: { level: 1, copies: 3, front: false, large: false, index: 6, ...warrensS },
  swine_drummer: { level: 1, copies: 3, front: false, large: false, index: 9, ...warrensS },
  carrion_eater: { level: 1, copies: 3, front: true, large: false, index: 12, ...warrensS },
  large_carrion_eater: { level: 2, copies: 1, front: true, large: false, index: 15, ...warrensS },
  swinetaur: { level: 2, copies: 1, front: true, large: true, index: 0, ...warrensL },
  swine_skiver: { level: 3, copies: 2, front: false, large: false, index: 17, ...warrensS },
};
