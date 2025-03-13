import React from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native'
import {
  FontAwesomeIcon,
  FontAwesomeIconStyle,
} from '@fortawesome/react-native-fontawesome'
import {faExclamation, faArrowsRotate} from '@fortawesome/free-solid-svg-icons'
import {useTheme} from '../../themes/ThemeContext'
import {usePalette} from '../../hooks/usePalette'
import {Text} from '../Text'

export function ErrorMessage({
  message,
  numberOfLines,
  style,
  onPressTryAgain,
}: {
  message: string
  numberOfLines?: number
  style?: StyleProp<ViewStyle>
  onPressTryAgain?: () => void
}) {
  const theme = useTheme()
  const pal = usePalette('error')
  return (
    <View testID="errorMessageView" style={[styles.outer, pal.view, style]}>
      <View
        style={[styles.errorIcon, {backgroundColor: theme.palette.error.icon}]}>
        <FontAwesomeIcon
          icon={faExclamation}
          style={pal.text as FontAwesomeIconStyle}
          size={16}
        />
      </View>
      <Text
        type="sm-medium"
        style={[styles.message, pal.text]}
        numberOfLines={numberOfLines}>
        {message}
      </Text>
      {onPressTryAgain && (
        <TouchableOpacity
          testID="errorMessageTryAgainButton"
          style={styles.btn}
          onPress={onPressTryAgain}
          accessibilityRole="button"
          accessibilityLabel={'Retry'}
          accessibilityHint={'Retries the last action, which errored out'}>
          <FontAwesomeIcon
            icon={faArrowsRotate}
            style={{color: theme.palette.error.icon}}
            size={18}
          />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  outer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  errorIcon: {
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  message: {
    flex: 1,
    paddingRight: 10,
  },
  btn: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
})
