/**
 * @Project Summarised
 * @File useColorScheme.ts
 * @Path app/hooks
 * @Author BRICE ZELE
 * @Date 13/03/2023
 */
import {Appearance} from 'react-native';
import {useCallback, useEffect, useRef, useState} from 'react';
import {useAppSelector} from '../state/useAppSelector';

const COLOR_SCHEME_FLICKER_DELAY_MS = 250;

/**
 * Custom useColorScheme hook to determine the app's color scheme.
 * Borrowed from https://github.com/facebook/react-native/issues/28525 due to a react-native bug. This workaround debounces the initial color scheme flicker.
 */
const useDarkMode = (): boolean => {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
  const forceDark = useAppSelector(state => state.application)?.forceDark;
  const timeout = useRef<NodeJS.Timeout>();

  const resetCurrentTimeout = useCallback(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
  }, []);

  const onColorSchemeChange = useCallback(
    (preferences: Appearance.AppearancePreferences) => {
      resetCurrentTimeout();

      timeout.current = setTimeout(() => {
        setColorScheme(preferences.colorScheme);
      }, COLOR_SCHEME_FLICKER_DELAY_MS);
    },
    [resetCurrentTimeout],
  );

  const onUserChangeThemeMode = useCallback(() => {
    resetCurrentTimeout();

    timeout.current = setTimeout(() => {
      setColorScheme(forceDark ? 'dark' : 'light');
    }, COLOR_SCHEME_FLICKER_DELAY_MS);
  }, [resetCurrentTimeout, forceDark]);

  useEffect(() => {
    onUserChangeThemeMode();
    Appearance.addChangeListener(onColorSchemeChange);
    return (): void => {
      resetCurrentTimeout();
    };
  }, [onColorSchemeChange, resetCurrentTimeout, onUserChangeThemeMode]);
  //TODO: uncomment this to enable dark mode switching
  return forceDark === null ? colorScheme === 'dark' : !!forceDark;
};

export default useDarkMode;
