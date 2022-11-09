import HtmlWebpackPlugin from 'html-webpack-plugin';
import { VueLoaderPlugin } from 'vue-loader';
import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { ProgressPlugin } from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import { DefinePlugin } from 'webpack';
import CopyPlugin from 'copy-webpack-Plugin';

import { DefineWebpackConfig } from '../index.types';

const defineBaseWebpackConfig: DefineWebpackConfig = (webpackConfig, { behavior, mode, argv }) => {
  webpackConfig.cache({
    type: 'filesystem'
  });
  webpackConfig.entry('main').add('./src/main.ts');

  webpackConfig.output.path(path.resolve(process.cwd(), 'dist')).publicPath('/');
  // .assetModuleFilename('assets/[contenthash][ext]');

  webpackConfig.resolve.extensions.merge(['.ts', '.tsx', '.js', '.jsx', '.json']);

  webpackConfig.resolve.alias.set('@', path.resolve(process.cwd(), 'src'));

  webpackConfig.watchOptions({
    // node_modules的变换频率低，忽略
    ignored: /node_modules/
  });

  webpackConfig.optimization
    .minimize(true)
    .minimizer('TerserPlugin')
    // TerserPlugin压缩混淆开启并行+排除/node_modules/
    .use(TerserPlugin, [
      {
        minify: TerserPlugin.terserMinify,
        parallel: true,
        exclude: /node_modules/
      }
    ]);

  // 分包规则
  webpackConfig.optimization.splitChunks({
    cacheGroups: {
      vendors: {
        name: `chunk-vendors`,
        test: /[\\/]node_modules[\\/]/,
        priority: -10,
        chunks: 'initial'
      },
      common: {
        name: `chunk-common`,
        minChunks: 2,
        priority: -20,
        chunks: 'initial',
        reuseExistingChunk: true
      }
    }
  });

  // vue
  webpackConfig.module
    .rule('vue')
    .test(/\.vue$/)
    .use('vue-loader')
    .loader('vue-loader');

  // ts
  webpackConfig.module.rule('ts').test(/\.(t|j)sx?$/);
  // .exclude(/node_modules/);
  webpackConfig.module
    .rule('ts')
    .use('babel-loader')
    .loader('babel-loader')
    .options({
      cacheDirectory: true,
      presets: [
        [
          '@babel/preset-typescript',
          {
            isTSX: true,
            allExtensions: true
          }
        ]
      ],
      plugins: ['@vue/babel-plugin-jsx']
    });

  // 样式文件 css sass less
  webpackConfig.module.rule('css').test(/\.css$/);
  webpackConfig.module.rule('sass').test(/\.(sa|sc)ss$/);
  webpackConfig.module.rule('less').test(/\.less$/);
  // 开发环境 内联，生产环境 css文件
  if (behavior === 'serve') {
    webpackConfig.module.rule('css').use('style-loader').loader('style-loader');
    webpackConfig.module.rule('sass').use('style-loader').loader('style-loader');
    webpackConfig.module.rule('less').use('style-loader').loader('style-loader');
  } else {
    webpackConfig.module
      .rule('css')
      .use('mini-css-extract-plugin')
      .loader(MiniCssExtractPlugin.loader);
    webpackConfig.module
      .rule('sass')
      .use('mini-css-extract-plugin')
      .loader(MiniCssExtractPlugin.loader);
    webpackConfig.module
      .rule('less')
      .use('mini-css-extract-plugin')
      .loader(MiniCssExtractPlugin.loader);
  }
  webpackConfig.module.rule('css').use('css-loader').loader('css-loader');
  webpackConfig.module.rule('sass').use('css-loader').loader('css-loader');
  webpackConfig.module.rule('less').use('css-loader').loader('css-loader');

  webpackConfig.module.rule('css').use('postcss-loader').loader('postcss-loader');
  webpackConfig.module.rule('sass').use('postcss-loader').loader('postcss-loader');
  webpackConfig.module.rule('less').use('postcss-loader').loader('postcss-loader');

  webpackConfig.module.rule('sass').use('sass-loader').loader('sass-loader');
  webpackConfig.module.rule('less').use('less-loader').loader('less-loader');

  // 静态资源文件
  webpackConfig.module
    .rule('asset')
    .test(/\.(png|svg|jpe?g|gif)$/)
    .resourceQuery({
      not: [/url/, /inline/, /raw/]
    });

  webpackConfig.module.rule('url').resourceQuery(/url/);

  webpackConfig.module.rule('inline').resourceQuery(/inline/);
  webpackConfig.module.rule('raw').resourceQuery(/raw/);
  webpackConfig.module.rule('fonts').test(/\.(eot|svg|ttf|woff2?|)$/);

  // 插件
  webpackConfig.plugin('DefinePlugin').use(DefinePlugin, [
    {
      // tree-shaking vue3对option api的兼容代码
      __VUE_OPTIONS_API__: false,
      // 生产环境关闭vue devtool
      __VUE_PROD_DEVTOOLS__: false
    }
  ]);
  webpackConfig.plugin('VueLoaderPlugin').use(VueLoaderPlugin);
  webpackConfig.plugin('HtmlWebpackPlugin').use(HtmlWebpackPlugin, [
    {
      title: 'Document',
      template: './public/index.html',
      favicon: './public/favicon.ico'
    }
  ]);
  webpackConfig.plugin('ProgressPlugin').use(ProgressPlugin, [
    {
      activeModules: true,
      entries: true,
      modules: false,
      modulesCount: 5000,
      profile: false,
      dependencies: false,
      dependenciesCount: 10000
    }
  ]);
  webpackConfig.plugin('CopyPlugin').use(CopyPlugin, [
    {
      patterns: [
        {
          from: 'public',
          to: 'public',
          toType: 'dir',
          globOptions: {
            ignore: ['**/index.html', '**/favicon.ico']
          }
        }
      ]
    }
  ]);

  webpackConfig.merge({
    output: {
      assetModuleFilename: 'assets/[contenthash][ext]'
    },
    module: {
      rule: {
        ts: {
          exclude: /node_modules/
        },
        asset: {
          type: 'asset'
        },
        url: {
          type: 'asset/resource'
        },
        inline: {
          type: 'asset/inline'
        },
        raw: {
          type: 'asset/source'
        },
        fonts: {
          type: 'asset/resource',
          generator: {
            filename: 'assets/fonts/[contenthash][ext]'
          }
        }
      }
    }
  });
  return webpackConfig;
};

export default defineBaseWebpackConfig;
