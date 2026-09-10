# 绒绒野餐会：美术方向与素材记录

## 用户确认的方向

动物与食物使用同一套柔软、温暖、可爱的短绒玩具画风，但保持各自清晰的物种和食物轮廓。参考手工毛绒玩具的简洁表情与童话游戏的亲和比例，不复刻已有商品、角色、标志或界面。已选定的两套角色保留，不再使用原版星灵作为发射物。

- 动物：猫、狗、兔子、猪、奶牛、羊、老虎、小象。
- 食物：草莓、饭团、面包、布丁、桃子、西兰花、可颂、蛋糕。
- 独立轮廓：发射物没有包围圆圈、白底或卡片底板，只保留轻微落地阴影。
- 背景：阳光野餐小院、鼠尾草绿遮阳篷、奶油色桌布、蜜桃色小旗。场景中部留白让位给游戏。
- 原版八个角色仅保留为经典头像选择，不再成为第三个可玩主题。

官方风格研究入口：[Jellycat 动物](https://jellycat.com/animals)、[Jellycat Amuseables](https://jellycat.com/amuseables)、[奥比岛](https://aobi.leiting.com/home)。这些链接用于说明研究方向；网站中的现有图片没有作为游戏素材使用。

## 生产素材

素材由内置 imagegen 生成。动物与食物图集均为四列两行，蓝色为临时抠像底色，不是游戏画面。`texture.js` 在加载时生成透明纹理，保留每格最大的主体连通区域并统一显示尺寸。经典头像使用旧图集的浅色背景提取路径。

- `assets/animals-picnic.png`：动物原图集。
- `assets/food-picnic.png`：食物原图集。
- `assets/picnic-garden.png`：新版场景背景。
- `assets/spirits.png`：仅供经典头像使用。
- `assets/atelier.png`：旧背景源文件保留，但新版页面不引用。

## 动物图集生成提示词

```text
Use case: stylized-concept. Asset type: original animal plush-character sprite atlas for a charming children's cozy merge game, eight characters in exact FOUR COLUMNS x TWO ROWS. Design a completely NEW coherent collection named Pocket Picnic Friends, with the approachable simplicity of thoughtfully designed handmade stuffed toys and the warm illustrated proportions of a chibi storybook island game. Not a copy of any existing brand or franchise. Style: beautifully art-directed 2.5D painted game illustration of soft short-pile velour stuffed animals, clean recognizable silhouette, large rounded head but a distinct full body, tiny widely spaced black embroidered oval eyes, small understated imperfect smiles, minimal blush, gentle cream and warm pastel shading. NOT photorealistic, NOT long furry hair, NOT round mochi blobs, NOT huge shiny anime eyes, NOT plastic. Each has a distinct species silhouette and one charming original detail. EXACT order: top row 1 ginger-and-cream calico kitten sitting with its curled tail, one folded ear and a little sage leaf neckerchief; 2 cinnamon floppy-eared puppy with a long soft oval body and oversized cream paws, a tiny apricot scarf; 3 ivory rabbit, one upright ear one relaxed sideways ear, pink ear lining and a small stitched carrot pocket on the tummy; 4 peach piglet with a wide pink snout and short trotters, a little sage fabric heart on its belly. Bottom row 5 creamy dairy calf with irregular cocoa patches, broad muzzle, little caramel horns and a tiny yellow flower collar; 6 oatmeal lamb with scalloped soft fleece hood, beige face, little hooves and a peach scarf; 7 soft tangerine tiger cub with chunky cocoa stripes, ivory muzzle, curled tail and an off-center felt leaf on the head; 8 pale warm-grey baby elephant with big floppy ears, a short curved trunk, cream tummy and small peach fabric saddle. Entire bodies visible, no overlap, every character centered inside an equal grid cell and fitting within central 75% of its cell. Landscape 2:1 canvas, rigorously aligned 4 columns 2 rows. IMPORTANT asset production backdrop: perfectly FLAT SOLID pure electric BLUE #0000FF across all empty pixels, no gradient, no texture, no floor, no checkerboard, no blue bounce light or blue tint on characters. This blue is a temporary color-key matte, NOT part of the game. No blue clothing. No circles, no badges, no backing discs, no white background panels, no labels, no text, no logo, no border, no watermark. Prioritize appealing unique personalities and species clarity even at small size.
```

## 食物图集生成提示词

```text
Use case: stylized-concept. Asset type: original food plush-character sprite atlas for a charming cozy merge game for children. EIGHT food characters, exact FOUR COLUMNS x TWO ROWS. A coherent NEW collection named Little Picnic Pantry. Beautiful 2.5D storybook game illustration, short soft velour and felt materials rendered with clean warm pastel shading, sweet small black embroidered oval eyes with tiny restrained highlights, little hand-stitched crooked smiles, gentle understated blush, stubby mitten hands and tiny tucked paws rather than long dangling corduroy legs. Recognizable food silhouettes, original charming accessories, varied appealing expressions, not replicas of existing plush products. Not photoreal, not hairy, not huge glossy eyes, not generic round blobs. EXACT order: top row 1 plump rosy strawberry with a floppy leaf bonnet and tiny yellow felt flower on one leaf; 2 triangular ivory rice-ball with rounded corners, charcoal nori apron pocket and tiny peach mittens; 3 golden baked soft bread roll with three cream scoring marks, sleepy smile, little cinnamon scarf and tucked feet; 4 rounded pale-yellow caramel pudding with a softly irregular caramel beret and a tiny cherry pompom. Bottom row 5 blush-pink peach with a leafy side curl, pale felt belly patch and curious tilted expression; 6 broccoli with a scalloped sage-green treetop and chunky pale stalk body, tiny yellow satchel, adventurous smile; 7 buttery almond croissant with curled ends used as little arms, small ivory almond hairclip and content sleepy eyes; 8 triangular strawberry shortcake with ivory cream layers, coral jam stripes, one red strawberry topper and a little scalloped felt cream cape. Every food separate, full silhouette visible, centered in its equal cell, occupying no more than 75% cell width and height. Landscape 2:1, exact aligned 4 columns 2 rows. IMPORTANT production background: perfectly FLAT SOLID electric BLUE #0000FF in every empty pixel, no gradient, no texture, no floor, no checkerboard. Blue is temporary color-key matte only; no blue reflection or tint on characters, no blue clothing. No text, no circles, no enclosing discs, no badges, no white panels, no logo, no watermark, no borders. Make them warm, huggable, original and distinctive with rounded clear silhouettes.
```

## 背景生成提示词

```text
Use case: stylized-concept. Asset type: NEW portrait background artwork for Little Picnic Club, a cozy plush-animal and plush-food merge game. Beautiful sunny storybook picnic courtyard with a crafted miniature diorama feel. Upper 28%: a softly striped sage-and-cream fabric canopy hanging overhead, peach pennant bunting, a sunlit cottage garden and pale blue sky in the distance, tiny felt wildflowers along the far edges, narrow woven picnic baskets and folded linen at the extreme side edges. Lower 72%: ONE LARGE EMPTY tabletop covered in beautifully subtle warm ivory linen with very faint cream gingham and small neat stitched seams. Table begins at y=29%, extends all the way to bottom, occupies at least 90% image width. Gentle overhead perspective, almost parallel sides, wide open quiet playing surface. No objects in the central tabletop area, no characters. Warm fresh morning light, creamy natural pastels, sage mint, butter yellow, muted coral and honey wood details. Visual style: premium hand-painted 2.5D children's game illustration blended with tactile felt-and-linen material softness, appealing and carefully crafted, clean broad tonal shapes. Match handmade short-velour animal toys aesthetically, but do not include any toys. DIFFERENT from an attic: outdoors, fresh daylight, picnic canopy, no arch window, no lanterns, no night sky, no old wooden attic, no spaceship, no ornate golden frames. NO UI, no text, no lettering, no numbers, no icons, no game pieces, no checkerboard game grid, no logos, no watermarks. Portrait aspect 2:3. A scene background ready for live playable UI overlays, not a screenshot or UI mockup.
```

