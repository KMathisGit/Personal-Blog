// import all colors
const colors = require("tailwindcss/colors");

// lightblue is same as key in tailwind 2.2+
delete colors.lightBlue;

const purge = process.env.NODE_ENV === "production";

module.exports = {
  purge: { enabled: purge, content: ["src/**/*.{html,njk}"] },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundOpacity: {
        "01": "0.01",
        "02": "0.02",
        "025": "0.025",
      },
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: colors.white,
      black: colors.black,
      darkerBg: "#141519",
      darkBg: "#16161a",
      lightBg: "#242629",
      grayFont: "#94a1b2",
      purple: "#7f5af0",
      skyBlue: "#07a7f7",
    },
    fontFamily: {
      body: ["Trebuchet MS, Helvetica, sans-serif"],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
