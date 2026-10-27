"""Check published pilot files and playback cutoffs. This does not judge spoken language.

Run after exporting the pilot inventory: python3 scripts/audit-english-pilot-audio.py
Only public lesson recordings are downloaded. Nothing is uploaded or replaced.
"""

import array
import concurrent.futures
import csv
import hashlib
import json
import subprocess
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

inventory = Path("docs/english-a1-pilot-audio.csv")
rows = list(csv.DictReader(inventory.open()))
clips = {row["key"]: row for row in rows}
rate = 24000


def inspect(item):
    key, row = item
    result = {"key": key, "variety": row["model_variety"], "script": row["script"]}
    try:
        with urllib.request.urlopen(row["recording_url"], timeout=30) as response:
            raw = response.read(2_000_001)
        if not raw or len(raw) > 2_000_000:
            raise ValueError("Empty or unexpectedly large recording")
        decoded = subprocess.run(
            ["ffmpeg", "-v", "error", "-i", "pipe:0", "-ac", "1", "-ar", str(rate),
             "-f", "f32le", "pipe:1"],
            input=raw, capture_output=True, check=True, timeout=20,
        ).stdout
        samples = array.array("f", decoded)
        if sys.byteorder != "little":
            samples.byteswap()
        if not samples:
            raise ValueError("No decoded samples")
        audible = [index for index, value in enumerate(samples) if abs(value) >= 0.01]
        duration = len(samples) / rate
        last = audible[-1] / rate if audible else 0
        cutoff = min(duration, float(row["voice_end_seconds"]) + 0.1)
        peak = max(abs(value) for value in samples)
        findings = []
        if not audible or peak < 0.02:
            findings.append("No clear signal above the technical threshold")
        if last > cutoff + 0.08:
            findings.append("Audible signal continues after the app playback cutoff")
        if sum(abs(value) >= 0.999 for value in samples) / len(samples) > 0.001:
            findings.append("Possible clipping: inspect the recording")
        result.update(
            sha256=hashlib.sha256(raw).hexdigest(), bytes=len(raw),
            duration_seconds=round(duration, 3), playback_cutoff_seconds=round(cutoff, 3),
            last_signal_seconds=round(last, 3), peak=round(peak, 5), findings=findings,
            status="needs inspection" if findings else "technical checks passed",
        )
    except Exception as error:
        # Report the exception class without copying URLs, request headers or credentials.
        result.update(status="failed", findings=[type(error).__name__])
    return result


with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    results = list(pool.map(inspect, sorted(clips.items())))
report = {
    "checked_at": datetime.now(timezone.utc).isoformat(),
    "inventory_sha256": hashlib.sha256(inventory.read_bytes()).hexdigest(),
    "scope": "Public MP3 download, decoding, signal, clipping and app playback cutoff only",
    "human_listening_review": "pending",
    "references": len(rows), "unique_recordings": len(results),
    "passed": sum(result["status"] == "technical checks passed" for result in results),
    "clips": results,
}
Path("docs/english-m3-audio-audit.json").write_text(json.dumps(report, indent=2) + "\n")
print(f"{report['passed']}/{len(results)} recordings passed technical checks. Human listening review pending.")
sys.exit(0 if report["passed"] == len(results) else 1)
