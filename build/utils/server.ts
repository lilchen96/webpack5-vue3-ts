import Webpack, { Configuration } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import portfinder from 'portfinder';
import connect from 'connect';
import serveStatic from 'serve-static';
import chalk from 'chalk';
import { spawn } from 'child_process';

export const runDevServer = async (webpackConfig: Configuration) => {
  const config = await getServerConfig(webpackConfig);
  const compiler = Webpack(webpackConfig);
  const server = new WebpackDevServer(config, compiler);
  await server.start();
};

async function getServerConfig(webpackConfig: Configuration) {
  const config = webpackConfig.devServer;

  const port = await portfinder.getPortPromise({
    port: config?.port as number
  });

  return {
    ...config,
    port
  };
}

export const runStaticServer = async (publicPath: string) => {
  const port = await portfinder.getPortPromise({
    port: 8848
  });
  const app = connect();
  const indexFile = 'index.html';
  const url = `http://localhost:${port}${publicPath}`;
  app.use(
    publicPath,
    serveStatic('./dist', {
      index: [indexFile, '/']
    })
  );
  app.listen(port, function () {
    console.log(chalk.green(`> Preview at  ${url}`));
    spawn(`start ${url}`, {
      stdio: 'inherit',
      shell: true
    });
  });
};
