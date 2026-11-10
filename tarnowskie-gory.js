/* tarnowskie-gory-switch — the Rynek of the silver-mining town: town hall, Evangelical church tower,
 * the miners' belfry, Dom Sedlaczka and the narrow-gauge train. A summer collage; see RESEARCH.md. */
(() => {
  const { BAYER, clamp, mix, smooth, rng } = CitySwitch;
  const GOLD = 1, DUSK = 2, NIGHT = 3, DAWN = 4; // sky and grade keys after NOON = 0
  const FOOT = 118; // where the façades meet the square
  const KERB = 130; // granite edge of the square
  const RAIL = 144; // near rail of the narrow-gauge track; the frame shades the rows below about 145
  let M, N;
  const bayer = (x, y) => BAYER[((y & 3) << 2) | (x & 3)];

  const SKY = [
    ['#2f7ac0', '#5a9bd4', '#8dbde2', '#bfdcea', '#e6eee2'],
    ['#4f7fb0', '#93a4bb', '#dcae9a', '#f6bf86', '#ffdf9f'],
    ['#2a2f63', '#5a4a80', '#a8688a', '#e28f7c', '#f8c08a'],
    ['#070d22', '#0d1830', '#16263f', '#22364a', '#34474f'],
    ['#3c5682', '#8091b0', '#c9aeb6', '#f1c9b4', '#fbe7c8'],
  ];
  const grade = [
    ([r, g, b]) => [r, g, b],
    ([r, g, b]) => [r * 1.04 + 0.03, g * 0.88 + 0.015, b * 0.7],
    ([r, g, b]) => [r * 0.6 + 0.05, g * 0.47 + 0.03, b * 0.6 + 0.08],
    ([r, g, b]) => [r * 0.2 + 0.02, g * 0.24 + 0.035, b * 0.34 + 0.07],
    ([r, g, b]) => [r * 0.74 + 0.06, g * 0.7 + 0.04, b * 0.74 + 0.07],
  ];

  const palette = ({ mat, neon }) => {
    // Square: grey granite setts, pale slab lanes and kerbs
    mat('SETT', '#9b9d9a');
    mat('SETT_D', '#7f8281');
    mat('SETT_L', '#b1b2ad');
    mat('SLAB', '#c9c6ba');
    mat('SLAB_D', '#aeab9f');
    mat('WALK_D', '#74777a'); // the engine's shadow under people, darkened for setts
    // Town hall: clinker brick, sandstone, tile, copper, iron
    mat('CLINK', '#b0503c');
    mat('CLINK_D', '#8f3d30');
    mat('CLINK_L', '#c66a4e');
    mat('SAND', '#d9bd84');
    mat('SAND_D', '#b99a63');
    mat('SAND_L', '#ecd6a4');
    mat('RTILE', '#c8553a');
    mat('RTILE_D', '#a44330');
    mat('RTILE_L', '#dd7150');
    mat('COPPER', '#5f9c86');
    mat('IRON', '#2c2f33');
    mat('PANE', '#4d5f6e', { [GOLD]: '#d59a5c' });
    mat('PANE_L', '#8fa8b6', { [GOLD]: '#f3cf8a' });
    mat('DIAL', '#f0ece0');
    // Church: grey render, dark stone corners, orange tile
    mat('RENDER', '#b7b3a6');
    mat('RENDER_D', '#98958a');
    mat('QUOIN', '#5d5c58');
    mat('OTILE', '#d96a3c');
    mat('OTILE_D', '#b4532f');
    // Belfry: tarred boards, shingles, limestone, bronze
    mat('BOARD', '#4a3528');
    mat('BOARD_D', '#35251c');
    mat('BOARD_L', '#62483a');
    mat('SHINGLE', '#57463a');
    mat('SHINGLE_L', '#766253');
    mat('LIME', '#d3ccb6');
    mat('LIME_D', '#aaa48f');
    mat('BRONZE', '#c49a45');
    mat('PLAQUE', '#2f8a58');
    // Dom Sedlaczka and its neighbours
    mat('PIST', '#b9c489');
    mat('PIST_D', '#9aa670');
    mat('PIST_L', '#cdd6a2');
    mat('SLATE_R', '#4a4d55');
    mat('SLATE_RD', '#383b43');
    mat('SLATE_RL', '#62656d');
    mat('SURROUND', '#efe8d4');
    mat('SASH', '#7a4a32');
    mat('LETTER', '#3b3324');
    mat('OAK', '#8a5a36');
    mat('OAK_D', '#6b4327');
    mat('HOUSE_Y', '#e6cf8a');
    mat('HOUSE_YD', '#c9b06c');
    mat('HOUSE_B', '#dcc3ad');
    mat('HOUSE_BD', '#bda38d');
    mat('HOUSE_P', '#e3b8a6');
    mat('FASCIA', '#35503f');
    // Café garden, flowers, trees
    mat('PARASOL', '#f3efe2');
    mat('PARASOL_D', '#cfc8b4');
    mat('LATTICE', '#8b6239');
    mat('PETAL_R', '#d8383f');
    mat('PETAL_P', '#e773a8');
    mat('PETAL_W', '#f4f0e6');
    mat('PETAL_B', '#5a78c8');
    mat('LEAF', '#4f8a45');
    mat('LEAF_D', '#356b39');
    mat('LEAF_L', '#86b352');
    mat('LIMELEAF', '#6f9c3f');
    mat('LIMELEAF_L', '#a3c257');
    mat('TRUNK', '#5b4636');
    mat('PLANTER', '#878d92');
    // Narrow-gauge line
    mat('GRASS', '#6f9a48');
    mat('GRASS_D', '#527c3c');
    mat('GRASS_L', '#9bbb5a');
    mat('SANDBED', '#b5a585');
    mat('SANDBED_D', '#94866b');
    mat('RUST', '#7b4a34');
    mat('RUST_L', '#a9785a');
    mat('SLEEPER', '#4f4337');
    mat('LOCO', '#d8452c');
    mat('LOCO_D', '#a93323');
    mat('LOCO_Y', '#f2c230');
    mat('LOCO_ROOF', '#cfd2d2');
    mat('LOCO_ROOF_D', '#8d9193');
    mat('COACH', '#66754a');
    mat('COACH_D', '#4f5c3a');
    mat('COACH_OAK', '#7d5334');
    mat('COACH_ROOF', '#c6c9c4');
    mat('COACH_ROOF_D', '#70746f');
    mat('FUME', '#7f858c');
    // People and birds
    mat('TEE_R', '#d5523f');
    mat('TEE_G', '#4f9a6a');
    mat('TEE_Y', '#e9c24a');
    mat('DENIM', '#4d6a94');
    mat('SHORTS', '#c9b48c');
    mat('APRON', '#1e2026');
    mat('PIGEON', '#8d95a3');
    mat('PIGEON_D', '#5d6472');
    mat('FLAG_R', '#d62f3a');
    // Jubilee board, after the city's 500-lecie logo
    mat('J_NAVY', '#16264a');
    mat('J_BLUE', '#8fb0e6');
    // Sky: summer cumulus
    mat('CLOUD', '#ffffff', { [GOLD]: '#ffe6c2', [DUSK]: '#e3a0a4', [NIGHT]: '#2a3a52', [DAWN]: '#f6d8cc' });
    mat('CLOUD_SH', '#d5e3ee', { [GOLD]: '#eeb692', [DUSK]: '#9b6a92', [NIGHT]: '#1d2b42', [DAWN]: '#cdb2bf' });
    mat('CLOUD_HI', '#f0f6fa', { [GOLD]: '#fff3d6', [DUSK]: '#f4b8a8', [NIGHT]: '#34455c', [DAWN]: '#fbe6d8' });
    mat('FARROOF', '#a9b9bf', { [GOLD]: '#c99c86', [DUSK]: '#57456f', [NIGHT]: '#141c33', [DAWN]: '#9c93a6' });
    mat('FARTREE', '#8eab95', { [GOLD]: '#a8a070', [DUSK]: '#463f62', [NIGHT]: '#101a2c', [DAWN]: '#8c93a0' });

    neon('LANTERN_W', '#ffe2a6', '#ffb85a', 0.55);
    // Lamplight on setts and floodlight on walls, in three steps from bright to faint so the falloff stays soft
    ['#9a8f76', '#6c6b66', '#47505a'].forEach((c, i) => neon(`POOL${i}`, c, '#e9c184', 0.03));
    ['#8a4632', '#653529', '#472729'].forEach((c, i) => neon(`FB${i}`, c, '#ff9a58', 0.02));
    ['#6f3729', '#522b25', '#3a2126'].forEach((c, i) => neon(`FBD${i}`, c, '#ff9a58', 0.02));
    ['#b0965f', '#84734f', '#5b5442'].forEach((c, i) => neon(`FS${i}`, c, '#ffc27a', 0.02));
    ['#93794b', '#6e5f42', '#4c4638'].forEach((c, i) => neon(`FSD${i}`, c, '#ffc27a', 0.02));
    ['#8f8c7e', '#6b6a63', '#4d5054'].forEach((c, i) => neon(`FR${i}`, c, '#ffd9a0', 0.02));
    neon('DIAL_LIT', '#fff4d0', '#ffe0a0', 0.3);
    neon('BULB', '#ffe9b0', '#ffb040', 0.6);
    neon('BRASS', '#f4d58c', '#e8b860', 0.16);
    neon('PARLOUR', '#f0b565', '#ff9838', 0.2);
    neon('PAPER', '#f4f1e4', '#e8e2c8', 0.1);
    neon('SHOP', '#f3dfb4', '#ffd08a', 0.2);
  };

  // ---- Ground: fan-laid setts, a slab lane, the kerb, then the grass-grown narrow-gauge track
  const buildGround = (w) => {
    const r = rng(1526);
    for (let y = FOOT; y < KERB; y++) for (let x = -40; x < 360; x++) {
      const row = Math.floor((y - FOOT) / 4), dy = (y - FOOT) % 4;
      const cx = ((x + 400 + (row % 2) * 4) % 8) - 3.5;
      const joint = Math.round(4 - Math.sqrt(16 - cx * cx)) === dy;
      w.px(x, y, joint ? M.SETT_D : r() < 0.12 ? M.SETT_L : M.SETT);
    }
    for (let x = -40; x < 360; x++) {
      w.px(x, 125, (x + 400) % 9 ? M.SLAB : M.SLAB_D);
      w.px(x, 126, (x + 404) % 9 ? M.SLAB : M.SLAB_D);
      w.px(x, KERB, (x + 400) % 13 ? M.SLAB_D : M.SETT_D);
      w.px(x, KERB + 1, M.SETT_D);
    }
    for (let y = KERB + 2; y < 150; y++) for (let x = -40; x < 360; x++) {
      const bed = y >= RAIL - 6 && y <= RAIL;
      const v = r();
      if (!bed) w.px(x, y, v < 0.18 ? M.GRASS_L : v < 0.42 ? M.GRASS_D : M.GRASS);
      else w.px(x, y, v < 0.16 ? M.GRASS_D : v < 0.42 ? M.SANDBED_D : M.SANDBED);
    }
    for (let x = -40; x < 360; x += 5) w.rect(x, RAIL - 2, 2, 3, M.SLEEPER);
    for (let x = -40; x < 360; x++) {
      w.px(x, RAIL - 3, M.RUST);
      w.px(x, RAIL, r() < 0.3 ? M.RUST_L : M.RUST);
    }
    // Meadow flowers in the verge
    for (let i = 0; i < 110; i++) w.px(Math.floor(r() * 400) - 40, (i % 3 ? KERB + 2 : RAIL + 1) + Math.floor(r() * 5), [M.PETAL_R, M.PETAL_W, M.PETAL_B, M.LOCO_Y][i % 4]);
  };

  // A window: stone surround, dark panes, and a light that comes on with its group.
  const pane = (w, x, y, ww, wh, g, n = N.WARM, surround = M.SAND) => {
    w.rect(x - 1, y - 1, ww + 2, wh + 2, surround);
    w.rect(x, y, ww, wh, M.PANE);
    w.px(x, y, M.PANE_L);
    if (g) w.lightRect(x, y, ww, wh, n, g);
  };
  // Warm floodlight thrown up a façade: three steps from the foot upwards, dithered only where two steps meet.
  const flood = (w, x0, y0, x1, y1, g, reach = 1) => {
    const lit = new Map([[M.CLINK, 'FB'], [M.CLINK_L, 'FB'], [M.CLINK_D, 'FBD'], [M.SAND, 'FS'], [M.SAND_L, 'FS'], [M.SAND_D, 'FSD'], [M.RENDER, 'FR'], [M.RENDER_D, 'FR'], [M.QUOIN, 'FBD']]);
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const i = (y + 40) * 400 + x + 40;
      const n = lit.get(w.smat[i]);
      if (!n || w.sgroup[i]) continue;
      const step = Math.floor((((y1 - y) / (y1 - y0)) * 3.3) / reach + (bayer(x, y) / 16 - 0.5) * 0.8);
      if (step < 3) w.light(x, y, N[n + Math.max(0, step)], g);
    }
  };

  // ---- Ratusz, Rynek 4: front elevation after the 2024 and September 2026 photographs
  const buildRatusz = (w) => {
    const r = rng(1898);
    // Brick body, two upper floors over a sandstone ground floor
    for (let y = 72; y < 104; y++) for (let x = 104; x < 168; x++) w.px(x, y, (y % 3 === 0 && (x + y) % 4) || r() < 0.06 ? M.CLINK_D : r() < 0.08 ? M.CLINK_L : M.CLINK);
    w.rect(104, 87, 64, 1, M.SAND);
    for (let y = 104; y < FOOT; y++) for (let x = 100; x < 193; x++) w.px(x, y, y % 4 === 0 || (x + (y >> 2) * 3) % 7 === 0 ? M.SAND_D : M.SAND);
    w.rect(100, 103, 93, 1, M.SAND_L);
    // Steep tile roof, hipped at the left
    for (let y = 48; y < 71; y++) {
      const left = 120 - Math.round((y - 48) * 0.55);
      for (let x = left; x < 170; x++) w.px(x, y, y % 3 === 1 ? M.RTILE_D : (x * 7 + y * 3) % 11 === 0 ? M.RTILE_L : M.RTILE);
      w.px(left, y, M.RTILE_L);
    }
    w.rect(119, 47, 51, 1, M.RTILE_D);
    w.rect(104, 71, 64, 1, M.SAND_L);
    // Dormers with red caps
    for (const x of [124, 133, 158]) {
      w.rect(x, 60, 4, 5, M.CLINK_D); w.rect(x + 1, 61, 2, 3, M.PANE);
      w.rect(x - 1, 59, 6, 1, M.RTILE_D); w.rect(x, 58, 4, 1, M.RTILE_D); w.rect(x + 1, 57, 2, 1, M.RTILE_D);
    }
    // Upper windows: rectangular pairs above, round-headed below, all in sandstone
    for (const x of [113, 124, 135, 157]) {
      pane(w, x, 76, 2, 7, x === 124 ? w.winGroups[4] : w.councilG); pane(w, x + 4, 76, 2, 7, x === 124 ? w.winGroups[4] : w.councilG);
      w.rect(x - 1, 91, 8, 10, M.SAND); w.rect(x, 90, 6, 1, M.SAND);
      w.rect(x, 92, 6, 9, M.PANE); w.px(x, 92, M.SAND); w.px(x + 5, 92, M.SAND); w.rect(x + 2, 92, 2, 9, M.SAND_D); w.px(x + 1, 93, M.PANE_L);
      if (x !== 124) { w.lightRect(x, 93, 2, 8, N.WARM_DIM, x === 157 ? w.winGroups[9] : w.councilG); w.lightRect(x + 4, 93, 2, 8, N.WARM_DIM, x === 157 ? w.winGroups[9] : w.councilG); }
    }
    pane(w, 146, 76, 2, 7, w.councilG); pane(w, 150, 76, 2, 7, w.councilG);
    // Ground floor: round-headed windows and the three-arched entrance loggia with its steps
    for (const x of [114, 125, 136]) {
      w.rect(x, 108, 5, 8, M.PANE); w.px(x, 108, M.SAND); w.px(x + 4, 108, M.SAND); w.rect(x, 116, 5, 1, M.SAND_L); w.px(x + 1, 109, M.PANE_L);
    }
    for (const x of [146, 153, 160]) {
      w.rect(x, 107, 5, 10, M.IRON); w.px(x, 107, M.SAND_D); w.px(x + 4, 107, M.SAND_D);
      w.lightRect(x + 1, 110, 3, 7, N.WARM_DIM, w.floodG);
      w.rect(x - 1, 106, 7, 1, M.SAND_L);
    }
    w.rect(144, 117, 24, 1, M.SLAB); w.rect(143, 118, 26, 1, M.SLAB_D);
    w.rect(152, 97, 9, 2, M.SAND_L); w.rect(152, 99, 9, 1, M.SAND_D); for (const x of [153, 156, 159]) w.px(x, 96, M.PETAL_R);
    // Corner oriel in sandstone under a red dome and a copper spire
    for (let y = 70; y < 103; y++) for (let x = 96; x < 110; x++) w.px(x, y, x > 107 ? M.SAND_D : x < 98 ? M.SAND_L : M.SAND);
    for (let i = 0; i < 4; i++) w.rect(97 + i, 103 + i, 12 - i * 2, 1, i % 2 ? M.SAND : M.SAND_D);
    for (const y of [73, 84, 94]) { for (const x of [98, 102, 106]) { w.rect(x, y, 2, 6, M.PANE); if (y === 84) w.lightRect(x, y, 2, 6, N.WARM_DIM, w.winGroups[x % 28]); } w.rect(96, y + 7, 14, 1, M.SAND_L); }
    for (const x of [99, 103, 107]) w.px(x, 81, M.SAND_D);
    w.rect(95, 69, 16, 1, M.SAND_L);
    for (let y = 58; y < 69; y++) {
      const half = [2, 3, 4, 5, 5, 6, 6, 7, 7, 7, 8][y - 58];
      w.rect(103 - half, y, half * 2, 1, M.RTILE); w.px(103 - half, y, M.RTILE_L); w.px(102 + half, y, M.RTILE_D);
    }
    w.rect(102, 47, 1, 11, M.COPPER); w.rect(101, 54, 3, 2, M.COPPER);
    // Ridge turret: brick shaft, iron gallery, open lantern, red cap, spire
    for (let y = 34; y < 50; y++) for (let x = 142; x < 151; x++) w.px(x, y, x > 148 ? M.CLINK_D : x < 143 ? M.CLINK_L : M.CLINK);
    w.rect(144, 39, 2, 5, M.PANE); w.rect(147, 39, 2, 5, M.PANE);
    w.rect(139, 33, 15, 1, M.IRON); w.rect(139, 31, 15, 1, M.IRON); for (let x = 139; x < 154; x += 2) w.px(x, 32, M.IRON);
    w.rect(142, 23, 9, 8, M.CLINK_D);
    for (const x of [143, 146, 149]) { w.rect(x, 25, 2, 6, M.IRON); w.px(x, 24, M.IRON); w.lightRect(x, 25, 2, 6, N.LANTERN_W, w.floodG); }
    w.rect(141, 22, 11, 1, M.RTILE_D); w.rect(142, 21, 9, 1, M.RTILE); w.rect(143, 20, 7, 1, M.RTILE); w.rect(144, 19, 5, 1, M.RTILE_L); w.rect(145, 18, 3, 1, M.RTILE);
    w.rect(146, 9, 1, 9, M.IRON); w.rect(145, 14, 3, 2, M.COPPER); w.px(146, 8, M.COPPER);
    // Stepped gable at the right, with the clock, the council chamber window and a balcony
    for (let y = 50; y < 104; y++) {
      const inset = y >= 62 ? 0 : y >= 58 ? 3 : y >= 54 ? 6 : 9;
      for (let x = 168 + inset; x < 193 - inset; x++) w.px(x, y, (y % 3 === 0 && (x + y) % 4) || r() < 0.06 ? M.CLINK_D : r() < 0.08 ? M.CLINK_L : M.CLINK);
    }
    for (const [x, y, n] of [[168, 61, 3], [190, 61, 3], [171, 57, 3], [187, 57, 3], [174, 53, 3], [184, 53, 3], [177, 49, 7]]) w.rect(x, y, n, 1, M.SAND_L);
    for (const x of [168, 192, 171, 189]) w.rect(x, x < 170 || x > 190 ? 58 : 54, 1, 3, M.SAND);
    w.rect(178, 43, 5, 6, M.SAND); w.rect(179, 41, 3, 2, M.COPPER); w.rect(180, 36, 1, 5, M.COPPER);
    w.rect(178, 53, 5, 5, M.DIAL); w.lightRect(178, 53, 5, 5, N.DIAL_LIT, w.clockG); w.rect(177, 52, 7, 1, M.SAND); w.rect(177, 58, 7, 1, M.SAND);
    w.clockHall = [180, 55, 2];
    w.rect(171, 65, 19, 17, M.SAND);
    for (const x of [172, 176, 181, 185]) { w.rect(x, 67, 3, 6, M.PANE); w.rect(x, 75, 3, 6, M.PANE); w.px(x, 67, M.PANE_L); w.lightRect(x, 67, 3, 6, N.WARM, w.councilG); w.lightRect(x, 75, 3, 6, N.WARM, w.councilG); }
    w.rect(174, 84, 13, 1, M.SAND_L); w.rect(174, 85, 13, 2, M.SAND_D); for (let x = 175; x < 187; x += 2) w.px(x, 83, x % 4 ? M.PETAL_R : M.LEAF);
    for (const x of [171, 185]) { w.rect(x - 1, 91, 6, 10, M.SAND); w.rect(x, 92, 4, 9, M.PANE); w.px(x, 92, M.SAND); w.px(x + 3, 92, M.SAND); w.px(x + 1, 93, M.PANE_L); w.lightRect(x, 93, 4, 8, N.WARM_DIM, w.councilG); }
    w.rect(179, 90, 3, 9, M.SAND_L); w.px(180, 89, M.SAND_L); w.rect(178, 99, 5, 2, M.SAND_D);
    for (const x of [172, 185]) { w.rect(x, 108, 5, 8, M.PANE); w.px(x, 108, M.SAND); w.px(x + 4, 108, M.SAND); w.px(x + 1, 109, M.PANE_L); }
    w.rect(178, 108, 5, 10, M.OAK_D); w.px(178, 108, M.SAND); w.px(182, 108, M.SAND);
    flood(w, 96, 60, 192, 117, w.floodG, 0.75);
    // A white flagpole by the entrance; the flag itself flies in draw()
    w.rect(140, 78, 1, 40, M.SHIRT);
    w.flagAt = [141, 79];
  };

  // A leafy crown made of overlapping clumps, each lit from the upper left. Limes are broad, globe maples clipped round.
  const crown = (w, clumps, seed, mats = [M.LEAF_D, M.LEAF, M.LEAF_L]) => {
    const r = rng(seed);
    for (const [cx, cy, rx, ry] of clumps) for (let dy = -ry; dy <= ry; dy++) for (let dx = -rx; dx <= rx; dx++) {
      const d = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry);
      if (d > 1 - r() * 0.25) continue;
      const side = dx / rx + dy / ry;
      w.px(cx + dx, cy + dy, side < -0.55 ? (r() < 0.75 ? mats[2] : mats[1]) : side > 0.7 || r() < 0.16 ? mats[0] : mats[1]);
    }
  };

  // ---- Kościół Zbawiciela, Rynek 12: the tower after the June 2024 photograph
  const buildChurch = (w) => {
    // Nave behind the tower, its far end lost behind the lime
    for (let y = 78; y < 93; y++) for (let x = 75; x < 100; x++) w.px(x, y, y % 3 === 0 ? M.OTILE_D : (x + y * 2) % 7 === 0 ? M.RTILE_L : M.OTILE);
    for (let y = 93; y < FOOT; y++) for (let x = 75; x < 100; x++) w.px(x, y, y % 5 === 0 ? M.RENDER_D : M.RENDER);
    w.rect(75, 92, 25, 1, M.QUOIN);
    for (const x of [79, 86]) { w.rect(x, 98, 3, 12, M.PANE); w.px(x, 98, M.RENDER); w.px(x + 2, 98, M.RENDER); w.px(x + 1, 99, M.PANE_L); }
    // Brick ridge turret
    w.rect(84, 70, 3, 8, M.CLINK); w.rect(85, 71, 1, 3, M.IRON); w.rect(83, 69, 5, 1, M.CLINK_D); w.rect(84, 66, 3, 3, M.RTILE); w.rect(85, 62, 1, 4, M.RTILE_D);
    // Tower: three stages between dark corner strips, clock, louvred openings, four gables, tile spire
    for (let y = 50; y < FOOT; y++) for (let x = 59; x < 75; x++) w.px(x, y, x < 61 || x > 72 ? M.QUOIN : (y * 3 + x) % 13 === 0 ? M.RENDER_D : M.RENDER);
    for (const y of [67, 83]) { w.rect(58, y, 18, 1, M.QUOIN); for (let x = 61; x < 73; x += 2) w.px(x, y + 1, M.RENDER_D); }
    for (const [y, h] of [[54, 10], [94, 12]]) { w.rect(64, y, 5, h, M.RENDER_D); w.rect(65, y + 1, 3, h - 1, M.IRON); w.px(64, y, M.RENDER); w.px(68, y, M.RENDER); for (let j = y + 2; j < y + h; j += 2) w.rect(65, j, 3, 1, M.QUOIN); }
    w.rect(63, 71, 7, 7, M.DIAL); w.lightRect(63, 71, 7, 7, N.DIAL_LIT, w.clockG);
    w.clockChurch = [66, 74, 3];
    for (let y = 44; y < 50; y++) {
      const half = Math.round((y - 43) * 1.3);
      w.rect(67 - half, y, half * 2, 1, M.RENDER); w.px(67 - half, y, M.QUOIN); w.px(66 + half, y, M.QUOIN);
    }
    w.rect(58, 49, 18, 1, M.QUOIN); w.rect(66, 46, 2, 3, M.IRON);
    for (let y = 24; y < 48; y++) {
      const half = Math.round(((y - 23) / 24) * 8);
      for (let x = 67 - half; x < 67 + half; x++) if (y < 44 || Math.abs(x - 66.5) > (y - 43) * 1.3) w.px(x, y, x > 67 ? M.OTILE_D : (x + y) % 5 === 0 ? M.RTILE_L : M.OTILE);
    }
    w.rect(66, 22, 2, 2, M.COPPER); w.rect(66, 16, 1, 6, M.COPPER); w.rect(65, 18, 3, 1, M.COPPER);
    flood(w, 59, 50, 74, 117, w.floodG, 0.6);
  };

  // ---- Dzwonnica Gwarków, pl. Gwarków: after the December 2020 photograph
  const buildBelfry = (w) => {
    const r = rng(1955);
    // The yellow house with an orange tile roof behind, and the trees either side
    w.depth = 1;
    for (let y = 86; y < 98; y++) for (let x = -40; x < 62; x++) w.px(x, y, y % 3 === 0 ? M.OTILE_D : M.OTILE);
    for (let y = 98; y < FOOT; y++) for (let x = -40; x < 62; x++) w.px(x, y, M.HOUSE_Y);
    w.rect(-40, 97, 102, 1, M.HOUSE_YD);
    for (const x of [-24, -6, 12, 48]) { w.rect(x, 103, 5, 9, M.SURROUND); w.rect(x + 1, 104, 3, 7, M.SASH); w.lightRect(x + 1, 104, 3, 7, N.WARM_DIM, w.winGroups[(x + 40) % 28]); }
    crown(w, [[4, 84, 12, 12], [-6, 70, 10, 11], [8, 62, 9, 10], [-14, 86, 9, 9]], 21, [M.LEAF_D, M.LIMELEAF, M.LIMELEAF_L]);
    w.rect(2, 94, 2, 24, M.TRUNK);
    w.depth = 2;
    // Limestone rubble walls and steps at the foot
    for (let y = 111; y < FOOT; y++) for (let x = 10; x < 56; x++) w.px(x, y, y === 111 ? M.SURROUND : r() < 0.3 || (x + y * 3) % 6 === 0 ? M.LIME_D : M.LIME);
    for (let i = 0; i < 4; i++) w.rect(26 - i, 114 + i, 13 + i * 2, 1, i % 2 ? M.LIME_D : M.SURROUND);
    // Boarded foot with its rounded top, grille door and green plaque
    for (let y = 85; y < 114; y++) {
      const inset = y < 86 ? 6 : y < 87 ? 4 : y < 88 ? 2 : y < 89 ? 1 : 0;
      for (let x = 23 + inset; x < 42 - inset; x++) w.px(x, y, x % 3 === 0 ? M.BOARD_D : x < 26 ? M.BOARD_L : M.BOARD);
    }
    w.rect(29, 101, 7, 13, M.BOARD_D); w.px(29, 101, M.BOARD); w.px(35, 101, M.BOARD);
    for (let y = 102; y < 114; y++) for (let x = 30; x < 35; x++) w.px(x, y, (x + y) % 2 ? M.IRON : M.HOUSE_YD);
    w.rect(31, 93, 3, 3, M.PLAQUE);
    // Open stage: four posts, two rails, the bell under its headstock
    for (const x of [25, 38]) { w.rect(x, 70, 2, 16, M.BOARD); w.px(x, 70, M.BOARD_L); }
    w.rect(25, 77, 15, 1, M.BOARD_L); w.rect(25, 82, 15, 1, M.BOARD_L);
    w.rect(28, 70, 9, 1, M.BOARD_D);
    w.bellAt = [32, 71];
    // Broad shingle roof and its cross
    for (let y = 54; y < 70; y++) {
      const half = Math.round(((y - 53) / 16) * 17);
      for (let x = 32 - half; x <= 32 + half; x++) w.px(x, y, y % 3 === 2 ? M.BOARD_D : x < 32 - half * 0.2 ? M.SHINGLE_L : M.SHINGLE);
    }
    w.rect(15, 69, 35, 1, M.BOARD_D);
    w.rect(32, 48, 1, 6, M.IRON); w.rect(31, 50, 3, 1, M.IRON);
    // The Freedom Oak planted beside it in 2018
    w.rect(49, 104, 1, 8, M.TRUNK);
    crown(w, [[49, 101, 4, 4], [51, 104, 3, 3]], 2018);
  };

  // ---- South frontage west of the town hall: Rynek 3, Rynek 2 and Dom Sedlaczka at Rynek 1,
  // then ul. Gliwicka and the first arcaded house of the west side.
  const buildFrontage = (w) => {
    // Rynek 3: pale yellow, red tile roof
    for (let y = 64; y < 74; y++) for (let x = 193; x < 219; x++) w.px(x, y, y % 3 === 0 ? M.RTILE_D : (x * 3 + y) % 9 === 0 ? M.RTILE_L : M.RTILE);
    w.rect(199, 60, 3, 5, M.CLINK_D); w.rect(211, 61, 2, 4, M.CLINK_D);
    w.rect(193, 74, 26, 44, M.HOUSE_Y); w.rect(193, 74, 26, 1, M.SURROUND); w.rect(218, 75, 1, 43, M.HOUSE_YD);
    for (const x of [196, 204, 212]) for (const y of [78, 90]) { pane(w, x, y, 3, 6, (x + y) % 3 ? w.winGroups[(x + y) % 28] : 0, N.WARM, M.SURROUND); w.rect(x - 1, y + 7, 5, 1, M.HOUSE_YD); }
    w.rect(193, 101, 26, 2, M.FASCIA);
    w.rect(195, 104, 12, 12, M.PANE); w.lightRect(195, 104, 12, 12, N.SHOP, w.shopG); w.rect(201, 104, 1, 12, M.FASCIA);
    w.rect(210, 105, 5, 13, M.OAK); w.rect(211, 106, 3, 5, M.PANE); w.lightRect(211, 106, 3, 5, N.SHOP, w.shopG);
    // Rynek 2, Dom Petrascha: beige, flat cornice, a rusticated shop floor
    w.rect(219, 70, 26, 48, M.HOUSE_B); w.rect(218, 68, 28, 2, M.SURROUND); w.rect(219, 70, 26, 1, M.HOUSE_BD); w.rect(244, 71, 1, 47, M.HOUSE_BD);
    w.rect(226, 63, 3, 5, M.CLINK_D);
    for (const x of [222, 228, 234, 240]) for (const y of [75, 87]) { pane(w, x, y, 2, 7, (x + y) % 4 < 2 ? w.winGroups[(x * 3 + y) % 28] : 0, N.WARM_DIM, M.SURROUND); w.rect(x - 1, y - 3, 4, 1, M.HOUSE_BD); }
    w.rect(219, 98, 26, 1, M.SURROUND);
    for (let y = 99; y < FOOT; y++) for (let x = 219; x < 245; x++) w.px(x, y, y % 4 === 3 ? M.HOUSE_BD : M.HOUSE_B);
    w.rect(221, 104, 11, 12, M.PANE); w.lightRect(221, 104, 11, 12, N.WARM, w.cafeG); w.rect(226, 104, 1, 12, M.OAK_D);
    w.rect(236, 104, 6, 14, M.OAK_D); w.rect(237, 105, 4, 6, M.PANE); w.lightRect(237, 105, 4, 6, N.WARM, w.cafeG);
    // Dom Sedlaczka: slate hipped roof with three eyebrow dormers over two green storeys
    for (let y = 66; y < 87; y++) {
      const inset = Math.round((86 - y) * 0.5);
      for (let x = 246 + inset; x < 305 - inset; x++) w.px(x, y, (y + (x >> 1)) % 3 === 0 ? M.SLATE_RD : (x * 5 + y * 3) % 13 === 0 ? M.SLATE_RL : M.SLATE_R);
      w.px(246 + inset, y, M.SLATE_RL);
    }
    w.rect(256, 65, 39, 1, M.SLATE_RD); w.rect(283, 60, 3, 6, M.CLINK_D);
    for (const x of [262, 275, 288]) { w.rect(x - 2, 77, 7, 1, M.SLATE_RL); w.rect(x - 1, 76, 5, 1, M.SLATE_RL); w.rect(x - 1, 78, 5, 1, M.IRON); w.px(x + 1, 78, M.SASH); }
    w.rect(245, 87, 61, 1, M.SURROUND);
    for (let y = 88; y < FOOT; y++) for (let x = 246; x < 305; x++) w.px(x, y, x > 301 ? M.PIST_D : M.PIST);
    w.rect(246, 108, 59, 1, M.PIST_L);
    for (const x of [251, 262, 273, 284, 295]) { w.rect(x - 1, 89, 6, 9, M.SURROUND); w.rect(x, 90, 4, 7, M.SASH); w.rect(x + 1, 91, 1, 5, M.PANE); w.rect(x + 2, 91, 1, 5, M.PANE_L); w.lightRect(x + 1, 91, 2, 5, N.WARM_DIM, w.winGroups[(x + 11) % 28]); w.rect(x, 93, 4, 1, M.SASH); }
    w.hsign(248, 99, 55, 9, 'SEDLACZEK', { font: 5, n: N.BRASS, g: w.barG, board: M.PIST, off: M.LETTER });
    // Wine bar windows, the sandstone portal with its crest, and the glazed door
    for (const x of [251, 261]) { w.rect(x - 1, 109, 7, 8, M.SURROUND); w.rect(x, 110, 5, 6, M.SASH); w.rect(x + 1, 111, 3, 4, M.PANE); w.lightRect(x + 1, 111, 3, 4, N.PARLOUR, w.barG); }
    w.rect(271, 109, 11, 9, M.SAND); w.rect(272, 108, 9, 1, M.SAND_L);
    w.rect(273, 111, 7, 7, M.OAK); w.px(273, 111, M.SAND); w.px(279, 111, M.SAND); w.rect(276, 111, 1, 7, M.OAK_D); w.rect(274, 112, 5, 1, M.IRON);
    w.rect(288, 109, 9, 9, M.SURROUND); w.rect(289, 110, 7, 8, M.OAK); w.rect(290, 111, 2, 4, M.PANE); w.rect(293, 111, 2, 4, M.PANE);
    w.lightRect(290, 111, 2, 4, N.PARLOUR, w.barG); w.lightRect(293, 111, 2, 4, N.PARLOUR, w.barG);
    // Wrought-iron corner lantern
    w.rect(305, 100, 3, 1, M.IRON); w.px(307, 101, M.IRON); w.rect(306, 102, 3, 4, M.IRON); w.rect(307, 103, 1, 2, M.PARASOL_D); w.light(307, 103, N.LANTERN_W, w.lampG); w.light(307, 104, N.LANTERN_W, w.lampG);
    // First arcaded house across ul. Gliwicka
    for (let y = 72; y < 84; y++) for (let x = 311; x < 360; x++) w.px(x, y, y % 3 === 0 ? M.RTILE_D : M.RTILE);
    w.rect(311, 84, 49, 34, M.HOUSE_P); w.rect(311, 84, 49, 1, M.SURROUND);
    for (let x = 315; x < 356; x += 9) { pane(w, x, 89, 3, 7, w.winGroups[x % 28], N.WARM, M.SURROUND); w.rect(x - 1, 105, 7, 13, M.SLATE_RD); w.px(x - 1, 105, M.HOUSE_P); w.px(x + 5, 105, M.HOUSE_P); w.rect(x + 6, 103, 2, 15, M.SURROUND); }
  };

  // ---- The square's furniture: twin lanterns, clipped trees, flower towers, a bench, bicycles, the café garden
  const buildSquare = (w) => {
    const r = rng(2010);
    // Black cast-iron posts with two scrolled arms and hexagonal lanterns, a flower basket below
    for (const x of [111, 191, 241]) {
      w.rect(x, 98, 1, 21, M.IRON); w.rect(x - 1, 117, 3, 2, M.IRON); w.px(x, 97, M.IRON);
      w.rect(x - 4, 100, 9, 1, M.IRON); w.px(x - 2, 101, M.IRON); w.px(x + 2, 101, M.IRON);
      for (const lx of [x - 5, x + 3]) {
        w.rect(lx, 95, 3, 1, M.IRON); w.px(lx + 1, 94, M.IRON); w.rect(lx, 99, 3, 1, M.IRON);
        w.rect(lx, 96, 3, 3, M.PARASOL_D); w.lightRect(lx, 96, 3, 3, N.LANTERN_W, w.lampG);
      }
      w.rect(x - 2, 104, 5, 2, M.LEAF); w.px(x - 2, 104, M.PETAL_P); w.px(x + 1, 104, M.PETAL_W); w.px(x + 2, 105, M.PETAL_P); w.px(x - 1, 106, M.LEAF_D);
      // Pool of lamplight on the setts
      for (let dy = 0; dy < 8; dy++) for (let dx = -13; dx <= 13; dx++) {
        const d = (dx * dx) / 169 + ((dy - 3) * (dy - 3)) / 20;
        const step = Math.floor(d * 3 + (bayer(x + dx, 119 + dy) / 16 - 0.5) * 0.9);
        if (d < 1 && step < 3) w.light(x + dx, 119 + dy, N[`POOL${Math.max(0, step)}`], w.lampG);
      }
    }
    // Clipped globe trees in grey planters, either side of the entrance
    for (const x of [121, 175]) {
      w.rect(x - 3, 116, 7, 4, M.PLANTER); w.rect(x - 3, 116, 7, 1, M.SLAB); w.px(x - 2, 118, M.SLAB_D); w.px(x + 2, 118, M.SLAB_D); w.px(x, 118, M.SLAB_D);
      w.rect(x, 108, 1, 8, M.TRUNK);
      crown(w, [[x, 104, 5, 5]], x);
    }
    // Flower towers: tall cones of petunias
    for (const [x, a, b] of [[132, M.PETAL_R, M.PETAL_P], [184, M.PETAL_P, M.PETAL_W]]) {
      for (let y = 105; y < 119; y++) {
        const half = y < 107 ? 1 : y < 113 ? 2 : 3;
        for (let dx = -half; dx <= half; dx++) w.px(x + dx, y, r() < 0.22 ? M.LEAF_D : r() < 0.35 ? b : a);
      }
      w.rect(x - 2, 119, 5, 1, M.TRUNK);
    }
    // A slatted bench and two bicycles at a rack
    w.rect(152, 116, 10, 1, M.IRON); w.rect(152, 118, 10, 1, M.OAK_D); w.px(152, 119, M.IRON); w.px(161, 119, M.IRON); w.px(152, 117, M.IRON); w.px(161, 117, M.IRON);
    w.benchAt = [153, 118];
    for (const x of [100, 104]) w.sprite(['..K....K.', '.KFFFFFK.', 'T.TFKF.TT', 'T.T.K..TT', '.T......T'], { K: M.IRON, F: x === 100 ? M.TEE_G : M.LOCO_Y, T: M.TIRE }, x, 115);
    // Café garden in front of the tenements: parasols, a lattice fence with flower boxes, strings of bulbs
    for (const x of [203, 218, 233]) {
      w.rect(x, 104, 1, 13, M.STEEL_LT);
      w.rect(x - 1, 100, 3, 1, M.PARASOL); w.rect(x - 4, 101, 9, 1, M.PARASOL); w.rect(x - 6, 102, 13, 1, M.PARASOL); w.rect(x - 6, 103, 13, 1, M.PARASOL_D);
      for (const dx of [-6, -3, 0, 3, 6]) w.px(x + dx, 104, M.PARASOL);
    }
    for (let x = 198; x < 239; x += 3) w.tube(x, 105 + (x % 2), M.PARASOL_D, N.BULB, w.cafeG);
    for (const x of [201, 216, 231]) { w.rect(x, 111, 5, 1, M.SLAB); w.px(x + 2, 112, M.IRON); }
    w.depth = 3;
    for (let x = 196; x < 240; x++) {
      for (let y = 114; y < 119; y++) w.px(x, y, y === 114 || y === 118 || (x + y) % 4 === 0 || (x - y + 400) % 4 === 0 ? M.LATTICE : M.OAK_D);
      w.px(x, 113, r() < 0.45 ? M.LEAF : r() < 0.5 ? M.PETAL_R : M.PETAL_P);
    }
    w.depth = 2;
    // Jubilee board with the four colours of the city's 500-lecie logo
    w.rect(65, 116, 1, 4, M.IRON); w.rect(83, 116, 1, 4, M.IRON);
    [M.LOCO_Y, M.FLAG_R, M.J_BLUE, M.SURROUND].forEach((m, i) => w.rect(64 + i * 5, 105, i === 3 ? 6 : 5, 2, m));
    w.hsign(64, 107, 21, 9, '500', { font: 5, n: N.PAPER, g: w.softGroup, board: M.J_NAVY, off: M.SURROUND });
  };

  // ---- Sky. The view looks south: the sun rises behind the belfry on the left, stands over the roofs at noon
  // and goes down behind Dom Sedlaczka on the right. The moon follows the same way, hours later.
  const buildClouds = (w) => {
    const r = rng(500);
    w.cumulus = [[-20, 31, 1.3, 36], [96, 44, 0.9, 22], [214, 27, 1.1, 30], [300, 50, 0.8, 18]].map(([x, y, v, len]) => {
      // Flat-based summer cumulus: a row of domes of different sizes, taller in the middle
      const cols = new Array(len).fill(0);
      for (let n = 0; n < Math.ceil(len / 5); n++) {
        const cx = 3 + r() * (len - 6);
        const rad = 2.5 + (1 - Math.abs(cx / len - 0.5) * 1.6) * (len / 5) * (0.6 + r() * 0.5);
        for (let i = 0; i < len; i++) if (Math.abs(i - cx) < rad) cols[i] = Math.max(cols[i], Math.sqrt(rad * rad - (i - cx) * (i - cx)));
      }
      return { x, y, v, cols: cols.map((c) => Math.max(1, Math.round(c))) };
    });
  };
  const drawSky = (w, dt, hour) => {
    if (hour < 18.6) {
      const t = clamp((hour - 12) / 6.6);
      const low = smooth(15.6, 17.6, hour);
      w.sun(mix(204, 300, t), mix(14, 84, t * t), low > 0.3 ? 6 : 5, low);
    } else if (hour > 29.2) {
      const t = clamp((hour - 29.2) / 6.8);
      const low = 1 - smooth(30.4, 32, hour);
      w.sun(mix(22, 204, t), mix(86, 14, Math.sqrt(t)), low > 0.3 ? 6 : 5, low);
    }
    const m = (hour - 19) / 10.6;
    if (m > 0 && m < 1) w.moon(mix(30, 310, m), 70 - Math.sin(m * Math.PI) * 52);
    w.drawStars();
    for (const c of w.cumulus) {
      c.x += c.v * dt;
      if (c.x > 366) c.x = -c.cols.length - 44;
      const cx = Math.round(c.x);
      for (let i = 0; i < c.cols.length; i++) {
        const top = c.cols[i];
        for (let j = 0; j <= top; j++) {
          const lit = j >= top - 1 && i < c.cols.length * 0.62;
          w.pxSky(cx + i, c.y - j, j === 0 || (j === 1 && bayer(cx + i, j) > 5) ? M.CLOUD_SH : lit ? M.CLOUD_HI : j < top * 0.4 && bayer(cx + i, c.y - j) > 11 ? M.CLOUD_SH : M.CLOUD);
        }
      }
    }
    // Swifts wheel round the turret while there is light
    if (w.dark < 0.55) for (let k = 0; k < 5; k++) {
      const a = w.t * (0.55 + k * 0.06) + k * 1.9;
      const x = Math.round(150 + Math.cos(a) * (40 + k * 11) + Math.sin(a * 2.7) * 6);
      const y = Math.round(34 + Math.sin(a * 1.6 + k) * 11 + k * 2);
      const up = Math.sin(w.t * 11 + k * 2) > 0 ? 1 : 0;
      w.pxSky(x, y, M.INK); w.pxSky(x - 1, y - up, M.INK); w.pxSky(x + 1, y - up, M.INK);
      if (!up) { w.pxSky(x - 2, y + 1, M.INK); w.pxSky(x + 2, y + 1, M.INK); }
    }
  };

  // Clock hands for the hour on the 12..36 clock: [cx, cy, radius]
  const drawHands = (w, [cx, cy, R], hour) => {
    const hand = (turn, len) => { for (let d = 0; d <= len; d += 0.5) w.px(Math.round(cx + Math.sin(turn * Math.PI * 2) * d), Math.round(cy - Math.cos(turn * Math.PI * 2) * d), M.IRON); };
    hand(hour % 1, R);
    hand((hour % 12) / 12, R - 1);
  };

  // A standing or walking figure; `paint` is w.px, or a painter that respects foreground scenery
  const figure = (paint, x, y, top, leg, hair, step, flip) => {
    if (step) { paint(x, y, leg); paint(x + 2, y, leg); paint(x, y - 1, leg); paint(x + 2, y - 1, leg); } else { paint(x + 1, y, leg); paint(x + 1, y - 1, leg); }
    for (let i = 0; i < 3; i++) {
      paint(x + i, y - 2, leg);
      for (let j = 3; j < 7; j++) paint(x + i, y - j, top);
      paint(x + i, y - 7, M.SKIN); paint(x + i, y - 8, M.SKIN); paint(x + i, y - 9, hair);
    }
    paint(flip ? x + 2 : x, y - 8, hair);
  };

  // ---- Life on the square
  const drawCafe = (w, dt, hour) => {
    const back = (x, y, m) => w.pxBack(x, y, m);
    const open = hour < 24.3 || hour > 33;
    if (!open) return;
    const evening = hour > 16.8 && hour < 24.3;
    // Guests at the tables under the parasols, behind the lattice
    w.guests.forEach((g, n) => {
      if (!evening && n % 3 === 2) return;
      for (let i = 0; i < 3; i++) { back(g.x + i, 108, g.hair); back(g.x + i, 109, M.SKIN); back(g.x + i, 110, M.SKIN); for (let j = 111; j < 114; j++) back(g.x + i, j, g.top); }
      back(g.flip ? g.x + 2 : g.x, 109, g.hair);
      const sip = Math.sin(w.t * 0.7 + n * 1.9) > 0.8;
      back(g.flip ? g.x - 1 : g.x + 3, sip ? 110 : 111, evening ? M.BRONZE : M.SHIRT);
    });
    // The waiter goes from table to table and stops at each
    const wt = w.waiter;
    if (wt.wait > 0) wt.wait -= dt;
    else {
      wt.x += wt.dir * 7 * dt;
      if ((wt.dir > 0 && wt.x >= wt.to) || (wt.dir < 0 && wt.x <= wt.to)) {
        wt.x = wt.to;
        wt.wait = 2.5 + w.rand() * 3;
        wt.to = [198, 209, 224, 236][Math.floor(w.rand() * 4)];
        wt.dir = wt.to > wt.x ? 1 : -1;
      }
    }
    const x = Math.round(wt.x);
    figure(back, x, 117, M.SHIRT, M.APRON, M.HAIR, wt.wait > 0 ? 0 : Math.floor(wt.x / 2) % 2, wt.dir < 0);
    back(wt.dir < 0 ? x - 1 : x + 3, 112, M.STEEL_LT); back(wt.dir < 0 ? x - 2 : x + 4, 112, M.STEEL_LT);
  };

  // A rider leaning to the bars of a town bike, in two pedalling frames. Drawn facing right.
  const RIDER = ['....HH......', '....SS......', '...TTT......', '...TTTT.....', '...TTT.SK...', '...LLL..K...', '..KKLLLKK...'];
  const BIKE = [[...RIDER, '.WWKLKK.KWW.', 'W..WLK.KW..W', 'W..WL..KW..W', '.WW......WW.'], [...RIDER, '.WWKKLL.KWW.', 'W..W.KLKW..W', 'W..W...KW..W', '.WW......WW.']];
  const drawCyclist = (w, dt, hour) => {
    const b = w.rider;
    if (b.wait > 0) {
      b.wait -= dt;
      if (b.wait <= 0) { b.dir = -b.dir; b.x = b.dir > 0 ? -30 : 372; b.shirt = [M.TEE_G, M.SHIRT_B, M.TEE_Y, M.TEE_R][Math.floor(w.rand() * 4)]; }
      return;
    }
    b.x += b.dir * 24 * dt;
    if (b.x > 374 || b.x < -32) { b.wait = hour > 23.5 && hour < 30 ? 40 : 9 + w.rand() * 14; return; }
    const x = Math.round(b.x);
    w.rect(x + 2, 126, 8, 1, M.WALK_D);
    w.sprite(BIKE[Math.floor(b.x / 4 + 400) % 2], { H: M.HAIR, S: M.SKIN, T: b.shirt, L: M.DENIM, K: M.IRON, W: M.TIRE }, x, 115, b.dir < 0);
    if (w.dark > 0.3) { w.pxLight(b.dir > 0 ? x + 10 : x + 1, 120, N.HEAD); w.pxLight(b.dir > 0 ? x + 1 : x + 10, 121, N.TAIL); }
  };

  const drawGroup = (w, dt, hour) => {
    // A guided group crossing the square behind a yellow pennant, by day
    const g = w.tour;
    g.x += 4.2 * dt;
    if (g.x > 400) g.x = -150;
    if (hour > 17.8 && hour < 33) return;
    g.who.forEach((p, n) => {
      const x = Math.round(g.x - p.back);
      figure((px, py, m) => w.px(px, py, m), x, p.y, p.top, p.leg, p.hair, Math.floor((g.x - p.back) / 2 + n) % 2, false);
      w.px(x, p.y + 1, M.WALK_D); w.px(x + 2, p.y + 1, M.WALK_D);
      if (!n) { w.rect(x + 3, p.y - 13, 1, 9, M.IRON); w.rect(x + 4, p.y - 13, 3, 2, M.LOCO_Y); w.px(x + 4, p.y - 11, M.LOCO_Y); }
    });
  };

  const drawPigeons = (w, dt, hour, train) => {
    const about = hour < 19.4 || hour > 30;
    for (const p of w.pigeons) {
      const near = train && Math.abs((train.dir > 0 ? train.x + TRAIN : train.x) - p.hx) < 52;
      if (p.fly <= 0 && about && (near || w.scare > 0)) { p.fly = 5 + w.rand() * 4; p.x = p.hx; p.y = p.hy; p.vx = (w.rand() - 0.5) * 50; p.vy = -22 - w.rand() * 14; }
      if (p.fly > 0) {
        p.fly -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 3 * dt;
        const x = Math.round(p.x), y = Math.round(p.y), up = Math.sin(w.t * 24 + p.p) > 0 ? -1 : 1;
        w.px(x, y, M.PIGEON); w.px(x + 1, y, M.PIGEON); w.px(x - 1, y + up, M.PIGEON_D); w.px(x + 2, y + up, M.PIGEON_D);
        continue;
      }
      if (!about) continue;
      p.wait -= dt;
      if (p.wait < 0) { p.wait = 0.6 + w.rand() * 2.6; p.face = w.rand() < 0.5; p.step = Math.round((w.rand() - 0.5) * 6); }
      const x = p.hx + p.step, peck = Math.sin(w.t * 5 + p.p) > 0.5;
      w.sprite(peck ? ['....', 'DBB.', '.BBH', '.F..'] : ['..H.', 'DBB.', '.BB.', '.F..'], { H: M.PIGEON_D, B: M.PIGEON, D: M.PIGEON_D, F: M.BOARD_O }, x - 1, p.hy - 3, !p.face);
    }
    w.scare = Math.max(0, w.scare - dt);
  };

  // ---- Górnośląskie Koleje Wąskotorowe: an Lxd2 and three coaches, out towards Miasteczko and back towards Bytom.
  // Local columns count from the tail of the train to the nose of the engine; rows from the roof down to the wheels.
  const TRAIN = 188;
  const TOP = RAIL - 16;
  const trainNow = (w, hour) => {
    const c = (w.t + 8) % 76; // the first train is already on its way in when the scene opens
    const run = c >= 6 && c < 26 ? { dir: 1, x: -TRAIN - 30 + (c - 6) * 34 } : c >= 44 && c < 64 ? { dir: -1, x: 370 - (c - 44) * 34 } : null;
    if (!run) w.trainRuns = hour < 23 || hour > 31.5; // decided between trains, so one never vanishes mid-square
    return run && w.trainRuns ? run : null;
  };
  const drawTrain = (w, run) => {
    const base = Math.round(run.x);
    const X = (i, len) => (run.dir > 0 ? base + i : base + TRAIN - i - len);
    const R = (i, row, len, h, m) => w.rectBack(X(i, len), TOP + row, len, h, m);
    const L = (i, row, len, h, n, g = 2) => { for (let a = 0; a < len; a++) for (let b = 0; b < h; b++) { const x = X(i, len) + a, y = TOP + row + b; if (x >= -40 && x < 360 && w.sdepth[(y + 40) * 400 + x + 40] < 3) w.light(x, y, n, g); } };
    const wheels = (i) => { R(i, 13, 4, 2, M.TIRE); R(i + 1, 15, 2, 1, M.TIRE); R(i + 1, 13, 2, 1, M.STEEL_DK); };
    const lit = w.dark > 0.3;
    for (let c = 0; c < 3; c++) {
      const o = c * 48;
      const open = c === 1;
      R(o + 3, 1, 40, 1, M.COACH_ROOF); R(o + 1, 2, 44, 1, M.COACH_ROOF); R(o + 2, 3, 42, 1, M.COACH_ROOF_D);
      R(o + 5, open ? 8 : 4, 36, open ? 4 : 8, open ? M.COACH_OAK : M.COACH);
      if (!open) R(o + 5, 9, 36, 1, M.COACH_D);
      for (let k = 0; k < 6; k++) R(o + 5 + k * 7, 4, 1, 8, M.COACH_OAK);
      for (let k = 0; k < 5; k++) {
        const seat = ((k + c * 5) * 2654435761) >>> 29;
        if (open) {
          // Summer car: people on the benches under the roof
          if (seat < 6) { R(o + 8 + k * 7, 5, 2, 1, [M.HAIR, M.COAT][seat & 1]); R(o + 8 + k * 7, 6, 2, 1, M.SKIN); R(o + 7 + k * 7, 7, 4, 1, [M.TEE_R, M.SHIRT_B, M.TEE_Y, M.SHIRT, M.TEE_G, M.SHIRT_P][seat]); }
          if (lit && k % 2 === 0) { R(o + 9 + k * 7, 4, 1, 1, M.PARASOL_D); L(o + 9 + k * 7, 4, 1, 1, N.BULB); }
        } else {
          R(o + 7 + k * 7, 5, 4, 3, M.PANE);
          if (lit) L(o + 7 + k * 7, 5, 4, 3, N.WARM);
          if (seat < 4) { R(o + 8 + k * 7, 6, 2, 1, M.HAIR); R(o + 8 + k * 7, 7, 2, 1, lit ? M.OAK_D : M.SKIN); }
        }
      }
      for (const e of [1, 41]) { R(o + e, 8, 4, 1, M.IRON); R(o + (e === 1 ? 1 : 44), 9, 1, 3, M.IRON); }
      R(o + 1, 12, 44, 1, M.IRON); R(o + 46, 12, 2, 1, M.IRON);
      for (const i of [6, 12, 30, 36]) wheels(o + i);
    }
    // The engine: cab at the back, long hood, grey roofs, yellow band running into a chevron on the nose
    const o = 144;
    R(o + 2, 0, 13, 1, M.LOCO_ROOF); R(o + 1, 1, 15, 1, M.LOCO_ROOF_D);
    R(o + 2, 2, 13, 10, M.LOCO);
    R(o + 4, 3, 4, 4, M.PANE); R(o + 10, 3, 4, 4, M.PANE); R(o + 5, 3, 1, 1, M.PANE_L); R(o + 11, 3, 1, 1, M.PANE_L); R(o + 8, 3, 2, 9, M.LOCO_D);
    R(o + 15, 4, 27, 1, M.LOCO_ROOF); R(o + 15, 5, 27, 1, M.LOCO_ROOF_D);
    R(o + 15, 6, 27, 6, M.LOCO);
    for (let i = 18; i < 38; i += 2) R(o + i, 6, 1, 2, M.LOCO_D);
    R(o + 2, 8, 37, 1, M.LOCO_Y); R(o + 39, 9, 1, 1, M.LOCO_Y); R(o + 40, 10, 1, 1, M.LOCO_Y); R(o + 41, 9, 1, 1, M.LOCO_Y);
    R(o + 30, 2, 2, 2, M.IRON); R(o + 41, 3, 1, 1, M.IRON);
    R(o + 42, 6, 2, 6, M.LOCO_D); R(o + 43, 7, 1, 1, M.SHIRT); R(o + 43, 10, 1, 1, M.SHIRT);
    R(o, 12, 44, 1, M.LOCO_D);
    for (const i of [0, 43]) { R(o + i, 11, 1, 1, M.LOCO_Y); R(o + i, 12, 1, 1, M.IRON); R(o + i, 13, 1, 1, M.LOCO_Y); }
    R(o + 3, 13, 13, 1, M.IRON); R(o + 28, 13, 13, 1, M.IRON);
    for (const i of [4, 11, 29, 36]) wheels(o + i);
    R(o - 2, 12, 2, 1, M.IRON);
    if (lit) { L(o + 43, 7, 1, 1, N.HEAD, 1); L(o + 43, 10, 1, 1, N.HEAD, 1); L(o + 41, 3, 1, 1, N.HEAD, 1); L(0, 9, 1, 2, N.TAIL, 1); L(o + 4, 3, 4, 4, N.WARM_DIM); L(o + 10, 3, 4, 4, N.WARM_DIM); }
    // Diesel exhaust thinning out behind the stack
    for (let k = 0; k < 5; k++) {
      const age = (w.t * 1.6 + k * 0.62) % 3.1;
      const sx = X(o + 30, 2) - run.dir * Math.round(age * 9), sy = TOP + 1 - Math.round(age * 2.6);
      for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) if (bayer(sx + a, sy + b) > age * 5) w.pxBack(sx + a, sy + b, M.FUME);
    }
  };

  const draw = (w, dt, hour) => {
    drawSky(w, dt, hour);
    drawHands(w, w.clockChurch, hour);
    drawHands(w, w.clockHall, hour);
    // The flag by the town hall door
    const [fx, fy] = w.flagAt;
    for (let i = 0; i < 7; i++) {
      const wave = Math.round(Math.sin(w.t * 4.2 - i * 0.9) * (i / 6));
      w.px(fx + i, fy + wave, M.SHIRT); w.px(fx + i, fy + 1 + wave, M.SHIRT); w.px(fx + i, fy + 2 + wave, M.FLAG_R); w.px(fx + i, fy + 3 + wave, M.FLAG_R);
    }
    // The bell hangs still until a quick flick of the lens rings it
    const [bx, by] = w.bellAt;
    w.ring = Math.max(0, w.ring - dt);
    const s = Math.round(Math.sin(w.t * 9) * 2 * clamp(w.ring / 1.5));
    w.rect(bx - 1 + Math.sign(s), by, 3, 2, M.BRONZE); w.rect(bx - 1 + s, by + 2, 3, 1, M.BRONZE); w.rect(bx - 2 + s, by + 3, 5, 1, M.BRONZE); w.px(bx + s - Math.sign(s), by + 4, M.IRON);
    drawCafe(w, dt, hour);
    // Someone on the bench by day
    if (hour < 18.2 || hour > 31.5) {
      const [sx, sy] = w.benchAt;
      w.rect(sx, sy - 6, 3, 4, M.TEE_Y); w.rect(sx, sy - 9, 3, 3, M.SKIN); w.rect(sx, sy - 9, 3, 1, M.COAT); w.rect(sx + 1, sy - 2, 4, 1, M.DENIM); w.rect(sx + 4, sy - 1, 1, 2, M.DENIM);
      w.rect(sx + 3, sy - 6 + (Math.sin(w.t * 0.4) > 0.9 ? 1 : 0), 2, 2, M.SHIRT);
    }
    w.drawPeople(dt, hour);
    drawGroup(w, dt, hour);
    w.drawCat(dt, hour);
    drawCyclist(w, dt, hour);
    const train = trainNow(w, hour);
    drawPigeons(w, dt, hour, train);
    if (train) drawTrain(w, train);
  };

  // Ground mist lies over the meadow and the track around sunrise
  const post = (w, dt, hour) => {
    const mist = smooth(28.6, 29.8, hour) * (1 - smooth(31.2, 32.6, hour));
    if (mist < 0.02) return;
    const pix = w.rgba;
    const tone = [mix(226, 74, w.dark), mix(224, 88, w.dark), mix(226, 108, w.dark)];
    for (let y = 114; y < 150; y++) {
      const depth = (0.12 + 0.88 * smooth(116, 142, y)) * mist;
      for (let x = 0; x < 400; x++) {
        const drift = Math.sin((x + w.t * 2.5) * 0.05 + y * 0.33) * 0.5 + 0.5;
        if (depth * (0.3 + 0.7 * drift) * 9 <= BAYER[(((y + 40) & 3) << 2) | (x & 3)]) continue;
        const i = ((y + 40) * 400 + x) * 4;
        pix[i] = mix(pix[i], tone[0], 0.5); pix[i + 1] = mix(pix[i + 1], tone[1], 0.5); pix[i + 2] = mix(pix[i + 2], tone[2], 0.5);
      }
    }
  };

  const build = (w, ctx) => {
    M = ctx.M;
    N = ctx.N;
    w.noSignal = true;
    w.walkTop = FOOT;
    w.roadTop = KERB + 2;
    // Lights, on the 12..36 clock; every group is off at both noons
    w.lampG = w.addGroup(18.4, 29.7, 'neon', { soft: true });
    w.floodG = w.addGroup(18.8, 28.9, 'room');
    w.clockG = w.addGroup(18.1, 30.2, 'room');
    w.councilG = w.addGroup(17.4, 20.6, 'room');
    w.cafeG = w.addGroup(17.7, 24.4);
    w.barG = w.addGroup(17.9, 23.2, 'room');
    w.shopG = w.addGroup(17.5, 21, 'room');
    // Far roofs and trees, seen down ul. Gliwicka and between the houses
    w.depth = 0;
    const far = rng(42);
    for (let x = -40; x < 360;) {
      const wd = 7 + Math.floor(far() * 11), top = 98 + Math.floor(far() * 9);
      if (far() < 0.3) for (let dx = 0; dx < wd; dx++) w.rect(x + dx, top - 4 + Math.round(Math.abs(dx - wd / 2) * 0.8), 1, 24, M.FARTREE);
      else { w.rect(x, top, wd, 22, M.FARROOF); w.rect(x + 1, top - 1, wd - 2, 1, M.FARROOF); w.light(x + 2, top + 4, N.WARM_DIM, w.farWin[x & 3]); }
      x += wd;
    }
    w.depth = 2;
    buildGround(w);
    buildChurch(w);
    buildBelfry(w);
    buildRatusz(w);
    // The lime that hides the seam between church and town hall
    w.rect(89, 100, 2, 18, M.TRUNK); w.px(88, 117, M.TRUNK); w.px(91, 117, M.TRUNK);
    crown(w, [[90, 96, 9, 7], [84, 89, 7, 7], [95, 88, 7, 7], [90, 80, 8, 7]], 3, [M.LEAF_D, M.LIMELEAF, M.LIMELEAF_L]);
    buildFrontage(w);
    buildSquare(w);
    buildClouds(w);
    // Tall grass in front of the rails, so the wheels run behind it
    w.depth = 3;
    const r = rng(1853);
    for (let x = -40; x < 360; x++) if (r() < 0.34) { const h = 1 + Math.floor(r() * 3); w.rect(x, RAIL + 2 - h, 1, h, r() < 0.4 ? M.GRASS_L : M.GRASS_D); if (h === 3 && r() < 0.4) w.px(x, RAIL - 1, [M.PETAL_W, M.PETAL_R, M.LOCO_Y][x & 1 ? 0 : (x >> 1) % 3]); }
    w.depth = 2;

    // Actors
    w.cat.x = 13; w.cat.y = 110; // on the limestone wall by the belfry
    w.ring = 0; w.scare = 0; w.trainRuns = true;
    w.personStyles.red = [M.TEE_R, M.DENIM, M.HAIR];
    w.personStyles.green = [M.TEE_G, M.SHORTS, M.COAT];
    w.personStyles.yellow = [M.TEE_Y, M.DENIM, M.HAIR];
    w.personStyles.dress = [M.SHIRT_P, M.SKIN, M.COAT];
    w.personStyles.blue = [M.SHIRT_B, M.SHORTS, M.HAIR];
    for (const [x, y, dir, speed, style, nightOnly] of [[20, 121, 1, 5, 'red'], [70, 123, -1, 4, 'dress'], [118, 120, 1, 6, 'blue'], [150, 124, -1, 5, 'shirt'], [204, 122, 1, 4, 'green'], [246, 121, -1, 6, 'yellow'], [288, 123, 1, 5, 'coat'], [330, 122, -1, 4, 'red'], [44, 124, 1, 7, 'blue'], [172, 120, -1, 3, 'dress'],
      [96, 122, 1, 3, 'suit', true], [226, 124, -1, 4, 'green', true], [300, 121, -1, 3, 'coat', true]]) w.peds.push({ x, y, dir, speed, style, nightOnly, phase: x % 3 });
    w.guests = [[198, M.TEE_R, M.HAIR, 0], [207, M.SHIRT_B, M.COAT, 1], [212, M.SHIRT, M.HAIR, 0], [222, M.TEE_G, M.HAIR, 1], [227, M.SHIRT_P, M.COAT, 0], [236, M.TEE_Y, M.HAIR, 1]].map(([x, top, hair, flip]) => ({ x, top, hair, flip }));
    w.waiter = { x: 209, to: 224, dir: 1, wait: 2 };
    w.rider = { x: 372, dir: -1, wait: 0, shirt: M.TEE_G };
    w.tour = { x: 96, who: [[0, 123, M.TEE_R, M.DENIM, M.HAIR], [7, 124, M.SHIRT, M.SHORTS, M.COAT], [11, 122, M.TEE_Y, M.DENIM, M.HAIR], [16, 124, M.SHIRT_B, M.DENIM, M.COAT], [21, 123, M.SHIRT_P, M.SKIN, M.HAIR], [26, 124, M.TEE_G, M.SHORTS, M.HAIR]].map(([back, y, top, leg, hair]) => ({ back, y, top, leg, hair })) };
    w.pigeons = [[146, 128], [153, 129], [161, 128], [170, 129], [179, 128], [200, 129], [208, 128], [217, 129]].map(([hx, hy], n) => ({ hx, hy, p: n * 1.7, fly: 0, wait: n * 0.4, step: 0, face: n % 2 === 0, x: hx, y: hy, vx: 0, vy: 0 }));
  };

  CitySwitch.define('tarnowskie-gory-switch', {
    city: 'Tarnowskie Góry',
    label: 'Tarnowskie Góry day and night',
    tube: ['#f0b96a', '#8fd0c0'],
    body: ['#e9e5d8', '#121d2b'],
    glass: 'clear',
    sky: SKY,
    grade,
    palette,
    build,
    draw,
    post,
    startle: (w) => { w.cat.puff = 1.4; w.scare = 0.3; w.ring = 3.5; },
  });
})();
