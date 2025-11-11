module.exports = {
  content: [
    './src/**/*.html',
    './src/**/*.js' 
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        heading: ['"Space Mono"', 'monospace']
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
  safelist: [
    'tab-active','modal-open','modal-toggle','badge-outline','btn-ghost',
    'dropdown','dropdown-end','hidden','animate-bounce','btn-outline'
  ],
}