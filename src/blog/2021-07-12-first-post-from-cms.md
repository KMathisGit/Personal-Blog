---
title: First post from CMS!
description: This is my first time posting from the CMS tool!
author: Kevin Mathis
tags:
  - post
  - featured
  - css
date: 2021-07-12T01:36:06.142Z
image: /assets/blog/article-1.jpg
imageAlt: An image of my laptop
---

## Example code block

```html/1,2
<nav
  class="py-4 sticky top-0 bg-darkerBg text-grayFont shadow-lg w-full flex justify-center font-semibold z-10"
>
  <div
    class="w-full px-4 max-w-4xl sm:px-8 mx-auto flex items-center justify-between"
  >
    <a class="flex items-center" href="/">
      <img
        src="/assets/avatar.png"
        alt="face photo"
        width="48px"
        height="48px"
        class="mr-6"
      />
      <span class="text-white text-xl"></span>
    </a>
    <ul class="list-none flex text-lg">
      <li>Item</li>
    </ul>
  </div>
</nav>
```

<h3 class="anchor" id="anchor-text">
  Anchor Text
</h3>

```javascript
function myFunction() {
  let highlighted = true;
  return highlighted;
}
```

## Example using highlighted code block

```js/1,3/5-8
module.exports = function (eleventyConfig) {
  // SYNTAX HIGHLIGHTING PLUGIN
  eleventyConfig.addPlugin(syntaxHighlight, {
    alwaysWrapLineHighlights: false,
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

  // PASSTHROUGH BUILD COPIES
  eleventyConfig.addPassthroughCopy("./src/assets");
  eleventyConfig.addPassthroughCopy("./src/admin");
  return {
    dir: {
      input: "src",
    },
  };
};
```

Use `npm outdate` and `npm update` to check for and update to newer versions of your installed node modules using npm's built-in commands.
