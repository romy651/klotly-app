/**
 * @Project Summarised
 * @File Font.ts
 * @Path app/themes
 * @Author BRICE ZELE
 * @Date 13/03/2023
 */
export const FontFamily = {
  serif: 'serif',
  sansSerif: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semibold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
    monospace: 'InputMono-Regular',
  },
};

type fontWeightType =
  | 'normal'
  | 'bold'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900'
  | undefined;
export const FontWeight: Record<string, fontWeightType> = {
  thin: '100',
  ultraLight: '200',
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  heavy: '800',
  black: '900',
};
export const TextVariants = {
  defaults: {},
  headlineLarge: {
    fontFamily: FontFamily.sansSerif.bold,
    fontSize: 40,
    lineHeight: 48,
    color: 'textPrimary',
  },
  headlineMedium: {
    fontFamily: FontFamily.sansSerif.medium,
    fontSize: 32,
    lineHeight: 38,
    color: 'textPrimary',
  },
  headlineSmall: {
    fontFamily: FontFamily.sansSerif.medium,
    fontSize: 24,
    lineHeight: 28,
    color: 'textPrimary',
  },
  subheadLarge: {
    fontFamily: FontFamily.sansSerif.medium,
    fontSize: 20,
    lineHeight: 24,
    color: 'textPrimary',
  },
  subheadSmall: {
    fontFamily: FontFamily.sansSerif.medium,
    fontSize: 15,
    lineHeight: 20,
    color: 'textPrimary',
  },
  bodyLarge: {
    fontFamily: FontFamily.sansSerif.medium,
    fontSize: 17,
    lineHeight: 24,
    color: 'textPrimary',
  },
  bodySmall: {
    fontFamily: FontFamily.sansSerif.regular,
    fontSize: 15,
    lineHeight: 20,
    color: 'textPrimary',
  },
  bodyMicro: {
    fontFamily: FontFamily.sansSerif.regular,
    fontSize: 12,
    lineHeight: 17,
    color: 'textPrimary',
  },
  buttonLabelLarge: {
    fontFamily: FontFamily.sansSerif.semibold,
    fontSize: 20,
    lineHeight: 24,
    color: 'textPrimary',
  },
  buttonLabelMedium: {
    fontFamily: FontFamily.sansSerif.semibold,
    fontSize: 17,
    lineHeight: 20,
    color: 'textPrimary',
  },
  buttonLabelSmall: {
    fontFamily: FontFamily.sansSerif.semibold,
    fontSize: 15,
    lineHeight: 20,
    color: 'textPrimary',
  },
  buttonLabelMicro: {
    fontFamily: FontFamily.sansSerif.semibold,
    fontSize: 12,
    lineHeight: 17,
    color: 'textPrimary',
  },
  monospace: {
    fontFamily: FontFamily.sansSerif.monospace,
    fontSize: 15,
    lineHeight: 20,
    color: 'textPrimary',
  },
};
