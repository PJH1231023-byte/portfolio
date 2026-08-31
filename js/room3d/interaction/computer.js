/* =========================================================
   interaction/computer.js — 电脑弹窗：open/closeComputerScreen + bindComputerIcons
   贪吃蛇游戏在 panels.js
   ========================================================= */
'use strict';

function openComputerScreen() {
  var cs = document.getElementById('computerScreen');
  if (!cs) return;
  cs.classList.add('is-open');
  cs.setAttribute('aria-hidden', 'false');
}

function closeComputerScreen() {
  var cs = document.getElementById('computerScreen');
  if (!cs) return;
  cs.classList.remove('is-open');
  cs.setAttribute('aria-hidden', 'true');
}

function bindComputerIcons() {
  var cs = document.getElementById('computerScreen');
  if (!cs) return;
  cs.querySelectorAll('[data-target]').forEach(function (ic) {
    ic.addEventListener('click', function () {
      var target = ic.getAttribute('data-target');
      if (target === 'resume' && window.openPerson) window.openPerson();
      else if (target === 'game' && window.openGame) window.openGame();
      else if (target === 'project' && window.openWall) window.openWall();
    });
  });
  var closeBtn2 = document.getElementById('computerClose');
  if (closeBtn2) closeBtn2.addEventListener('click', closeComputerScreen);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && cs.classList.contains('is-open')) {
      closeComputerScreen();
      e.stopImmediatePropagation();
    }
  }, true);
}

/* 物品信息浮窗（狗 / 绿植 / 奖杯） */
var ITEM_INFO = {
  dog: { title: '我的金毛 · 睡午觉', body: '它趴在泰迪熊身边睡得正香，脑袋枕着熊的脚掌，耳朵耷拉着，是家里最治愈的小管家。' },
  bear: { title: '泰迪熊玩偶', body: '靠在墙边的浅棕色泰迪熊，是我的童年伙伴，也是金毛最好的靠枕。' },
  plant: { title: '我的绿植', body: '角落的绿植给房间添了生机——创作要像植物一样，向下扎根、向上生长。' },
  shelf: { title: '我的小书架', body: '多层书架摆满了我爱看的书——灵感都藏在这些书页里。' }
};
