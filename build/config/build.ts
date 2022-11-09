import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import { DefineWebpackConfig } from '../index.types';

const defineBuildWebpackConfig: DefineWebpackConfig = (webpackConfig, { behavior, mode, argv }) => {
  webpackConfig.mode('production');
  webpackConfig.devtool('source-map');
  webpackConfig.output.filename('js/[name].[contenthash].js');
  webpackConfig.plugin('MiniCssExtractPlugin').use(MiniCssExtractPlugin, [
    {
      filename: 'css/[name].[contenthash].css'
    }
  ]);
  webpackConfig.merge({
    output: {
      clean: true
    }
  });
};

export default defineBuildWebpackConfig;
