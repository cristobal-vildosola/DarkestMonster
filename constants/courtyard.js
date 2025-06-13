const crimsonS = { img: 'img/courtyard/crimsonS.webp', x: 9, y: 5, zone: 'courtyard' };
const crimsonL = { img: 'img/courtyard/crimsonL.webp', x: 4, y: 2, zone: 'courtyard' };

const courtyard = {
  manservant: { level: 1, copies: 3, front: true, large: false, index: 0, ...crimsonS },
  esquire: { level: 1, copies: 3, front: true, large: false, index: 3, ...crimsonS },
  supplicant: { level: 1, copies: 3, front: true, large: false, index: 6, ...crimsonS },
  gatekeeper: { level: 1, copies: 3, front: true, large: false, index: 9, ...crimsonS },
  sycophant: { level: 1, copies: 3, front: false, large: false, index: 12, ...crimsonS },
  courtesan: { level: 2, copies: 3, front: true, large: false, index: 15, ...crimsonS },
  chevalier: { level: 2, copies: 3, front: false, large: false, index: 18, ...crimsonS },
  crocodilian: { level: 3, copies: 1, front: false, large: true, index: 0, ...crimsonL },
};
