#!/usr/bin/env node
// Fails on any high or critical advisory in production dependencies, except the few listed
// below. Each exception must have no patched release, stay out of the shipped app bundle, and
// carry a review date: after that date the audit fails again until someone re-checks it.
import { execFileSync } from 'node:child_process';

const accepted = {
  'https://github.com/advisories/GHSA-86w9-cpqp-85rv': {
    name: 'node-forge',
    until: '2026-11-08',
    reason:
      'No patched release (1.4.0 is the latest and affected). Used only by the Expo CLI and expo-updates code-signing tooling at build time; not in the app bundle.',
  },
  'https://github.com/advisories/GHSA-vfj7-8cjw-p6xm': {
    name: 'braces',
    until: '2026-11-08',
    reason:
      'No patched release (3.0.3 is the latest and affected). Used only by Metro’s file watcher through micromatch at build time; not in the app bundle.',
  },
};

let raw;
try {
  raw = execFileSync('npm', ['audit', '--omit=dev', '--json'], { encoding: 'utf8' });
} catch (error) {
  // npm audit exits non-zero when it finds anything; the JSON is still on stdout.
  raw = error.stdout;
}
const report = JSON.parse(raw);
if (report.error) {
  console.error('npm audit failed:', report.error.summary ?? report.error);
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const blocking = new Map();
const waived = new Map();
for (const vulnerability of Object.values(report.vulnerabilities ?? {}))
  for (const source of vulnerability.via)
    if (typeof source === 'object' && ['high', 'critical'].includes(source.severity)) {
      const exception = accepted[source.url];
      const target = exception && exception.until >= today ? waived : blocking;
      target.set(source.url, `${source.severity} ${source.name} ${source.range}: ${source.title}`);
    }

for (const [url, text] of waived)
  console.log(`Accepted until ${accepted[url].until}: ${text}\n  ${accepted[url].reason}`);
for (const [url, exception] of Object.entries(accepted))
  if (exception.until < today)
    console.error(`Exception for ${exception.name} expired on ${exception.until}: re-check ${url}`);

if (blocking.size) {
  console.error('\nHigh or critical production advisories:');
  for (const [url, text] of blocking) console.error(`- ${text}\n  ${url}`);
  process.exit(1);
}
console.log('\nNo unaccepted high or critical production advisories.');
