# Official sky background image credits

Retrieved and verified on 2026-09-08. Each file is the unchanged image response from the official NASA URL listed below. No local conversion, resizing, compression, recolouring, compositing, or image editing was performed. Website presentation uses CSS cropping and darkening only; interface parallax is a visual effect, not a reconstruction of astronomical distances.

## Cosmic Cliffs

- Local file: `images/sky/cosmic-cliffs.png`
- Title: "Cosmic Cliffs" in the Carina Nebula (NIRCam Image)
- Complete credit: **Image: NASA, ESA, CSA, STScI**
- [Official image and science description](https://science.nasa.gov/asset/webb/cosmic-cliffs-in-the-carina-nebula-nircam-image/)
- [Exact official image rendition](https://assets.science.nasa.gov/dynamicimage/assets/science/missions/webb/science/2022/07/STScI-01GA6KKWG229B16K4Q38CH3BXS.png?w=1536&h=890&fit=crop&crop=faces%2Cfocalpoint)
- Selection: the 1536w rendition explicitly listed in the source page's main-image `srcset`.
- Verified response: PNG, 1536 x 889 pixels, 3,529,883 bytes. The official URL requests height 890; the decoded response is 889 pixels high.
- SHA-256: `9b30277696e30e9a16ef844864253e1d2bf02d36206553b2483a2bce462c7ff6`

## Rho Ophiuchi

- Local file: `images/sky/rho-ophiuchi.png`
- Title: Rho Ophiuchi (NIRCam Image)
- Complete credit: **Image: NASA, ESA, CSA, STScI, Klaus Pontoppidan (STScI); Image Processing: Alyssa Pagan (STScI)**
- [Official image and science description](https://science.nasa.gov/asset/webb/rho-ophiuchi-nircam-image/)
- [Exact official image rendition](https://assets.science.nasa.gov/dynamicimage/assets/science/missions/webb/science/2023/07/STScI-01H44AVB69N1P8RAEJ12NW2RB2.png?w=1536&h=1439&fit=crop&crop=faces%2Cfocalpoint)
- Selection: the 1536w rendition explicitly listed in the source page's main-image `srcset`.
- Verified response: PNG, 1536 x 1438 pixels, 3,600,398 bytes. The official URL requests height 1439; the decoded response is 1438 pixels high.
- SHA-256: `c1abf0dec3f61fdc5248f79b2eb2bd5d20d3a53ea6a2aa7591c7b6152619ebb2`

## Orbital sunset

- Local file: `images/sky/orbital-sunset.jpg`
- Title: Cloud shadows stretch across the Earth during an orbital sunset
- Credit: **NASA; photograph by Koichi Wakata**. NASA's image-library metadata names Koichi Wakata as photographer and JSC as the publishing center.
- Image identifier: `iss068e022267`; photograph taken from the International Space Station on November 13, 2022, above the Atlantic coast of Suriname. NASA article published January 17, 2023.
- [Official article](https://www.nasa.gov/image-article/cloud-shadows-stretch-across-earth-during-an-orbital-sunset/)
- [Official NASA metadata including photographer and capture date](https://images-api.nasa.gov/search?nasa_id=iss068e022267)
- [Official NASA asset listing](https://images-api.nasa.gov/asset/iss068e022267)
- [Exact official image rendition](https://images-assets.nasa.gov/image/iss068e022267/iss068e022267~large.jpg)
- Selection: the existing `~large.jpg` rendition listed by NASA's image-library API. Visually inspected: blue atmospheric layers, illuminated warm cloud tops, and long cloud shadows remain visible across much of the frame.
- Verified response: JPEG, 1920 x 1280 pixels, 129,668 bytes.
- SHA-256: `c467a3ff949263f414f491f9d9314e54df2dfa79896af327493bc42e69eaf171`
- This replaces the nearly black photograph `iss069e025337`; the prior file is preserved unchanged at `.tmp/orbital-sunset-iss069e025337-original.jpg`.

## Scientific meaning and reuse

The two Webb images are composites of actual near-infrared observations. Their visible colours are assigned to data from different filters; they should not be described as the colours a person would see with unaided eyes. The orbital sunset is an Earth photograph, not a Webb infrared composite. See [NASA's explanation of Webb full-colour image processing](https://science.nasa.gov/mission/webb/science-overview/science-explainers/how-are-webbs-full-color-images-made/).

Keep the complete per-image credits visible with the background/source interface and link to the original pages. These images must not imply NASA, ESA, CSA, or STScI endorsement of this portfolio. See [NASA's media usage guidelines](https://www.nasa.gov/nasa-brand-center/) and [ESA/Webb's image usage and credit guidance](https://esawebb.org/copyright/).

Total image payload: **7,259,949 bytes**. Official suitable JPEG renditions were not advertised on the selected Webb pages; their ready-made PNG responses are retained unchanged. Re-fetch with `python .tmp/fetch-sky-assets.py`; inspect page image metadata with `python .tmp/fetch-sky-assets.py --inspect`. The script uses Pillow only to verify and decode images, never to save or process them.
