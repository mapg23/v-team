"use strict";

import db from '../src/database.mjs';

test('api smoke - database module shape', () => {
  // don't call db.connect (would attempt a DB connection), just ensure functions exist
  expect(typeof db.query).toBe('function');
  expect(typeof db.select).toBe('function');
  expect(typeof db.insert).toBe('function');
});
