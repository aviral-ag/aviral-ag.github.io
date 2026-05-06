/**
 * Project filters without Filterizr (avoids absolute positioning / grid overlap).
 */
document.addEventListener('DOMContentLoaded', () => {
  const holder = document.getElementById('project-card-holder')
  if (holder == null || holder.children.length === 0) return

  const buttons = document.querySelectorAll('.project-filtr-control')
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
    holder.closest('.projects-section')?.querySelector('.project-filtr-control[data-filter="all"]') ||
    buttons[0]
  if (defaultBtn) {
    setActive(defaultBtn)
    applyFilter((defaultBtn.getAttribute('data-filter') || 'all').toLowerCase())
  }
})
