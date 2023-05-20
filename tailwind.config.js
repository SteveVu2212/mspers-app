/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}',
  './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontfamily: {
				sans: ['ui-sans-serif', 'system-ui'],
				sansSerif: ['Open Sans', 'sans-serif'],
      },
      colors: {
				primary: "#ff6633",
        secondary: "#2879cb",
        tertiary: "#2e3745",
				reasonOrange: '#ff6633',
				reasonBlue: '#2879cb',
				reasonDarkBlue: '#2e3745',
				reasonYellow: '#f6b941',
				reasonGray: '#a69fa1',
				reasonLightBlue: '#6699cc',
				reasonGreen: '#669900',
				reasonRed: '#cc0000',
				bgLightGray: '#f5f5f5',
				bgMediumGray: '#d3d3d3',
			},
			boxShadow: {
				'custom': ' 0 5px 15px -3px rgba(0, 0, 0, 0.4)',
			  },
    },
  },
  plugins: [
	  require('flowbite/plugin')
  ]
}

