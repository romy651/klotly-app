import {FlatList, LayoutAnimation} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TextInput} from 'react-native-gesture-handler';
import {Screen} from 'app/components/layout/Screen';
import TouchableIcon from 'app/components/core/Button/TouchableIcon';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {Flex} from 'app/components/layout/Flex';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {ViewHeader} from 'app/components/Util/ViewHeader';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeStackParamList} from 'app/routes/screens/Screens.types';
import {HomeStackScreens} from 'app/routes/screens/Stack';
import {UserInfo} from 'app/redux/user/userReducer';
import {Text} from 'app/components/core/Text/Text';
import TutorItem from './Components/TutorItem';
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {sleep} from 'app/utils/tools';
import firestore from '@react-native-firebase/firestore';
import {useAppSelector} from 'app/hooks/state/useAppSelector';

type Props = NativeStackScreenProps<
  HomeStackParamList,
  HomeStackScreens.SearchScreen
>;

const SearchScreen: React.FC<Props> = ({navigation}): JSX.Element => {
  const [query, setQuery] = useState<string>('');
  const {t} = useTranslation();
  const theme = useAppTheme();
  const user = useAppSelector(state => state.user);
  const [tutors, setTutors] = useState<UserInfo[]>([]);

  const renderItems = ({item}: {item: UserInfo}) => {
    return <TutorItem user={item} />;
  };

  useEffect(() => {
    (async () => {
      sleep(1000);
      const rq = await firestore()
        .collection('users')
        .where('id', '==', query)
        .get();
      const data = rq.docs
        .map(_ => _.data() as UserInfo)
        .filter(_ => _.id !== user.id);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setTutors(data);
    })();
  }, [query]);

  return (
    <Screen backgroundColor={'background2'} edges={['bottom', 'top']}>
      <ViewHeader title={t('search') as string} showBorder showBackButton />
      <Flex gap={'spacing1'} flex={1} backgroundColor={'background0'}>
        <Flex
          height={40}
          my={'spacing10'}
          mx={'spacing10'}
          borderRadius={'rounded8'}
          pl={'spacing14'}
          backgroundColor={'background2'}
          flexDirection={'row'}
          alignItems={'center'}>
          <TextInput
            placeholder={t('search_place_holder') as string}
            style={{
              color: theme.colors.textPrimary,
              width: '100%',
            }}
            value={query}
            inputMode="numeric"
            onChangeText={setQuery}
            placeholderTextColor={theme.colors.textSecondary}
          />
          {query.length > 0 && (
            <Flex
              alignItems="center"
              backgroundColor="textSecondary"
              borderRadius="rounded20"
              position={'absolute'}
              right={50}
              height={20}
              justifyContent="center"
              width={20}>
              <TouchableIcon
                Component={Ionicon}
                action={(): void => setQuery('')}
                color={theme.colors.background0}
                name="close"
                size={14}
              />
            </Flex>
          )}
          <Flex
            alignItems="center"
            borderRadius="rounded20"
            height={20}
            justifyContent="center"
            style={{marginLeft: 'auto', marginRight: 10}}
            width={20}>
            <TouchableIcon
              Component={MatIcon}
              action={(): void => setQuery('')}
              color={theme.colors.textSecondary}
              name="qrcode-scan"
              size={18}
            />
          </Flex>
        </Flex>
        {tutors.length === 0 ? (
          <Flex
            paddingVertical={'spacing16'}
            backgroundColor={'accentSuccessSoft'}
            px={'spacing10'}>
            <Text variant={'buttonLabelSmall'} color={'textSecondary'}>
              {t('id_search_empty')}
            </Text>
          </Flex>
        ) : (
          <FlatList
            ListHeaderComponent={
              <Text
                px={'spacing12'}
                variant={'buttonLabelMicro'}
                color={'textPrimary'}>
                {t('results')}
              </Text>
            }
            contentContainerStyle={{paddingLeft: 5}}
            data={tutors}
            renderItem={renderItems}
          />
        )}
      </Flex>
    </Screen>
  );
};

export default SearchScreen;
