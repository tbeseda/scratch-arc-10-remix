This is a scratch project used while working on [@architect/plugin-remix](https://github.com/architect/plugin-remix).

The following README was maintained for archival purposes.

---

# `arc-plugin-remix`

Working toward an Architect v10 plugin for Remix

## objective

```sh
@app
arc-10-remix

@plugins
architect/plugin-remix

@remix
app-directory app # defaults to "remix"
build-directory .build # defaults to ".remix"
# mount /remixed # defaults to "/*". not working yet!
# server-handler path/to/custom/handler/index.js # advanced usage
```

where the only Remix dir in root is `./app` or (`./remix` by default).

extend existing `remix.config.js`.

enable standard Arc things like HTTP routes, events, etc.

## process

1. sourced from those examples noted in [helpful section](#helpful).
1. converted to vanilla JS. then added Arc 10.
1. extracted the arc-stack ./server into plugin.
1. plugin runs Remix watcher as a subprocess of Sandbox.

## notes

- this plugin will overwrite Remix config's build directories set in remix.config.js
  - the rest of remix.config.js is maintained and passed to Remix
- in order to get Remix-generated static assets to a bucket, the `assetsBuildDirectory` option in Remix is set to `./public/.remix` (configurable). it would be cool to put them inside `.remix/assets` behind a static asset server while developing with Sandbox, and move them to a bucket when deploying.
- `arc deploy` is untested
  - is `@static` pragma required?
- there are not tests yet

## bugs

- [ ] app.arc `@remix` can be configured with a custom mounted endpoint for Remix, but I think there's an issue with trailing slashes between Arc and Remix. this can probably be configured in Remix
- [x] if Arc Sandbox restarts (like when editing app.arc), the Remix watcher doesn't shut down and the user ends up with a port conflict when the new watcher starts

## helpful

- https://remix.run/docs/en/v1/pages/technical-explanation
  - ☝️ good run down of Remix internals
- ~~https://github.com/remix-run/remix/tree/logan/rem-696-arc-stack/packages/create-remix/templates/arc-stack~~
  - ~~Logan's work on Remix in Arc based on the Arc notes example~~ merged
- https://github.com/remix-run/remix/tree/main/examples/basic
  - just the basics of Remix
- https://github.com/remix-run/remix/tree/main/packages/remix-architect
  - the adapter responsible for `createRequestHandler` used in the plugin server
