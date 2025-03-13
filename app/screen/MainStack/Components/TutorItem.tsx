import {Text} from 'app/components/core/Text/Text';
import {Flex} from 'app/components/layout/Flex';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {updateUserSuccess, UserInfo} from 'app/redux/user/userReducer';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import CountryFlag from 'react-native-country-flag';
import Icon from 'react-native-vector-icons/Ionicons';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {Stack} from 'app/routes/screens/Stack';
import {
  calculateAverageReview,
  getOnlineStatus,
  getTutorLessons,
  isSuperTutor,
} from 'app/utils/tools';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import FastImage from 'react-native-fast-image';
import TouchableIcon from 'app/components/core/Button/TouchableIcon';
import StaticStar from 'app/components/rating/StaticStar';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import {countryCurrencyMap} from 'app/constants/currency-map';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {useDispatch} from 'react-redux';
import firestore from '@react-native-firebase/firestore';

interface TutorItemProps {
  user: UserInfo;
}

const TutorItem: React.FC<TutorItemProps> = ({user}) => {
  const [online, setOnline] = useState<0 | 1 | 2>(0);
  const navigation = useNavigation<any>();
  const theme = useAppTheme();
  const me = useAppSelector(state => state.user);
  const dispatch = useDispatch();
  const [lessons, setLessons] = useState<number>(0);
  const rate = useAppSelector(state => state.application.exchangeRate);
  const {t} = useTranslation();
  const reviews = (user.tutorObj?.reviews || []).map(r => r.rate);
  //@ts-ignore
  const currency = countryCurrencyMap[me.country.toUpperCase()] as string;
  const price = `${currency} ${Math.ceil((user.tutorObj?.rate || 20) * rate)}`;
  const students = user.tutorObj?.students || [];
  const hasStudents = students.length > 0;

  const openUser = () => {
    navigation?.push(Stack.UserProfileScreen, {
      userId: user.id,
      user,
    });
  };

  useEffect(() => {
    (async () => {
      const status = await getOnlineStatus(user.id);
      setOnline(status);
      const l = await getTutorLessons(user.id);
      setLessons(l);
    })();
  }, []);

  const isNewAccount = () => {
    const {nanoseconds, seconds} = user.registered_at;
    const milliseconds = seconds * 1000 + nanoseconds / 1000000;
    const creationTime = moment(milliseconds);
    const currentTime = moment();
    const daysSinceCreation = currentTime.diff(creationTime, 'days');
    return daysSinceCreation <= 4;
  };

  const pluraliseStudents = (val: string) => {
    if (students.length > 1) {
      return val + 's';
    } else {
      return val;
    }
  };
  const pluraliseLessons = (val: string) => {
    if (lessons > 1) {
      return val + 's';
    } else {
      return val;
    }
  };

  const dots = () => {
    if (students.length > 0 && lessons > 0) {
      return '•';
    } else {
      return '';
    }
  };

  const updateFavTutor = async (tutorId: string) => {
    const db = firestore();
    if ((me.favoriteTutors || []).includes(tutorId)) {
      const temp = (me.favoriteTutors || []).filter(t => t !== tutorId);
      await db.collection('users').doc(me.id).update({favoriteTutors: temp});
      dispatch(updateUserSuccess({...me, favoriteTutors: temp}));
    } else {
      const temp = [...(me.favoriteTutors || []), tutorId];
      await db.collection('users').doc(me.id).update({favoriteTutors: temp});
      dispatch(updateUserSuccess({...me, favoriteTutors: temp}));
    }
  };

  return (
    <Touchable onPress={openUser}>
      <Flex
        gap={'spacing10'}
        style={{
          ...styles.container,
          borderBottomColor: theme.colors.background3,
        }}
        borderBottomColor={'background2'}>
        <View style={styles.topView}>
          <View style={styles.topLeftView}>
            <FastImage style={styles.fullView} source={{uri: user.avatar}} />
            <View
              style={{
                ...styles.status,
                backgroundColor:
                  online === 0
                    ? theme.colors.background3
                    : online === 1
                    ? theme.colors.accentSuccess
                    : theme.colors.accentCritical,
              }}
            />
          </View>
          <View style={styles.likeButton}>
            <TouchableIcon
              Component={Icon}
              name={
                (me.favoriteTutors || []).includes(user.id)
                  ? 'bookmark'
                  : 'bookmark-outline'
              }
              action={() => updateFavTutor(user.id)}
              color={theme.colors.textPrimary}
              size={24}
            />
          </View>
          <Flex marginTop={'spacing1'}>
            <Text
              numberOfLines={2}
              style={{width: SCREEN_WIDTH - 175}}
              fontWeight={'bold'}
              variant={'buttonLabelLarge'}
              color={'textPrimary'}>
              {`${user.firstName} ${user.lastName}`}
              {'   '}
              <CountryFlag
                size={18}
                style={styles.flag}
                isoCode={user.country.toLowerCase()}
              />
            </Text>
            {isSuperTutor(reviews) && (
              <View
                style={{
                  ...styles.supTutor,
                  backgroundColor: theme.colors.accentCriticalSoft,
                }}>
                <Text variant={'buttonLabelMicro'} color={'textSecondary'}>
                  {t('super_tutor')}
                </Text>
              </View>
            )}
            {isNewAccount() && (
              <View
                style={{
                  ...styles.supTutor,
                  backgroundColor: theme.colors.accentSuccessSoft,
                }}>
                <Text variant={'buttonLabelMicro'} color={'textSecondary'}>
                  {t('just_joined')}
                </Text>
              </View>
            )}
            <Flex style={styles.topBottomView}>
              <Flex>
                <Text
                  fontWeight={'bold'}
                  variant={'buttonLabelLarge'}
                  color={'textPrimary'}>
                  {price}
                </Text>
                <Text
                  style={{marginTop: -15}}
                  variant={'buttonLabelMicro'}
                  color={'textSecondary'}>
                  {t('fifty_min_lesson')}
                </Text>
              </Flex>
              <Flex style={{marginLeft: 'auto'}}>
                <StaticStar number={calculateAverageReview(reviews)} />
                <Text
                  style={{marginTop: -8}}
                  variant={'buttonLabelMicro'}
                  color={'textSecondary'}>
                  {reviews.length}{' '}
                  {reviews.length > 1 ? t('reviews') : t('review')}
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </View>
        {user.tutorObj?.headline && (
          <Text numberOfLines={2} color={'textPrimary'} variant={'bodySmall'}>
            {user.tutorObj?.headline}
          </Text>
        )}
        {lessons > 0 && students.length > 0 && (
          <Flex style={{marginTop: -5}} flexDirection={'row'}>
            <MatComIcon
              name="account"
              size={16}
              color={theme.colors.textSecondary}
            />
            <Text
              style={{marginLeft: -10}}
              variant={'bodyMicro'}
              color={'textSecondary'}>
              {hasStudents
                ? students.length + ' ' + pluraliseStudents(t('student'))
                : ''}{' '}
              {`${dots()} `}{' '}
              {lessons > 0 ? lessons + ' ' + pluraliseLessons(t('lesson')) : ''}
            </Text>
          </Flex>
        )}
        <Flex gap={'spacing14'} flexDirection={'row'}>
          <MatComIcon
            name="format-quote-close"
            size={16}
            color={theme.colors.textSecondary}
          />
          <Text
            style={{marginLeft: -10}}
            variant={'bodyMicro'}
            color={'textSecondary'}>
            {t('speaks')} {user.languages.join(', ')}
          </Text>
        </Flex>
      </Flex>
    </Touchable>
  );
};

export default TutorItem;

const styles = StyleSheet.create({
  supTutor: {
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 2,
    width: 90,
    alignItems: 'center',
    marginVertical: -7,
  },
  topBottomView: {
    flexDirection: 'row',
  },
  likeButton: {
    position: 'absolute',
    top: -7,
    right: -7,
  },
  status: {
    width: 15,
    height: 15,
    borderRadius: 3,
    position: 'absolute',
    bottom: 5,
    left: 70,
    borderWidth: 2,
    borderColor: 'white',
  },
  topView: {
    flexDirection: 'row',
  },
  topLeftView: {
    width: 90,
    height: 90,
    borderRadius: 5,
    marginRight: 20,
    overflow: 'hidden',
  },
  fullView: {
    width: '100%',
    height: '100%',
  },
  container: {
    width: '100%',
    paddingLeft: 5,
    paddingRight: 10,
    borderBottomWidth: 3,
    paddingVertical: 15,
  },
  touchableAction: {
    position: 'absolute',
    bottom: 30,
    right: 10,
  },
  gradient: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.2)',
    position: 'absolute',
  },
  callView: {
    width: 50,
    height: 50,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lastRow: {
    flexDirection: 'row',
    marginTop: -10,
    alignItems: 'center',
    marginBottom: 10,
  },
  topRow: {
    flexDirection: 'row',
    width: 100,
    alignItems: 'center',
  },
  flag: {
    borderRadius: 5,
  },
  bottomView: {
    width: '100%',
    height: 95,
    marginTop: 'auto',
    padding: 10,
  },
  Container: {
    backgroundColor: 'gray',
    width: '100%',
    height: '100%',
  },
  available: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: 90,
    margin: 7,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 7,
  },
  countryView: {
    width: 55,
    padding: 5,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginRight: 5,
  },
});
