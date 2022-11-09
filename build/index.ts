import defineBaseWebpackConfig from './config/base';
import defineServeWebpackConfig from './config/serve';
import defineBuildWebpackConfig from './config/build';
import defineConfig from '../webpack.config';
import Config from 'webpack-chain';
import webpack from 'webpack';
import path from 'path';
import Dotenv from 'dotenv-webpack';
import { runDevServer, runStaticServer } from './utils/server';
import chalk from 'chalk';
import { formatStats } from './utils/formatStats';
import { getProcessArgv } from './utils/processArgv';

export { DefineWebpackConfig } from './index.types';

const params = getProcessArgv();
const { mode, behavior } = params;
const envPath = path.resolve(process.cwd(), `.env.${mode}`);

const webpackConfig = new Config();
// 注入基础配置
defineBaseWebpackConfig(webpackConfig, params);
if (behavior === 'serve') {
  defineServeWebpackConfig(webpackConfig, params);
} else {
  defineBuildWebpackConfig(webpackConfig, params);
}

// 注入自定义配置
defineConfig(webpackConfig, params);

// 注入mode对应的环境文件
webpackConfig.plugin('Dotenv').use(Dotenv, [
  {
    path: envPath
  }
]);

const config = webpackConfig.toConfig();

if (behavior === 'serve') {
  // 启动开发服务器
  runDevServer(config);
} else {
  // 打包
  webpack(config, (err, stats: any) => {
    if (err) {
      console.error(chalk.red('Build failed with errors.'));
      console.error(err);
      return;
    }
    if (stats.hasErrors()) {
      console.error(chalk.red('Build failed with errors.'));
      console.error(stats.toString('errors-only'));
      return;
    }
    // 输出打包结果
    console.log(formatStats(stats));
    // console.log(stats.toString());
    // 开启预览服务器
    if (process.argv.includes('--preview')) {
      runStaticServer(config.output?.publicPath as string);
    }
  });
}
