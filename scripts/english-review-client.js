// Embedded into the generated reviewer page. No findings are sent over the network.
(() => {
  const packet = JSON.parse(document.querySelector('#packet').textContent);
  const status = document.querySelector('#status');
  const byId = (id) => document.getElementById(id);
  const records = [];
  let active;
  let storageKey;
  let storageWorks = true;
  const node = (tag, text, parent) => {
    const element = document.createElement(tag);
    if (text) element.textContent = text;
    if (parent) parent.append(element);
    return element;
  };
  const progress = () => {
    const current = records.map(({ key }) => active?.items[key]);
    const reviewed = current.filter((entry) => entry?.decision === 'checked').length;
    const changes = current.filter((entry) => entry?.decision === 'change').length;
    byId('progress').textContent =
      `${reviewed} items checked without an issue; ${changes} need changes; ${records.length - reviewed - changes} pending. Human sign-off is still a separate decision.`;
  };
  const persist = () => {
    if (!active) return;
    active.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(storageKey, JSON.stringify(active));
    } catch {
      storageWorks = false;
    }
    status.textContent = storageWorks
      ? 'Draft saved in this browser. Export to share or back it up.'
      : 'Browser storage is unavailable. Keep this page open and export your findings now.';
    progress();
  };
  const decision = (parent, key, label, evidence) => {
    const form = node('div', '', parent);
    form.className = 'decision';
    const id = `item-${records.length}`;
    const addSelect = (name, values, suffix) => {
      const labelNode = node('label', name, form);
      labelNode.htmlFor = id + suffix;
      const select = node('select', '', form);
      select.id = id + suffix;
      for (const [value, text] of values) {
        const option = node('option', text, select);
        option.value = value;
      }
      return select;
    };
    const choice = addSelect(
      `Decision: ${label}`,
      [
        ['pending', 'Not checked'],
        ['checked', 'No issue found'],
        ['change', 'Change needed'],
      ],
      '-decision',
    );
    const severity = addSelect(
      `Severity: ${label}`,
      [
        ['', 'Choose if a change is needed'],
        ['blocker', 'Blocker'],
        ['major', 'Major'],
        ['minor', 'Minor'],
      ],
      '-severity',
    );
    const labelNode = node('label', `Finding and suggested correction: ${label}`, form);
    const notes = node('textarea', '', labelNode);
    notes.id = `${id}-notes`;
    notes.maxLength = 2000;
    labelNode.htmlFor = notes.id;
    const record = { key, label, choice, severity, notes };
    records.push(record);
    for (const field of [choice, severity, notes]) {
      field.disabled = true;
      field.addEventListener('input', () => {
        active.items[key] = {
          ...evidence,
          label,
          decision: choice.value,
          severity: severity.value,
          notes: notes.value,
          reviewedAt: new Date().toISOString(),
        };
        persist();
      });
    }
  };
  const showStep = (parent, step) => {
    for (const field of ['title', 'intro', 'prompt', 'context', 'body', 'note', 'tip'])
      if (step[field]) node('p', step[field], parent);
    if (step.audio) node('p', `Listen first: ${step.audio}`, parent);
    if (step.kind === 'scene')
      for (const line of step.lines)
        node('p', `${line.speaker}: ${line.text}\nMeaning: ${line.meaning}`, parent).className =
          'script';
    if (step.kind === 'teach')
      for (const item of step.items)
        node(
          'p',
          `${item.target}\nMeaning: ${item.meaning}\n${item.note ?? ''}`,
          parent,
        ).className = 'script';
    if (step.options)
      step.options.forEach((text, index) =>
        node('p', `${index === step.answer ? 'Key' : 'Alternative'}: ${text}`, parent),
      );
    if (step.kind === 'build')
      node(
        'p',
        `Tile answer: ${step.answer.join(' ')}. Extra tiles: ${(step.extra ?? []).join(' / ')}`,
        parent,
      );
    if (step.accepted)
      node('p', `Accepted answers: ${step.accepted.join(' / ')}. Hint: ${step.hint}`, parent);
    if (step.pairs) for (const pair of step.pairs) node('p', pair.join(' → '), parent);
    if (step.fields)
      for (const field of step.fields)
        node('p', `${field.label}: ${field.accepted.join(' / ')}. Hint: ${field.hint}`, parent);
    if (step.examples) for (const text of step.examples) node('p', `Example: ${text}`, parent);
    if (step.explanation) node('p', `Feedback: ${step.explanation}`, parent);
    if (step.kind === 'speak') {
      node('p', 'Unscored self-practice. These models are optional in the app.', parent);
      for (const text of step.lines) node('p', text, parent);
      if (step.mission) {
        for (const text of step.mission.checks) node('p', `Self-check: ${text}`, parent);
        node('p', `Changed situation: ${step.mission.twist}`, parent);
      }
    }
  };
  for (const lesson of packet.lessons) {
    const details = node('details', '', byId('lessons'));
    node('summary', `Unit ${lesson.unit}: ${lesson.title}`, details);
    node('p', `${lesson.id} · version ${lesson.version}\n${lesson.outcome}`, details).className =
      'meta';
    lesson.steps.forEach((step, index) => {
      const section = node('section', '', details);
      node('h3', `Step ${index + 1}: ${step.kind}`, section);
      showStep(section, step);
      decision(
        section,
        `step:${lesson.id}:${lesson.version}:${index + 1}`,
        `${lesson.id}, step ${index + 1}`,
        { kind: 'script', lesson: lesson.id, version: lesson.version, step: index + 1 },
      );
    });
  }
  for (const clip of packet.audio) {
    const details = node('details', '', byId('audio'));
    details.dataset.variety = clip.variety;
    node('summary', `${clip.variety} · ${clip.speaker}: ${clip.script}`, details);
    const player = node('audio', '', details);
    player.controls = true;
    player.preload = 'none';
    player.src = clip.url;
    player.addEventListener('play', () => {
      for (const other of document.querySelectorAll('audio')) if (other !== player) other.pause();
    });
    node(
      'p',
      clip.sha256
        ? `File SHA-256: ${clip.sha256}`
        : 'File bytes are not verified against the current inventory. Re-run the audio audit before audio sign-off.',
      details,
    ).className = 'meta';
    decision(
      details,
      `audio:${clip.key}:${clip.sha256 ?? packet.snapshot}`,
      `${clip.key} (${clip.variety})`,
      { kind: 'audio', audioKey: clip.key, sha256: clip.sha256, variety: clip.variety },
    );
  }
  if (!packet.liveCalls?.length)
    node(
      'p',
      'No completed call recordings match the current coach instructions yet.',
      byId('live'),
    );
  for (const call of packet.liveCalls ?? []) {
    const details = node('details', '', byId('live'));
    node('summary', `${call.callId} · ${call.reference} · synthetic conversation`, details);
    const player = node('audio', '', details);
    player.controls = true;
    player.preload = 'none';
    player.src = call.url;
    player.addEventListener('play', () => {
      for (const other of document.querySelectorAll('audio')) if (other !== player) other.pause();
    });
    node('p', `Recording SHA-256: ${call.recordingHash}`, details).className = 'meta';
    for (const turn of call.turns)
      node(
        'p',
        `${turn.role === 'user' ? 'Synthetic learner' : 'Coach'}: ${turn.text}`,
        details,
      ).className = 'script';
    node('p', `After-call feedback: ${JSON.stringify(call.review)}`, details);
    decision(
      details,
      `live:${call.callId}:${call.reference}:${call.sourceHash}:${call.recordingHash}`,
      `${call.callId} live ${call.reference}`,
      {
        kind: 'live-call',
        callId: call.callId,
        reference: call.reference,
        sourceHash: call.sourceHash,
        recordingHash: call.recordingHash,
      },
    );
  }
  byId('variety').addEventListener('change', (event) => {
    for (const item of byId('audio').children)
      item.hidden = event.target.value !== 'all' && item.dataset.variety !== event.target.value;
  });
  byId('begin').addEventListener('click', () => {
    const reviewer = byId('reviewer').value.trim();
    const role = byId('role').value;
    if (!reviewer || !role) {
      status.textContent = 'Enter a reviewer code and choose a role first.';
      return;
    }
    for (const { choice, severity, notes } of records)
      choice.disabled = severity.disabled = notes.disabled = true;
    byId('export').disabled = true;
    storageKey = `vokeno-english-m3:${JSON.stringify([reviewer, role])}`;
    let saved;
    storageWorks = true;
    try {
      saved = localStorage.getItem(storageKey);
    } catch {
      storageWorks = false;
    }
    try {
      active = saved ? JSON.parse(saved) : { schema: 1, reviewer, role, items: {} };
      if (!active.items || active.reviewer !== reviewer || active.role !== role)
        throw new Error('Invalid saved review');
    } catch {
      status.textContent =
        'The saved review could not be read. Choose a new reviewer code to avoid overwriting it.';
      active = undefined;
      return;
    }
    active.snapshot = packet.snapshot;
    for (const { key, choice, severity, notes } of records) {
      const entry = active.items[key];
      choice.value = entry?.decision ?? 'pending';
      severity.value = entry?.severity ?? '';
      notes.value = entry?.notes ?? '';
      choice.disabled = severity.disabled = notes.disabled = false;
    }
    byId('export').disabled = false;
    status.textContent = storageWorks
      ? `Reviewing as ${reviewer} (${role}). Findings for other versions are preserved in the export.`
      : 'Browser storage is unavailable. You can review in this tab; export before closing it.';
    progress();
  });
  byId('export').addEventListener('click', () => {
    const currentKeys = records.map(({ key }) => key);
    const incomplete = currentKeys.some(
      (key) =>
        active.items[key]?.decision === 'change' &&
        (!active.items[key].severity || !active.items[key].notes.trim()),
    );
    if (incomplete) {
      status.textContent = 'Add a severity and explanation for each change before exporting.';
      return;
    }
    const payload = {
      ...active,
      exportedAt: new Date().toISOString(),
      currentKeys,
      humanSignOff: 'not implied by export',
    };
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }),
    );
    const link = node('a');
    link.href = url;
    link.download = 'english-m3-findings.json';
    link.click();
    URL.revokeObjectURL(url);
    status.textContent = 'Findings exported. Unchecked items remain pending.';
  });
})();
