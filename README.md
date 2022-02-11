Working toward an Architect v10 plugin for Remix

## objective

```sh
@app
arc-10-remix

@plugins
architect/plugin-remix

@remix
mount /remix
appDirectory app
```

where the only Remix dir in root is `./app`.

additionally, I can still add standard Arc things like HTTP routes, events, etc.

## process

sourced from those examples noted in [helpful section](#helpful).

converted to vanilla JS. then added Arc 10.

extracted ./server into plugin

enable Remix watcher

## notes

- the big caveat here is that remix.config.js is generated, saved, loaded (by Remix), and removed during the Sandbox lifecycle. so it's git-ignored.
  - initially, I tried to create a default remix.config from the plugin, merge with a user remix.config, and send that to Remix. however, Remix requires an actual remix.config.js file on disk. so I started by writing to the .remix/ temporary directory, but currently Remix expects the remix.config to be a sibling of package.json.
- in order to get Remix-generated static assets to a bucket, the `assetsBuildDirectory` option in Remix is set to public/.remix. it would be cool to put them inside .remix/assets behind a static asset server while developing, and move them to a bucket when deploying

## bugs

- app.arc `@remix` can be configured with a custom mounted endpoint for Remix, but I think there's an issue with trailing slashes between Arc and Remix. this can probably be configured in Remix
- if Arc Sandbox restarts (like when editing app.arc), the Remix watcher doesn't shut down and the user ends up with a port conflict when the new watcher starts
  - as an alternative to Remix's watch command, I used Remix's compiler to build in dev mode and then rebuild from Arc Sandbox watcher plugin. combined with Arc v10's new livereload feature, I got pretty close but it felt brittle compared to Remix watch that's tuned just for Remix.
    - mixing Remix watch with Arc livereload will probably lead to a bad time 😬

## helpful

- https://remix.run/docs/en/v1/pages/technical-explanation
  - ☝️ good run down of Remix internals
- https://github.com/remix-run/remix/tree/logan/rem-696-arc-stack/packages/create-remix/templates/arc-stack
  - Logan's work on Remix in Arc based on the Arc notes example
- https://github.com/remix-run/remix/tree/main/examples/basic
  - just the basics or Remix
- https://github.com/remix-run/remix/tree/main/packages/remix-architect
  - the adapter responsible for `createRequestHandler` used in the plugin server
