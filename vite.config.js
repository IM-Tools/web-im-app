const path = require('path');
module.exports = {
    pluginOptions: {
      'style-resources-loader': {
        preProcessor: 'scss',
        patterns: []
      }
    },
  alias: {
      '/@/': path.resolve(__dirname, './src')
  },
  hostname: '127.0.0.1', // 默认是 localhost
  port: '3002', // 默认是 3000 端口
  open: true, // 浏览器自动打开
  https: false, // 是否开启 https/*  */
  ssr: true, // 服务端渲染
  optimizeDeps: {
    include: [ "axios"]
  },
  base: './', // 生产环境下的公共路径
  outDir: 'dist', // 打包构建输出路径，默认 dist ，如果路径存在，构建之前会被删除
  proxy: { // 本地开发环境通过代理实现跨域，生产环境使用 nginx 转发
  '/api': {
    target: 'http://127.0.0.1:9052/', // 后端服务实际地址
    changeOrigin: true,
    secure:false,
    rewrite: path => path.replace(/^\/api/, '')
  }
}
}