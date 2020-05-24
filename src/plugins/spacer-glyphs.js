const plugin = require('tailwindcss/plugin');
const _ = require('lodash');

const spacerPrefixes = (customPrefixes = []) => {
  return _.uniq([
    ...customPrefixes,
    'spacer-glyph'
  ]);
}


// TO-DO: Write tests passing types of glyph values:
// - string
// - object with default and reverse
// - object with default and no reverse
// - object with reverse and no default
// - object with extra invalid keys
// - object with only invalid keys
// - not object or string

// TO-DO: Accept glyphs from user theme
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

  let combinedGlyphs = Object.assign({}, customGlyphs, defaultGlyphs)

  let combinedGlyphsPairs = Object.entries(combinedGlyphs);

  combinedGlyphsPairs = combinedGlyphsPairs.map((value) => {
    if (typeof value[1] === 'string') {
      return [
        value[0],
        {
          'default': value[1],
          'reverse': value[1]
        }
      ]
    }
    return value;
  });
  return Object.fromEntries(combinedGlyphsPairs);

}


// TO-DO: Enable custom font definition for glyphs
// TO-DO: Enable variants
module.exports = plugin(function ({
  theme,
  variants,
  e,
  addUtilities
}) {
  let glyphWidth = theme('spacing')['2'];
  let spacerGlyphClasses = {};

  let spacerGlyphDefaultProps = {
    display: 'block',
    position: 'absolute',
    width: glyphWidth,
    marginLeft: `calc(${glyphWidth} / -2)`,
    textAlign: 'center',
    content: `''`,
  };

  // Generic .spacer-glyph-x with no additional modifiers
  _.forEach(spacerPrefixes(), (prefix) => {
    spacerGlyphClasses[`.${e(`${prefix}`)}`] = {
      '&>*::before': spacerGlyphDefaultProps,

      // Default glyph: disc
      '&:not(.space-x-reverse)>*:not(:first-child)::before': {
        content: `'${spacerGlyphs()['disc'].default}'`
      },
      '&.space-x-reverse>*:not(:last-child)::before': {
        content: `'${spacerGlyphs()['disc'].default}'`
      },
    }

    // Spacer positioning for specific space widths (e.g. `.space-x-4`)
    _.forEach(theme('spacing'), (spacingAmt, spacingKey) => {
      spacerGlyphClasses[`.${e(`${prefix}`)}.space-x-${e(`${spacingKey}`)}`] = {
        '&>*::before': {
          marginLeft: `calc(${spacingAmt} / -2 - ${glyphWidth} / 2)`,
        }
      };
    });

    // Classes for choosing glyph
    _.forEach(spacerGlyphs(), (glyph, glyphKey) => {
      spacerGlyphClasses[`.${e(`${prefix}`)}-${glyphKey}`] = {
        '&:not(.space-x-reverse)>*:not(:first-child)::before': {
          content: `'${glyph.default}'`
        },
        '&.space-x-reverse>*:not(:last-child)::before': {
          content: `'${glyph.reverse}'`
        },
      }
    });
  });

  addUtilities(spacerGlyphClasses);

}, {
  theme: {
    spacerGlyphs: {},
  },
  variants: {
    spacerGlyphs: ['responsive'],
  },
});