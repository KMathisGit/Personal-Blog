const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function (eleventyConfig) {
  // SYNTAX HIGHLIGHTING PLUGIN
  eleventyConfig.addPlugin(syntaxHighlight);

  // SHORT CODES
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // FILTERS
  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
  });

  eleventyConfig.addFilter("postTags", (tags) => {
    return tags.filter((tag) => !["post", "featured", "pages"].includes(tag));
  });

  // PASSTHROUGH BUILD COPIES
  eleventyConfig.addPassthroughCopy("./src/assets");
  eleventyConfig.addPassthroughCopy("./src/admin");
  return {
    dir: {
      input: "src",
    },
  };
};
