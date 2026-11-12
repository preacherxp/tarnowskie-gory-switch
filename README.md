# Tarnowskie Góry switch

Contemporary Tarnowskie Góry in a pixel-art day/night switch: the Rynek with its renovated neo-Renaissance town hall, the tower of the Evangelical Church of the Saviour, the miners' belfry, Dom Sedlaczka, and a Górnośląskie Koleje Wąskotorowe narrow-gauge train passing along the near edge.

[Live demo](https://preacherxp.github.io/tarnowskie-gory-switch/) · [Download 60 fps MP4](tarnowskie-gory-day-night-60fps.mp4) · [Download Instagram 4:5 MP4](tarnowskie-gory-instagram-4x5-60fps.mp4) · [Download Instagram cover](tarnowskie-gory-instagram-cover.jpg)

The seven-second, 1600 × 1000 H.264 recording includes the entire animated switch, frame and moving glass lens.

The scene is a compressed panorama, not one street view. The south frontage of the Rynek is drawn in its real order, from the town hall at number 4 to Dom Sedlaczka at number 1. The church tower from the north side of the square, the belfry from pl. Gwarków and the narrow-gauge line are brought into the same summer picture. People cross the setts on foot and by bicycle, a guided group follows a yellow pennant, a waiter works the café garden, pigeons scatter before the train, and both clocks show the hour. A quick flick of the lens rings the belfry's bell.

## Research

[The source-cited research note](RESEARCH.md) records the references, the photographs that were opened and their dates, the layout, and what could not be verified. The main sources:

- Town hall: the [city's notice on the renovation](https://tarnowskiegory.pl/2025/01/sala-sesyjna-do-remontu/), Ślązag's [plan](https://www.slazag.pl/zabytkowy-ratusz-tarnowskie-gory-remont) and [report after the work](https://www.slazag.pl/rynek-w-tarnowskich-gorach-zachwyca-zabytkami-odnowiony-ratusz-to-jedno-ale-ciekawych-budynkow-jest-tu-wiecej), and [photographs of June 2024](https://commons.wikimedia.org/wiki/File:2024-06_Tarnowskie_G%C3%B3ry_Ratusz_(1).jpg).
- Church of the Saviour: [heritage register](https://zabytek.pl/en/obiekty/tarnowskie-gory-kosciol-ewangelicki) and a [tower photograph of June 2024](https://commons.wikimedia.org/wiki/File:2024-06_Tarnowskie_G%C3%B3ry_Ko%C5%9Bci%C3%B3%C5%82_ewangelicki_(3).jpg).
- Dzwonnica Gwarków: [Silesian tourism portal](https://www.slaskie.travel/poi/3429/dzwonnica-gwarkow-w-tarnowskich-gorach) and a [photograph of December 2020](https://commons.wikimedia.org/wiki/File:Tarnowskie_G%C3%B3ry_Dzwonnica_Gwark%C3%B3w_13.jpg).
- Dom Sedlaczka: the [Muzeum w Tarnowskich Górach](https://muzeumtg.pl/), the [heritage register](https://zabytek.pl/en/obiekty/tarnowskie-gory-dom-sedlaczek) and a [photograph of September 2020](https://commons.wikimedia.org/wiki/File:%22Sedlaczek%22_building_in_Tarnowskie_G%C3%B3ry.jpg).
- Narrow-gauge railway: the operator, [Stowarzyszenie Górnośląskich Kolei Wąskotorowych](https://sgkw.eu/), and its [photo gallery](https://sgkw.eu/galeria-zdjec/).
- The square: [Rynek w Tarnowskich Górach](https://pl.wikipedia.org/wiki/Rynek_w_Tarnowskich_G%C3%B3rach) and a [night photograph of July 2021](https://commons.wikimedia.org/wiki/File:Rynek_w_Tarnowskich_G%C3%B3rach_noc%C4%85.jpg).
- The jubilee board uses the colours of the city's [500-lecie logo](https://tarnowskiegory.pl/).

The UNESCO-listed Historic Silver Mine and Black Trout Adit lie underground and are not drawn. The train is shortened and carries no fleet number. Night lighting schedules are artistic.

## Run and validate

```sh
python3 -m http.server 8000
node test-scene.cjs
```

Open http://localhost:8000. No build or runtime dependencies are required. See [AGENTS.md](AGENTS.md) for real-browser composition and interaction checks.

## Embed

```html
<script src="city-switch.js"></script>
<script src="tarnowskie-gory.js"></script>
<tarnowskie-gory-switch style="display: block; width: min(680px, 100%);"></tarnowskie-gory-switch>
```

Drag through the hours, tap or press Space to toggle, or use arrow keys. The API exposes `checked`, `position`, and `jump(night)`. `change` supplies `detail.night`; `scrub` supplies `position`, `hour`, and `dark`.

GitHub Pages serves `/` from `main`.

## Attribution

The engine is derived from `tokyo-switch.js`; the original idea is “住人のいるスイッチ” by @Lattice_Node ([original project](https://ludion.ai/p/toggle-daylight), MIT), as credited in the engine source. Research photographs are drawing references and are not redistributed.
