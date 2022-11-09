import chalk from 'chalk';
import path from 'path';
export function formatStats(stats: any) {
  const json = stats.toJson({
    hash: false,
    modules: false,
    chunks: false
  });

  let assets = json.assets
    ? json.assets
    : json.children.reduce((acc: [], child: any) => acc.concat(child.assets), []);

  const seenNames = new Map();
  const isJS = (val: string) => /\.js$/.test(val);
  const isCSS = (val: string) => /\.css$/.test(val);
  const isMinJS = (val: string) => /\.min\.js$/.test(val);
  assets = assets
    .map((a: any) => {
      a.name = a.name.split('?')[0];
      return a;
    })
    .filter((a: any) => {
      if (seenNames.has(a.name)) {
        return false;
      }
      seenNames.set(a.name, true);
      return isJS(a.name) || isCSS(a.name);
    })
    .sort((a: any, b: any) => {
      if (isJS(a.name) && isCSS(b.name)) return -1;
      if (isCSS(a.name) && isJS(b.name)) return 1;
      if (isMinJS(a.name) && !isMinJS(b.name)) return -1;
      if (!isMinJS(a.name) && isMinJS(b.name)) return 1;
      return b.size - a.size;
    });

  function formatSize(size: number) {
    return (size / 1024).toFixed(2) + ' KiB';
  }

  function makeRow(a?: string, b?: string) {
    return `  ${a}\t    ${b}`;
  }

  const summary = assets
    .map((asset: any) =>
      makeRow(
        /js$/.test(asset.name)
          ? chalk.green(path.join('dist', asset.name))
          : chalk.blue(path.join('dist', asset.name)),
        formatSize(asset.size)
      )
    )
    .join(`\n`);

  return `${summary}\n\n  ${chalk.gray(`Images and other types of assets omitted.`)}\n`;
}
