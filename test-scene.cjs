const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const registry = new Map();
const context = vm.createContext({
  HTMLElement: class {
    attachShadow() {
      return { querySelector: () => ({ addEventListener() {} }) };
    }
  },
  customElements: {
    get: (tag) => registry.get(tag),
    define: (tag, element) => registry.set(tag, element),
  },
  matchMedia: () => ({ matches: false }),
});
context.window = context;
for (const file of ['city-switch.js', 'tarnowskie-gory.js']) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, file), 'utf8'), context, { filename: file });
}
const Switch = registry.get('tarnowskie-gory-switch');
assert.ok(Switch, 'the scene registers its custom element');
const world = new Switch().world;
const lights = ['lampG', 'floodG', 'clockG', 'councilG', 'cafeG', 'barG', 'shopG'];
const daylight = new Uint8Array(world.rgba.length);
for (const hour of [12, 17, 18.5, 22, 26, 29, 31, 36]) {
  for (let frame = 0; frame < 35; frame++) world.tick(1 / 30, hour);
  assert.equal(world.rgba.length, 400 * 190 * 4);
  assert.ok(world.rgba.some((value) => value > 0), `the scene renders at ${hour}`);
  assert.ok(world.groups.length < 256);
  if (hour === 12) daylight.set(world.rgba);
  if (hour === 12 || hour === 36) for (const name of lights) assert.equal(world.levels[world[name]], 0, `${name} is off at ${hour}`);
  if (hour === 22) {
    assert.notDeepEqual(world.rgba, daylight, 'night changes the scene');
    for (const name of ['lampG', 'floodG', 'clockG', 'cafeG', 'barG']) assert.ok(world.levels[world[name]] > 0.9, `${name} is lit at night`);
    assert.equal(world.levels[world.councilG], 0, 'the council chamber is dark by ten');
  }
  if (hour === 26) assert.equal(world.levels[world.cafeG], 0, 'the café garden has closed by two');
}

// The narrow-gauge train crosses in both directions on a 76-second cycle, the first already arriving as the scene
// opens, and leaves the track clear in between.
const trainRed = () => {
  let count = 0;
  for (let i = 170 * 400 * 4; i < 182 * 400 * 4; i += 4) if (world.rgba[i] > 190 && world.rgba[i + 1] < 95 && world.rgba[i + 2] < 50) count++;
  return count;
};
const until = (second) => { while ((world.t + 8) % 76 < second || (world.t + 8) % 76 > second + 1) world.tick(1 / 30, 12); };
until(34);
assert.equal(trainRed(), 0, 'the track is clear between trains');
assert.ok(world.pigeons.every((pigeon) => pigeon.fly <= 0), 'the pigeons have settled again after the train');

// A quick flick of the lens startles the cat, lifts the pigeons and rings the miners' bell.
world.startle();
world.tick(1 / 30, 14);
assert.ok(world.cat.puff > 0, 'the cat reacts to a quick drag');
assert.ok(world.ring > 0, 'the bell rings');
assert.ok(world.pigeons.every((pigeon) => pigeon.fly > 0), 'the pigeons take off');

const frozenTime = world.t;
const waiter = world.waiter.x;
world.tick(1 / 30, 22, { calm: true });
assert.equal(world.t, frozenTime, 'reduced motion stops the scene animation');
assert.equal(world.waiter.x, waiter, 'reduced motion stills the waiter');
assert.equal(world.levels[world.lampG], 1);

until(14);
assert.ok(trainRed() > 150, 'the engine passes towards Miasteczko');
until(53);
assert.ok(trainRed() > 150, 'and comes back towards Bytom');

// Optional raw frames let the same check produce a visual preview without browser dependencies.
if (process.argv[2]) {
  for (const hour of [12, 18, 22]) {
    world.tick(0, hour, { calm: true });
    fs.writeFileSync(path.join(process.argv[2], `tarnowskie-gory-${hour}.rgba`), world.rgba);
  }
}
console.log('Tarnowskie Góry: day, dusk, night, dawn, light schedules, startle, train cycle and reduced motion passed.');
