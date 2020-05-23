const plugin = require('tailwindcss/plugin');
const _ = require('lodash');

const spacerPrefixes = (customPrefixes = []) => {
  return _.uniq([
    ...customPrefixes,
    'spacer-glyph-x'
  ]);
}

const spacerGlyphs = (customGlyphs = {}) => {
  const defaultGlyphs = {
    'angle': {
      'default': '›',
      'reverse': '‹',
    },
    'angle-double': {
      'default': '»',
      'reverse': '«',
    },
    'dash': '–',
    'disc': '•',
    'pipe': '|',
    'slash': '/',
    'slash-double': '//',
  };

  return Object.assign({}, customGlyphs, defaultGlyphs);
}

module.exports = plugin(function ({
  theme,
  variants,
  e,
  addUtilities
}) {
  let spacerGlyphClasses = {
    // '.spacer-glyph-x': {

    //   '>*': {
    //     color: 'red',
    //     backgroundColor: 'orange',
    //   },
    //   '>*::before': {
    //     display: 'block',
    //     position: 'absolute',
    //     width: theme('spacing')['2'],
    //     textAlign: 'center',
    //     content: `'•'`
    //   }
    // },
  };

  _.forEach(spacerPrefixes(), (prefix) => {
    spacerGlyphClasses[`.${e(`${prefix}`)}`] = {
      '&>*:not(:first-child)::before': {
        display: 'block',
        position: 'absolute',
        width: theme('spacing')['2'],
        textAlign: 'center',
        content: `'•'`
      }
    };
    _.forEach(theme('spacing'), (spacingAmt, spacingKey) => {
      spacerGlyphClasses[`.${e(`${prefix}`)}.space-x-${e(`${spacingKey}`)}`] = {
        '&>*::before': {
          marginLeft: `calc(${spacingAmt} / -2 - 0.25rem)`,
        }
      };

    });
  });
  // const spacerGlyphClasses = {
  //   '.spacer-x': {
  //     color: 'blue',
  //     fontWeight: 'bold',
  //   }
  // }

  addUtilities(spacerGlyphClasses);
}, {
  theme: {
    spacerGlyphs: {},
  },
  variants: {
    aspectRatio: ['responsive'],
  },
});