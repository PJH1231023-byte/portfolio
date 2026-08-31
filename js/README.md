# darktech/js — 作品集 3D 房间 模块化目录

> 由 `script.js`（原 2298 行单体）按功能拆分。改动某个东西时，先对照本目录找到对应文件，**只改该文件**，不要再全量覆盖。

## 目录树

```
darktech/
├─ index.html            ← 入口，按依赖顺序加载下方 js（改引用看这里）
└─ js/
   ├─ README.md          ← 本文件（目录大纲）
   │
   ├─ data/                          【作品数据】
   │  └─ works.js                    workDetails + keychainWorks（含奥德赛）；改作品列表/钥匙扣只动它
   │
   ├─ site/                          【主站页面交互】
   │  └─ site.js                     加载动画/星云/视差/主题切换/作品浮窗/钥匙扣板/头像跟随
   │
   └─ room3d/                        【3D 房间】
      ├─ state.js                    房间共享状态（全局变量唯一声明处：renderer/scene/camera/controls/
      │                              猫狗变量 cat*、timeOfDay、灯光、DOM 引用）
      ├─ utils.js                    roundedBox / flyTo（运镜）等通用工具
      ├─ textures.js                 全部程序化纹理：天空/木纹/墙面/地毯/洞洞板/月亮/星星/桌面 + 法线缓存
      │
      ├─ space.js                    buildRoom 房间框架（地板/墙/天花板/窗框/门框/踢脚线等空间本体）
      ├─ sky.js                      buildSky 天空穹顶 + buildSunspot 太阳
      ├─ filter.js                   光线滤镜 updateSky / toggleLamp / bindSkyControls（天色/台灯控制）
      │
      ├─ furniture/                  【每件家具一个文件】
      │  ├─ rug.js                   圆形地毯
      │  ├─ desk.js                  书桌 + 显示器
      │  ├─ chair.js                 办公椅
      │  ├─ pegboard.js              洞洞板
      │  ├─ photos.js                照片墙
      │  ├─ trophy.js                奖杯
      │  ├─ plant.js                 绿植
      │  ├─ shelf.js                 书架
      │  ├─ sofa.js                  沙发
      │  ├─ coffee-table.js          茶几
      │  ├─ dog.js                   金毛（趴睡 3D 造型 + 悬停反馈 catGroup/catTail/catHover）
      │  ├─ bear.js                  泰迪熊
      │  ├─ sunspot.js               太阳光斑
      │  ├─ window.js                窗户（视作家具）
      │  ├─ avatar.js                3D 头像
      │  └─ lamp.js                  落地灯
      │
      └─ interaction/                【交互】
         ├─ picker.js                点击拾取 onPick / 金毛悬停 / 物品浮窗触发
         ├─ computer.js              电脑屏幕 open/close + 桌面图标绑定
         ├─ info.js                  物品信息气泡 ITEM_INFO 文案 + openItemInfo/closeItemInfo
         └─ panels.js                房间面板：人物/照片墙/作品墙 + 贪吃蛇小游戏
      │
      └─ main.js                     init 入口 / animate 动画循环 / onResize / openRoom/closeRoom /
                                     autoclick 直达 / selftest 自测 / 全局绑定
```

## 常见改动对照（先查这里再动手）

| 想改什么 | 去哪个文件 |
|---|---|
| 作品列表 / 作品封面 / 钥匙扣 | `js/data/works.js` |
| 窗外的天色、台灯、自动流转 | `js/room3d/filter.js` |
| 房间的墙/地板/天花板/窗框 | `js/room3d/space.js` |
| 金毛的长相/睡姿/颜色 | `js/room3d/furniture/dog.js` |
| 泰迪熊 | `js/room3d/furniture/bear.js` |
| 家具点击后的说明文字 | `js/room3d/interaction/info.js`（ITEM_INFO） |
| 电脑里的内容 / 打开方式 | `js/room3d/interaction/computer.js` |
| 点人像/照片墙/作品墙的面板、贪吃蛇 | `js/room3d/interaction/panels.js` |
| 初始视角/进入房间的镜头 | `js/room3d/utils.js`（flyTo）|
| 进入/退出房间、自测开关 | `js/room3d/main.js` |

## 约定

- 所有文件在 `index.html` 里**按顺序**用 `<script>` 加载（普通脚本，非 ES Module），函数互相直接调用。
- `state.js` 是全局变量的**唯一声明处**；新增共享变量先加在 state.js。
- 家具统一是 `build*()` 函数，返回 3D 对象；颜色/材质直接写在对应家具文件里。
- 环境里**没有橘猫**；`catGroup/catTail/catHover` 这些变量名是金毛在用的（勿删）。
- 窗外景色（蓝天白云远山）在 `space.js` + `filter.js`，随天色联动变色，保留不覆盖。
