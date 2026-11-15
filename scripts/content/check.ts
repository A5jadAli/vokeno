// npm run content:check -- <unit-id>     one unit against the content standard (exit 1 on a miss)
// npm run content:check -- --all         every unit, as a table (report only)
import { STANDARD, sessionMetrics, unitIds, unitProblems, unitSessions } from './lib';

const [target] = process.argv.slice(2);
if (!target) {
  console.error('Usage: npm run content:check -- <unit-id> | --all');
  process.exit(2);
}

const percent = (share: number) => `${Math.round(share * 100)}%`;

/** Rows as aligned columns, headed by the first row's keys. */
function table(rows: Record<string, string | number>[]) {
  const keys = Object.keys(rows[0]);
  const cells = [keys, ...rows.map((row) => keys.map((key) => String(row[key])))];
  const widths = keys.map((_, column) => Math.max(...cells.map((line) => line[column].length)));
  for (const line of cells)
    process.stdout.write(
      `${line
        .map((cell, column) => cell.padEnd(widths[column]))
        .join('  ')
        .trimEnd()}\n`,
    );
}

const unitRow = (id: string) => {
  const metrics = unitSessions(id).map(sessionMetrics);
  const marked = metrics.reduce((sum, m) => sum + m.marked, 0);
  return {
    unit: id,
    'new items (max)': Math.max(...metrics.map((m) => m.newItems)),
    'choice (max)': percent(Math.max(...metrics.map((m) => m.chooseShare))),
    produced: percent(metrics.reduce((sum, m) => sum + m.produced, 0) / (marked || 1)),
    'recycled (min)': Math.min(...metrics.map((m) => m.recycled)),
    misses: unitProblems(unitSessions(id)).length,
  };
};

if (target === '--all') {
  table(unitIds().map(unitRow));
  process.stdout.write(`\nStandard: ${JSON.stringify(STANDARD)}\n`);
} else {
  const sessions = unitSessions(target);
  const problems = unitProblems(sessions);
  if (sessions.length)
    table(
      sessions.map(sessionMetrics).map((m) => ({
        session: m.id,
        'new items': m.newItems,
        marked: m.marked,
        choice: percent(m.chooseShare),
        produced: m.produced,
        'thin choices': m.thinChoices,
        'spoken lines': m.spokenLines,
        recycled: m.recycled,
      })),
    );
  for (const problem of problems) console.error(`MISS  ${problem}`);
  process.stdout.write(
    problems.length ? `${problems.length} miss(es).\n` : 'Meets the content standard.\n',
  );
  process.exit(problems.length ? 1 : 0);
}
