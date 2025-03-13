import * as React from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

import {L10nContext, ThemeContext} from '../../utils';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import Feather from 'react-native-vector-icons/Feather';

export interface AttachmentButtonAdditionalProps {
  touchableOpacityProps?: TouchableOpacityProps;
}

export interface AttachmentButtonProps extends AttachmentButtonAdditionalProps {
  /** Callback for attachment button tap event */
  onPress?: () => void;
}

export const AttachmentButton = ({
  onPress,
  touchableOpacityProps,
}: AttachmentButtonProps) => {
  const l10n = React.useContext(L10nContext);
  const theme = React.useContext(ThemeContext);
  const _theme = useAppTheme();

  const handlePress = (event: GestureResponderEvent) => {
    onPress?.();
    touchableOpacityProps?.onPress?.(event);
  };

  return (
    <TouchableOpacity
      style={{...styles.icon, backgroundColor: _theme.colors.background2}}
      accessibilityLabel={l10n.attachmentButtonAccessibilityLabel}
      accessibilityRole="button"
      {...touchableOpacityProps}
      onPress={handlePress}>
      {theme.icons?.attachmentButtonIcon?.() ?? (
        <Feather name="camera" size={22} color={_theme.colors.textSecondary} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  icon: {
    padding: 8,
    borderRadius: 5,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
});
