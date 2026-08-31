/* =========================================================
   room3d/state.js — 房间共享状态（全局变量，唯一声明处）
   ⚠️ DOM 元素 overlay/stage/house/closeBtn 在 main.js 的 DOMContentLoaded 里赋值
   ========================================================= */
'use strict';

/* DOM 元素引用（在 main.js 的 DOMContentLoaded 里赋值，避免加载时 DOM 未就绪） */
var overlay, stage, house, closeBtn;
var renderer, scene, camera, controls, raycaster, mouse;
var interactives = [];
var inited = false;
var skyMesh, sunMesh, moonMesh, starGroup, lampLight, lampMesh, lampOn = false;
var sunLight;
var catGroup, catTail, catHover = false, camAnim = null, sunspot = null, camAnimOnDone = null;
var chairSpin = null, chairHover = false;   /* 办公扶手椅：鼠标触碰旋转 */
var timeOfDay = 14;
var _todM = (window.location.search || '').match(/tod=(\d+(?:\.\d+)?)/);
if (_todM) timeOfDay = parseFloat(_todM[1]);
var skyAuto = false;
var _texCache = {};
