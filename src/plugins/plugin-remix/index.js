const { copyFileSync, existsSync, mkdirSync, rmSync } = require('fs');
const { join } = require('path');
const { BuildMode } = require('@remix-run/dev/build');
const remixCommands = require('@remix-run/dev/cli/commands');
const remixCompiler = require('@remix-run/dev/compiler');
const { BUILD_DIR, MY_NAME } = require('./constants');
const { generateConfig, cleanup } = require('./util');

let watcher;

function setHttp({ inventory: { inv } }) {
  const {
    _project: { arc, build: buildDir },
  } = inv;

  if (arc[MY_NAME]) {
    let path = '/*';
    for (const option of arc[MY_NAME]) {
      if (Array.isArray(option) && option[0] === 'mount') path = option[1];
    }

    const serverDir = join(buildDir, 'server');
    if (!existsSync(serverDir)) mkdirSync(serverDir, { recursive: true });
    copyFileSync(join(__dirname, 'server', 'index.js'), join(serverDir, 'index.js'));

    return {
      method: 'any',
      path,
      src: serverDir,
    };
  }
}

function setRuntimes({ inventory: { inv } }) {
  const {
    _project: { arc },
  } = inv;

  if (arc[MY_NAME]) {
    return {
      name: 'remix',
      type: 'transpiled',
      build: BUILD_DIR,
      baseRuntime: 'nodejs14.x',
    };
  }
}

async function sandboxStart({ inventory: { inv } }) {
  console.log('Arc is starting remix watch');
  // TODO: handle sandbox restart -- see README

  const { _project } = inv;

  if (_project.arc[MY_NAME]) {
    const config = await generateConfig(inv);
    // ! awaiting .watch will never resolve
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
    runtimes: setRuntimes,
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
      cleanup(inv);
      if (watcher) {
        // TODO close remix watcher
        // await Promise.race([
        //   watcher,
        //   new Promise((resolve) => {
        //     setTimeout(resolve, 1500);
        //   }),
        // ]);
      }
    },
  },
};
