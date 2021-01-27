/* eslint-disable indent */
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
            2
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'eqeqeq': [
            'error',
        ],
        'arrow-spacing': [
            'error', { 'before': true, 'after': true }
        ],
        'no-trailing-spaces': [
            'error'
        ],
        'object-curly-spacing': [
            'error', 'always'
        ],
        'semi': [
            'error',
            'never'
        ]
    }
}
