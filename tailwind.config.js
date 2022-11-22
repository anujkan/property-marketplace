/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		fontFamily: {
			sans: ["Bebas Neue", ...defaultTheme.fontFamily.sans],
			serif: ["Roboto", ...defaultTheme.fontFamily.serif],
			mono: ["Playfair Display", ...defaultTheme.fontFamily.mono],
		},
		extend: {},
	},
	plugins: [],
};
