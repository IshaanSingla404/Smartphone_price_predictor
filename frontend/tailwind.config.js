/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./*.html', './js/*.js'],
  theme: {
    extend: {
      colors: {
        primary: '#d0bcff',
        'primary-container': '#a078ff',
        'primary-fixed': '#e9ddff',
        'primary-fixed-dim': '#d0bcff',
        'on-primary': '#3c0091',
        'on-primary-container': '#340080',
        'on-primary-fixed': '#23005c',
        'on-primary-fixed-variant': '#5516be',
        secondary: '#44e2cd',
        'secondary-container': '#03c6b2',
        'secondary-fixed': '#62fae3',
        'secondary-fixed-dim': '#3cddc7',
        'on-secondary': '#003731',
        'on-secondary-container': '#004d44',
        'on-secondary-fixed': '#00201c',
        'on-secondary-fixed-variant': '#005047',
        tertiary: '#c4c7c9',
        background: '#131315',
        surface: '#131315',
        'surface-dim': '#131315',
        'surface-bright': '#39393b',
        'surface-container-lowest': '#0e0e10',
        'surface-container-low': '#1c1b1d',
        'surface-container': '#201f22',
        'surface-container-high': '#2a2a2c',
        'surface-container-highest': '#353437',
        'surface-variant': '#353437',
        'on-surface': '#e5e1e4',
        'on-surface-variant': '#cbc3d7',
        outline: '#958ea0',
        'outline-variant': '#494454',
        'inverse-primary': '#6d3bd7'
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1.5rem',
        full: '9999px'
      },
      spacing: {
        'container-max': '1280px',
        'stack-sm': '12px',
        'stack-md': '24px',
        'stack-lg': '48px',
        'stack-xl': '96px',
        gutter: '32px',
        'margin-mobile': '24px',
        'margin-desktop': '64px'
      },
      fontFamily: {
        sans: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'display-xl': ['Geist', 'sans-serif'],
        'display-lg': ['Geist', 'sans-serif'],
        'display-lg-mobile': ['Geist', 'sans-serif'],
        'headline-md': ['Geist', 'sans-serif'],
        'headline-sm': ['Geist', 'sans-serif'],
        'body-lg': ['Geist', 'sans-serif'],
        'body-md': ['Geist', 'sans-serif'],
        'label-md': ['Geist', 'sans-serif'],
        'label-sm': ['Geist', 'sans-serif']
      },
      fontSize: {
        'display-xl': ['72px', { lineHeight: '1.1', letterSpacing: '-0.04em', fontWeight: '600' }],
        'display-lg': ['48px', { lineHeight: '1.2', letterSpacing: '-0.03em', fontWeight: '600' }],
        'display-lg-mobile': ['36px', { lineHeight: '1.2', fontWeight: '600' }],
        'headline-md': ['32px', { lineHeight: '1.3', letterSpacing: '-0.02em', fontWeight: '500' }],
        'headline-sm': ['24px', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '500' }],
        'body-lg': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'label-md': ['14px', { lineHeight: '1.2', letterSpacing: '0.02em', fontWeight: '500' }],
        'label-sm': ['12px', { lineHeight: '1', letterSpacing: '0.05em', fontWeight: '600' }]
      }
    }
  }
};
