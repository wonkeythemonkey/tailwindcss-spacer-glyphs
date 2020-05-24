module.exports = {
    theme: {
        extend: {
            spacerGlyphs: {
                'question': {
                    'default': '?',
                    'reverse': '¿'
                }
            },
        }
    },
    variants: {},
    plugins: [
        require('./src/plugins/spacer-glyphs')
    ],
}