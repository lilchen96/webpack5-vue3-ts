/* <type>(<scope>): <subject></subject> */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'test', 'fix', 'chore', 'docs', 'refactor', 'style', 'ci', 'perf', 'revert']
    ], // 类型可选值
    'scope-empty': [0] // scope为空
  }
};
