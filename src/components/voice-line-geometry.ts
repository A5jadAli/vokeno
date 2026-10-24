// The Voice line from the app icon, exactly as drawn: four cubic Béziers in icon units, with
// level ends, two small rises and the deep dip in the middle.
const MARK: [number, number][][] = [
  [
    [-38, -4],
    [-33, -4],
    [-31, -16],
    [-25, -16],
  ],
  [
    [-25, -16],
    [-18, -16],
    [-15, 28],
    [0, 28],
  ],
  [
    [0, 28],
    [15, 28],
    [18, -16],
    [25, -16],
  ],
  [
    [25, -16],
    [31, -16],
    [33, -4],
    [38, -4],
  ],
];

const bezier = (a: number, b: number, c: number, d: number, t: number) => {
  const u = 1 - t;
  return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d;
};

/** The mark as a dense polyline: x from 0 to 1, y 0 at the ends, -0.375 at the rises, 1 at the dip. */
export function markPoints(perCurve = 96) {
  const points: [number, number][] = [];
  MARK.forEach(([p0, p1, p2, p3], curve) => {
    for (let step = curve === 0 ? 0 : 1; step <= perCurve; step += 1) {
      const t = step / perCurve;
      const x = bezier(p0[0], p1[0], p2[0], p3[0], t);
      const y = bezier(p0[1], p1[1], p2[1], p3[1], t);
      points.push([(x + 38) / 76, (y + 4) / 32]);
    }
  });
  return points;
}

/**
 * One straight, round-ended piece of the line at its full shape, in pixels from the box's left
 * edge and its middle line: centre (x, y) and the run (dx, dy) from its start to its end.
 */
export type LineSegment = { x: number; y: number; dx: number; dy: number; length: number };

/**
 * The mark cut into equal pieces along its length, each about 0.8 of the stroke long, so the
 * round ends of neighbouring pieces overlap into one smooth stroke. At level `a` a piece moves
 * to y·a and turns to atan2(dy·a, dx); its length stays the full-shape length, which at lower
 * levels only overlaps its neighbours along the same line.
 */
export function voiceLineSegments(width: number, height: number, thickness: number) {
  const span = width - thickness;
  const reach = (height - thickness) / 2;
  const dense = markPoints().map(([x, y]) => [thickness / 2 + x * span, y * reach] as const);
  const distance = [0];
  for (let index = 1; index < dense.length; index += 1) {
    const [x0, y0] = dense[index - 1];
    const [x1, y1] = dense[index];
    distance.push(distance[index - 1] + Math.hypot(x1 - x0, y1 - y0));
  }
  const total = distance[distance.length - 1];
  const count = Math.max(8, Math.ceil(total / (thickness * 0.8)));
  const pointAt = (target: number) => {
    let index = 1;
    while (index < dense.length - 1 && distance[index] < target) index += 1;
    const [x0, y0] = dense[index - 1];
    const [x1, y1] = dense[index];
    const part = (target - distance[index - 1]) / (distance[index] - distance[index - 1] || 1);
    return [x0 + (x1 - x0) * part, y0 + (y1 - y0) * part] as const;
  };
  const points = Array.from({ length: count + 1 }, (_, index) => pointAt((index / count) * total));
  return points.slice(1).map(([x1, y1], index): LineSegment => {
    const [x0, y0] = points[index];
    return {
      x: (x0 + x1) / 2,
      y: (y0 + y1) / 2,
      dx: x1 - x0,
      dy: y1 - y0,
      length: Math.hypot(x1 - x0, y1 - y0),
    };
  });
}
