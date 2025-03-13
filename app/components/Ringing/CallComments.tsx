import React, {useCallback, useMemo, useState} from 'react';
import {StyleSheet, TextInput} from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFlatList,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '@gorhom/bottom-sheet';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {useBackHandler} from '@react-native-community/hooks';
import {Flex} from 'app/components/layout/Flex';
import {useTranslation} from 'react-i18next';
import {Text} from 'app/components/core/Text/Text';
import TouchableIcon from 'app/components/core/Button/TouchableIcon';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {CircularActivityIndicator} from 'app/components/ChatUI';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {isAndroid} from 'app/utils/PlatformUtils';

export type CallComment = {
  image: string;
  content: string;
  username: string;
  createdAt: number;
};

type Props = {
  comments: CallComment[];
  onSend: (text: string) => Promise<void>;
  handleSheetChanges: (ind: number) => void;
  bottomSheetRef: React.RefObject<BottomSheet>;
  onAnimate: (fromIndex: number, toIndex: number) => void;
};

const CallComments: React.FC<Props> = ({
  comments,
  onSend,
  handleSheetChanges,
  bottomSheetRef,
  onAnimate,
}) => {
  const theme = useAppTheme();
  //@ts-ignore
  const {t} = useTranslation();
  const [isSending, setIsSending] = useState<boolean>(false);
  const [text, setText] = useState<string>('');
  const snapPoints = useMemo(() => ['85%'], []);
  const inset = useSafeAreaInsets();
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        style={styles.backdrop}
        pressBehavior="close"
        disappearsOnIndex={-1}
      />
    ),
    [],
  );
  useBackHandler(() => {
    bottomSheetRef.current?.close();
    return true;
  });

  const footerComponent = () => {
    return (
      <Flex
        backgroundColor={'background0'}
        position={'absolute'}
        borderTopColor={'background3'}
        borderTopWidth={1}
        bottom={0}
        paddingVertical={'spacing10'}
        alignItems={'center'}
        justifyContent={'space-between'}
        style={{
          paddingBottom: isAndroid ? 10 : inset.bottom,
        }}
        flexDirection={'row'}
        px={'spacing16'}
        width="100%">
        <Flex
          borderWidth={1.5}
          borderColor={'background3'}
          height={42}
          justifyContent={'center'}
          px={'spacing6'}
          borderRadius={'rounded8'}
          width={SCREEN_WIDTH - 90}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder={t('add_comment') as string}
            placeholderTextColor={theme.colors.textSecondary}
          />
        </Flex>
        {isSending ? (
          <CircularActivityIndicator
            style={{marginRight: 10}}
            color={theme.colors.accentAction}
          />
        ) : (
          <TouchableIcon
            name="send"
            Component={Ionicon}
            disable={text.length === 0}
            size={20}
            style={{
              backgroundColor:
                text.length === 0
                  ? theme.colors.background3
                  : theme.colors.accentAction,
            }}
            color={theme.colors.white}
            action={addComment}
          />
        )}
      </Flex>
    );
  };

  const emptyComponent = () => {
    return (
      <Flex
        flex={1}
        justifyContent={'center'}
        px={'spacing10'}
        pt={'spacing48'}
        alignItems={'center'}>
        <FontAwesome
          name="comments-o"
          color={theme.colors.textSecondary}
          size={90}
        />
        <Text
          textAlign={'center'}
          variant={'bodyLarge'}
          color={'textSecondary'}>
          {t('no_comment')}
        </Text>
      </Flex>
    );
  };

  const addComment = async () => {
    if (text.length > 0) {
      setIsSending(true);
      await onSend(text);
      setText('');
      setIsSending(false);
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      enablePanDownToClose
      onAnimate={onAnimate}
      snapPoints={snapPoints}
      backgroundStyle={{backgroundColor: theme.colors.background2}}
      handleIndicatorStyle={{backgroundColor: theme.colors.textPrimary}}
      style={styles.bsheet}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}>
      <Flex
        backgroundColor={'background2'}
        height={45}
        borderBottomWidth={1}
        borderBottomColor={'background3'}
        justifyContent={'center'}
        alignItems={'center'}>
        <Text variant={'buttonLabelLarge'} color={'textPrimary'}>
          {t('add_comment')}
        </Text>
      </Flex>
      <Flex flex={1} backgroundColor={'background0'}>
        <BottomSheetFlatList
          data={[...comments]}
          ListEmptyComponent={emptyComponent()}
          renderItem={({item}: {item: any}) => (
            <Flex
              mt={'spacing14'}
              paddingHorizontal={'spacing10'}
              flexDirection={'row'}>
              <FastImage
                source={{
                  uri: item.image,
                }}
                style={styles.image}
              />
              <Flex
                borderWidth={1}
                width={SCREEN_WIDTH - 80}
                style={{backgroundColor: theme.colors.background2}}
                p={'spacing10'}
                gap={'none'}
                borderTopStartRadius={'none'}
                borderRadius={'rounded16'}>
                <Text
                  variant={'buttonLabelSmall'}
                  fontWeight={'bold'}
                  color={'textPrimary'}>
                  {item.username}
                </Text>
                <Text variant={'buttonLabelSmall'} color={'textPrimary'}>
                  {item.content}
                </Text>
              </Flex>
            </Flex>
          )}
          contentContainerStyle={{
            ...styles.contentContainer,
            backgroundColor: theme.colors.background0,
          }}
        />
      </Flex>
      {footerComponent()}
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  image: {width: 40, height: 40, borderRadius: 40, marginTop: 1},
  contentContainer: {
    paddingBottom: 100,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  backdrop: {
    backgroundColor: 'black',
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    position: 'absolute',
  },
  bsheet: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default CallComments;
