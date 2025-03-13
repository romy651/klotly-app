import {oneOf} from '@flyerhq/react-native-link-preview';
import * as React from 'react';
import {Pressable, Text, View} from 'react-native';

import {MessageType} from '../../types';
import {
  excludeDerivedMessageProps,
  ThemeContext,
  UserContext,
} from '../../utils';
import {Avatar} from '../Avatar';
import {FileMessage} from '../FileMessage';
import {ImageMessage} from '../ImageMessage';
import {StatusIcon} from '../StatusIcon';
import {TextMessage, TextMessageTopLevelProps} from '../TextMessage';
import styles from './styles';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import TouchableIcon from 'app/components/core/Button/TouchableIcon';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {transalteText} from 'app/utils/tools';
import {CircularActivityIndicator} from '../CircularActivityIndicator';

export interface MessageTopLevelProps extends TextMessageTopLevelProps {
  /** Called when user makes a long press on any message */
  onMessageLongPress?: (message: MessageType.Any) => void;
  /** Called when user taps on any message */
  onMessagePress?: (message: MessageType.Any) => void;
  /** Customize the default bubble using this function. `child` is a content
   * you should render inside your bubble, `message` is a current message
   * (contains `author` inside) and `nextMessageInGroup` allows you to see
   * if the message is a part of a group (messages are grouped when written
   * in quick succession by the same author) */
  renderBubble?: (payload: {
    child: React.ReactNode;
    message: MessageType.Any;
    nextMessageInGroup: boolean;
  }) => React.ReactNode;
  /** Render a custom message inside predefined bubble */
  renderCustomMessage?: (
    message: MessageType.Custom,
    messageWidth: number,
  ) => React.ReactNode;
  /** Render a file message inside predefined bubble */
  renderFileMessage?: (
    message: MessageType.File,
    messageWidth: number,
  ) => React.ReactNode;
  /** Render an image message inside predefined bubble */
  renderImageMessage?: (
    message: MessageType.Image,
    messageWidth: number,
  ) => React.ReactNode;
  /** Render a text message inside predefined bubble */
  renderTextMessage?: (
    message: MessageType.Text,
    messageWidth: number,
    showName: boolean,
  ) => React.ReactNode;
  /** Show user avatars for received messages. Useful for a group chat. */
  showUserAvatars?: boolean;
}

export interface MessageProps extends MessageTopLevelProps {
  enableAnimation?: boolean;
  message: MessageType.DerivedAny;
  messageWidth: number;
  roundBorder: boolean;
  showAvatar: boolean;
  showName: boolean;
  showStatus: boolean;
}

/** Base component for all message types in the chat. Renders bubbles around
 * messages and status. Sets maximum width for a message for
 * a nice look on larger screens. */
export const Message = React.memo(
  ({
    enableAnimation,
    message,
    messageWidth,
    onMessagePress,
    onMessageLongPress,
    onPreviewDataFetched,
    renderBubble,
    renderCustomMessage,
    renderFileMessage,
    renderImageMessage,
    renderTextMessage,
    roundBorder,
    showAvatar,
    showName,
    showStatus,
    showUserAvatars,
    usePreviewData,
  }: MessageProps) => {
    const theme = React.useContext(ThemeContext);
    const user = React.useContext(UserContext);
    const _theme = useAppTheme();

    const currentUserIsAuthor =
      message.type !== 'dateHeader' && user?.id === message.author.id;
    const [_message, setMessage] = React.useState(message);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const {container, contentContainer, dateHeader, pressable} = styles({
      currentUserIsAuthor,
      message,
      messageWidth,
      roundBorder,
      theme,
    });

    if (message.type === 'dateHeader') {
      return (
        <View style={dateHeader}>
          <Text style={theme.fonts.dateDividerTextStyle}>{message.text}</Text>
        </View>
      );
    }

    const renderBubbleContainer = () => {
      const child = renderMessage();

      return oneOf(
        renderBubble,
        <View style={contentContainer} testID="ContentContainer">
          {child}
        </View>,
      )({
        child,
        message: excludeDerivedMessageProps(message),
        nextMessageInGroup: roundBorder,
      });
    };

    const onTranslate = async () => {
      setIsLoading(true);
      const _req = _message.text as string;
      if (!_req.includes('...')) {
        const res = await transalteText(message.text, 'english').catch(e =>
          console.log('THERES IS ANE ERROR', e),
        );
        setMessage({...message, text: res + '...'});
      }
      setIsLoading(false);
      //console.log('THE TRANSLATION ', res)
    };

    const renderMessage = () => {
      switch (message.type) {
        case 'custom':
          return (
            renderCustomMessage?.(
              // It's okay to cast here since we checked message type above
              // type-coverage:ignore-next-line
              excludeDerivedMessageProps(message) as MessageType.Custom,
              messageWidth,
            ) ?? null
          );
        case 'file':
          return oneOf(renderFileMessage, <FileMessage message={message} />)(
            // type-coverage:ignore-next-line
            excludeDerivedMessageProps(message) as MessageType.File,
            messageWidth,
          );
        case 'image':
          return oneOf(
            renderImageMessage,
            <ImageMessage
              {...{
                message,
                messageWidth,
              }}
            />,
          )(
            // type-coverage:ignore-next-line
            excludeDerivedMessageProps(message) as MessageType.Image,
            messageWidth,
          );
        case 'text':
          return oneOf(
            renderTextMessage,
            <TextMessage
              {...{
                enableAnimation,
                message,
                messageWidth,
                onPreviewDataFetched,
                showName,
                usePreviewData,
                _text: _message.text,
              }}
            />,
          )(
            // type-coverage:ignore-next-line
            excludeDerivedMessageProps(message) as MessageType.Text,
            messageWidth,
            showName,
          );
        default:
          return null;
      }
    };

    return (
      <View style={container}>
        <Avatar
          {...{
            author: message.author,
            currentUserIsAuthor,
            showAvatar,
            showUserAvatars,
            theme,
          }}
        />
        <Pressable
          onLongPress={() =>
            onMessageLongPress?.(excludeDerivedMessageProps(message))
          }
          onPress={() => onMessagePress?.(excludeDerivedMessageProps(message))}
          style={pressable}>
          {renderBubbleContainer()}
        </Pressable>
        {!currentUserIsAuthor &&
          message.type === 'text' &&
          (isLoading ? (
            <CircularActivityIndicator
              {...{
                color: _theme.colors.accentActive,
                style: {
                  marginLeft: -10,
                  width: 20,
                  height: 20,
                  borderRadius: 30,
                },
              }}
            />
          ) : (
            <TouchableIcon
              action={onTranslate}
              Component={MatComIcon}
              name="translate"
              size={16}
              color={'white'}
              style={{
                position: 'absolute',
                width: 30,
                height: 30,
                right: -15,
                bottom: -5,
                backgroundColor: _theme.colors.textTertiary,
              }}
            />
          ))}
        <StatusIcon
          {...{
            currentUserIsAuthor,
            showStatus,
            status: message.status,
            theme,
          }}
        />
      </View>
    );
  },
);
