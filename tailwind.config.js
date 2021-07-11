const purge = process.env.NODE_ENV === "production";

module.exports = {
  purge: { enabled: purge, content: ["src/**/*.{html,njk}"] },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
