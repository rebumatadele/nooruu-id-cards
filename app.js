(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const fields = ['employeeId','expiry','nameEn','nameOm','nameAm','roleEn','roleOm','station','contact'];
  const flag = 'assets/oromia-flag.webp';
  const logo = 'assets/nooruu-logo.jpg';
  let portrait = '';
  let batch = [];
  let printMode = 'single';
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const display = value => escape(value || '—');
  const dateLabel = value => value ? new Date(`${value}T12:00:00`).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}) : '—';

  function readForm() {
    const card = Object.fromEntries(fields.map(id => [id, $(id).value.trim()]));
    card.photo = portrait;
    return card;
  }
  function message(text, error = false) {
    $('formMessage').textContent = text;
    $('formMessage').style.color = error ? '#b4363a' : '#0d634d';
  }
  function valid(card) {
    if (!card.employeeId || !card.nameEn || !card.roleEn) {
      message('Add an employee number, English name and job title.', true);
      return false;
    }
    return true;
  }
  function front(card) {
    const secondary = [card.nameOm, card.nameAm].filter(Boolean).map(v => `<span class="card-alt-name">${escape(v)}</span>`).join('');
    return `<article class="id-card card-front" aria-label="Front of employee ID card">
      <div class="card-stripe"><i></i><i></i><i></i></div>
      <div class="card-body">
        <div class="card-top"><div class="card-company"><img src="${logo}" alt=""><div><b>NOORUU</b><small>EMPLOYEE IDENTIFICATION</small></div></div><div class="card-flag"><span>OROMIA<br>REGION</span><img src="${flag}" alt="Oromia flag"></div></div>
        <div class="card-mid"><div class="portrait">${card.photo ? `<img src="${escape(card.photo)}" alt="Employee portrait">` : '<div class="portrait-placeholder">PHOTO</div>'}</div>
          <div class="card-fields"><div class="card-field-block"><span class="card-label">Maqaa / Full name</span><strong class="card-name">${display(card.nameEn)}</strong>${secondary}</div>
          <div class="card-field-block"><span class="card-label">Gahee hojii / Job title</span><strong class="card-role">${display(card.roleEn)}</strong>${card.roleOm ? `<span class="card-small">${escape(card.roleOm)}</span>` : ''}</div>
          <div><span class="card-label">Bakka hojii / Station</span><span class="card-small">${display(card.station)}</span></div></div></div>
        <div class="card-bottom"><div><span class="card-label">Employee no.</span><strong class="card-id">${display(card.employeeId)}</strong></div><div class="card-valid"><span class="card-label">Valid until</span>${dateLabel(card.expiry)}</div></div>
      </div></article>`;
  }
  function back(card) {
    return `<article class="id-card card-back" aria-label="Reverse of employee ID card">
      <div class="card-stripe"><i></i><i></i><i></i></div><div class="card-body">
        <div class="back-head"><img src="${logo}" alt=""><div><b>NOORUU</b><span>Employee ID · Waraqaa eenyummaa hojjetaa</span></div></div>
        <div class="back-copy"><strong>This card identifies a Nooruu employee.</strong> It remains the property of Nooruu. If found, please contact the office shown below.<br><br><strong>Kaardiin kun hojjetaa Nooruu adda baasa.</strong> Yoo argattan, maaloo lakkoofsa armaan gadiitiin nu qunnamaa.</div>
        <div class="back-details"><div><span class="card-label">Employee number</span><b>${display(card.employeeId)}</b></div><div><span class="card-label">Office / emergency contact</span><b>${display(card.contact)}</b></div></div>
        <div class="back-foot">NOORUU · STAFF IDENTIFICATION · OROMIA, ETHIOPIA</div>
      </div></article>`;
  }
  function renderPreview() {
    const card = readForm();
    $('previewCards').innerHTML = front(card) + back(card);
  }
  function renderBatch() {
    $('batchCount').textContent = batch.length;
    $('batchList').innerHTML = batch.length ? batch.map((card,index) => `<div class="batch-item"><div><strong>${display(card.nameEn)}</strong><span>${display(card.employeeId)} · ${display(card.roleEn)}</span></div><button type="button" data-remove="${index}" aria-label="Remove ${escape(card.nameEn)}">×</button></div>`).join('') : '<div class="empty">No employees added yet. Fill in the form above and add the first card.</div>';
    $('batchList').querySelectorAll('[data-remove]').forEach(button => button.addEventListener('click', () => {
      batch.splice(Number(button.dataset.remove), 1);
      renderBatch();
    }));
  }
  function sheet(cards, side) {
    return `<section class="print-page">${cards.map(card => side === 'front' ? front(card) : back(card)).join('')}<span class="print-label">NOORUU · ${side.toUpperCase()} · Print at actual size (100%)</span></section>`;
  }
  function makePrint() {
    let cards;
    if (printMode === 'batch') {
      if (!batch.length) { message('Add at least one employee to the batch.', true); return false; }
      cards = batch;
    } else {
      const card = readForm();
      if (!valid(card)) return false;
      cards = [card];
    }
    const pages = [];
    for (let i = 0; i < cards.length; i += 8) {
      const group = cards.slice(i, i + 8);
      pages.push(sheet(group, 'front'), sheet(group, 'back'));
    }
    $('printRoot').innerHTML = pages.join('');
    return true;
  }
  function print(mode) {
    printMode = mode;
    if (makePrint()) {
      const images = [...$('printRoot').querySelectorAll('img')];
      Promise.all(images.map(img => img.complete ? Promise.resolve() : new Promise(resolve => { img.onload = resolve; img.onerror = resolve; }))).then(() => window.print());
    }
  }
  function download(name, content) {
    const url = URL.createObjectURL(new Blob([content], {type:'application/json'}));
    const a = document.createElement('a');
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function cleanImported(card) {
    if (!card || typeof card !== 'object' || !card.employeeId || !card.nameEn || !card.roleEn) throw Error('Each employee needs a number, English name and job title.');
    const clean = Object.fromEntries(fields.map(key => [key, String(card[key] ?? '').slice(0, 100)]));
    clean.photo = typeof card.photo === 'string' && /^data:image\/(png|jpeg|webp);base64,/.test(card.photo) ? card.photo : '';
    return clean;
  }
  fields.forEach(id => $(id).addEventListener('input', renderPreview));
  $('photo').addEventListener('change', event => {
    const file = event.target.files[0];
    if (!file) return;
    if (!['image/png','image/jpeg','image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) { message('Choose a PNG, JPG or WebP under 5 MB.', true); event.target.value = ''; return; }
    const reader = new FileReader();
    reader.onload = () => { portrait = String(reader.result); renderPreview(); message('Portrait loaded.'); };
    reader.readAsDataURL(file);
  });
  $('addButton').addEventListener('click', () => {
    const card = readForm();
    if (!valid(card)) return;
    if (batch.some(item => item.employeeId.toLowerCase() === card.employeeId.toLowerCase())) { message('That employee number is already in the batch.', true); return; }
    batch.push(card); renderBatch(); message(`${card.nameEn} added to batch.`);
  });
  $('newButton').addEventListener('click', () => { fields.forEach(id => $(id).value = ''); $('photo').value = ''; portrait = ''; renderPreview(); message('Ready for a new employee.'); $('employeeId').focus(); });
  $('clearButton').addEventListener('click', () => { if (batch.length && !confirm('Clear the entire batch?')) return; batch = []; renderBatch(); message('Batch cleared.'); });
  $('printButton').addEventListener('click', () => print('single'));
  $('printBatchButton').addEventListener('click', () => print('batch'));
  $('exportButton').addEventListener('click', () => { if (!batch.length) { message('Add employees to the batch before exporting.', true); return; } download('nooruu-employees.json', JSON.stringify({format:'nooruu-employee-cards',version:1,employees:batch},null,2)); message('Batch data exported. Keep this file private.'); });
  $('importButton').addEventListener('click', () => $('importFile').click());
  $('importFile').addEventListener('change', async event => {
    const file = event.target.files[0]; if (!file) return;
    try {
      if (file.size > 20 * 1024 * 1024) throw Error('JSON file is too large (20 MB maximum).');
      const data = JSON.parse(await file.text());
      if (data.format !== 'nooruu-employee-cards' || !Array.isArray(data.employees) || data.employees.length > 500) throw Error('Choose a Nooruu employee export with up to 500 cards.');
      const incoming = data.employees.map(cleanImported);
      const ids = incoming.map(c => c.employeeId.toLowerCase());
      if (new Set(ids).size !== ids.length) throw Error('The imported file contains duplicate employee numbers.');
      batch = incoming; renderBatch(); message(`${batch.length} employee cards imported.`);
    } catch (error) { message(error.message || 'Could not import the file.', true); }
    event.target.value = '';
  });
  renderPreview(); renderBatch();
})();
