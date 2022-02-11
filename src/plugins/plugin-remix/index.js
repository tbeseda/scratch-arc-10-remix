const { copyFileSync, existsSync, mkdirSync } = require('fs');
const { join } = require('path');
const { MY_NAME } = require('./constants');
const { cleanup, generateConfig, mergeConfig } = require('./util');
// risky use of Remix internals:
const { BuildMode } = require('@remix-run/dev/build');
const remixCommands = require('@remix-run/dev/cli/commands');
const remixCompiler = require('@remix-run/dev/compiler');

let watcher;

function setHttp({ inventory: { inv } }) {
  const {
    _project: { arc },
  } = inv;

  if (arc[MY_NAME]) {
    const { pluginConfig } = mergeConfig(arc);
    console.log(pluginConfig);
    const serverDir = join(pluginConfig.buildDirectory, 'server');

    if (!existsSync(serverDir)) mkdirSync(serverDir, { recursive: true });
    copyFileSync(join(__dirname, 'server', 'index.js'), join(serverDir, 'index.js'));

    return {
      method: 'any',
      path: pluginConfig.mount,
      src: serverDir,
    };
  }
}

async function sandboxStart({ inventory: { inv } }) {
  console.log('Arc is starting Remix watch...');
  // TODO: handle sandbox restart -- see README

  const { _project } = inv;

  if (_project.arc[MY_NAME]) {
    const config = await generateConfig(inv);
    // ! awaiting .watch will never resolve
    // ? child fork process this:
    watcher = remixCommands.watch(config, BuildMode.Development);
  }
}

async function deployStart({ inventory: { inv } }) {
  const {
    _project: { arc },
  } = inv;

  // build the thing
  if (arc[MY_NAME]) {
    const config = await generateConfig(inv);
    await remixCompiler.build(config, { mode: BuildMode.Production });
  }
}

module.exports = {
  set: {
    http: setHttp,
  },
  deploy: {
    start: deployStart,
    async end({ inventory: { inv } }) {
      cleanup(inv);
    },
  },
  sandbox: {
    start: sandboxStart,
    async end({ inventory: { inv } }) {
      if (watcher) {
        // TODO close remix watcher
      }
      cleanup(inv);
    },
  },
};
