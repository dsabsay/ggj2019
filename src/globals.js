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
};
