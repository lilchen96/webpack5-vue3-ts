import { DefineWebpackConfig } from '../index.types';

const defineServeWebpackConfig: DefineWebpackConfig = (webpackConfig, { behavior, mode, argv }) => {
  webpackConfig.mode('development');
  webpackConfig.target('web');
  webpackConfig.output.filename('js/[name].js');
  webpackConfig.merge({
    devtool: 'eval-cheap-module-source-map',
    devServer: {
      host: '0.0.0.0',
      hot: true,
      open: false,
      port: 8080,
      client: {
        logging: 'error',
        overlay: {
          warnings: false,
          errors: true
        }
      },
      compress: false
    },
    stats: 'errors-only'
  });
};

export default defineServeWebpackConfig;
