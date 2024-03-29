/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			typography: {
				DEFAULT: {
					css: {
						"code::before": {content: ''},
						"code::after": {content: ''}
					}
				}
			},
			screens: {
				'3xl': '1800px',
			},
			maxWidth: {
				'screen-3xl': '1800px',
			},
			colors: {
				'neutral': '#F9F4EF',
				'neutral-dark': '#0A0A0A',
				'neutral-gray': '#525252'
			},
			fontFamily: {
				'sans': ['DM Sans', {
					fontFeatureSettings: "'clig' off, 'liga' off"
				}],
				'serif': ['Martel', {
					fontFeatureSettings: "'clig' off, 'liga' off"
				}],
				'code': 'Source Code Pro'
			}
		},
	},
	plugins: [
		require('@tailwindcss/typography')
	],
}
