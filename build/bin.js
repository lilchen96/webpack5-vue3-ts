const { spawn } = require('child_process');

const argStr = process.argv.slice(2).join(' ');
spawn(`cross-env TS_NODE_PROJECT="tsconfig.node.json" ts-node ./build/index.ts ${argStr}`, {
  stdio: 'inherit',
  shell: true
});
