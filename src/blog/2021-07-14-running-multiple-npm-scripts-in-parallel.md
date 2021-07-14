---
title: Running Multiple NPM Scripts in Parallel
author: Kevin Mathis
date: 2021-07-14
tags: ["post", "featured", "javascript", "node"]
image: /assets/blog/multiple-streams.jpg
imageAlt:
description: Ever needed to kick off multiple npm scipts and have them all running in parallel? This post covers the basics of understanding NPM scripts and how to achieve parallel execution - even if you are running Windows OS.
---

Running NPM scripts is typically a straight forward process - you add a key value pairing to your package.json file. The key is the command term and the value is the actual command you want to execute.

Here is a look at your typical `create-react-app` package.json

```json
    "scripts": {
        "start": "react-scripts start",
        "build": "react-scripts build",
        "test": "react-scripts test",
        "eject": "react-scripts eject"
    }
```

To run any of these scripts you just write `npm run {script-key}`. So when you type in the infamous `npm run start` it is running `react-scripts start`.

Now lets say that you want to execute multiple commands within a single script. The first question is whether these commands should run sequentially or in parallel.

Let's say that you want to do a `build` and afterwards you want to do `start` to spin up your local dev environment. I know these 2 things don't make much sense to pair together but bear with me.

To achieve this we would add to our package.json scripts the following:

```json/3
    "scripts": {
        "start": "react-scripts start",
        "build": "react-scripts build",
        "build-start": "react-scripts build && react-scripts start",
        "test": "react-scripts test",
        "eject": "react-scripts eject"
    }
```

This works and does what we expect it do, but now lets switch the order of these commands around:

```json/4/3
    "scripts": {
        "start": "react-scripts start",
        "build": "react-scripts build",
        "build-start": "react-scripts build && react-scripts start",
        "build-start": "react-scripts start && react-scripts build",
        "test": "react-scripts test",
        "eject": "react-scripts eject"
    }
```

Our script no longer does both commands - it only ever executes `react-scripts start`. This is because this command is continually running the dev server until it is terminated, and when it is, the entire scoped command is as well - so no build 😞.

So how can we solve this? Well turns out this is a very common issue and so there are easy ways to solve this.

<h3 class="anchor" id="unix-users">Unix users</h3>

For unix you can simply change from double ampersand to a single ampersand:

```json/3
    "scripts": {
        "start": "react-scripts start",
        "build": "react-scripts build",
        "build-start": "react-scripts start & react-scripts build",
        "test": "react-scripts test",
        "eject": "react-scripts eject"
    }
```

In unix a single ampersand will run these in parallel rather than in sequential order.

<h3 class="anchor" id="windows-users">Windows users</h3>

Using NPM on windows sadly isn't as easy as switching to a single ampersand. Instead many people opt for a node package such as `npm-run-all`.

To install this package simple run `npm install npm-run-all --save-dev`. Now to use this is quite simple, we now have the ability to use this package to run things sequentially or in parallel.

To run commands sequentially we use `run-s`, and to run in parallel we use `run-p`. After that we simply list off the different script keys we want to run.

So it would look like:

```json/3
    "scripts": {
        "start": "react-scripts start",
        "build": "react-scripts build",
        "build-start": "run-p start build",
        "test": "react-scripts test",
        "eject": "react-scripts eject"
    }
```

Notice we are giving the script keys `start` and `build` now rather than the commands themselves.

And that's it! So now you can do `npm run build-start` and notice that the dev server spins up and the build also gets built.

This was a contrived example used to demonstrate how some commands will block execution of subsequent commands, and how to solve this by running them parallel. Hopefully this helps you next time you are needing to run multiple processes in node where some or all of them require their own process.
