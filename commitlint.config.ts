const Configuration = {
  // 继承的规则
  extends: ['@commitlint/config-conventional'],
  // 定义规则
  rules: {
    // type的类型定义: 表示git提交的type必须在以下类型范围之内
    'type-enum': [
      // 当前验证错误级别
      2,
      // 在什么情况下进行验证
      'always',
      // 范型内容
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'revert',
        'wip',
      ],
    ],
  },
}

export default Configuration
