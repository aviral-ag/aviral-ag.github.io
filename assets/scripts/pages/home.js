import { init } from 'ityped'

// Typing carousel — strip emoji / exotic Unicode that can confuse ityped rendering
function stringForTyped(raw) {
  return raw
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/\uFE0F/g, '')
    .replace(/\s+/g, ' ')
    .trim()
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
  const ul = document.getElementById('typing-carousel-data')?.children
  if (ul != null && ul.length > 0) {
    const strings = Array.from(ul)
      .map((el) => stringForTyped(el.textContent))
      .filter(Boolean)

    if (strings.length > 0) {
      init('#ityped', {
        strings,
        startDelay: 220,
        loop: true,
      })
    }
  }

  initResumePreview()
})
