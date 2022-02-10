https://remix.run/docs/en/v1/pages/technical-explanation
☝️ good run down of Remix internals

postinstall necessary to correctly compose Remix in node_modules/

`echo "NODE_ENV=development" >> .env` needed for livereload module

run `arc sandbox` and `remix watch` for dev

old arc is peerDep in `remix-architect` -- use `npm i --legacy-peer-deps`

`@remix-run/architect` uses `@remix-run/node` and `@remix-run/server-runtime`
(though, remix/node also relies on remix/server-runtime)
these help adapt Node.js to be Remix/React-friendly
`createRequestHandler` from remix/architect is the main interface -- simple

./server/index looks for ./server/build

some `@types/*` packages in devDeps help with types
`remix.env.d.ts` also helps typings like importing .css files
