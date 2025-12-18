import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as Repack from '@callstack/repack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (env) => {
  const { platform = 'android' } = env;

  return {
    context: __dirname,
    entry: './index.js',
    resolve: {
      ...Repack.getResolveOptions(),
    },
    output: {
      path: path.join(__dirname, 'build', 'generated', platform),
      publicPath: `http://localhost:3000/bundles/${platform}/`,
      filename: 'index.bundle',
      chunkFilename: '[name].chunk.bundle',
    },
    module: {
      rules: [
        {
          test: /\.[cm]?[jt]sx?$/,
          type: 'javascript/auto',
          use: {
            loader: '@callstack/repack/babel-swc-loader',
            options: {},
          },
        },
        ...Repack.getAssetTransformRules(),
      ],
    },
    plugins: [
      new Repack.RepackPlugin({
        extraChunks: [
          {
            include: /^.+\.local$/,
            type: 'local',
          },
          {
            exclude: /^.+\.local$/,
            type: 'remote',
            outputPath: path.join(__dirname, 'bundles', platform),
          },
        ],
      }),
    ],
    optimization: {
      chunkIds: 'named',
      splitChunks: {
        chunks: 'async',
        cacheGroups: {
          components: {
            test: /[\\/]components[\\/]/,
            name: 'components',
            chunks: 'async',
          },
        },
      },
    },
  };
};
