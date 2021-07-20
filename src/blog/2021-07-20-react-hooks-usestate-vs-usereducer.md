---
title: "React hooks: useState VS useReducer"
author: Kevin Mathis
date: 2021-07-20
tags: ["post", "featured", "javascript", "react"]
image: /assets/blog/hook.webp
imageAlt:
description: A question many React developers find themselves asking is what is the difference in useState and useReducer and when should one be chosen over the other. This article sets out to answer these questions one and for all.
---

<h3 class="anchor" id="react-hooks">React hooks</h3>

This article is going to be comparing a couple of [React Hooks](https://reactjs.org/docs/hooks-intro.html) and discussing how to determine when to use one over the other. If you are not familiar with [useState hook](https://reactjs.org/docs/hooks-reference.html#usestate) and [useReducer hook](https://reactjs.org/docs/hooks-reference.html#usereducer) I recommend checking them out before reading any further.

<h3 class="anchor" id="syntactical-differences">Syntactical differences</h3>

Both `useState()` and `useReducer()` hooks are used to manage the state of components, however there are some slight differences between the two that help determine which one better fits a scenario. Let's first look at the syntax of each hook and how we use them.

Let's imagine a case where we have a rectangle object with properties describing the dimensions and color and compare the difference in syntax.

```javascript
// Component
function Rectangle() {
  const [rectangle, setRectangle] = useState({
    width: 20,
    height: 20,
    color: "blue",
  });

  const setWidth = (newWidth) =>
    setRectangle({ ...rectangle, width: newWidth });
  const setHeight = (newHeight) =>
    setRectangle({ ...rectangle, height: newHeight });
  const setColor = (newColor) =>
    setRectangle({ ...rectangle, color: newColor });

  // return html...
}
```

```javascript
const rectangleReducer = (rectangle, action) => {
  switch(action.type) {
    case "width":
      return {...rectangle, width: action.payload};
    case "height":
      return {...rectangle, height: action.payload};
    case "color":
      return {...rectangle, color: action.payload};
    case:
      throw Error(`Unsupported action type: ${action.type}`);
  }
}

// Component
function Rectangle() {
  const [rectangle, dispatch] = useReducer(rectangleReducer, { width: 20, height: 20, color: "blue"});

  // return html...
}
```

So right away you may be thinking `useReducer()` requires more boilerplate code, which is true to some extent, however you will soon discover the benefits of it. Notice how the reducer function does not need to live inside the component. On the surface, this may not seem very beneficial but it is and here are some reasons why:

- Reduces overhead of state updates
- Allows for re-usable, generic reducers
- One Isolated function for all state updates

<h3 class="anchor" id="reducing-overhead">Reducing overhead</h3>

So to touch on the first point _reduces overhead of state updates_ - not only will we avoid re-instantiating this function on every component update the dispatch function reference also remains static and does not change. This is important when we want to provide the ability to update this state to child components.

Let's extend onto the example and look at how we would pass the ability to update state to a child component for both `useState()` and `useReducer()`

#### Using useState()

```javascript
// Component definition...

return (
  <ChildComponent
    setWidth={setWidth}
    setHeight={setHeight}
    setColor={setColor}
  ></ChildComponent>
);
```

#### Using useReducer()

```javascript
// Component definition...

return <ChildComponent dispatch={dispatch}></ChildComponent>;
```

As you can see, when it comes to working with the state updater it is much easier with the `useReducer()` hook. Also, those 3 functions to update width, height, and color in the `useState()` example will be re-instantiated every render thus causing even more overhead to the component updates.

However this re-instantiation issue can be avoided by wrapping [useCallback hooks](https://reactjs.org/docs/hooks-reference.html#usecallback) around each of those 3 functions, but that in itself introduces more weight to the component.

<h3 class="anchor" id="reusable-reducers">Reusability of reducers</h3>

A very powerful and under-used concept that `useReducer()` allows for is creating a reducer that can be imported and used across multiple components. You can also create reducers that can extend other reducers - this is incredibly powerful and known as _inversion of control_.

Here is fantastic post about this concept by Kent Dodds: [Inversion of Control](https://kentcdodds.com/blog/inversion-of-control).

<h3 class="anchor" id="isolated-function">Isolated update function</h3>

The last great benefit on the list was how reducers give us one function in which all state updates are expected to be done within. This makes it much easier to do a few things, we mentioned managing overhead of state updates already. Another great benefit of this comes when we need to debug. Because our function is isolated from component lifecycle, we don't have to worry about stale references and we have one single place to look - rather than many methods inside of a component which are wrapping calls to `setState()`.

<h3 class="anchor" id="what-about-usestate">So what about useState?</h3>

At this point, I have only been mentioning the benefits of `useReducer()` - what about `useState()`?

`useState()` is great whenever we don't have complex state. What determines if state is _complex_? To keep the definition simple, complex state is any object with many properties and requires multiple methods for updating state (rectangle example: setWidth, setHeight, and setColor).

If the state you are managing is a [Primitive](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) then avoid `useReducer()`.
This does not mean to break up your state into single primitive values, in fact, you should avoid doing so.

Having multiple `useState()` declarations on a single component is fine, as long as it makes sense in the context. But if you find yourself doing so - just ask, would it make sense to combine these into a single object? If so, switch to a reducer.

<h3 class="anchor" id="final-thoughts">Final thoughts</h3>

Choosing one over the other can be like walking a tight rope in many situations because the determining factor should be how simple or complex your component state is. Sometimes our component state starts with a few simple primitive data types but overtime continues to grow at which point you should consider re-factoring into a single object and using `useReducer()`

So to sum it all up simply, `useState()` when you have simple state to manage. When you have more complex state, like objects with many properties, or state that requires many different update methods then you want to go with `useReducer()`
