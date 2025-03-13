import {StyleSheet} from 'react-native';

import {Theme} from '../../types';

export default ({theme}: {theme: Theme}) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      flexDirection: 'row',
      paddingHorizontal: 10,
      paddingVertical: 10,
    },
    input: {
      ...theme.fonts.inputTextStyle,
      color: theme.colors.inputText,
      flex: 1,
      maxHeight: 100,
      // Fixes default paddings for Android
      borderRadius: 15,
      borderWidth: 1,
      paddingVertical: 5,
      paddingHorizontal: 10,
      marginHorizontal: 10,
    },
    marginRight: {
      marginRight: 16,
    },
  });
