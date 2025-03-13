import {createTheme} from '@shopify/restyle';
import {borderRadii, iconSizes, imageSizes, spacing} from './Sizing';
import {opacify} from '../utils/colorsUtils';
import {ColorsDark, ColorsLight} from './Color';
import {zIndices} from './zIndices';
import {TextVariants} from './Font';

export type ThemeType = 'blue' | 'red';
export type AppareanceType = 'light' | 'dark';

/*export const Theme = {
    light: {
        logo: {
            source: Assets.images.logoLightTheme,
        },
        splashscreen: {
            backgroundColor: '#69f',
        },
    },
    dark: {
        logo: {
            source: Assets.images.logoDarkTheme,
        },
        splashscreen: {
            backgroundColor: '#69f',
        },
    },
}

const ThemeColor = {
    dark: {
        dark: true,
        colors: {
            primary: '#2C365A',
            background: '#000000',
            card: '#3D4644',
            text: '#000000',
            border: '#707070',
        },
    },
    light: {
        dark: false,
        colors: {
            primary: '#2C365A',
            background: '#FFFFFF',
            card: '#F0F3FC',
            text: '#FFFFFF',
            border: '#707070',
        },
    },
}*/

export const theme = createTheme({
  borderRadii,
  iconSizes,
  imageSizes,
  spacing,
  textVariants: TextVariants,
  zIndices,
  breakpoints: {
    phone: 0,
    longPhone: {
      width: 0,
      height: 812,
    },
    tablet: 768,
    largeTablet: 1024,
  },
  colors: {
    clearBackground1Backdrop: opacify(0, ColorsLight.background1),
    translucentBackgroundBackdrop: opacify(50, ColorsLight.background0),
    translucentBackground: opacify(50, ColorsLight.background0),
    imageTintBackground: opacify(80, ColorsLight.background1),
    background60: opacify(60, ColorsLight.background1),
    translucentThemeColor: opacify(50, ColorsLight.userThemeColor),
    ...ColorsLight,
  },
});

export const darkTheme: Theme = {
  ...theme,
  colors: {
    clearBackground1Backdrop: opacify(0, ColorsDark.background1),
    translucentBackgroundBackdrop: opacify(5, ColorsDark.background0),
    translucentBackground: opacify(5, ColorsDark.white),
    translucentThemeColor: opacify(50, ColorsLight.userThemeColor),
    imageTintBackground: opacify(80, ColorsDark.background1),
    background60: opacify(60, ColorsDark.background1),
    ...ColorsDark,
  },
};

export type Theme = typeof theme;
