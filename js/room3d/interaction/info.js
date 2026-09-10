/* =========================================================
   interaction/info.js — 物品信息气泡
   ITEM_INFO：物品点击弹窗文案（改文案只动这里）
   openItemInfo / closeItemInfo / bindItemInfo（DOM 就绪后绑定关闭）
   ========================================================= */
'use strict';

/* 物品信息文案（狗 / 熊 / 绿植 / 书架） */
var ITEM_INFO = {
  dog: { title: '我的金毛 · 睡午觉', body: '它趴在泰迪熊身边睡得正香，脑袋枕着熊的脚掌，耳朵耷拉着，是家里最治愈的小管家。' },
  bear: { title: '泰迪熊玩偶', body: '靠在墙边的浅棕色泰迪熊，是我的童年伙伴，也是金毛最好的靠枕。' },
  plant: { title: '我的绿植', body: '角落的绿植给房间添了生机——创作要像植物一样，向下扎根、向上生长。' },
  shelf: { title: '我的小书架', body: '多层书架摆满了我爱看的书——灵感都藏在这些书页里。' }
};

function openItemInfo(key) {
  var info = document.getElementById('itemInfo');
  if (!info) return;
  var d = ITEM_INFO[key] || { title: key, body: '' };
  var t = document.getElementById('itemInfoTitle'); if (t) t.textContent = d.title;
  var b = document.getElementById('itemInfoBody'); if (b) b.textContent = d.body;
  info.classList.add('is-open');
  info.setAttribute('aria-hidden', 'false');
}

function closeItemInfo() {
  var info = document.getElementById('itemInfo');
  if (!info) return;
  info.classList.remove('is-open');
  info.setAttribute('aria-hidden', 'true');
}

/* 关闭按钮/点击遮罩关闭：DOM 就绪后绑定 */
document.addEventListener('DOMContentLoaded', function () {
  (function bindItemInfo() {
    var info = document.getElementById('itemInfo');
    if (!info) return;
    var cb = document.getElementById('itemInfoClose');
    if (cb) cb.addEventListener('click', closeItemInfo);
    info.addEventListener('click', function (e) {
      if (e.target === info) closeItemInfo();
    });
  })();
});
