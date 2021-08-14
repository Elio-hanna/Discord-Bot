module.exports = {
    'env': {
        'browser': true,
        'commonjs': true,
        'es2021': true
    },
    'extends': 'eslint:recommended',
    'parserOptions': {
        'ecmaVersion': 12
    },
    'rules': {
        'indent': [
            'error',
            4
        ],
        // 'linebreak-style': [
        //     'error',
        //     'unix'
        // ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'never'
        ],
        'space-before-function-paren': 'off',
        'comma-dangle': 'off',
        'no-void': 'off',
        'no-prototype-builtins': 'off',
        'no-console': 'off'
    }
}
