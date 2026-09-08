(function(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PicnicCampaign = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  'use strict';
  const levels = [
    { name: '第一次碰头', target: 1, count: 1, moves: 12 },
    { name: '好事成双', target: 2, count: 2, moves: 20 },
    { name: '新朋友来了', target: 3, count: 1, moves: 22 },
    { name: '挨在一起坐', target: 3, count: 2, moves: 24 },
    { name: '分享小幸福', target: 4, count: 1, moves: 26 },
    { name: '软乎乎的拥抱', target: 5, count: 1, moves: 28 },
    { name: '热闹野餐日', target: 6, count: 1, moves: 30 },
    { name: '全员大合照', target: 7, count: 1, moves: 32 }
  ];
  function seed(world, index) {
    // Seed only a new run. Later chapters keep the existing board and queue.
    world.add(0, 135, 325); world.add(0, 187, 325);
    world.add(0, 305, 326); world.add(0, 357, 326);
    world.add(1, 237, 409);
    world.add(0, 113, 456); world.add(0, 352, 457);
    return { current: 0, next: 1, highest: 1 };
  }
  // The suggested move budget awards stars; it no longer ends a run.
  function stars(shots, limit) { return shots <= Math.ceil(limit * .4) ? 3 : shots <= Math.ceil(limit * .7) ? 2 : 1; }
  function outcome(level, progress, shots, crossedLine) {
    if (progress >= level.count) return 'won';
    if (crossedLine) return 'lost';
    return 'playing';
  }
  return { levels, seed, stars, outcome };
});
