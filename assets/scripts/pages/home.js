import { init } from 'ityped'

// Typing carousel — strip emoji / exotic Unicode that can confuse ityped rendering
function stringForTyped(raw) {
  return raw
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/\uFE0F/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

document.addEventListener('DOMContentLoaded', () => {
  const ul = document.getElementById('typing-carousel-data')?.children
  if (ul == null || ul.length === 0) return

  const strings = Array.from(ul)
    .map((el) => stringForTyped(el.textContent))
    .filter(Boolean)

  if (strings.length === 0) return

  init('#ityped', {
    strings,
    startDelay: 220,
    loop: true,
  })
})
