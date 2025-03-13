import {
  KeyboardAccessoryView,
  useComponentSize,
} from '@flyerhq/react-native-keyboard-accessory-view';
import {oneOf} from '@flyerhq/react-native-link-preview';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import * as React from 'react';
import {
  FlatList,
  FlatListProps,
  GestureResponderHandlers,
  InteractionManager,
  LayoutAnimation,
  StatusBar,
  StatusBarProps,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {usePrevious} from '../../hooks';
import {l10n} from '../../l10n';
import {defaultTheme} from '../../theme';
import {MessageType, Theme, User} from '../../types';
import {
  calculateChatMessages,
  initLocale,
  L10nContext,
  ThemeContext,
  unwrap,
  UserContext,
} from '../../utils';
import {CircularActivityIndicator} from '../CircularActivityIndicator';
import {Input, InputAdditionalProps, InputTopLevelProps} from '../Input';
import {Message, MessageTopLevelProps} from '../Message';
//import ImageView from './ImageView'
import styles from './styles';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';

// Untestable
/* istanbul ignore next */
const animate = () => {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
};

dayjs.extend(calendar);

export type ChatTopLevelProps = InputTopLevelProps & MessageTopLevelProps;

export interface ChatProps extends ChatTopLevelProps {
  customBottomComponent?: () => React.ReactNode;
  customDateHeaderText?: (dateTime: number) => string;
  dateFormat?: string;
  disableImageGallery?: boolean;
  emptyState?: () => React.ReactNode;
  enableAnimation?: boolean;
  flatListProps?: Partial<FlatListProps<MessageType.DerivedAny[]>>;
  inputProps?: InputAdditionalProps;
  isLastPage?: boolean;
  l10nOverride?: Partial<
    Record<keyof (typeof l10n)[keyof typeof l10n], string>
  >;
  locale?: keyof typeof l10n;
  messages: MessageType.Any[];
  onEndReached?: () => Promise<void>;
  showUserNames?: boolean;
  theme?: Theme;
  timeFormat?: string;
  user: User;
  listHeaderComponent?: () => React.JSX.Element;

  onVideoCall: () => void;
  onAudioCall: () => void;
  onSendGift: () => void;
}

/** Entry component, represents the complete chat */
export const Chat = ({
  customBottomComponent,
  customDateHeaderText,
  dateFormat,
  disableImageGallery,
  emptyState,
  enableAnimation,
  flatListProps,
  inputProps,
  isAttachmentUploading,
  isLastPage,
  l10nOverride,
  locale = 'en',
  messages,
  onAttachmentPress,
  onEndReached,
  onMessageLongPress,
  onMessagePress,
  onPreviewDataFetched,
  onSendPress,
  renderBubble,
  renderCustomMessage,
  renderFileMessage,
  renderImageMessage,
  renderTextMessage,
  sendButtonVisibilityMode = 'editing',
  showUserAvatars = false,
  showUserNames = false,
  textInputProps,
  theme = defaultTheme,
  timeFormat,
  usePreviewData = true,
  user,
  listHeaderComponent,
  onVideoCall,
  onAudioCall,
  onSendGift,
}: ChatProps) => {
  const {
    container,
    emptyComponentContainer,
    emptyComponentTitle,
    flatList,
    flatListContentContainer,
    footer,
    footerLoadingPage,
    header,
    keyboardAccessoryView,
  } = styles({theme});

  const {onLayout, size} = useComponentSize();
  const animationRef = React.useRef(false);
  const list = React.useRef<FlatList<MessageType.DerivedAny>>(null);
  const insets = useSafeAreaInsets();
  const [isImageViewVisible, setIsImageViewVisible] = React.useState(false);
  const [isNextPageLoading, setNextPageLoading] = React.useState(false);
  const [imageViewIndex, setImageViewIndex] = React.useState(0);
  const _theme = useAppTheme();
  const [stackEntry, setStackEntry] = React.useState<StatusBarProps>({});

  const l10nValue = React.useMemo(
    () => ({...l10n[locale], ...unwrap(l10nOverride)}),
    [l10nOverride, locale],
  );

  const {chatMessages, gallery} = calculateChatMessages(messages, user, {
    customDateHeaderText,
    dateFormat,
    showUserNames,
    timeFormat,
  });

  const previousChatMessages = usePrevious(chatMessages);

  React.useEffect(() => {
    if (
      chatMessages[0]?.type !== 'dateHeader' &&
      chatMessages[0]?.id !== previousChatMessages?.[0]?.id &&
      chatMessages[0]?.author?.id === user.id
    ) {
      list.current?.scrollToOffset({
        animated: true,
        offset: 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatMessages]);

  React.useEffect(() => {
    initLocale(locale);
  }, [locale]);

  // Untestable
  /* istanbul ignore next */
  if (animationRef.current && enableAnimation) {
    InteractionManager.runAfterInteractions(animate);
  }

  React.useEffect(() => {
    // Untestable
    /* istanbul ignore next */
    if (animationRef.current && enableAnimation) {
      InteractionManager.runAfterInteractions(animate);
    } else {
      animationRef.current = true;
    }
  }, [enableAnimation, messages]);

  const handleEndReached = React.useCallback(
    // Ignoring because `scroll` event for some reason doesn't trigger even basic
    // `onEndReached`, impossible to test.
    // TODO: Verify again later
    /* istanbul ignore next */
    async ({distanceFromEnd}: {distanceFromEnd: number}) => {
      if (
        !onEndReached ||
        isLastPage ||
        distanceFromEnd <= 0 ||
        messages.length === 0 ||
        isNextPageLoading
      ) {
        return;
      }

      setNextPageLoading(true);
      await onEndReached?.();
      setNextPageLoading(false);
    },
    [isLastPage, isNextPageLoading, messages.length, onEndReached],
  );

  const handleImagePress = React.useCallback(
    (message: MessageType.Image) => {
      setImageViewIndex(
        gallery.findIndex(
          image => image.id === message.id && image.uri === message.uri,
        ),
      );
      setIsImageViewVisible(true);
      setStackEntry(
        StatusBar.pushStackEntry({
          barStyle: 'light-content',
          animated: true,
        }),
      );
    },
    [gallery],
  );

  const handleMessagePress = React.useCallback(
    (message: MessageType.Any) => {
      if (message.type === 'image' && !disableImageGallery) {
        handleImagePress(message);
      }
      onMessagePress?.(message);
    },
    [disableImageGallery, handleImagePress, onMessagePress],
  );

  const handleRequestClose = () => {
    setIsImageViewVisible(false);
    StatusBar.popStackEntry(stackEntry);
  };

  const keyExtractor = React.useCallback(
    ({id}: MessageType.DerivedAny) => id,
    [],
  );

  const renderItem = React.useCallback(
    ({item: message}: {item: MessageType.DerivedAny; index: number}) => {
      const messageWidth =
        showUserAvatars &&
        message.type !== 'dateHeader' &&
        message.author.id !== user.id
          ? Math.floor(Math.min(size.width * 0.72, 440))
          : Math.floor(Math.min(size.width * 0.77, 440));

      const roundBorder =
        message.type !== 'dateHeader' && message.nextMessageInGroup;
      const showAvatar =
        message.type !== 'dateHeader' && !message.nextMessageInGroup;
      const showName = message.type !== 'dateHeader' && message.showName;
      const showStatus = message.type !== 'dateHeader' && message.showStatus;

      console.log('message: ', message.id);

      return (
        <>
          <Message
            {...{
              enableAnimation,
              message,
              messageWidth,
              onMessageLongPress,
              onMessagePress: handleMessagePress,
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
            }}
          />
        </>
      );
    },
    [
      enableAnimation,
      handleMessagePress,
      onMessageLongPress,
      onPreviewDataFetched,
      renderBubble,
      renderCustomMessage,
      renderFileMessage,
      renderImageMessage,
      renderTextMessage,
      showUserAvatars,
      size.width,
      usePreviewData,
      user.id,
    ],
  );

  const renderListEmptyComponent = React.useCallback(
    () => (
      <View style={emptyComponentContainer}>
        {oneOf(
          emptyState,
          <Text style={emptyComponentTitle}>
            {l10nValue.emptyChatPlaceholder}
          </Text>,
        )()}
      </View>
    ),
    [emptyComponentContainer, emptyComponentTitle, emptyState, l10nValue],
  );

  const renderListFooterComponent = React.useCallback(
    () =>
      // Impossible to test, see `handleEndReached` function
      /* istanbul ignore next */
      isNextPageLoading ? (
        <View style={footerLoadingPage}>
          <CircularActivityIndicator color={theme.colors.primary} size={16} />
        </View>
      ) : (
        <View style={footer} />
      ),
    [footer, footerLoadingPage, isNextPageLoading, theme.colors.primary],
  );

  const renderScrollable = React.useCallback(
    (panHandlers: GestureResponderHandlers) => (
      <FlatList
        automaticallyAdjustContentInsets={false}
        contentContainerStyle={[
          flatListContentContainer,
          // eslint-disable-next-line react-native/no-inline-styles
          {
            justifyContent: chatMessages.length !== 0 ? undefined : 'flex-end',
            paddingTop: insets.bottom,
          },
        ]}
        initialNumToRender={10}
        ListFooterComponent={listHeaderComponent}
        ListHeaderComponentStyle={header}
        maxToRenderPerBatch={6}
        onEndReachedThreshold={0.75}
        style={{...flatList, backgroundColor: _theme.colors.background0}}
        showsVerticalScrollIndicator={false}
        {...unwrap(flatListProps)}
        data={chatMessages}
        inverted
        keyboardDismissMode="interactive"
        keyExtractor={keyExtractor}
        onEndReached={handleEndReached}
        ref={list}
        renderItem={renderItem}
        {...panHandlers}
      />
    ),
    [
      chatMessages,
      flatList,
      flatListContentContainer,
      flatListProps,
      handleEndReached,
      header,
      insets.bottom,
      keyExtractor,
      renderItem,
      renderListEmptyComponent,
      renderListFooterComponent,
    ],
  );

  return (
    <UserContext.Provider value={user}>
      <ThemeContext.Provider value={theme}>
        <L10nContext.Provider value={l10nValue}>
          <View style={container} onLayout={onLayout}>
            {customBottomComponent ? (
              <>
                <>{renderScrollable({})}</>
                <>{customBottomComponent()}</>
              </>
            ) : (
              <KeyboardAccessoryView
                {...{
                  renderScrollable,
                  style: {
                    ...keyboardAccessoryView,
                    backgroundColor: _theme.colors.background0,
                    borderTopColor: _theme.colors.background2,
                    borderTopWidth: 1,
                  },
                }}>
                <Input
                  {...{
                    ...unwrap(inputProps),
                    isAttachmentUploading,
                    onAttachmentPress,
                    onSendPress,
                    renderScrollable,
                    sendButtonVisibilityMode,
                    textInputProps,
                    onVideoCall,
                    onAudioCall,
                    onSendGift,
                  }}
                />
              </KeyboardAccessoryView>
            )}
            {/*<ImageView
              imageIndex={imageViewIndex}
              images={gallery}
              onRequestClose={handleRequestClose}
              visible={isImageViewVisible}
          />*/}
          </View>
        </L10nContext.Provider>
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
};
