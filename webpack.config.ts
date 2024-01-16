import { DefineWebpackConfig } from './build';
// 打包分析
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
// gzip压缩
import CompressionWebpackPlugin from 'compression-webpack-plugin';

const defineConfig: DefineWebpackConfig = (config, { behavior, mode, argv }) => {
  config.merge({
    // 指定map文件类型
    devtool:
      mode === 'prod' ? false : mode === 'test' ? 'source-map' : 'eval-cheap-module-source-map',
    // 代理设置
    devServer: {
      proxy: {
        '/api': {
          target: 'https://www.juejin.cn',
          changeOrigin: true,
          secure: false,
          pathRewrite: {
            '^/api': '/'
          }
        }
      }
    }
  });

  // 设置网页名称，内置已使用过HtmlWebpackPlugin，所以直接tap修改参数即可
  config.plugin('HtmlWebpackPlugin').tap((args) => [
    {
      ...args[0],
      title: 'webpack5-vue3-ts'
    }
  ]);
  // 打包分析
  if (argv.includes('--report')) {
    config.plugin('BundleAnalyzerPlugin').use(BundleAnalyzerPlugin);
  }
  // cdn优化
  // 仅生产环境用cdn
  if (mode === 'prod') {
    // 设置 externals
    config.externals({
      vue: 'Vue',
      dayjs: 'dayjs'
    });

    const files = {
      js: ['https://cdn.jsdelivr.net/npm/vue@3.2.41/dist/vue.global.min.js', 'public/dayjs.min.js'],
      css: ['public/public.css']
    };

    // 生产script标签，内置已使用过HtmlWebpackPlugin，所以直接tap修改参数即可
    config.plugin('HtmlWebpackPlugin').tap((args) => [
      {
        ...args[0],
        js: files.js.map((item) => `<script defer src="${item}"></script>`).join(''),
        css: files.css
          .map((item) => `<link rel="preload" href=${item} rel="stylesheet" />`)
          .join('')
      }
    ]);
  }

  // gzip压缩，仅构建时
  if (behavior === 'build') {
    config.plugin('CompressionWebpackPlugin').use(CompressionWebpackPlugin);
  }
};

export default defineConfig;
