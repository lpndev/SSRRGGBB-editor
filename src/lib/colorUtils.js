// Style bits
export const STYLES = {
  bold: { bit: 0x01, label: 'Bold' },
  underline: { bit: 0x02, label: 'Underline' },
  reverse: { bit: 0x04, label: 'Reverse' },
  italic: { bit: 0x08, label: 'Italic' },
  blink: { bit: 0x10, label: 'Blink' },
  hiBlack: { bit: 0x20, label: 'Hi Black' },
  bright: { bit: 0x40, label: 'Bright' },
  dim: { bit: 0x80, label: 'Dim' }
}

// Get style byte from styles object
export function getStyleByte(styles) {
  let byte = 0

  Object.keys(STYLES).forEach((key) => {
    if (styles[key]) byte |= STYLES[key].bit
  })

  return byte
}

// Generate SSRRGGBB format
export function get0xFormat(hex, styles) {
  const styleByte = getStyleByte(styles)
    .toString(16)
    .padStart(2, '0')
    .toUpperCase()

  return `0x${styleByte}${hex.replace('#', '').toUpperCase()}`
}

// Parse SSRRGGBB to hex and styles
export function parse0xFormat(value) {
  if (!value?.startsWith('0x') || value.length !== 10) return null

  const hex = value.substring(2)
  if (!/^[0-9A-Fa-f]{8}$/.test(hex)) return null

  const styleByte = parseInt(hex.substring(0, 2), 16)
  const color = '#' + hex.substring(2)

  const styles = {}

  Object.keys(STYLES).forEach((key) => {
    styles[key] = (styleByte & STYLES[key].bit) !== 0
  })

  return { color, styles }
}

// Convert hex to RGB
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null
}

// Convert hex to HSL
export function hexToHsl(hex) {
  const rgb = hexToRgb(hex)
  if (!rgb) return null

  let { r, g, b } = rgb
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h,
    s,
    l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
      default:
        h = 0
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}
