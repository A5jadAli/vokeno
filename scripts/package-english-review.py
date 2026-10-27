"""Package the generated M3 review page and evidence, excluding credentials and human findings."""
import json
import re
import zipfile
from pathlib import Path

page = Path("docs/english-m3-review.html")
packet = json.loads(re.search(
    r'<script id="packet" type="application/json">(.*?)</script>', page.read_text(), re.S,
).group(1))
files = [
    page,
    *[Path("docs") / name for name in [
        "english-a1-pilot-review.md", "english-a1-pilot-scripts.md",
        "english-a1-pilot-audio.csv", "english-audio-models.csv",
        "english-m3-participant-guide.md", "english-m3-observations.csv",
        "english-m3-validation.md", "english-m3-audio-audit.json",
        "english-m3-live-results.json",
        "english-curriculum-plan.md", "english-curriculum-units.md",
        "english-curriculum-review-2026-10.md",
    ]],
]
if packet["liveCalls"]:
    files.append(Path("artifacts/english-m3-live/results.json"))
    files.extend(Path("artifacts/english-m3-live") / call["recording"] for call in packet["liveCalls"])
if any(not path.is_file() for path in files):
    raise SystemExit("A review artifact is missing. Regenerate the packet before packaging.")
Path("artifacts").mkdir(exist_ok=True)
output = Path("artifacts/english-m3-review-pack.zip")
readme = f"""Vokeno English M3 review

Extract this whole ZIP, then open docs/english-m3-review.html in a browser.
Choose a reviewer code and role. Export your findings regularly and return the JSON
through the channel agreed with the product owner. The page does not submit findings.
Do not edit the generated page to record findings.

Includes 12 sessions, 80 steps, 123 public lesson recordings linked from the page,
and {len(packet['liveCalls'])} captured synthetic coach calls included in this archive.
Internet access is needed to play the linked lesson recordings.
Coach samples are synthetic text-input tests, not learner microphone tests.
No native, teacher or learner sign-off is implied by this pack.

Beginner sessions: docs/english-m3-participant-guide.md
Blank observation sheet: docs/english-m3-observations.csv
Findings and remaining evidence: docs/english-m3-validation.md

Use the current pilot app build for navigation and real microphone testing.
Source-code links in the Markdown documents refer to the project repository.
The exported findings belong to the reviewer; keep learner-identifying data private.
Packet fingerprint: {packet['snapshot']}
"""
with zipfile.ZipFile(output, "w", zipfile.ZIP_DEFLATED) as archive:
    archive.writestr("START-HERE.txt", readme)
    for path in files:
        archive.write(path, path.as_posix())
print(f"Created {output} with {len(files)} evidence files and no human findings.")
