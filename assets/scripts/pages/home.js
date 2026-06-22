// Typing carousel — strip emoji / exotic Unicode that can confuse rendering
function stringForTyped(raw) {
  return raw
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/\uFE0F/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function initTypingCarousel() {
  const target = document.getElementById('ityped')
  const dataList = document.getElementById('typing-carousel-data')
  if (!target || !dataList) return

  const strings = Array.from(dataList.children)
    .map((el) => stringForTyped(el.textContent))
    .filter(Boolean)

  if (strings.length === 0) return

  const cursor = target.parentElement?.querySelector('.ityped-cursor')
  let stringIndex = 0
  let charIndex = 0
  let deleting = false

  const typeSpeed = 55
  const deleteSpeed = 32
  const pauseAfterType = 2200
  const pauseAfterDelete = 420

  const tick = () => {
    const current = strings[stringIndex]
    if (!current) return

    if (!deleting) {
      target.textContent = current.slice(0, charIndex + 1)
      charIndex += 1

      if (charIndex >= current.length) {
        deleting = true
        window.setTimeout(tick, pauseAfterType)
        return
      }
      window.setTimeout(tick, typeSpeed)
      return
    }

    charIndex -= 1
    target.textContent = current.slice(0, charIndex)

    if (charIndex <= 0) {
      deleting = false
      stringIndex = (stringIndex + 1) % strings.length
      window.setTimeout(tick, pauseAfterDelete)
      return
    }
    window.setTimeout(tick, deleteSpeed)
  }

  if (cursor) cursor.style.visibility = 'visible'
  window.setTimeout(tick, 320)
}

function initResumePreview() {
  const trigger = document.querySelector('.home-hero-resume-trigger')
  const wrap = document.querySelector('.home-hero-resume-wrap')
  const panel = document.getElementById('resume-preview-panel')
  if (!trigger || !wrap || !panel) return

  const iframe = panel.querySelector('.resume-preview-iframe')
  const openLink = panel.querySelector('.resume-preview-panel-open')
  const closeBtn = panel.querySelector('.resume-preview-panel-close')
  const previewUrl = trigger.dataset.resumePreview
  const openUrl = trigger.dataset.resumeOpen || trigger.href

  if (openLink) openLink.href = openUrl

  let closeTimer = null
  let iframeLoaded = false
  const hoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)').matches

  const loadIframe = () => {
    if (!iframe || !previewUrl || iframeLoaded) return
    iframe.src = previewUrl
    iframeLoaded = true
  }

  const openPanel = () => {
    window.clearTimeout(closeTimer)
    loadIframe()
    panel.classList.add('is-open')
    panel.setAttribute('aria-hidden', 'false')
    document.body.classList.add('resume-preview-open')
  }

  const closePanel = () => {
    panel.classList.remove('is-open')
    panel.setAttribute('aria-hidden', 'true')
    document.body.classList.remove('resume-preview-open')
  }

  const scheduleClose = () => {
    window.clearTimeout(closeTimer)
    closeTimer = window.setTimeout(closePanel, 180)
  }

  if (hoverCapable) {
    wrap.addEventListener('mouseenter', openPanel)
    wrap.addEventListener('mouseleave', scheduleClose)
    panel.addEventListener('mouseenter', openPanel)
    panel.addEventListener('mouseleave', scheduleClose)
  } else {
    trigger.addEventListener('click', (event) => {
      if (!panel.classList.contains('is-open')) {
        event.preventDefault()
        openPanel()
      }
    })
  }

  closeBtn?.addEventListener('click', closePanel)

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && panel.classList.contains('is-open')) {
      closePanel()
    }
  })
}

document.addEventListener('DOMContentLoaded', () => {
  initTypingCarousel()
  initResumePreview()
})
