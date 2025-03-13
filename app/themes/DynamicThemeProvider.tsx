/**
 * @Project Summarised
 * @File DynamicThemeProvider.tsx
 * @Path app/themes
 * @Author BRICE ZELE
 * @Date 12/03/2023
 */
import React, {PropsWithChildren, useEffect, useMemo} from 'react';
import {ThemeProvider} from '@shopify/restyle';
import {darkTheme, Theme, theme as lightTheme} from './Theme';
import {useColorScheme} from 'react-native';

const DynamicThemeProvider: React.FC<PropsWithChildren<unknown>> = ({
  children,
}) => {
  const dmode = useColorScheme();
  //const darkMode = useDarkMode()
  const baseTheme = dmode === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    //changeNavigationBarColor('rgba(0,0,0,0)');
  }, [baseTheme]);

  const theme: Theme = useMemo(
    () => ({
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        userThemeColor: baseTheme.colors.userThemeColor,
      },
    }),
    [baseTheme],
  );

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default DynamicThemeProvider;
