module.exports = {//导出构建项目所用的插件
  plugins: {
    // 空对象 对应 默认配置
    tailwindcss: {},
    // 为css属性加入浏览器前缀 解决浏览器兼容性问题
    autoprefixer: {}
    // .element {
    //       -webkit-transform: rotate(45deg);// 不必介绍了吧😈 
    //       -moz-transform: rotate(45deg); //Mozilla Firefox
    //       -ms-transform: rotate(45deg); //Internet Explorer 10
    //       -o-transform: rotate(45deg); // Opera
    //       transform: rotate(45deg);
    // }
  }
}

// module.exports = {
//   plugins: () => [
//     require('tailwindcss')('./tailwind.config.js'),
//     require('autoprefixer'),
//     // ... 其他插件
//   ]
// }