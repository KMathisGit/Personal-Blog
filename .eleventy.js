const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const renderPagination = require("./renderPagination");
const Nunjucks = require("nunjucks");

module.exports = function (eleventyConfig) {
  let nunjucksEnvironment = new Nunjucks.Environment(
    new Nunjucks.FileSystemLoader("src/_includes")
  );

  // ADD NUNJUCKS GLOBALS (OBJECT REFERENCES)
  nunjucksEnvironment.addGlobal("renderPagination", renderPagination);
  nunjucksEnvironment.addGlobal("isPostPage", (url) => {
    return url.includes("/posts/page/");
  });

  eleventyConfig.setLibrary("njk", nunjucksEnvironment);

  // SYNTAX HIGHLIGHTING PLUGIN
  eleventyConfig.addPlugin(syntaxHighlight, {
    // Change which syntax highlighters are installed
    templateFormats: ["njk", "md"], // default: "*"

    // init callback lets you customize Prism
    init: function ({ Prism }) {},

    // Added in 3.0, set to true to always wrap lines in `<span class="highlight-line">`
    // The default (false) only wraps when line numbers are passed in.
    alwaysWrapLineHighlights: false,

    // Added in 3.0.2, set to false to opt-out of pre-highlight removal of leading
    // and trailing whitespace
    trim: true,

    // Added in 3.0.4, change the separator between lines (you may want "\n")
    lineSeparator: "<br>",
  });

  // SHORT CODES
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // FILTERS
  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
  });

  eleventyConfig.addFilter("postTags", (tags) => {
    return tags.filter((tag) => !["post", "featured", "pages"].includes(tag));
  });

  eleventyConfig.addFilter("top", (arr, num) => {
    return arr.splice(0, num);
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
