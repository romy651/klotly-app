import {NativeStackScreenProps} from '@react-navigation/native-stack';
import TouchableIcon from 'app/components/core/Button/TouchableIcon';
import {Text} from 'app/components/core/Text/Text';
import {Flex} from 'app/components/layout/Flex';
import {Screen} from 'app/components/layout/Screen';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {AppStackParamList} from 'app/routes/screens/Screens.types';
import {Stack} from 'app/routes/screens/Stack';
import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View, StyleSheet, TextInput, Alert, Platform} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import {CharProgress} from 'app/components/char-progress/CharProgress';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ContextMenu from 'react-native-context-menu-view';
import {Image} from 'react-native';
import {sendFeedback, uploadAvatar} from 'app/utils/tools';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import Toast from 'react-native-toast-message';
import {CircularActivityIndicator} from 'app/components/ChatUI';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {isIos} from 'app/utils/PlatformUtils';

type Props = NativeStackScreenProps<AppStackParamList, Stack.FeedbackScreen>;

const FeedbackScreen: React.FC<Props> = ({navigation}): JSX.Element => {
  const theme = useAppTheme();
  const me = useAppSelector(state => state.user);
  //@ts-ignore
  const {t} = useTranslation();
  const [text, setText] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const canUpload = useCallback(() => {
    return text.length > 50;
  }, [text]);

  const onSend = () => {
    setLoading(true);
    if (image.length > 0) {
      uploadAvatar(
        image,
        me.id,
        () => {},
        () => {
          Alert.alert(t('error'), t('error_try_later') as string);
        },
        uri => {
          sendFeedback(me.id, text, uri, () => {
            Toast.show({
              type: 'success',
              text1: t('feedback_sent') as string,
              text2: t('thanks_feedback') as string,
            });
          });
          setLoading(false);
          navigation.goBack();
        },
      );
    } else {
      sendFeedback(me.id, text, '', () => {
        Toast.show({
          type: 'success',
          text1: t('feedback_sent') as string,
          text2: t('thanks_feedback') as string,
        });
      });
      setLoading(false);
      navigation.goBack();
    }
  };

  const actions = [
    {
      title: t('camera'),
      action: () => async () => {
        const _image = await launchCamera({
          mediaType: 'photo',
        });
        //@ts-ignore
        const res = _image.assets[0].uri as string;
        res && setImage(res);
      },
    },
    {
      title: t('album'),
      action: async () => {
        const _image = await launchImageLibrary({
          mediaType: 'photo',
          selectionLimit: 1,
        });
        //@ts-ignore
        const res = _image.assets[0].uri as string;
        res && setImage(res);
      },
    },
    {
      title: t('cancel'),
      action: () => {},
      destructive: true,
    },
  ];

  const PlusView = () => {
    return (
      <ContextMenu
        onPress={e => actions[e.nativeEvent.index]?.action()}
        dropdownMenuMode
        actions={actions}>
        <Touchable
          style={{...styles.plusView, borderColor: theme.colors.textSecondary}}>
          <AntDesign
            name={'plus'}
            size={28}
            color={theme.colors.textSecondary}
          />
        </Touchable>
      </ContextMenu>
    );
  };

  return (
    <Screen backgroundColor={'background2'} edges={['top']}>
      <View
        style={{
          ...styles.headerView,
          borderBottomColor: theme.colors.background2,
        }}>
        <TouchableIcon
          Component={Ionicon}
          name={Platform.OS === 'ios' ? 'chevron-back' : 'arrow-back'}
          size={22}
          color={theme.colors.textPrimary}
          action={navigation.goBack}
          style={styles.backButton}
        />
        <Flex
          ml={isIos ? 'none' : 'spacing60'}
          style={{marginRight: isIos ? undefined : 'auto'}}
          flexDirection={'row'}>
          <Text
            textTransform={'capitalize'}
            fontWeight={'bold'}
            variant={'headlineSmall'}
            color={'textPrimary'}
            numberOfLines={1}>
            {t('send_feedback')}
          </Text>
        </Flex>
        <View style={styles.saveButton}>
          <Touchable disabled={!canUpload()} onPress={onSend}>
            {!loading ? (
              <Text
                fontWeight={'bold'}
                variant={'buttonLabelSmall'}
                color={!canUpload() ? 'accentActiveSoft' : 'accentActive'}>
                {t('send')}
              </Text>
            ) : (
              <CircularActivityIndicator
                color={theme.colors.accentActive}
                size={22}
              />
            )}
          </Touchable>
        </View>
      </View>

      <Flex flex={1} backgroundColor={'background0'}>
        <Flex backgroundColor={'background2'} style={styles.textView}>
          <TextInput
            placeholder={`${t('write_feedback')}...`}
            value={text}
            multiline
            numberOfLines={5}
            onChangeText={setText}
            style={{...styles.textInput, color: theme.colors.textPrimary}}
          />

          <Flex style={styles.bottomView}>
            <Flex justifyContent={'space-between'} flexDirection={'row'}>
              {image.length === 0 && <PlusView />}
              {image.length > 0 && (
                <View>
                  <Image
                    width={80}
                    height={80}
                    borderRadius={5}
                    source={{
                      uri: image,
                    }}
                  />
                  <View
                    style={{
                      position: 'absolute',
                      top: 5,
                      right: 5,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      borderRadius: 10,
                      padding: 2,
                    }}>
                    <Touchable onPress={() => setImage('')}>
                      <Ionicon size={22} color={'white'} name="close" />
                    </Touchable>
                  </View>
                </View>
              )}
              <Flex
                style={{
                  marginTop: 'auto',
                  position: 'absolute',
                  bottom: -5,
                  right: 0,
                }}>
                <CharProgress count={text.length} />
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Screen>
  );
};

const styles = StyleSheet.create({
  plusView: {
    width: 80,
    height: 80,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
    marginTop: 'auto',
    borderRadius: 5,
  },
  bottomView: {
    marginTop: 'auto',
    marginBottom: 20,
    marginLeft: 20,
    justifyContent: 'flex-end',
    paddingRight: 10,
  },
  textInput: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  textView: {
    width: SCREEN_WIDTH - 20,
    marginHorizontal: 10,
    minHeight: 300,
    borderRadius: 10,
    marginTop: 20,
  },
  headerView: {
    width: '100%',
    height: 53,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 10,
  },
  backButton: {
    position: 'absolute',
    left: 10,
  },
  touchable_item: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingRight: 10,
    paddingLeft: 15,
  },
  saveButton: {
    position: 'absolute',
    right: 10,
  },
});

export default FeedbackScreen;
