const ruinsS = { img: 'img/common/monsters.webp', x: 10, y: 7, zone: 'ruins' };
const ruinsL = { img: 'img/common/big.webp', x: 2, y: 2, zone: 'ruins' };

const ruins = {
  bone_soldier: { level: 1, copies: 3, front: true, large: false, index: 0, ...ruinsS },
  bone_courtier: { level: 1, copies: 3, front: false, large: false, index: 3, ...ruinsS },
  bone_arbalist: { level: 1, copies: 3, front: false, large: false, index: 6, ...ruinsS },
  bone_defender: { level: 1, copies: 2, front: true, large: false, index: 9, ...ruinsS },
  bone_captain: { level: 2, copies: 1, front: true, large: true, index: 0, ...original('bone_captain'), zone: 'ruins' },
  bone_spearman: { level: 2, copies: 3, front: true, large: false, index: 12, ...ruinsS },
  bone_bearer: { level: 3, copies: 3, front: false, large: false, index: 15, ...ruinsS },
};
