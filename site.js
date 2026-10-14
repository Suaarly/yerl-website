// Lightweight, accessible interactions. No tracking and no external libraries.
const toggle = document.querySelector('[data-menu-toggle]');
const mobileNav = document.querySelector('[data-mobile-nav]');
if (toggle && mobileNav) {
  toggle.addEventListener('click', () => {
    const opened = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!opened));
    mobileNav.hidden = opened;
  });
}

const search = document.querySelector('[data-catalog-search]');
if (search) {
  const cards = [...document.querySelectorAll('[data-catalog-item]')];
  const tabs = [...document.querySelectorAll('[data-filter]')];
  const count = document.querySelector('[data-results-count]');
  const empty = document.querySelector('[data-no-results]');
  let active = 'all';
  const params = new URLSearchParams(location.search);
  search.value = params.get('q') || '';
  const render = () => {
    const query = search.value.trim().toLocaleLowerCase();
    let visible = 0;
    cards.forEach(card => {
      const category = card.dataset.category || '';
      const text = card.dataset.search || '';
      const show = (active === 'all' || category === active) && text.toLocaleLowerCase().includes(query);
      card.hidden = !show;
      if (show) visible++;
    });
    if (count) count.textContent = String(visible);
    if (empty) empty.hidden = visible !== 0;
  };
  tabs.forEach(tab => tab.addEventListener('click', () => {
    active = tab.dataset.filter;
    tabs.forEach(t => { t.classList.toggle('active', t === tab); t.setAttribute('aria-pressed', String(t === tab)); });
    render();
  }));
  search.addEventListener('input', render);
  render();
}

const quiz = document.querySelector('[data-quiz]');
if (quiz) {
  const check = quiz.querySelector('[data-quiz-check]');
  const retry = quiz.querySelector('[data-quiz-retry]');
  const result = quiz.querySelector('[data-quiz-result]');
  check?.addEventListener('click', () => {
    const sections = [...quiz.querySelectorAll('[data-question]')];
    const unanswered = sections.some(section => !section.querySelector('input:checked'));
    if (unanswered) { result.textContent = quiz.dataset.missing; result.hidden = false; result.focus(); return; }
    let score=0;
    sections.forEach(section => {
      const selected = Number(section.querySelector('input:checked').value);
      const right = Number(section.dataset.answer);
      const good = selected === right;
      if (good) score++;
      section.classList.toggle('correct',good);
      section.classList.toggle('incorrect',!good);
      section.querySelector('[data-explanation]').hidden = false;
      section.querySelectorAll('input').forEach(x => x.disabled = true);
    });
    result.textContent = quiz.dataset.score.replace('{n}', String(score)).replace('{total}', String(sections.length));
    result.hidden=false; result.focus();
    check.hidden = true; retry.hidden = false;
  });
  retry?.addEventListener('click',()=>{
    quiz.querySelectorAll('input').forEach(x=>{x.checked=false;x.disabled=false;});
    quiz.querySelectorAll('[data-question]').forEach(q=>q.classList.remove('correct','incorrect'));
    quiz.querySelectorAll('[data-explanation]').forEach(x=>x.hidden=true);
    result.hidden = true; check.hidden = false; retry.hidden = true;
    quiz.scrollIntoView({behavior:'smooth',block:'start'});
  });
}
