import { level1 } from './level1.js';
import { level2 } from './level2.js';
import { level3 } from './level3.js';

/* Globals */

export default {
  player1: null,
  platforms: [],
  apples: new Set(),
  tinyLeaves: [],
  pickupOffsetX: null,
  pickupOffsetY: null,
  nextLeafAt: 50,
  nextCloudAt: 20,
  leaves: [],
  clouds: [],
  startTileX: -1,
  startTileY: -1,
  startSlotNum: -1,
  pickup: -1,
  tiles: [],
  background: null,
  level: 1,
  levels: [level1, level2, level3],
  bgMusic: null,
  jumpSound: null,
  landSound: null,
  walkSound: null,
  pickupSound: null,
  resetButton: null,
  myGameArea: null,
  images: {
    tiles: {
      "Tile1": null,
      "Tile2": null,
      "Tile3": null,
      "Tile4": null,
      "Tile5": null,
      "Tile6": null,
      "Tile7": null,
      "Tile8": null,
    },
    items: {
      "Apple1": null,
      "Apple2": null,
      "Apple3": null,
    },
    environment: {
      "HouseClosed": null,
      "HouseOpen": null,
      "Leaf": null,
      "Cloud1": null,
      "Cloud2": null,
      "Cloud3": null,
      "Background": null,
    },
    "ui": {
      "RestartButton": null,
    },
  },
};
