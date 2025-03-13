import {NativeStackScreenProps} from '@react-navigation/native-stack';
import TouchableIcon from 'app/components/core/Button/TouchableIcon';
import {Text} from 'app/components/core/Text/Text';
import {Flex} from 'app/components/layout/Flex';
import {Screen} from 'app/components/layout/Screen';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {AppStackParamList} from 'app/routes/screens/Screens.types';
import {Stack} from 'app/routes/screens/Stack';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  View,
  StyleSheet,
  Platform,
  UIManager,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import CoinIndicator from 'app/components/Coin/CoinIndicator';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {View as MView} from 'moti';
import {Easing} from 'react-native-reanimated';
import {privacyPolicy, termsUse} from 'app/constants';

const _size = 100;
const _color = '#6E01EF';

type Props = NativeStackScreenProps<AppStackParamList, Stack.PlanScreen>;

const PlanScreen: React.FC<Props> = ({navigation}): JSX.Element => {
  const theme = useAppTheme();
  const {t} = useTranslation();
  const [choice, setChoice] = useState<0 | 1>(0);

  useEffect(() => {
    if (
      Platform.OS === 'android' &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const onSubscribe = () => {};

  const openTermsUse = () => {
    Linking.canOpenURL(termsUse).then(supported => {
      if (supported) {
        Linking.openURL(termsUse);
      } else {
        Alert.alert(t('error'), t('unsupported_browser') as string);
      }
    });
  };

  const openPrivacyPolicy = () => {
    Linking.canOpenURL(privacyPolicy).then(supported => {
      if (supported) {
        Linking.openURL(privacyPolicy);
      } else {
        Alert.alert(t('error'), t('unsupported_browser') as string);
      }
    });
  };

  return (
    <Screen backgroundColor={'background1'} edges={['top']}>
      <View
        style={{
          ...styles.headerView,
          borderBottomColor: theme.colors.background60,
        }}>
        <TouchableIcon
          Component={Ionicon}
          name="close"
          size={24}
          color={theme.colors.textPrimary}
          action={navigation.goBack}
          style={styles.backButton}
        />
        <Flex flexDirection={'row'}>
          <Text
            textTransform={'capitalize'}
            fontWeight={'bold'}
            variant={'buttonLabelMedium'}
            color={'textPrimary'}
            numberOfLines={1}>
            {t('become_vip')}
          </Text>
        </Flex>
        <Flex style={styles.saveButton}>
          <CoinIndicator />
        </Flex>
      </View>
      <ScrollView>
        <View
          style={{
            backgroundColor: theme.colors.accentWarningSoft,
            paddingBottom: 100,
          }}>
          <Flex
            paddingVertical={'spacing16'}
            borderBottomWidth={1}
            borderBottomColor={'background3'}
            paddingLeft={'spacing20'}
            flexDirection={'row'}
            alignItems={'center'}>
            <FontIcon
              color={theme.colors.accentWarning}
              name={'coins'}
              size={22}
            />
            <Flex>
              <Text
                marginLeft={'spacing8'}
                fontWeight={'bold'}
                color={'textPrimary'}
                variant={'bodySmall'}>
                {t('montly_coins')}
              </Text>
              <Text
                marginLeft={'spacing8'}
                style={{marginTop: -15, width: SCREEN_WIDTH - 70}}
                fontWeight={'bold'}
                color={'textSecondary'}
                variant={'bodyMicro'}>
                {t('montly_coins_desc')}
              </Text>
            </Flex>
          </Flex>
          <Flex
            paddingVertical={'spacing16'}
            borderBottomWidth={1}
            borderBottomColor={'background3'}
            paddingLeft={'spacing20'}
            flexDirection={'row'}
            alignItems={'center'}>
            <MatIcon
              color={theme.colors.accentWarning}
              name={'google-ads'}
              size={22}
            />
            <Flex>
              <Text
                marginLeft={'spacing8'}
                fontWeight={'bold'}
                color={'textPrimary'}
                variant={'bodySmall'}>
                {t('no_ads')}
              </Text>
              <Text
                marginLeft={'spacing8'}
                style={{marginTop: -15, width: SCREEN_WIDTH - 70}}
                fontWeight={'bold'}
                color={'textSecondary'}
                variant={'bodyMicro'}>
                {t('no_ads_desc')}
              </Text>
            </Flex>
          </Flex>
          <Flex
            paddingVertical={'spacing16'}
            borderBottomWidth={1}
            borderBottomColor={'background3'}
            paddingLeft={'spacing20'}
            flexDirection={'row'}
            alignItems={'center'}>
            <FontIcon
              color={theme.colors.accentWarning}
              name={'kiss-wink-heart'}
              size={22}
            />
            <Flex>
              <Text
                marginLeft={'spacing8'}
                fontWeight={'bold'}
                color={'textPrimary'}
                variant={'bodySmall'}>
                {t('see_who_liked_you')}
              </Text>
              <Text
                marginLeft={'spacing8'}
                style={{marginTop: -15, width: SCREEN_WIDTH - 70}}
                fontWeight={'bold'}
                color={'textSecondary'}
                variant={'bodyMicro'}>
                {t('see_who_liked_you_desc')}
              </Text>
            </Flex>
          </Flex>
          <Flex
            paddingVertical={'spacing16'}
            borderBottomWidth={1}
            borderBottomColor={'background3'}
            paddingLeft={'spacing20'}
            flexDirection={'row'}
            alignItems={'center'}>
            <MatIcon
              color={theme.colors.accentWarning}
              name={'shield-crown'}
              size={22}
            />
            <Flex>
              <Text
                marginLeft={'spacing8'}
                fontWeight={'bold'}
                color={'textPrimary'}
                variant={'bodySmall'}>
                {t('get_vip_batch')}
              </Text>
              <Text
                marginLeft={'spacing8'}
                style={{marginTop: -15, width: SCREEN_WIDTH - 70}}
                fontWeight={'bold'}
                color={'textSecondary'}
                variant={'bodyMicro'}>
                {t('get_vip_batch_desc')}
              </Text>
            </Flex>
          </Flex>
          <Flex
            paddingVertical={'spacing16'}
            borderBottomWidth={1}
            borderBottomColor={'background3'}
            paddingLeft={'spacing20'}
            flexDirection={'row'}
            alignItems={'center'}>
            <FontIcon
              color={theme.colors.accentWarning}
              name={'location-arrow'}
              size={20}
            />
            <Flex>
              <Text
                marginLeft={'spacing8'}
                fontWeight={'bold'}
                color={'textPrimary'}
                variant={'bodySmall'}>
                {t('switch_locations')}
              </Text>
              <Text
                marginLeft={'spacing8'}
                style={{marginTop: -15, width: SCREEN_WIDTH - 70}}
                fontWeight={'bold'}
                color={'textSecondary'}
                variant={'bodyMicro'}>
                {t('switch_locations_desc')}
              </Text>
            </Flex>
          </Flex>
        </View>
        <Flex
          style={{marginTop: -80}}
          paddingTop={'spacing16'}
          backgroundColor={'background1'}
          borderTopLeftRadius={'rounded20'}
          borderTopRightRadius={'rounded20'}>
          <Touchable onPress={() => setChoice(0)}>
            <Flex
              backgroundColor={
                choice === 0 ? 'accentSuccessSoft' : 'background1'
              }
              borderRadius={'rounded16'}
              paddingVertical={'spacing12'}
              marginVertical={'spacing6'}
              paddingHorizontal={'spacing14'}
              marginHorizontal={'spacing14'}
              flexDirection={'row'}
              alignItems={'center'}>
              {choice == 1 ? (
                <Feather
                  name="circle"
                  size={20}
                  color={theme.colors.textSecondary}
                />
              ) : (
                <AntDesign
                  name="checkcircle"
                  size={20}
                  color={theme.colors.accentSuccess}
                />
              )}
              <Text
                style={{marginLeft: -5}}
                fontWeight={'bold'}
                marginLeft={'spacing8'}
                variant={'bodySmall'}
                color={'textPrimary'}>
                {`${t('one_month_vip')} +`}
              </Text>
              <Flex>
                <View style={{flexDirection: 'row'}}>
                  <FontIcon
                    style={{marginTop: 2}}
                    color={theme.colors.accentWarning}
                    name={'coins'}
                    size={18}
                  />
                  <Text
                    marginLeft={'spacing8'}
                    fontWeight={'bold'}
                    mr={'spacing6'}
                    variant={'bodyLarge'}
                    color={'accentWarning'}>
                    4200
                  </Text>
                </View>
                <Text
                  style={{marginTop: -15}}
                  marginLeft={'spacing8'}
                  fontWeight={'bold'}
                  variant={'bodySmall'}
                  color={'accentWarning'}>
                  {t('coins_monthly')}
                </Text>
              </Flex>
              <Text
                fontWeight={'bold'}
                variant={'bodyLarge'}
                color={'textPrimary'}>
                SEK 450/m
              </Text>
            </Flex>
          </Touchable>
          <Touchable onPress={() => setChoice(1)}>
            <Flex
              backgroundColor={
                choice === 1 ? 'accentSuccessSoft' : 'background1'
              }
              borderRadius={'rounded16'}
              style={{marginTop: -14}}
              paddingVertical={'spacing12'}
              marginVertical={'spacing6'}
              paddingHorizontal={'spacing14'}
              marginHorizontal={'spacing14'}
              flexDirection={'row'}
              alignItems={'center'}>
              {choice == 0 ? (
                <Feather
                  name="circle"
                  size={20}
                  color={theme.colors.textSecondary}
                />
              ) : (
                <AntDesign
                  name="checkcircle"
                  size={20}
                  color={theme.colors.accentSuccess}
                />
              )}
              <Text
                style={{marginLeft: -5}}
                fontWeight={'bold'}
                marginLeft={'spacing8'}
                variant={'bodySmall'}
                color={'textPrimary'}>
                {`${t('one_month_vip')} +`}
              </Text>
              <Flex>
                <View style={{flexDirection: 'row'}}>
                  <FontIcon
                    style={{marginTop: 2}}
                    color={theme.colors.accentWarning}
                    name={'coins'}
                    size={18}
                  />
                  <Text
                    marginLeft={'spacing8'}
                    fontWeight={'bold'}
                    mr={'spacing6'}
                    variant={'bodyLarge'}
                    color={'accentWarning'}>
                    4200
                  </Text>
                </View>
                <Text
                  style={{marginTop: -15}}
                  marginLeft={'spacing8'}
                  fontWeight={'bold'}
                  variant={'bodySmall'}
                  color={'accentWarning'}>
                  {t('coins_monthly')}
                </Text>
              </Flex>
              <Text
                fontWeight={'bold'}
                variant={'bodyLarge'}
                color={'textPrimary'}>
                SEK 450/m
              </Text>
            </Flex>
          </Touchable>
          <Touchable onPress={onSubscribe}>
            <MView
              style={[
                styles.dot,
                styles.center,
                {backgroundColor: theme.colors.accentSuccess},
              ]}>
              {[...Array(3).keys()].map(i => (
                <MView
                  key={i}
                  from={{scale: 1, opacity: 0.3}}
                  animate={{scale: 1.5, opacity: 0}}
                  transition={{
                    loop: true,
                    repeatReverse: false,
                    duration: 4000,
                    delay: i * 800,
                    type: 'timing',
                    easing: Easing.out(Easing.ease),
                  }}
                  style={[
                    StyleSheet.absoluteFillObject,
                    styles.dot,
                    {backgroundColor: theme.colors.accentSuccess},
                  ]}
                />
              ))}
              <Text fontWeight={'bold'} variant={'bodyLarge'} color={'white'}>
                {t('subscribe_now')}
              </Text>
            </MView>
          </Touchable>
          <Text
            textAlign={'center'}
            mt={'spacing6'}
            marginHorizontal={'spacing10'}
            variant={'bodyMicro'}
            color={'textSecondary'}>
            {t('subscribe_desc')}{' '}
            <Text
              onPress={openTermsUse}
              variant={'bodyMicro'}
              color={'accentAction'}>
              {t('terms_of_service')}
            </Text>{' '}
            {t('and')}{' '}
            <Text
              onPress={openPrivacyPolicy}
              variant={'bodyMicro'}
              color={'accentAction'}>
              {t('privacy_policy')}
            </Text>
          </Text>
        </Flex>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  loadingFlex: {
    height: SCREEN_HEIGHT - 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerView: {
    width: '100%',
    height: 53,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 0,
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
  dot: {
    width: SCREEN_WIDTH - 30,
    marginLeft: 15,
    height: 60,
    borderRadius: _size,
    backgroundColor: _color,
  },
  center: {alignItems: 'center', justifyContent: 'center'},
});

export default PlanScreen;
