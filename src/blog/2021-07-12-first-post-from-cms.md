---
title: Three Popular Ways to Style your React Apps
author: Kevin Mathis
date: 2021-07-15
tags: ["post", "featured", "javascript", "react"]
image: /assets/blog/Three-pillars.webp
imageAlt:
description: When creating a react app there's many ways to solve how styling is handled. In this post I will walk through the 3 most popular methods and some of the pros and cons each of them bring about.
---

<h3 class="anchor" id="styling-react-applications">Styling React Applications</h3>

When it comes to styling your React application, there are many different ways to do so. To keep this simply I am going to break it down into 3 methods that have been adopted widely by the React community.

- Traditional CSS Modules
- CSS-in-JS
- Utility-first frameworks

<h3 class="anchor" id="traditional-css">Traditional CSS modules</h3>

This is probably the most common method used as it is most obvious way to style your React application. Most people today also use a CSS preprocessor such as [SASS](https://sass-lang.com/) to make writing their stylesheets easier.

Any time we want to create styles for something we go to a corrsponding stylesheet file to do so. With all these extra files, you will likely want to come up with a way to organize everything. Below is an example of a projects SCSS file architecture:

![SCSS file structure](/assets/blog/scss-structure.webp "SCSS file structure")

Adopting an architecture like this one allows you to continually manage styles easily as the size of you application continues to grow.

But for those out there that don't exactly like having to write styles in separate files have in recent times adopted what is known as CSS-in-JS.

<h3 class="anchor" id="css-in-js">CSS-in-JS</h3>

CSS-in-JS is exactly what it sounds like - you will be writing all of your styles in JS files. This allows you to use JS logic to create dynamic styles much easier. This method by itself has a few different ways to approach the situation.

The two most popular being:

- Inline styling
- Styled components

Inline styling is a simple approach where we just write our use the `style` attribute and put our styles in directly. However we can be smart about this and create re-usable objects to pass in instead.

```javascript
const styles = {
  Headers: {
    h1: {
      color: "#111",
      fontSize: "48px"
    },
    h2: {
      color: "#222",
      fontSize: "36px"
    }
  }
}

function App() {
 return (
   <>
      <h1 style={styles.Headers.h1}>H1 Header</h1>
      <h2 style={styles.Header.h2}>H2 Header</h2>
    </>
 );
```

Now typically you would be creating files dedicated to housing styles in and import them as needed. The great thing about this is since we are in JS we can do all sorts of dynamic styling. We could call a function with some props and have this function return back the proper set of styles for the scenario provided. But the bad thing about this method is some things just aren't possible such as `media queries` and `psuedo-selectors`

However the next approach solves the issue of not being able to write `media queries` and `psuedo-selectors`.

With styled components, we write true CSS in our JS. How can this be done you ask? Well the easiest way is to install this package: `npm install --save styled-components` (there's also another popular choice called `emotion` that is very similar and loved by many)

Now that we have the package installed, just import it where you would like to use it and prepare to have your mind blown. So if we re-create our previous example for the h1 and h2 elements it would look something like:

```javascript
const H1 = styled.h1`
  color: "#111",
  fontSize: "48px"
`;
const H2 = styled.h2`
  color: "#222",
  fontSize: "36px"
`;

function App() {
 return (
   <>
      <H1></H1>
      <H2></H2>
    </>
 );
```

Pretty awesome huh? And the really cool thing is that we can do `media-queries`, `psuedo-selectors`, and even `nesting`

Check out the following [documentation](https://styled-components.com/docs/basics) if you want to learn more about this package!

<h3 class="anchor" id="utility-first">Utility first frameworks</h3>
