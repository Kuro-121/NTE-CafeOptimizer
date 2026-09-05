// ── STORAGE KEYS ───────────────────────────────────────────────────────────
const DATA_KEY     = 'cafe_origen_data_v2';   // { dishes: {}, characters: {} } — keyed by name
const SETTINGS_KEY = 'cafe_origen_settings';

// Master data from data.json (never mutated, never stored)
let masterData = { ingredients: [], dishes: [], characters: [] };

// User state: { dishes: { [name]: { owned, level } }, characters: { [name]: { owned, level } } }
let userState = { dishes: {}, characters: {} };

let settings = { cafesOwned: 5, trendCategory: '', trendBonus: 1.0, popularityBonus: 0, hotoriCatDecor: false};
let lastView = null;

// ── LOAD ───────────────────────────────────────────────────────────────────
function init() {
  masterData = MASTER_DATA;
  I18N.apply();
  loadSettings();
  loadUserState();
  seedUserState();
  populateTrendDropdown();
  renderDishes();
  renderCharacters();
  updateRosterSummary();
  applySettings();
}

// Fills in default entries for any dish/character not yet in userState.
// This runs after loadUserState so existing saves are preserved.
function seedUserState() {
  masterData.dishes.forEach(d => {
    if (!userState.dishes[d.name]) userState.dishes[d.name] = { owned: false, level: 1 };
  });
  masterData.characters.forEach(c => {
    if (!userState.characters[c.name]) userState.characters[c.name] = { owned: false, level: 1 };
  });
  saveUserState();
}

function loadUserState() {
  try {
    const saved = localStorage.getItem(DATA_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Guard against corrupted array data from a previous bad save
      if (Array.isArray(parsed.dishes) || Array.isArray(parsed.characters)) {
        console.warn('Corrupt userState detected in localStorage, resetting.');
        localStorage.removeItem(DATA_KEY);
        return;
      }
      userState.dishes     = (parsed.dishes     && typeof parsed.dishes === 'object')     ? parsed.dishes     : {};
      userState.characters = (parsed.characters && typeof parsed.characters === 'object') ? parsed.characters : {};
    }
  } catch (e) {
    console.warn('Could not load user state:', e);
  }
}

function saveUserState() {
  try {
    localStorage.setItem(DATA_KEY, JSON.stringify(userState));
  } catch (e) {
    console.warn('Could not save user state:', e);
  }
}

function loadSettings() {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) settings = { ...settings, ...JSON.parse(saved) };
  } catch {}
}

function saveSettings() {
  settings.cafesOwned     = parseInt(document.getElementById('cafesOwned').value) || 1;
  settings.trendCategory  = document.getElementById('trendCategory').value;
  settings.trendBonus     = parseFloat(document.getElementById('trendBonus').value) || 0;
  settings.popularityBonus = parseFloat(document.getElementById('popularityBonus').value) || 0;
  settings.hotoriCatDecor = document.getElementById('hotoriCatDecor').checked;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function applySettings() {
  document.getElementById('cafesOwned').value     = settings.cafesOwned;
  document.getElementById('trendCategory').value  = settings.trendCategory;
  document.getElementById('trendBonus').value     = settings.trendBonus;
  document.getElementById('popularityBonus').value = settings.popularityBonus;
  document.getElementById('hotoriCatDecor').checked = !!settings.hotoriCatDecor;
}

// ── TABS ───────────────────────────────────────────────────────────────────
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
  });
});

// ── TREND DROPDOWN ─────────────────────────────────────────────────────────
function populateTrendDropdown() {
  const sel = document.getElementById('trendCategory');
  sel.innerHTML = `<option value="">${I18N.t('settings.none')}</option>`;

  // Collect options: dish types + ingredient names + ingredient categories (like 'Fruit')
  const dishTypes = [...new Set(masterData.dishes.map(d => d.type))].sort();
  const ingNames  = masterData.ingredients.map(i => i.name).sort();
  const ingCats   = [...new Set(masterData.ingredients.map(i => i.category).filter(Boolean))].sort();

  const addGroup = (type, items) => {
    if (!items.length) return;
    const grp = document.createElement('optgroup');
    grp.label = I18N.t(`trend.${type}`);
    items.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item;
      opt.textContent = I18N.data(type, item);
      if (item === settings.trendCategory) opt.selected = true;
      grp.appendChild(opt);
    });
    sel.appendChild(grp);
  };

  addGroup('dishTypes', dishTypes);
  addGroup('ingredientCategories', ingCats);
  addGroup('ingredients', ingNames);
}

// ── DISHES ─────────────────────────────────────────────────────────────────
function renderDishes() {
  const tbody = document.getElementById('dishTableBody');
  tbody.innerHTML = '';

  masterData.dishes.forEach(d => {
    if (!userState.dishes[d.name]) userState.dishes[d.name] = { owned: false, level: 1 };
    const us = userState.dishes[d.name];
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="text-align:center">
        <input type="checkbox" data-dish-owned="${d.name}" ${us.owned ? 'checked' : ''} />
      </td>
      <td>
        <select data-dish-lvl="${d.name}" style="width:70px">
          <option value="1" ${us.level == 1 ? 'selected' : ''}>L1</option>
          <option value="2" ${us.level == 2 ? 'selected' : ''}>L2</option>
        </select>
      </td>
      <td class="name-col">${I18N.data('dishes', d.name)}</td>
      <td class="type-col">${I18N.data('dishTypes', d.type)}</td>
      <td style="font-size:0.75rem;max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--text3)">${I18N.list('ingredients', d.ingredients)}</td>
      <td>${d.priceL1}</td>
      <td>${d.priceL2}</td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll('[data-dish-owned]').forEach(cb => {
    cb.addEventListener('change', () => {
      const name = cb.dataset.dishOwned;
      userState.dishes[name].owned = cb.checked;
      saveUserState(); updateRosterSummary();
    });
  });

  tbody.querySelectorAll('[data-dish-lvl]').forEach(sel => {
    sel.addEventListener('change', () => {
      const name = sel.dataset.dishLvl;
      userState.dishes[name].level = parseInt(sel.value);
      saveUserState();
    });
  });

  // ── Bulk toggle: Own All / Unown All
  const btnOwned = document.getElementById('btnToggleAllOwned');
  const allOwned = masterData.dishes.every(d => userState.dishes[d.name]?.owned);
  btnOwned.textContent = I18N.t(allOwned ? 'dishes.unownAll' : 'dishes.ownAll');
  btnOwned.classList.toggle('active', allOwned);
  btnOwned.onclick = () => {
    const nowAllOwned = masterData.dishes.every(d => userState.dishes[d.name]?.owned);
    masterData.dishes.forEach(d => {
      if (!userState.dishes[d.name]) userState.dishes[d.name] = { owned: false, level: 1 };
      userState.dishes[d.name].owned = !nowAllOwned;
    });
    saveUserState(); updateRosterSummary(); renderDishes();
  };

  // ── Bulk toggle: Set All L2 / Set All L1
  const btnLevel = document.getElementById('btnToggleAllLevel');
  const allL2 = masterData.dishes.every(d => userState.dishes[d.name]?.level === 2);
  btnLevel.textContent = I18N.t(allL2 ? 'dishes.setAllL1' : 'dishes.setAllL2');
  btnLevel.classList.toggle('active', allL2);
  btnLevel.onclick = () => {
    const nowAllL2 = masterData.dishes.every(d => userState.dishes[d.name]?.level === 2);
    masterData.dishes.forEach(d => {
      if (!userState.dishes[d.name]) userState.dishes[d.name] = { owned: false, level: 1 };
      userState.dishes[d.name].level = nowAllL2 ? 1 : 2;
    });
    saveUserState(); renderDishes();
  };
}

// ── CHARACTERS ─────────────────────────────────────────────────────────────
function renderCharacters() {
  const container = document.getElementById('charCards');
  container.innerHTML = '';

  masterData.characters.forEach(c => {
    if (!userState.characters[c.name]) userState.characters[c.name] = { owned: false, level: 1 };
    const us = userState.characters[c.name];
    const isOwned = us.owned;

    const card = document.createElement('div');
    card.className = `char-card${isOwned ? ' owned' : ''}`;

    // Build skills preview (read-only)
    const skillsHtml = (c.skills || []).map(s => `
      <div class="skill-item">
        <span class="skill-lvl">L${s.level}</span>
        <span class="skill-val">${s.val > 0 && s.type.includes('Traffic') ? '+'+s.val : s.val > 0 && s.val < 1 ? '+'+s.val.toFixed(3) : s.val}</span>
        <span class="skill-type">${I18N.data('skillTypes', s.type)}</span>
        ${s.tag !== 'None' ? `<span class="skill-tag">/ ${I18N.data(s.tag === 'Any' ? 'skillTags' : 'dishTypes', s.tag)}</span>` : ''}
        ${s.req > 0 ? `<span class="skill-req">${I18N.t('characters.requirement', { count: s.req })}</span>` : ''}
      </div>
    `).join('');

    card.innerHTML = `
      <div class="char-card-header">
        <div class="char-card-left">
          <span class="char-name">${I18N.data('characters', c.name)}</span>
          <span class="char-owned-badge ${isOwned ? 'owned' : 'unowned'}">${I18N.t(isOwned ? 'characters.owned' : 'characters.notOwned')}</span>
        </div>
        <span class="char-chevron">▼</span>
      </div>
      <div class="char-card-body">
        <div class="char-controls">
          <div class="char-control-item">
            <label>${I18N.t('characters.owned')}</label>
            <input type="checkbox" data-char-owned="${c.name}" ${isOwned ? 'checked' : ''} />
          </div>
          <div class="char-control-item">
            <label>${I18N.t('characters.level')}</label>
            <input type="number" min="1" max="5" value="${us.level || 1}" data-char-lvl="${c.name}" />
          </div>
        </div>
        <div class="skills-section">
          <div class="skills-title">${I18N.t('characters.skills')}</div>
          <div class="skill-list">${skillsHtml}</div>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  // Toggle open/close
  container.querySelectorAll('.char-card-header').forEach(header => {
    header.addEventListener('click', () => {
      header.closest('.char-card').classList.toggle('open');
    });
  });

  // Owned checkbox
  container.querySelectorAll('[data-char-owned]').forEach(cb => {
    cb.addEventListener('change', () => {
      const name = cb.dataset.charOwned;
      userState.characters[name].owned = cb.checked;
      const card = cb.closest('.char-card');
      const badge = card.querySelector('.char-owned-badge');
      if (cb.checked) {
        card.classList.add('owned');
        badge.className = 'char-owned-badge owned';
        badge.textContent = I18N.t('characters.owned');
      } else {
        card.classList.remove('owned');
        badge.className = 'char-owned-badge unowned';
        badge.textContent = I18N.t('characters.notOwned');
      }
      saveUserState(); updateRosterSummary();
    });
  });

  // Level input
  container.querySelectorAll('[data-char-lvl]').forEach(inp => {
    inp.addEventListener('change', () => {
      const name = inp.dataset.charLvl;
      userState.characters[name].level = Math.max(1, Math.min(5, parseInt(inp.value) || 1));
      inp.value = userState.characters[name].level;
      saveUserState();
    });
  });
}

// ── ROSTER SUMMARY ─────────────────────────────────────────────────────────
function updateRosterSummary() {
  const cafes = parseInt(document.getElementById('cafesOwned').value) || 1;
  const maxD = cafes, maxC = cafes * 2;
  const ownedDishes = masterData.dishes.filter(d => (userState.dishes[d.name] || {}).owned).length;
  const ownedChars  = masterData.characters.filter(c => (userState.characters[c.name] || {}).owned).length;

  document.getElementById('rosterSummary').innerHTML = `
    ${I18N.t('summary.dishes', { owned: ownedDishes, slots: maxD })}<br>
    ${I18N.t('summary.characters', { owned: ownedChars, slots: maxC })}<br>
    ${I18N.t('summary.dishCombos', { count: nCr(ownedDishes, Math.min(ownedDishes, maxD)) })}<br>
    ${I18N.t('summary.charCombos', { count: nCr(ownedChars, Math.min(ownedChars, maxC)) })}
  `;
}
['cafesOwned', 'trendCategory', 'trendBonus', 'popularityBonus', 'hotoriCatDecor'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => { saveSettings(); updateRosterSummary(); });
  document.getElementById(id).addEventListener('change', () => { saveSettings(); updateRosterSummary(); });
});

function nCr(n, r) {
  if (r > n || r < 0) return 0;
  if (r === 0 || r === n) return 1;
  r = Math.min(r, n - r);
  let result = 1;
  for (let i = 0; i < r; i++) result = result * (n - i) / (i + 1);
  return Math.round(result);
}

// ── OPTIMIZER ──────────────────────────────────────────────────────────────
document.getElementById('btnRun').addEventListener('click', () => {
  saveSettings();
  updateRosterSummary();
  runOptimizer();
});

function runOptimizer() {
  const { cafesOwned, trendCategory, trendBonus } = settings;
  const trendMatch = trendCategory.toLowerCase();
  const maxDishes = cafesOwned;
  const maxChars  = cafesOwned * 2;

  // Build trending ingredient set
  const trendingSubItems = trendMatch
    ? new Set(masterData.ingredients
        .filter(r => r.category.toLowerCase() === trendMatch)
        .map(r => r.name.toLowerCase()))
    : new Set();

  // Build owned dish pool from master data + user state
  const ownedDishes = [];
  masterData.dishes.forEach(d => {
    const us = userState.dishes[d.name] || {};
    if (!us.owned) return;
    const lvl = us.level || 1;
    const base = (lvl == 2) ? d.priceL2 : d.priceL1;
    const ingredients = d.ingredients.toLowerCase();
    const typeMatch = trendMatch && d.type.toLowerCase().includes(trendMatch);
    let subMatch = false;
    for (const sub of trendingSubItems) { if (ingredients.includes(sub)) { subMatch = true; break; } }
    const ingMatch = trendMatch && (ingredients.includes(trendMatch) || subMatch);
    const isTrending = typeMatch || ingMatch;
    ownedDishes.push({ name: d.name, type: d.type, basePrice: base + (isTrending ? trendBonus : 0), isTrending });
  });

  // Build owned character pool from master data + user state
  const ownedChars = [];
  masterData.characters.forEach(c => {
    const us = userState.characters[c.name] || {};
    if (!us.owned) return;
    const charLvl = us.level || 1;
    const skills = (c.skills || [])
      .filter(s => charLvl >= (s.level || 1) && s.val > 0)
      .map(s => ({ val: s.val, req: s.req || 0, type: s.type, tag: s.tag || 'None' }));
    if (skills.length > 0) ownedChars.push({ name: c.name, skills });
  });

  // Validation
  if (ownedDishes.length === 0) { showError('error.noOwnedDishes'); return; }
  if (ownedDishes.length < maxDishes) {
    showError('error.notEnoughDishes', { needed: maxDishes, cafes: cafesOwned, owned: ownedDishes.length });
    return;
  }

  const dishCombos = getBestMenusByType(ownedDishes, maxDishes);
  const charCombos = ownedChars.length > 0
    ? getCombinations(ownedChars, Math.min(ownedChars.length, maxChars))
    : [[]];

  let bestScore = 0, bestData = null;

  dishCombos.forEach(testMenu => {
    const tagCounts = {};
    testMenu.forEach(d => { tagCounts[d.type] = (tagCounts[d.type] || 0) + 1; });
    const maxTagCount = Math.max(...Object.values(tagCounts), 0);

    charCombos.forEach(testTeam => {
      let currentTraffic = 2400;
      let currentPriceBuff = 0;
      let currentPriceMultiplier = 1.0;
      const tempLog = [];

      function getTagCount(skill) {
        if (skill.tag === 'None') return 0;
        if (skill.tag === 'Any') return maxTagCount;
        return tagCounts[skill.tag] || 0;
      }
      function skillActivates(skill) {
        const tc = skill.tag === 'None' ? skill.req : getTagCount(skill);
        return tc >= skill.req;
      }
      function appendLog(name, traffic, price, multiplier) {
        const parts = [];
        if (traffic > 0)    parts.push({ key: 'buff.traffic', value: traffic.toFixed(2) });
        if (price > 0)      parts.push({ key: 'buff.price', value: price.toFixed(2) });
        if (multiplier > 0) parts.push({ key: 'buff.pricePercent', value: (multiplier * 100).toFixed(1) });
        if (!parts.length) return;
        const idx = tempLog.findIndex(l => l.name === name);
        if (idx >= 0) tempLog[idx].buffs.push(...parts);
        else tempLog.push({ name, buffs: parts });
      }

      // Pass 1: Flat skills
      testTeam.forEach(c => {
        let tt = 0, tp = 0, activated = false;
        c.skills.forEach(skill => {
          if (skill.type === 'Traffic_Multiply' || skill.type === 'Price_Multiply') return;
          if (!skillActivates(skill)) return;
          activated = true;
          if (skill.type === 'Traffic_Flat') tt += skill.val;
          if (skill.type === 'Price_Flat')   tp += skill.val;
        });
        if (activated) { currentTraffic += tt; currentPriceBuff += tp; appendLog(c.name, tt, tp, 0); }
      });

      // Pass 2: Traffic_Multiply (against post-flat traffic)
      let tt = 0, activated = false;
      testTeam.forEach(c => {
        let bonusTraffic = 0;
        c.skills.forEach(skill => {
          if (skill.type !== 'Traffic_Multiply') return;
          if (!skillActivates(skill)) return;
          activated = true;
          bonusTraffic += currentTraffic * skill.val;
        });
        tt += bonusTraffic;
        appendLog(c.name, bonusTraffic, 0, 0);
      });
      // Hotori Cat Decor: +1% traffic
      if (settings.hotoriCatDecor) {
        const hotoriCatDecorTrafficMultiply = 0.01;
        activated = true;
        const bonusTraffic = currentTraffic * hotoriCatDecorTrafficMultiply;
        tt += bonusTraffic;
        appendLog('Hotori Cat Decor', bonusTraffic, 0, 0);
      }
      if (activated) { currentTraffic += tt; }

      // Pass 3: Price_Multiply (multiplies final dish price)
      testTeam.forEach(c => {
        let pm = 0, activated = false;
        c.skills.forEach(skill => {
          if (skill.type !== 'Price_Multiply') return;
          if (!skillActivates(skill)) return;
          activated = true;
          pm += skill.val;
        });
        if (activated) { currentPriceMultiplier += pm; appendLog(c.name, 0, 0, pm); }
      });

      const trafficRatio = currentTraffic / 100;
      const totalIncome = testMenu.reduce((sum, d) =>
        sum + (d.basePrice + currentPriceBuff) * currentPriceMultiplier * trafficRatio, 0);

      if (totalIncome > bestScore) {
        bestScore = totalIncome;
        bestData = {
          dishes: testMenu, traffic: currentTraffic,
          priceBuff: currentPriceBuff, priceMultiplier: currentPriceMultiplier,
          income: totalIncome, log: tempLog
        };
      }
    });
  });

  if (!bestData) { showError('error.noRoster'); return; }
  showResults(bestData);
}

function getCombinations(array, size) {
  const result = [];
  function helper(start, combo) {
    if (combo.length === size) { result.push([...combo]); return; }
    for (let i = start; i < array.length; i++) helper(i + 1, [...combo, array[i]]);
  }
  helper(0, []);
  return result;
}

// Skills only depend on dish-type counts. For each possible count distribution,
// the most valuable menu is therefore the top-priced dishes from each type.
function getBestMenusByType(dishes, size) {
  const groups = [...new Set(dishes.map(d => d.type))].map(type => ({
    dishes: dishes.filter(d => d.type === type).sort((a, b) => b.basePrice - a.basePrice)
  }));
  const result = [];

  function build(groupIndex, remaining, menu) {
    if (groupIndex === groups.length) {
      if (remaining === 0) result.push(menu);
      return;
    }

    const group = groups[groupIndex].dishes;
    const laterCapacity = groups
      .slice(groupIndex + 1)
      .reduce((sum, item) => sum + item.dishes.length, 0);
    const minCount = Math.max(0, remaining - laterCapacity);
    const maxCount = Math.min(group.length, remaining);

    for (let count = minCount; count <= maxCount; count++) {
      build(groupIndex + 1, remaining - count, [...menu, ...group.slice(0, count)]);
    }
  }

  build(0, size, []);
  return result;
}

// ── RESULTS ────────────────────────────────────────────────────────────────
function showError(key, variables = {}) {
  lastView = { type: 'error', key, variables };
  document.getElementById('resultsArea').innerHTML = `
    <div class="results-placeholder">
      <div class="placeholder-icon">⚠️</div>
      <p style="color:var(--red)">${I18N.t(key, variables)}</p>
    </div>`;
}

function showResults(data) {
  lastView = { type: 'results', data };
  const { trendCategory, trendBonus } = settings;
  const trafficRatio = data.traffic / 100;

  const trendType = masterData.dishes.some(d => d.type === trendCategory)
    ? 'dishTypes'
    : masterData.ingredients.some(i => i.category === trendCategory)
      ? 'ingredientCategories'
      : 'ingredients';
  const trendHtml = trendCategory
    ? `<div style="font-family:var(--mono);font-size:0.78rem;color:var(--accent);margin-bottom:0.5rem">🔥 ${I18N.t('results.trend', { category: I18N.data(trendType, trendCategory), bonus: trendBonus.toFixed(2) })}</div>`
    : '';

  const statsHtml = `
    <div class="result-stat-row">
      <div class="result-stat">
        <div class="result-stat-label">${I18N.t('results.traffic')}</div>
        <div class="result-stat-value">${data.traffic.toFixed(2)}</div>
      </div>
      <div class="result-stat">
        <div class="result-stat-label">${I18N.t('results.priceBuff')}</div>
        <div class="result-stat-value">+${data.priceBuff.toFixed(2)}</div>
      </div>
      <div class="result-stat">
        <div class="result-stat-label">${I18N.t('results.priceMultiplier')}</div>
        <div class="result-stat-value">×${data.priceMultiplier.toFixed(3)}</div>
      </div>
      <div class="result-stat" style="border-color:var(--accent);background:rgba(245,166,35,0.06)">
        <div class="result-stat-label">${I18N.t('results.displayedIncome')}</div>
        <div class="result-stat-value">${data.income.toFixed(2)} <span style="font-size:0.7rem;color:var(--text3)">${I18N.t('unit.fonsPerHour')}</span></div>
      </div>
      <div class="result-stat" style="border-color:var(--accent);background:rgba(245,166,35,0.06)">
        <div class="result-stat-label">${I18N.t('results.actualIncome')}</div>
        <div class="result-stat-value">${(data.income * (1 + settings.popularityBonus)).toFixed(2)} <span style="font-size:0.7rem;color:var(--text3)">${I18N.t('unit.fonsPerHour')}</span></div>
      </div>
    </div>`;

  const dishesHtml = `
    <div class="result-section-title">🍽️ ${I18N.t('results.bestMenu')}</div>
    <div class="result-menu">
      ${data.dishes.map(d => {
        const finalPrice = (d.basePrice + data.priceBuff) * data.priceMultiplier;
        return `
          <div class="result-dish">
            <div class="result-dish-name">
              ${d.isTrending ? '<span class="trend-badge">🔥</span>' : ''}
              ${I18N.data('dishes', d.name)}
              <span style="font-size:0.7rem;color:var(--text3);font-family:var(--mono)">${I18N.data('dishTypes', d.type)}</span>
            </div>
            <div style="display:flex;gap:1rem;font-family:var(--mono);font-size:0.8rem">
              <span class="result-dish-price">${finalPrice.toFixed(2)} Fons</span>
              <span class="result-dish-income">${(finalPrice * trafficRatio).toFixed(2)}${I18N.t('unit.perHour')}</span>
            </div>
          </div>`;
      }).join('')}
    </div>`;

  const logHtml = data.log.length > 0 ? `
    <div class="result-section-title" style="margin-top:1rem">👥 ${I18N.t('results.characterBuffs')}</div>
    <div class="result-log">
      ${data.log.map(e => `
        <div class="log-entry">
          <span class="log-name">${I18N.data(e.name === 'Hotori Cat Decor' ? 'decorations' : 'characters', e.name)}</span>
          <span class="log-buffs">${e.buffs.map(buff => I18N.t(buff.key, { value: buff.value })).join(I18N.t('common.and'))}</span>
        </div>`).join('')}
    </div>` : '';

  document.getElementById('resultsArea').innerHTML = `
    <div class="results-output">${trendHtml}${statsHtml}${dishesHtml}${logHtml}</div>`;
}

// ── START ──────────────────────────────────────────────────────────────────
document.getElementById('languageSelect').addEventListener('change', event => {
  I18N.setLanguage(event.target.value);
});

document.addEventListener('languagechange', () => {
  populateTrendDropdown();
  renderDishes();
  renderCharacters();
  updateRosterSummary();
  if (lastView?.type === 'results') showResults(lastView.data);
  if (lastView?.type === 'error') showError(lastView.key, lastView.variables);
});

init();
