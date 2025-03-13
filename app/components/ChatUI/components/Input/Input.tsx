import * as React from 'react';
import {StyleSheet, TextInput, TextInputProps, View} from 'react-native';

import {MessageType} from '../../types';
import {L10nContext, ThemeContext, unwrap, UserContext} from '../../utils';
import {
  AttachmentButton,
  AttachmentButtonAdditionalProps,
} from '../AttachmentButton';
import {
  CircularActivityIndicator,
  CircularActivityIndicatorProps,
} from '../CircularActivityIndicator';
import {SendButton} from '../SendButton';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {useNavigation} from '@react-navigation/core';

export interface InputTopLevelProps {
  /** Whether attachment is uploading. Will replace attachment button with a
   * {@link CircularActivityIndicator}. Since we don't have libraries for
   * managing media in dependencies we have no way of knowing if
   * something is uploading so you need to set this manually. */
  isAttachmentUploading?: boolean;
  /** @see {@link AttachmentButtonProps.onPress} */
  onAttachmentPress?: () => void;
  /** Will be called on {@link SendButton} tap. Has {@link MessageType.PartialText} which can
   * be transformed to {@link MessageType.Text} and added to the messages list. */
  onSendPress: (message: MessageType.PartialText) => void;
  /** Controls the visibility behavior of the {@link SendButton} based on the
   * `TextInput` state. Defaults to `editing`. */
  sendButtonVisibilityMode?: 'always' | 'editing';
  textInputProps?: TextInputProps;

  onVideoCall: () => void;
  onAudioCall: () => void;
  onSendGift: () => void;
}

export interface InputAdditionalProps {
  attachmentButtonProps?: AttachmentButtonAdditionalProps;
  attachmentCircularActivityIndicatorProps?: CircularActivityIndicatorProps;
}

export type InputProps = InputTopLevelProps & InputAdditionalProps;

/** Bottom bar input component with a text input, attachment and
 * send buttons inside. By default hides send button when text input is empty. */
export const Input = ({
  attachmentButtonProps,
  attachmentCircularActivityIndicatorProps,
  isAttachmentUploading,
  onAttachmentPress,
  onSendPress,
  sendButtonVisibilityMode,
  textInputProps,

  onVideoCall,
  onAudioCall,
  onSendGift,
}: InputProps) => {
  const l10n = React.useContext(L10nContext);
  const theme = React.useContext(ThemeContext);
  const _theme = useAppTheme();
  const user = React.useContext(UserContext);
  const {container, input} = styles({theme});
  const {t} = useTranslation();

  const navigation = useNavigation<any>();

  // Use `defaultValue` if provided
  const [text, setText] = React.useState(textInputProps?.defaultValue ?? '');

  const value = textInputProps?.value ?? text;

  const handleChangeText = (newText: string) => {
    // Track local state in case `onChangeText` is provided and `value` is not
    setText(newText);
    textInputProps?.onChangeText?.(newText);
  };

  const handleSend = () => {
    const trimmedValue = value.trim();

    // Impossible to test since button is not visible when value is empty.
    // Additional check for the keyboard input.
    /* istanbul ignore next */
    if (trimmedValue) {
      onSendPress({text: trimmedValue, type: 'text'});
      setText('');
    }
  };

  return (
    <View>
      {/*<ScrollView showsHorizontalScrollIndicator={false} horizontal style={_styles.overView}>
                <Touchable
                    onPress={() => onSendPress({text: `${t('hi_baby')} 😍`, type: 'text'})}
                    activeOpacity={0.7}
                    style={{..._styles.Touchable, backgroundColor: _theme.colors.background2}}>
                    <Text style={{..._styles.text, color: _theme.colors.textSecondary}}>
                        {t('hi_baby')} 😍
                    </Text>
                </Touchable>
                <Touchable
                    onPress={onSendGift}
                    activeOpacity={0.7}
                    style={{..._styles.Touchable, backgroundColor: _theme.colors.background2}}>
                    <Text style={{..._styles.text, color: _theme.colors.textSecondary}}>
                        🎁 {t('gift')}
                    </Text>
                </Touchable>
                <Touchable
                    onPress={onVideoCall}
                    activeOpacity={0.7}
                    style={{..._styles.Touchable, backgroundColor: _theme.colors.background2}}>
                    <Text style={{..._styles.text, color: _theme.colors.textSecondary}}>
                        <Ionicon name="videocam" size={16} color={_theme.colors.accentSuccess} />{' '}
                        {t('video_chat')}
                    </Text>
                </Touchable>
                <Touchable
                    onPress={onAudioCall}
                    activeOpacity={0.7}
                    style={{..._styles.Touchable, backgroundColor: _theme.colors.background2}}>
                    <Text style={{..._styles.text, color: _theme.colors.textSecondary}}>
                        📞 {t('audio_chat')}
                    </Text>
                </Touchable>
            </ScrollView>*/}
      <View style={container}>
        {user &&
          (isAttachmentUploading ? (
            <CircularActivityIndicator
              {...{
                ...attachmentCircularActivityIndicatorProps,
                color: _theme.colors.accentActive,
                style: {
                  marginLeft: 10,
                  width: 29,
                  height: 29,
                  borderRadius: 30,
                },
              }}
            />
          ) : (
            !!onAttachmentPress && (
              <AttachmentButton
                {...unwrap(attachmentButtonProps)}
                onPress={onAttachmentPress}
              />
            )
          ))}
        <TextInput
          multiline
          placeholder={`${t('input_here')}...`}
          placeholderTextColor={_theme.colors.textSecondary}
          underlineColorAndroid="transparent"
          {...textInputProps}
          // Keep our implementation but allow user to use these `TextInputProps`
          style={[
            input,
            textInputProps?.style,
            {
              color: _theme.colors.textPrimary,
              fontSize: 14,
              borderColor: _theme.colors.background3,
              borderRadius: 5,
            },
          ]}
          onChangeText={handleChangeText}
          value={value}
        />
        {
          <SendButton
            active={value.trim().length > 0 && isAttachmentUploading === false}
            onPress={handleSend}
          />
        }
      </View>
    </View>
  );
};

const _styles = StyleSheet.create({
  overView: {
    paddingTop: 10,
    paddingLeft: 10,
  },
  text: {
    fontSize: 14,
  },
  Touchable: {
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
});
