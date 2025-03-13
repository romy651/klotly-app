import {Alert, StyleSheet} from 'react-native';
import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import FastImage from 'react-native-fast-image';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  AppStackParamList,
  HomeStackParamList,
} from 'app/routes/screens/Screens.types';
import {Stack} from 'app/routes/screens/Stack';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {Review} from 'app/redux/user/userReducer';
import firestore from '@react-native-firebase/firestore';
import {ViewHeader} from 'app/components/Util/ViewHeader';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {Flex} from 'app/components/layout/Flex';
import {Text} from 'app/components/core/Text/Text';
import {Screen} from 'app/components/layout/Screen';
import {
  Button,
  ButtonEmphasis,
  ButtonSize,
} from 'app/components/core/Button/Button';
import Toast from 'react-native-toast-message';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {TextInput} from 'react-native-paper';
import _ from 'lodash';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {isAndroid} from 'app/utils/PlatformUtils';

type Props = NativeStackScreenProps<
  HomeStackParamList & AppStackParamList,
  Stack.LeaveFeedbackScreen
>;

const LeaveFeedbackScreen: React.FC<Props> = ({
  navigation,
  route,
}): JSX.Element => {
  const ratings = [
    'rate',
    'not_good',
    'not_so_great',
    'satisfactory',
    'good',
    'great',
  ];
  const theme = useAppTheme();
  const [number, setNumber] = useState<number>(0);
  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const {tutor} = route.params;
  const me = useAppSelector(state => state.user);
  const inset = useSafeAreaInsets();
  //@ts-ignore
  const {t} = useTranslation();
  //const targetUser = useSelector(state => state.profileX) as

  const onDone = () => {
    if (text.length === 0 || number === 0) {
      Alert.alert(t('error'), t('review_sub_error') as string);
    } else {
      Alert.alert(t('confirm'), t('review_submission_confirm') as string, [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: t('yes') as string,
          onPress: submit,
          style: 'default',
        },
      ]);
    }
  };

  const submit = async () => {
    try {
      setLoading(true);
      const res: Review = {
        date: new Date().getTime(),
        user: me.id,
        content: text,
        rate: number,
      };
      await firestore()
        .collection('users')
        .doc(`${tutor.id}`)
        .update({
          tutorObj: {
            ...tutor.tutorObj,
            reviews: [...(tutor.tutorObj?.reviews || []), res],
          },
        })
        .then(e => {
          console.log('IT IS DONE PERF: ', e);
        });
      setLoading(false);
      Toast.show({text1: 'thank_you', text2: t('review_submitted') as string});
      navigation.goBack();
    } catch (e) {
      console.log('THERE IS AN ERROR: ', e);
    }
  };

  const debouncedClick = _.debounce(async () => {
    onDone();
  }, 300);

  const handleClick = useCallback(() => {
    debouncedClick();
  }, [debouncedClick]);

  const footerComponent = () => {
    return (
      <Flex
        backgroundColor={'background0'}
        position={'absolute'}
        borderTopColor={'background3'}
        borderTopWidth={1}
        bottom={0}
        style={{paddingBottom: isAndroid ? 10 : inset.bottom}}
        py={'spacing10'}
        px={'spacing20'}
        width="100%">
        <Button
          backgroundColor={'accentAction'}
          emphasis={ButtonEmphasis.Background}
          size={ButtonSize.Medium}
          loading={loading}
          style={{borderRadius: 15}}
          onPress={handleClick}>
          {t('submit')}
        </Button>
      </Flex>
    );
  };

  return (
    <Screen backgroundColor={'background2'} edges={['top']}>
      <ViewHeader
        title={t('post_review') as string}
        showBackButton
        showBorder
      />
      <Flex flex={1} backgroundColor={'background0'}>
        <Flex
          gap={'spacing6'}
          flexDirection={'row'}
          justifyContent={'space-around'}
          alignItems={'center'}
          px={'spacing10'}
          mt={'spacing10'}
          py={'spacing10'}>
          <FastImage style={styles.image} source={{uri: tutor.avatar}} />
          <Flex gap={'spacing6'} width={SCREEN_WIDTH - 100}>
            <Text
              fontWeight={'bold'}
              variant={'buttonLabelLarge'}
              numberOfLines={2}>
              {`${tutor.firstName} ${tutor.lastName}`}
            </Text>
            <Text variant={'bodySmall'} color={'textPrimary'}>
              {t('review_desc')}
            </Text>
          </Flex>
        </Flex>
        <Flex
          height={50}
          px={'spacing14'}
          flexDirection={'row'}
          alignItems={'center'}>
          <Flex style={styles.wrapper}>
            <AntDesign
              name="star"
              onPress={() => setNumber(1)}
              style={styles.star}
              color={
                number < 1 ? theme.colors.background3 : theme.colors.textPrimary
              }
              size={30}
            />
            <AntDesign
              name="star"
              onPress={() => setNumber(2)}
              style={styles.star}
              color={
                number < 2 ? theme.colors.background3 : theme.colors.textPrimary
              }
              size={30}
            />
            <AntDesign
              name="star"
              onPress={() => setNumber(3)}
              style={styles.star}
              color={
                number < 3 ? theme.colors.background3 : theme.colors.textPrimary
              }
              size={30}
            />
            <AntDesign
              name="star"
              onPress={() => setNumber(4)}
              style={styles.star}
              color={
                number < 4 ? theme.colors.background3 : theme.colors.textPrimary
              }
              size={30}
            />
            <AntDesign
              name="star"
              onPress={() => setNumber(5)}
              style={styles.star}
              color={
                number < 5 ? theme.colors.background3 : theme.colors.textPrimary
              }
              size={30}
            />
          </Flex>
          <Text
            variant={'buttonLabelMicro'}
            style={{...styles.text, marginLeft: 'auto'}}>
            {t(ratings[number] as string)}
          </Text>
        </Flex>
        <Flex px={'spacing10'}>
          <TextInput
            multiline={true}
            numberOfLines={5}
            maxLength={500}
            onChangeText={setText}
            style={{color: theme.colors.textPrimary, minHeight: 100}}
            value={text}
            placeholder={t('describe_exp') as string}
          />
        </Flex>
        <Text
          paddingHorizontal={'spacing10'}
          variant={'bodySmall'}
          style={styles.smallText}>{`${t('character_limit')} ${
          text.length
        }/500`}</Text>
      </Flex>
      {footerComponent()}
    </Screen>
  );
};

export default LeaveFeedbackScreen;

const styles = StyleSheet.create({
  smallText: {},
  text: {
    fontWeight: 'normal',
    fontSize: 18,
  },
  star: {
    marginRight: 5,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingView: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 5,
  },
});
