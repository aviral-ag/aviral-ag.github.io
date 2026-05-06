/**
 * Skill category filters without Filterizr (pill cloud uses normal flex layout).
 */
document.addEventListener('DOMContentLoaded', () => {
  const section = document.querySelector('.skills-section.skills-pill-layout')
  if (section == null) return

  const holder =
    document.getElementById('skill-card-holder') ||
    document.getElementById('primary-skills')
  if (holder == null || holder.children.length === 0) return

  const buttons = section.querySelectorAll('.skill-filtr-control')
  if (buttons.length === 0) return

  function setActive (activeBtn) {
    buttons.forEach((b) => {
      b.classList.toggle('active', b === activeBtn)
      b.setAttribute('aria-pressed', b === activeBtn ? 'true' : 'false')
    })
  }

  function applyFilter (filter) {
    const items = holder.querySelectorAll('[data-category]')
    items.forEach((el) => {
      const raw = el.getAttribute('data-category') || ''
      const cats = raw.split(/\s*,\s*/).map((c) => c.trim()).filter(Boolean)
      const show = filter === 'all' || cats.includes(filter)
      el.classList.toggle('d-none', !show)
    })
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = (btn.getAttribute('data-filter') || 'all').toLowerCase()
      applyFilter(filter)
      setActive(btn)
    })
  })

  const defaultBtn =
    section.querySelector('.skill-filtr-control[data-filter="all"]') || buttons[0]
  if (defaultBtn) {
    setActive(defaultBtn)
    applyFilter((defaultBtn.getAttribute('data-filter') || 'all').toLowerCase())
  }
})
