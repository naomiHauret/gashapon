const colors = require('tailwindcss/colors')
const plugin = require('tailwindcss/plugin')
const typography = {
  fontSizeMin: 1.125,
  fontSizeMax: 1.25,
  msFactorMin: 1.125,
  msFactorMax: 1.2,
  lineHeight: 1.6,
}

const screensRem = {
  min: 20,
  '2xs': 30,
  xs: 36,
  sm: 40,
  md: 48,
  lg: 64,
  xl: 80,
  '2xl': 85.364,
}

const fsMin = typography.fontSizeMin
const fsMax = typography.fontSizeMax
const msFactorMin = typography.msFactorMin
const msFactorMax = typography.msFactorMax
const screenMin = screensRem.min
const screenMax = screensRem['2xl']

// Calc min and max font-size
const calcMulti = (multiMin = 0, multiMax = null) => {
  return {
    fsMin: fsMin * Math.pow(msFactorMin, multiMin),
    fsMax: fsMax * Math.pow(msFactorMax, multiMax || multiMin),
  }
}

// build the clamp property
const clamp = (multiMin = 0, multiMax = null) => {
  const _calcMulti = calcMulti(multiMin, multiMax || multiMin)
  const _fsMin = _calcMulti.fsMin
  const _fsMax = _calcMulti.fsMax
  return `clamp(${_fsMin}rem, calc(${_fsMin}rem + (${_fsMax} - ${_fsMin}) * ((100vw - ${screenMin}rem) / (${screenMax} - ${screenMin}))), ${_fsMax}rem)`
}

const remToPx = (rem) => {
  return `${rem * 16}px`
}

module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    screens: {
      min: remToPx(screensRem.min),
      '2xs': remToPx(screensRem['2xs']),
      xs: remToPx(screensRem.xs),
      sm: remToPx(screensRem.sm),
      md: remToPx(screensRem.md),
      lg: remToPx(screensRem.lg),
      xl: remToPx(screensRem.xl),
      '2xl': remToPx(screensRem['2xl']),
    },
    fontFamily: {
      display: ['"Fredoka", sans-serif'],
      sans: ['"Be Vietnam Pro", sans-serif'],
      mono: ['"Inconsolata", monospace'],
    },
    fontSize: {
      '3xs': clamp(-5),
      '2xs': clamp(-2),
      xs: clamp(-1),
      sm: clamp(-0.5),
      base: clamp(0),
      ex: clamp(0.35),
      md: clamp(0.5),
      lg: clamp(1),
      xl: clamp(2),
      '2xl': clamp(3),
      '3xl': clamp(4),
      '4xl': clamp(5),
      '5xl': clamp(6),
      '6xl': clamp(7),
      '7xl': clamp(8),
      '8xl': clamp(9),
      '9xl': clamp(10),
    },
    fontVariationWidth: {
      125: 125,
      200: 200,
      250: 250,
      300: 300,
    },
    extend: {
      colors: {
        'brand-pink': '#FF98E8',
        'brand-indigo': '#7087FF',
        'brand-yellow': '#F4FF70',
        negative: colors.rose,
        positive: colors.emerald,
        warning: colors.yellow,
        neutral: colors.gray,
        'tinted-neutral': colors.slate,
      },
      keyframes: {
        appear: {
          from: {
            opacity: 0,
            transform: 'translateY(5px)',
          },
          to: {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
      },
      animation: {
        'card-rotation': 'card-rotation 2000ms linear infinite',
        appear: 'appear 300ms ease-in forwards',
      },
      height: {
        'fit-content': 'fit-content',
      },
      width: ({ theme }) => ({
        ...theme('screens'),
        'max-content': 'max-content',
        'fit-content': 'fit-content',
        'min-content': 'min-content',
      }),
      maxWidth: ({ theme }) => ({
        ...theme('width'),
        ...theme('screens'),
        unset: 'unset',
      }),
      minWidth: ({ theme }) => ({
        ...theme('width'),
        ...theme('screens'),
        unset: 'unset',
      }),
      opacity: {
        2.5: '0.025',
        3.5: '0.035',
        7.5: '0.075',
      },
      spacing: {
        '1ex': '1ex',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    plugin(({ addUtilities, theme, e }) => {
      const values = theme('fontVariationWidth')
      var utilities = Object.entries(values).map(([key, value]) => {
        return {
          [`.${e(`font-variation-width-${key}`)}`]: { 'font-variation-settings': `'wdth' ${value}` },
        }
      })
      addUtilities(utilities)
    }),
    require('tailwindcss-logical'),
    require('@tailwindcss/typography'),
  ],
}
