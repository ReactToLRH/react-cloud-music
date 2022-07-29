module.exports = {
  // stylelint-config-standard : stylelint 标准(standard)配置
  // stylelint-config-css-modules : 调整stylesint规则以接受css模块特定的语法。
  // stylelint-config-rational-order : 一个用于规范css属性写作顺序的规则集成。配合stylelint-order插件使用。
  // stylelint-config-prettier : 关闭所有不必要的或可能与 Prettier 冲突的规则
  // stylelint-no-unsupported-browser-features : 检查正在使用的 CSS 是否被目标浏览器支持
  extends: [
    'stylelint-config-standard',
    'stylelint-config-styled-components',
    // 'stylelint-config-css-modules',
    'stylelint-config-rational-order',
    'stylelint-config-prettier'
    // 'stylelint-no-unsupported-browser-features'
  ],
  // stylelint-order : 用于规范样式属性写作顺序的插件
  // stylelint-declaration-block-no-ignored-properties : 用于提示写矛盾的样式。例如：{ display: inline; width: 100px; }
  plugins: ['stylelint-declaration-block-no-ignored-properties'],
  rules: {
    // 禁止使用未知的 at 规则。
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'extend',
          'at-root',
          'debug',
          'warn',
          'error',
          'if',
          'else',
          'for',
          'each',
          'while',
          'mixin',
          'include',
          'content',
          'return',
          'function'
        ]
      }
    ],
    // 禁止使用未知的 media 特性名称。
    'media-feature-name-no-unknown': [
      true,
      {
        ignoreMediaFeatureNames: ['print', 'min-device-pixel-ratio']
      }
    ],
    // 禁止低优先级的选择器出现在高优先级的选择器之后
    'no-descending-specificity': null,
    // https://github.com/stylelint/stylelint/issues/4114
    // 允许在 calc 函数中使用无效的表达式
    'function-calc-no-invalid': null,
    // 要求或禁止 url 使用引号
    'function-url-quotes': 'always',
    // 禁止字体家族名称列表中缺少通用家族
    'font-family-no-missing-generic-family-keyword': null,
    'plugin/declaration-block-no-ignored-properties': true,
    // 禁止未知单位
    'unit-no-unknown': [true, { ignoreUnits: ['upx', 'rpx'] }],
    // 禁止空源
    'no-empty-source': null,
    'selector-type-no-unknown': [
      true,
      {
        ignoreTypes: []
      }
    ],
    'declaration-block-no-duplicate-properties': null,
    // 方法名大小写控制  匹配任意字符
    'function-name-case': [
      'lower',
      {
        ignoreFunctions: ['/^.*$/']
      }
    ],
    'no-descending-specificity': null,
    'no-invalid-position-at-import-rule': null,
    'declaration-empty-line-before': null,
    'keyframes-name-pattern': null,
    'custom-property-pattern': null,
    'number-max-precision': 8,
    'alpha-value-notation': 'number',
    'color-function-notation': 'legacy',
    'selector-class-pattern': null,
    'selector-id-pattern': null,
    'selector-not-notation': null
  }
}
