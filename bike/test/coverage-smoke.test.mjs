"use strict";

import Device from '../Devices.mjs';
import '../Simulator.mjs'; // execute module side-effects (creates simulator instance)

test('bike smoke - Device basics', () => {
  const d = new Device(1, { x: 0, y: 0 }, 100, 10, false, 0);
  expect(d.cords).toEqual({ x: 0, y: 0 });

  // move should update cords when status <= 50
  d.move({ x: 5, y: 6 });
  expect(d.cords).toEqual({ x: 5, y: 6 });
});
