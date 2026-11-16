// The content queue: the table under "## Queue" in docs/content-backlog.md, read by the harness
// (scripts/content/run.ts). One row is one job. The harness only ever changes a row's status.
export const KINDS = ['unit', 'checkpoint', 'repair'] as const;
export type Kind = (typeof KINDS)[number];
export type Job = {
  n: number;
  /** The unit id the job writes or repairs, e.g. es-a1-u7. */
  id: string;
  kind: Kind;
  brief: string;
  /** "todo", or "done (2026-11-15)". */
  status: string;
};

const cells = (line: string) =>
  line
    .split(/(?<!\\)\|/)
    .slice(1, -1)
    .map((cell) => cell.trim());

/** The queue's rows in order. Throws on a row it cannot read, so a typo never hides a job. */
export function parseQueue(backlog: string): Job[] {
  const lines = backlog.split('\n');
  const start = lines.findIndex((line) => line.trim() === '## Queue');
  if (start < 0) throw new Error('docs/content-backlog.md has no "## Queue" section.');
  const end = lines.findIndex((line, index) => index > start && line.startsWith('## '));
  return lines
    .slice(start + 1, end < 0 ? undefined : end)
    .filter((line) => /^\|\s*\d+\s*\|/.test(line))
    .map((line) => {
      const [n, job, kind, brief, status] = cells(line);
      const id = /^`([a-z0-9-]+)`$/.exec(job)?.[1];
      if (
        !id ||
        !KINDS.includes(kind as Kind) ||
        !/^(todo|done \(\d{4}-\d{2}-\d{2}\))$/.test(status)
      )
        throw new Error(`Cannot read queue row ${n}: ${line.trim().slice(0, 90)}`);
      return { n: Number(n), id, kind: kind as Kind, brief, status };
    });
}

/** The backlog with one job's status cell replaced; every other character is left alone. */
export function withStatus(backlog: string, id: string, status: string): string {
  const lines = backlog.split('\n');
  const index = lines.findIndex((line) => cells(line)[1] === `\`${id}\``);
  if (index < 0) throw new Error(`No queue row for ${id}.`);
  const parts = lines[index].split(/(?<!\\)\|/);
  parts[parts.length - 2] = ` ${status} `;
  lines[index] = parts.join('|');
  return lines.join('\n');
}

/** The course a job belongs to: "es-a1" for es-a1-u7. */
export const courseOf = (id: string) => id.split('-').slice(0, 2).join('-');

/**
 * The next job to work on: the first that is not done, skipping jobs the harness has blocked and,
 * for new units and checkpoints, anything in a course where an earlier one is blocked (a unit
 * builds on the one before it; a repair does not).
 */
export function nextJob(queue: readonly Job[], blocked: ReadonlySet<string>): Job | undefined {
  const stuck = new Set(
    queue
      .filter((job) => blocked.has(job.id) && job.kind !== 'repair')
      .map((job) => courseOf(job.id)),
  );
  return queue.find(
    (job) =>
      job.status === 'todo' &&
      !blocked.has(job.id) &&
      (job.kind === 'repair' || !stuck.has(courseOf(job.id))),
  );
}
