type modeType = 'light' | 'dark'
const modes = {
  light: 'light',
  dark: 'dark',
};

const opacity = {
  accent50: {
    [modes.light]: 0.04,
    [modes.dark]: 0.04,
  },
  accent100: {
    [modes.light]: 0.08,
    [modes.dark]: 0.08,
  },
  accent200: {
    [modes.light]: 0.15,
    [modes.dark]: 0.14,
  },
  accent300: {
    [modes.light]: 0.24,
    [modes.dark]: 0.23,
  },
  accent400: {
    [modes.light]: 0.33,
    [modes.dark]: 0.34,
  },
  accent500: {
    [modes.light]: 0.46,
    [modes.dark]: 0.46,
  },
  accent600: {
    [modes.light]: 0.58,
    [modes.dark]: 0.58,
  },
  accent700: {
    [modes.light]: 0.69,
    [modes.dark]: 0.71,
  },
  accent800: {
    [modes.light]: 0.82,
    [modes.dark]: 0.84,
  },
};

const getAccentOpacity = (colorCode, opacity) => {
  if (colorCode.startsWith('#')) {
    return hexToRGBA(colorCode, opacity);
  }

  return RGBToRGBA(colorCode, opacity);
};

const hexToRGBA = (hex, opacity) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return 'rgba(' + +r + ',' + +g + ',' + +b + ',' + opacity + ')';
};

const RGBToRGBA = (rgb, opacity) => {
  // Choose correct separator
  let sep = rgb.indexOf(',') > -1 ? ',' : ' ';
  // Turn "rgb(r,g,b)" into [r,g,b]
  rgb = rgb.substr(4).split(')')[0].split(sep);

  let r = (+rgb[0]).toString(16),
    g = (+rgb[1]).toString(16),
    b = (+rgb[2]).toString(16);

  return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
};

/**
 * @class PaletteItem
 * @param {String} light
 * @param {String} dark
 */
class PaletteItem {
  light: string
  dark: string
  constructor({ light = '', dark = '' }) {
    this.light = light;
    this.dark = dark;
  }
}

/**
 *
 * Palette is a class containing default color styles with diffrent slectors.
 * This class returns JSON objects of color styles
 * This class also contains the setter methods for these styles.
 *
 * @version 1.0.0
 * @author CometChat
 *
 * @class Palette
 * @param {String} mode
 * @param {Object} backgroundColor
 * @param {Object} primary
 * @param {Object} primary40
 * @param {Object} primary150
 * @param {Object} primary500
 * @param {Object} secondary
 * @param {Object} tertiary
 * @param {Object} error
 * @param {Object} success
 * @param {Object} accent
 * @param {Object} accent50
 * @param {Object} accent100
 * @param {Object} accent200
 * @param {Object} accent300
 * @param {Object} accent400
 * @param {Object} accent500
 * @param {Object} accent600
 * @param {Object} accent700
 * @param {Object} accent800
 * @param {Object} accent900
 */

class Palette {
  mode: string
  backgroundColor: PaletteItem
  primary: PaletteItem
  primary13: PaletteItem
  primary40: PaletteItem
  primary150: PaletteItem
  primary500: PaletteItem
  secondary: PaletteItem
  tertiary: PaletteItem
  error: PaletteItem
  success: PaletteItem
  accent: PaletteItem
  accent50: PaletteItem
  accent100: PaletteItem
  accent200: PaletteItem
  accent300: PaletteItem
  accent400: PaletteItem
  accent500: PaletteItem
  accent600: PaletteItem
  accent700: PaletteItem
  accent800: PaletteItem
  accent900: PaletteItem
  constructor({
    mode = modes.light,
    backgroundColor = new PaletteItem({
      [modes.light]: 'rgb(255,255,255)',
      [modes.dark]: 'rgb(0,0,0)',
    }),
    primary = new PaletteItem({
      [modes.light]: 'rgb(51, 153, 255)',
      [modes.dark]: 'rgb(51, 153, 255)',
    }),
    primary13 = new PaletteItem({
      [modes.light]: 'rgba(51, 153, 255, .13)',
      [modes.dark]: 'rgba(51, 153, 255, .13)',
    }),
    primary40 = new PaletteItem({
      [modes.light]: 'rgba(51, 153, 255, .04)',
      [modes.dark]: 'rgba(51, 153, 255, .04)',
    }),
    primary150 = new PaletteItem({
      [modes.light]: 'rgba(51, 153, 255, .15)',
      [modes.dark]: 'rgba(51, 153, 255, .15)',
    }),
    primary500 = new PaletteItem({
      [modes.light]: 'rgba(51, 153, 255, .5)',
      [modes.dark]: 'rgba(51, 153, 255, .5)',
    }),
    secondary = new PaletteItem({
      [modes.light]: 'rgba(248, 248, 248, 0.9)',
      [modes.dark]: 'rgba(248, 248, 248, 0.9)',
    }),
    tertiary = new PaletteItem({
      [modes.light]: 'rgb(255, 245, 0)',
      [modes.dark]: 'rgb(255, 245, 0)',
    }),
    error = new PaletteItem({
      [modes.light]: 'rgb(255, 59, 48)',
      [modes.dark]: 'rgb(255, 59, 48)',
    }),
    success = new PaletteItem({
      [modes.light]: 'rgb(0, 200, 111)',
      [modes.dark]: 'rgb(0, 200, 111)',
    }),
    accent = new PaletteItem({
      [modes.light]: 'rgb(20, 20, 20)',
      [modes.dark]: 'rgb(255, 255, 255)',
    }),
    accent50 = new PaletteItem({
      [modes.light]: 'rgba(20, 20, 20, 0.04)',
      [modes.dark]: 'rgba(255, 255, 255, 0.04)',
    }),
    accent100 = new PaletteItem({
      [modes.light]: 'rgba(20, 20, 20, 0.08)',
      [modes.dark]: 'rgba(255, 255, 255, 0.08)',
    }),
    accent200 = new PaletteItem({
      [modes.light]: 'rgba(20, 20, 20, 0.15)',
      [modes.dark]: 'rgba(255, 255, 255, 0.14)',
    }),
    accent300 = new PaletteItem({
      [modes.light]: 'rgba(20, 20, 20, 0.24)',
      [modes.dark]: 'rgba(255, 255, 255, 0.23)',
    }),
    accent400 = new PaletteItem({
      [modes.light]: 'rgba(20, 20, 20, 0.33)',
      [modes.dark]: 'rgba(255, 255, 255, 0.34)',
    }),
    accent500 = new PaletteItem({
      [modes.light]: 'rgba(20, 20, 20, 0.46)',
      [modes.dark]: 'rgba(255, 255, 255, 0.46)',
    }),
    accent600 = new PaletteItem({
      [modes.light]: 'rgba(20, 20, 20, 0.58)',
      [modes.dark]: 'rgba(255, 255, 255, 0.58)',
    }),
    accent700 = new PaletteItem({
      [modes.light]: 'rgba(20, 20, 20, 0.69)',
      [modes.dark]: 'rgba(255, 255, 255, 0.71)',
    }),
    accent800 = new PaletteItem({
      [modes.light]: 'rgba(20, 20, 20, 0.82)',
      [modes.dark]: 'rgba(255, 255, 255, 0.84)',
    }),
    accent900 = new PaletteItem({
      [modes.light]: 'rgb(20, 20, 20)',
      [modes.dark]: 'rgb(255, 255, 255)',
    }),
  }) {
    this.mode = mode;
    this.backgroundColor = backgroundColor;
    this.primary = primary;
    this.primary13 = primary13;
    this.primary40 = primary40;
    this.primary150 = primary150;
    this.primary500 = primary500;
    this.secondary = secondary;
    this.tertiary = tertiary;
    this.error = error;
    this.success = success;
    this.accent = accent;
    this.accent50 = accent50;
    this.accent100 = accent100;
    this.accent200 = accent200;
    this.accent300 = accent300;
    this.accent400 = accent400;
    this.accent500 = accent500;
    this.accent600 = accent600;
    this.accent700 = accent700;
    this.accent800 = accent800;
    this.accent900 = accent900;
  }

  /**
   * Getters
   */
  getAccent = (mode?: modeType) => {
    return this.accent[mode || this.mode];
  };
  getAccent50 = (mode?: modeType) => {
    return this.accent50[mode || this.mode];
  };
  getAccent100 = (mode?: modeType) => {
    return this.accent100[mode || this.mode];
  };
  getAccent200 = (mode?: modeType) => {
    return this.accent200[mode || this.mode];
  };
  getAccent300 = (mode?: modeType) => {
    return this.accent300[mode || this.mode];
  };
  getAccent400 = (mode?: modeType) => {
    return this.accent400[mode || this.mode];
  };
  getAccent500 = (mode?: modeType) => {
    return this.accent500[mode || this.mode];
  };
  getAccent600 = (mode?: modeType) => {
    return this.accent600[mode || this.mode];
  };
  getAccent700 = (mode?: modeType) => {
    return this.accent700[mode || this.mode];
  };
  getAccent800 = (mode?: modeType) => {
    return this.accent800[mode || this.mode];
  };
  getAccent900 = (mode?: modeType) => {
    return this.accent900[mode || this.mode];
  };
  getSuccess = (mode?: modeType) => {
    return this.success[mode || this.mode];
  };
  getError = (mode?: modeType) => {
    return this.error[mode || this.mode];
  };
  getPrimary = (mode?: modeType) => {
    return this.primary[mode || this.mode];
  };
  getPrimary13 = (mode?: modeType) => {
    return this.primary13[mode || this.mode];
  };
  getPrimary40 = (mode?: modeType) => {
    return this.primary40[mode || this.mode];
  }
  getPrimary150 = (mode?: modeType) => {
    return this.primary150[mode || this.mode];
  }
  getPrimary500 = (mode?: modeType) => {
    return this.primary500[mode || this.mode];
  }
  getSecondary = (mode?: modeType) => {
    return this.secondary[mode || this.mode];
  };
  getTertiary = (mode?: modeType) => {
    return this.tertiary[mode || this.mode];
  };
  getBackgroundColor = (mode?: modeType) => {
    return this.backgroundColor[mode || this.mode];
  };


  setMode(mode) {
    this.mode = mode;
  }

  setBackground(colorset) {
    if (colorset && colorset[modes.light] && colorset[modes.dark]) {
      this.backgroundColor = colorset;
    }
  }

  setPrimary(colorset) {
    if (colorset && colorset[modes.light] && colorset[modes.dark]) {
      this.primary = colorset;
    }
  }

  setPrimary13(colorset) {
    if (colorset && colorset[modes.light] && colorset[modes.dark]) {
      this.primary13 = colorset;
    }
  }

  setPrimary40(colorset) {
    if (colorset && colorset[modes.light] && colorset[modes.dark]) {
      this.primary40 = colorset;
    }
  }

  setSecondary(colorset) {
    if (colorset && colorset[modes.light] && colorset[modes.dark]) {
      this.secondary = colorset;
    }
  }

  setTertiary(colorset) {
    if (colorset && colorset[modes.light] && colorset[modes.dark]) {
      this.tertiary = colorset;
    }
  }

  setPrimary150(colorset) {
    if (colorset && colorset[modes.light] && colorset[modes.dark]) {
      this.primary150 = colorset;
    }
  }

  setPrimary500(colorset) {
    if (colorset && colorset[modes.light] && colorset[modes.dark]) {
      this.primary500 = colorset;
    }
  }

  setError(colorset) {
    if (colorset && colorset[modes.light] && colorset[modes.dark]) {
      this.error = colorset;
    }
  }

  setAccent(colorset) {
    if (colorset && colorset[modes.light] && colorset[modes.dark]) {
      this.setAccent900({
        [modes.light]: colorset[modes.dark],
        [modes.dark]: colorset[modes.light],
      });

      this.setAccent50({
        [modes.light]: getAccentOpacity(
          colorset[modes.light],
          opacity.accent50[modes.light],
        ),
        [modes.dark]: getAccentOpacity(
          colorset[modes.light],
          opacity.accent50[modes.dark],
        ),
      });

      this.setAccent100({
        [modes.light]: getAccentOpacity(
          colorset.light,
          opacity.accent100[modes.light],
        ),
        [modes.dark]: getAccentOpacity(
          colorset.dark,
          opacity.accent100[modes.dark],
        ),
      });

      this.setAccent200({
        [modes.light]: getAccentOpacity(
          colorset.light,
          opacity.accent200[modes.light],
        ),
        [modes.dark]: getAccentOpacity(
          colorset.dark,
          opacity.accent200[modes.dark],
        ),
      });

      this.setAccent300({
        [modes.light]: getAccentOpacity(
          colorset.light,
          opacity.accent300[modes.light],
        ),
        [modes.dark]: getAccentOpacity(
          colorset.dark,
          opacity.accent300[modes.dark],
        ),
      });

      this.setAccent400({
        [modes.light]: getAccentOpacity(
          colorset.light,
          opacity.accent400[modes.light],
        ),
        [modes.dark]: getAccentOpacity(
          colorset.dark,
          opacity.accent400[modes.dark],
        ),
      });

      this.setAccent500({
        [modes.light]: getAccentOpacity(
          colorset.light,
          opacity.accent500[modes.light],
        ),
        [modes.dark]: getAccentOpacity(
          colorset.dark,
          opacity.accent500[modes.dark],
        ),
      });

      this.setAccent600({
        [modes.light]: getAccentOpacity(
          colorset.light,
          opacity.accent600[modes.light],
        ),
        [modes.dark]: getAccentOpacity(
          colorset.dark,
          opacity.accent600[modes.dark],
        ),
      });

      this.setAccent700({
        [modes.light]: getAccentOpacity(
          colorset.light,
          opacity.accent700[modes.light],
        ),
        [modes.dark]: getAccentOpacity(
          colorset.dark,
          opacity.accent700[modes.dark],
        ),
      });

      this.setAccent800({
        [modes.light]: getAccentOpacity(
          colorset.light,
          opacity.accent800[modes.light],
        ),
        [modes.dark]: getAccentOpacity(
          colorset.dark,
          opacity.accent800[modes.dark],
        ),
      });
    }
  }

  setAccent50(colorset) {
    if (colorset && colorset[modes.light] && colorset[modes.dark]) {
      this.accent50 = new PaletteItem({
        [modes.light]: colorset[modes.light],
        [modes.dark]: colorset[modes.dark],
      });
    }
  }

  setAccent100(colorset) {
    if (colorset && colorset[modes.light] && colorset[modes.dark]) {
      this.accent100 = new PaletteItem({
        [modes.light]: colorset[modes.light],
        [modes.dark]: colorset[modes.dark],
      });
    }
  }

  setAccent200(colorset) {
    if (colorset && colorset[modes.light] && colorset[modes.dark]) {
      this.accent200 = new PaletteItem({
        [modes.light]: colorset[modes.light],
        [modes.dark]: colorset[modes.dark],
      });
    }
  }

  setAccent300(colorset) {
    if (colorset && colorset[modes.light] && colorset[modes.dark]) {
      this.accent300 = new PaletteItem({
        [modes.light]: colorset[modes.light],
        [modes.dark]: colorset[modes.dark],
      });
    }
  }

  setAccent400(colorset) {
    if (colorset && colorset[modes.light] && colorset[modes.dark]) {
      this.accent400 = new PaletteItem({
        [modes.light]: colorset[modes.light],
        [modes.dark]: colorset[modes.dark],
      });
    }
  }

  setAccent500(colorset) {
    if (colorset && colorset[modes.light] && colorset[modes.dark]) {
      this.accent500 = new PaletteItem({
        [modes.light]: colorset[modes.light],
        [modes.dark]: colorset[modes.dark],
      });
    }
  }

  setAccent600(colorset) {
    if (colorset && colorset[modes.light] && colorset[modes.dark]) {
      this.accent600 = new PaletteItem({
        [modes.light]: colorset[modes.light],
        [modes.dark]: colorset[modes.dark],
      });
    }
  }

  setAccent700(colorset) {
    if (colorset && colorset[modes.light] && colorset[modes.dark]) {
      this.accent700 = new PaletteItem({
        [modes.light]: colorset[modes.light],
        [modes.dark]: colorset[modes.dark],
      });
    }
  }

  setAccent800(colorset) {
    if (colorset && colorset[modes.light] && colorset[modes.dark]) {
      this.accent800 = new PaletteItem({
        [modes.light]: colorset[modes.light],
        [modes.dark]: colorset[modes.dark],
      });
    }
  }

  setAccent900(colorset) {
    if (colorset && colorset[modes.light] && colorset[modes.dark]) {
      this.accent900 = new PaletteItem({
        [modes.light]: colorset[modes.light],
        [modes.dark]: colorset[modes.dark],
      });
    }
  }
}

// Exports the mode and palette
export { modes, Palette };
