module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        node: true,
        jest: true
    },

    extends: ['plugin:react/recommended', 'prettier'],

    plugins: ['react', 'react-hooks'],

    rules: {
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
        'no-var': 'error',
        'no-unused-vars': 'error',
        'comma-dangle': ['error', 'never'],
        eqeqeq: ['error', 'always'],
        'no-multiple-empty-lines': [2, { max: 1 }],
        'no-multi-spaces': [2],
        'react/prop-types': 0,
        'react/no-unescaped-entities': 0,
        'react/no-deprecated': 0,
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'react/display-name': 'off'
    },

    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 8
    },

    settings: {
        react: {
            version: '16.8.4'
        }
    }
};
