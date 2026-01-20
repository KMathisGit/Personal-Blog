---
title: Zero is More Than Local-First 
author: Kevin Mathis
date: 2025-07-20
tags: ["post", "featured", "javascript", "state management"]
image: /assets/blog/zero.png
imageAlt:
description: Zero's partial sync approach gives us more control, better performance, and fewer headaches when building apps with lots of data. Here's why, and how I've been using it.
---

<h3 class="anchor" id="zero-is-more">Zero is More Than Local-First</h3>

If you’ve worked with local‑first libraries before, you already know their promise: your app’s data is synced to the browser or device and stored locally, so all reads and writes happen instantly. When the network is available, the client syncs changes back to the server. The result is an app that feels fast, responsive, and fully functional offline.

However, there’s a trade‑off. Many of these libraries try to sync everything, which sounds great in theory but quickly becomes impractical for apps with large datasets. Think of something like the Twitter “For You” tab - you wouldn’t want to pull the entire feed into the client just to display what’s relevant.

That’s where [Zero](https://zero.rocicorp.dev/docs/introduction) comes in. Zero is a sync engine, but its goal isn’t to make your app completely offline‑first. Instead, it focuses on syncing only what’s necessary to keep client and server data aligned. It’s a different philosophy: partial sync first, not local‑first.

If you’re used to a typical React stack, a more accurate comparison is to tools like [TanStack Query](https://tanstack.com/query/docs) or [SWR](https://swr.vercel.app/). Zero acts as a query layer, keeping the server as the source of truth while providing built‑in caching, live updates, and a simpler way to handle revalidation without the boilerplate of manually managing optimistic updates or mirroring server state on the client.

<h3 class="anchor" id="partial-sync">Partial Sync</h3>

In [Zero](https://zero.rocicorp.dev/docs/introduction), we query the data we want, and that is all that gets synced. For example, if we query for a single todo item by ID:

```js
const [todo] = useQuery(z.query.todos.where('id', '=', id));
```

Zero will sync that single todo item into its local cache. It will not sync the entire list of todos unless we query for that explicitly.

The lifetime of this data is tied to the query itself. While our component is using the query, the data is cached and syncing. When the query is unmounted, Zero can [clean up the unused data in its local cache](https://zero.rocicorp.dev/docs/reading-data#data-lifetime-and-reuse).

This model gives us more control over what is stored locally, which is by design. Storing too much data in the browser can [hit IndexedDB limits, slow down initial syncs, and cause excessive memory usage.](https://zero.rocicorp.dev/docs/reading-data#client-capacity)

By syncing only the data we're actively using, we can keep the app fast and responsive, but this raises a question when navigating between pages. If a page requires data that is not yet available, we might see a visible flicker. To help with this, Zero supports [preloading](https://zero.rocicorp.dev/docs/reading-data#preloading), which allows us to prepare data ahead of time.

<h3 class="anchor" id="preloading">Preloading</h3>

Zero's `preload()` API looks like this:



```js
const preloadTodos = z.query.todos.limit(50).preload({ ttl: '1d' });
```

Preloading stores the data in the local cache (e.g. IndexedDB) and continually syncs, [but does not materialise it into JavaScript objects](https://zero.rocicorp.dev/docs/reading-data#preloading:~:text=Preloading%20stores%20the%20data%20in%20the%20local%20cache%20but%20does%20not%20materialize%20it%20into%20JavaScript%20objects) until an equivalent `useQuery` mounts. This helps keep memory usage low while still ensuring data is ready for fast display. To deactivate the preload syncing we can call `preloadTodos.cleanup()`.

One pattern I've landed on is to export a `preload` function from each page in the app, which calls the preloaders for any queries on that page:

```js
// preloader for a page that renders todos and lists
export const preloadPage = () =>
  preloaders((z) => [
    z.query.lists.limit(50).preload({ ttl: '1d' }),
    z.query.todos.limit(50).preload({ ttl: '1d' }),
  ]);

// a shared utility for composing preloaders:
export const preloaders = (withPreloaders) => {
  const z = getZero();
  const preloaders = withPreloaders(z);
  const cleanup = () => preloaders.map((p) => p.cleanup());
  const complete = (async () => {
    const promise = Promise.all(preloaders.map((p) => p.complete));
    await Promise.race([promise, timeout(5000)]);
  })();
  return { complete, cleanup };
};
```

We can then compose a custom `Link` component that triggers the preload on hover or with `IntersectionObserver`, and automatically deactivates it when unmounted.

```js
import { preloadPage } from './page';

export const Pagelink = (props) => (
  <Link {...props} href="/page" prefetcher={preloadPage} />
);
```

This way, by the time the user clicks the link, the data is more likely to be in the local cache and ready to render. To improve that likelihood, we can use a React transition to ensure the navigation waits for the preload to complete.

```js
const Link = ({ prefetcher, ...props }) => {
  const [isPending, startTransition] = React.useTransition();
  const prefetcherRef = React.useRef();
  const router = useRouter();

  // preload when link intersects
  // https://usehooks-ts.com/react-hook/use-intersection-observer
  const { linkRef } = useIntersectionObserver({
    onChange: (isIntersecting) => {
      if (isIntersecting) {
        prefetcherRef.current = prefetcher?.();
      } else {
        prefetcherRef.current?.cleanup();
        prefetcherRef.current = undefined;
      }
    },
  });

  React.useEffect(() => {
    const prefetcher = prefetcherRef.current;
    return () => prefetcher?.cleanup();
  }, []);

  return (
    <FrameworkLink
      {...props}
      ref={linkRef}
      className={cn(isPending && 'opacity-50', props.className)}
      onClick={(event) => {
        props.onClick?.(event);
        event.preventDefault();
        // wait for data to preload before navigating
        startTransition(async () => {
          if (prefetcherRef.current) await prefetcherRef.current.complete;
          router.push(props.href);
        });
      }}
    />
  );
};
```



<h3 class="anchor" id="mutations-and-optimistic-ui">Mutations and Optimistic UI</h3>

So far, we've talked about reading and preloading data. But what about writing data? This is where Zero's approach to mutations is really interesting. They're isomorphic: we define mutators once and they run on both client and server!

To create mutators they suggest creating a `createMutator` function that returns your mutators. On the server, we expose a [push handler endpoint](https://zero.rocicorp.dev/docs/custom-mutators#setting-up-the-server) that calls this function. On the client, we call it [when instantiating Zero](https://zero.rocicorp.dev/docs/custom-mutators#using-custom-mutators) so local writes can run immediately.

Here is an example of a custom upsert mutator:

```js
const createMutators = () => ({
  todo: {
    upsert: (tx, input) => {
      const now = Date.now();
      const existing = await tx.query.todos
        .where('id', '=', input.id)
        .one()
        .run();

      if (existing) {
        await tx.mutate.todos.update({ ...input, updatedAt: now });
      } else {
        await tx.mutate.todos.insert({
          ...input,
          createdAt: now,
          updatedAt: now,
        });
      }
    },
  },
});
```

Zero has a built in `upsert` API for mutations that don't require a `createdAt` field, but I specifically chose this example to highlight something neat about isomorphic mutators.

When we call `z.mutate.todo.upsert`, the client runs the mutation locally first. If the todo is not present locally, it inserts it so the UI updates straight away. The same mutator then runs on the server, but if the todo already exists on the server, it updates it.

If we need to add some client or server only logic here, there is a `reason` property on the transaction `(tx.reason === 'optimistic')` that we can use to branch our logic. Alternatively, we can create a `createServerMutators` function that composes the client mutators and extends them for server only logic requiring access to secrets.

This approach allows us to write mutators once without needing separate client and server logic, and handles cases where the client and server state may be slightly out of sync during the window when an optimistic update is applied. It makes it much easier to implement reliable optimistic UIs, without race conditions.

<h3 class="anchor" id="bring-your-own-backend">Bring your own backend</h3>

Zero is built to integrate with your existing backend. While some local-first solutions or sync engines require opting into their infrastructure or custom database, Zero has no vendor lock-in and no custom database to adopt. We can use our own.

Currently, Zero ships with first-class Postgres support, and there are experimental adapters for MongoDB and Materialize, with more to come.

For teams already invested in their stack or building with portability in mind, this flexibility means we get the benefits of a local-first solution, without giving up our existing database, tooling, or hosting setup.

<h3 class="anchor" id="final-thoughts">Final Thoughts</h3>

Overall, Zero introduces a very useful model for building modern apps, and here are the biggest reasons why:

- Partial sync lets us build apps like Reddit without overloading the local cache.
- Server as source-of-truth, aiding debugging and ensuring consistency across clients.
- Preload APIs help us improve performance for rendered data.
- Optimistic updates require a fraction of the boilerplate, thanks to isomorphic mutators.
- The UI stays reactive and consistent, with live updates from the server.
- No vendor lock-in or custom database, use your own stack.
- It's not local first. It's partial sync first. And for many projects, it's a better fit.

*It is worth noting that Zero is still in alpha. We can follow their [roadmap](https://zero.rocicorp.dev/docs/roadmap#beta-q2-25) for progress towards the upcoming beta release. The current API is already very usable, but it is a fast-evolving project.*
