/** tailwind.config.js **/
module.exports = {
  content: [
    './**/*.html',
    './**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {

        fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace']
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
  safelist: [
    // classes que seu JS pode ativar/dessativar dinamicamente
    'tab-active','modal-open','modal-toggle','badge-outline','btn-ghost',
    'dropdown','dropdown-end','hidden','animate-bounce','btn-outline'
  ],
  daisyui: {
    themes: ['light','night']
  }
}
