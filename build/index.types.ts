import Config from 'webpack-chain';

type DefineWebpackConfigParams = {
  behavior: string;
  mode: string;
  argv: string[];
};

export type DefineWebpackConfig = (
  webpackConfig: Config,
  params: DefineWebpackConfigParams
) => void;
