import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as Repack from '@callstack/repack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Rspack configuration enhanced with Re.Pack defaults for React Native.
 *
 * Learn about Rspack configuration: https://rspack.dev/config/
 * Learn about Re.Pack configuration: https://re-pack.dev/docs/guides/configuration
 */

export default Repack.defineRspackConfig({
  context: __dirname,
  entry: './index.js',
  resolve: {
    ...Repack.getResolveOptions(),
  },
  output: {
    // Configurar publicPath para chunks remotos
    // Em produção, altere para a URL do seu servidor
    publicPath: 'http://localhost:3000/bundles/',
    // Nome dos chunks gerados
    chunkFilename: '[name].chunk.bundle',
    filename: 'index.bundle',
  },
  module: {
    rules: [
      {
        test: /\.[cm]?[jt]sx?$/,
        type: 'javascript/auto',
        use: {
          loader: '@callstack/repack/babel-swc-loader',
          parallel: true,
          options: {},
        },
      },
      ...Repack.getAssetTransformRules(),
    ],
  },
  plugins: [
    new Repack.RepackPlugin({
      // Configuração do ChunkManager para carregamento remoto
      output: {
        enabled: true,
        verbose: true,
      },
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        components: {
          test: /[\\/]components[\\/]/,
          name: 'components',
          priority: 10,
          reuseExistingChunk: true,
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    },
  },
});
