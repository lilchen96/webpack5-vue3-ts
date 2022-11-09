export function getProcessArgv() {
  const behaviors = ['build', 'serve'];
  // 解析behavior和mode
  let behavior = process.argv[2];
  let mode;
  if (process.argv.includes('--mode')) {
    const index = process.argv.findIndex((arg) => arg === '--mode');
    mode = process.argv[index + 1];
  }
  // 赋予默认mode
  if (behaviors.includes(behavior)) {
    if (!mode) {
      if (behavior === 'serve') {
        mode = 'dev';
      }
      if (behavior === 'build') {
        mode = 'prod';
      }
    }
  } else {
    behavior = 'build';
  }
  return {
    behavior: behavior ?? '',
    mode: mode ?? '',
    argv: process.argv.slice(2)
  };
}
