# 精灵漫游 — 阵容与制作基准

## 本次确认

最新配色已确认：主角组整体鲜艳明亮，怪物组相对暗沉。12 正式使用奶油杏色身体、海蓝薄荷晶甲、香槟金边和蜜桃粉晶角；参考 assets/hero-12-bright-palette-v1.png。旧整合图不再作为12配色基准。

主角固定为 03、04、09、10、12；怪物固定为 05、06、07、08、11。01、02 退出阵容，不再新增角色。保留原编号，角色名称仍为工作暂名。

12 转为可选主角，保留原重甲造型和倔强表情，不再作为怪物出场。03、04、09、10 的造型沿用已经认可的图片。

04 的权威参考是 assets/hero-04-reference.png，原文件 exec-e6b41df9-58d3-4d56-a6f9-5702ec40ee19.png。必须保持小玫红晶石水滴尾巴和短金色链扣，不得使用细长龙尾、大松鼠尾或较大的光滑粉色尾巴。整合图仅用于阵容展示，细节发生偏差时以该单独参考为准。

## 资源状态

assets/approved-cast-reference.png 是此前五位主角、五种怪物的整合设定图，12的旧色已停用。新的可玩图集为 assets/cast-key.png，12已替换为确认的新配色。

assets/cast.png 是此前旧八角色图集，包含已退出的01、02，明确停用。新的 cast-key.png 使用色键背景，assets.js 在运行时生成十个独立透明画布，检查主体分离数量，不把色键底板显示在游戏中。

阵容数据见 cast.json。可玩实现、验证范围及打开方式见 README.md。

## 已确认玩法与后续步骤

- 横版多层台阶关卡、二段跳、玩家攻击；上下移动通过台阶、指定下降平台或攀爬结构设计。
- 怪物巡逻、发现玩家后攻击，不能跳跃。不同怪物的伤害、血量和攻击方式不同。
- 怪物血量清零后停止攻击与碰撞伤害，并消散移除。07 的水球是独立攻击效果，不是身体组成部分。
- 玩家显示血量，药水回血，护盾临时保护。
- 关卡逐关解锁，难度穿插，完成后可重玩刷时间星级；不需要额外难度选择器。
- 独立开场庭院背景和角色出场动画、角色选择与操作说明。
- 游戏名使用用户确认的「精灵漫游」，不是「晶灵漫游」。
- 横屏是固定产品要求，电脑与手机共用1280×720游戏视野。手机竖屏显示旋转提示，游玩中转回竖屏自动暂停。
- 已通过模拟和浏览器检查，并在最后接入本地作品集封面、简短介绍与作品入口。尚未执行远程部署。

## 整合图提示词

Use case: compositing / identity-preserve. Create a CONSOLIDATED APPROVED CAST SHEET for original game 精灵漫游 using ONLY the exact existing characters in the THREE references. This is layout assembly, not character creation. Wide landscape aspect, TWO rows of FIVE characters, warm ivory studio background, spacious full bodies with consistent display size and gentle contact shadows. NO new characters or redesigned faces/materials. Keep original identifiers, DO NOT renumber sequentially.

REFERENCE ROLES:
Image 1: eight-character sheet supplies 03,05,06,07,08 ONLY. Exclude 01 and 02 permanently. Do NOT use image1's 04.
Image 2: four-character sheet supplies 09,10,11,12 EXACTLY, preserving their faces and silhouettes.
Image 3: SELECTED 04 portrait is authoritative for 04 including its SMALL rose faceted crystal teardrop tail connected to rump with short gold jewelry chain. Tail remains SMALL exactly as reference, no large tail, bag, purple casing, no conventional long dragon tail.

TOP ROW = FIVE PLAYABLE HEROES, left to right labels EXACTLY:
03 — original lavender bean-shaped sleepy creature, tiny vertical black eyes, curled sprout, hanging opalescent glass coat wings with delicate gold borders. Preserve original.
04 — original lilac folded-arms dragon, skeptical eyes, three pink crystal horns, selected small faceted rose teardrop chain-tail from reference3.
09 — original cream pearl-shell child sprite, closed happy eyes, tiny open smiling mouth, hands at cheeks, scallop shell hood with gold edge and forehead pearl curl from reference2. Do not alter shell.
10 — original powder blue star-headed plump bird, happy crescent eyes, small ivory beak, glass side wings, amber feet one raised, from reference2. Keep its EXACT asymmetrical star silhouette.
12 — original stocky four-footed lilac heavy tortoise guardian, smoky quartz armored shell with bronze edging, amber horns, grumpy brow, tiny uneven tusks from reference2. It is now a HERO but DO NOT sweeten its face or redesign its shell.

BOTTOM ROW = FIVE ENEMIES, left to right labels EXACTLY:
05 — amber bandaged boar with jade tusks
06 — grey six-footed quartz-spine round beast
07 — blue large-beak bird with small glass wings. NO water projectile in or before mouth.
08 — purple mismatched-horn beast with large pink glass belly
11 — teal crab beast with asymmetrical jade pincers, head bandage, grumpy uneven teeth from reference2.

Use each character's established original fine sculpted clay / velvety body and crystal/nacre accent appearance. Preserve all defining details, silhouettes, facial expressions, colors and accessory geometry. No coarse new embroidery textures. No props, weapon effects, backgrounds, UI, new costumes. Only small original numeral labels beneath characters and two small row captions: '可选角色' above top row and '关卡怪物' above bottom row. Clear polished editorial character roster, no game logo or extra copy. All ten full silhouettes uncropped, no overlap.
