import * as React from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

import {L10nContext, ThemeContext} from '../../utils';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import TouchableIcon from 'app/components/core/Button/TouchableIcon';
import Ionicon from 'react-native-vector-icons/Ionicons';

export interface SendButtonPropsAdditionalProps {
  touchableOpacityProps?: TouchableOpacityProps;
}

export interface SendButtonProps extends SendButtonPropsAdditionalProps {
  /** Callback for send button tap event */
  onPress: () => void;
  active?: boolean;
}

export const SendButton = ({
  onPress,
  touchableOpacityProps,
  active,
}: SendButtonProps) => {
  const l10n = React.useContext(L10nContext);
  const theme = React.useContext(ThemeContext);
  const _theme = useAppTheme();

  return (
    <TouchableIcon
      accessibilityLabel={l10n.sendButtonAccessibilityLabel}
      accessibilityRole="button"
      name="send"
      Component={Ionicon}
      disable={!active}
      size={20}
      style={{
        ...styles.sendButton,
        backgroundColor: active
          ? _theme.colors.accentActive
          : _theme.colors.background2,
      }}
      color={_theme.colors.white}
      action={onPress}
    />
  );
};

const styles = StyleSheet.create({
  sendButton: {},
});
