/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");
module.exports = {
	content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
	theme: {
		colors: {
			white: "#ffffff",
			dark: "#0f0f0f",
			darkText: "#f9f9f9",
			softDarkText: "#e4e4e4",
			softDark: "#121212",
			hoverDark: "#1b1b1b",
		},
		extend: {
			keyframes: {},
		},
	},
	plugins: [
		function ({ addUtilities }) {
			const newUtilities = {
				".flex-center": {
					display: "flex",
					"align-items": "center",
					"justify-content": "center",
				},
				".shadow": {
					filter: "drop-shadow(2px 8px 4px #05050570)",
				},
				".button": {
					"border-radius": "7px",
					cursor: "pointer",
					background:
						"linear-gradient(180deg, #232323 0%, #222 100%), rgba(255, 255, 255, 0.04)",
					"box-shadow":
						"0px 1px 1px 0px rgba(0, 0, 0, 0.55), 0px 1px 1px 0px rgba(255, 255, 255, 0.05) inset",
				},
				".flex-between": {
					display: "flex",
					"align-items": "center",
					"justify-content": "space-between",
				},
				".border-dark": {
					border: "1px solid #282828",
				},
				".border-light": {
					border: "1px solid #69696951",
				},
				".flex-col": {
					display: "flex",
					"flex-direction": "column",
				},

				".flex-row": {
					display: "flex",
					"flex-direction": "row",
				},
				".button-hover": {
					color: "#F28C28",
					"border-radius": "4px",
					"transition-property": "all",
					"transition-timing-function": "cubic-bezier(0.4, 0, 0.2, 1)",
					"transition-duration": "150ms",
					background: "rgb(38 38 38)",
					cursor: "pointer",
				},
			};
			addUtilities(newUtilities, ["responsive", "hover"]);
		},
		plugin(function ({ matchUtilities, theme }) {
			matchUtilities({
				"col-gap": (value) => {
					return {
						display: "flex",
						"flex-direction": "column",
						gap: value,
					};
				},
			});
		}),
	],
};
