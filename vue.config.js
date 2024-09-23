const { defineConfig } = require('@vue/cli-service');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = defineConfig({
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          { from: 'acervo', to: 'acervo' } // Copia a pasta 'acervo' para 'dist/acervo'
        ],
      }),
    ],
  },
});
