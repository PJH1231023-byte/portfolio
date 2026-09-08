/* Free, clear-only ticket drops. The streak is shared across all chapters. */
(() => {
  'use strict';
  function chance(index) {
    const level=Math.max(0,Math.min(9,Math.floor(Number(index)||0)));
    return level<3?.25:level<7?.35:.45;
  }
  function rollTicket(index,dryStreak=0,random=Math.random) {
    const streak=Math.max(0,Math.min(3,Math.floor(Number(dryStreak)||0)));
    const guaranteed=streak>=3;
    const baseChance=chance(index);
    const dropped=guaranteed||random()<baseChance;
    return {count:dropped?1:0,guaranteed,baseChance,nextStreak:dropped?0:streak+1};
  }
  window.DreamRewards=Object.freeze({chance,rollTicket});
})();
