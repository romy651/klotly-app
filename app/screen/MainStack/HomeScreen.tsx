import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  AppStackParamList,
  HomeStackParamList,
  SortType,
} from '../../routes/screens/Screens.types';
import {HomeStackScreens, Stack} from '../../routes/screens/Stack';
import {Screen} from '../../components/layout/Screen';
import {Flex} from '../../components/layout/Flex';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {useTranslation} from 'react-i18next';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {LayoutAnimation, Platform, StyleSheet, UIManager} from 'react-native';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import MatComicon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Text} from 'app/components/core/Text/Text';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import TextTicker from 'react-native-text-ticker';
import AllTutor from './Components/AllTutuor';
import {UserInfo} from 'app/redux/user/userReducer';
import {languageMap} from 'app/constants/languages';
import {filterTutors, requestUserPermission, sortTutors} from 'app/utils/tools';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import {TFunction} from 'i18next';
import {Theme} from 'app/themes/Theme';
import {ViewHeader} from 'app/components/Util/ViewHeader';

type Props = NativeStackScreenProps<
  HomeStackParamList & AppStackParamList,
  HomeStackScreens.HomeScreen
>;

type HeaderProps = {
  title: string;
  tutors: UserInfo[];
  onFilter: () => void;
  onSort: () => void;
  t: TFunction;
  theme: Theme;
};

const Header = ({title, tutors, onFilter, onSort, t, theme}: HeaderProps) => {
  return (
    <Flex gap={'none'}>
      <Flex
        alignItems={'center'}
        flexDirection={'row'}
        py={'spacing10'}
        borderBottomWidth={1.5}
        borderBottomColor={'background3'}
        px={'spacing10'}
        gap={'none'}
        backgroundColor={'background2'}>
        <MatComicon
          name="filter-menu-outline"
          size={20}
          color={theme.colors.textSecondary}
        />
        <Flex paddingHorizontal={'spacing6'} width={SCREEN_WIDTH - 90}>
          <TextTicker
            style={{
              marginLeft: 10,
              width: SCREEN_WIDTH - 105,
            }}
            bounce={false}
            scrollSpeed={50}>
            <Text ml={'spacing14'} color={'textPrimary'} variant={'bodyMicro'}>
              {title}
            </Text>
          </TextTicker>
        </Flex>
        <Touchable style={styles.filterText} onPress={onFilter}>
          <Flex flexDirection={'row'}>
            <Text
              style={{marginRight: -10}}
              variant={'buttonLabelMicro'}
              color={'textPrimary'}>
              {t('filter')}
            </Text>
            <MatIcon
              name="filter-list"
              size={16}
              color={theme.colors.textPrimary}
            />
          </Flex>
        </Touchable>
      </Flex>
      <Flex
        backgroundColor={'background2'}
        alignItems={'center'}
        borderBottomWidth={1.5}
        borderBottomColor={'background3'}
        py={'spacing10'}
        px={'spacing10'}
        justifyContent={'space-between'}
        flexDirection={'row'}>
        <Text color={'textSecondary'} variant={'buttonLabelMicro'}>
          {`${tutors.length} ${tutors.length > 1 ? t('tutors') : t('tutor')}`}{' '}
        </Text>
        <Touchable style={styles.filterText} onPress={onSort}>
          <Flex flexDirection={'row'}>
            <Text
              style={{marginRight: -10}}
              variant={'buttonLabelMicro'}
              color={'textPrimary'}>
              {t('sort_relevance')}
            </Text>
            <MatComicon
              name="sort"
              size={16}
              color={theme.colors.textPrimary}
            />
          </Flex>
        </Touchable>
      </Flex>
    </Flex>
  );
};

const HomeScreen: React.FC<Props> = ({navigation}): JSX.Element => {
  //@ts-ignore
  const {t} = useTranslation();
  const theme = useAppTheme();
  const [sort, setSort] = useState<SortType>('pertinence');
  const [loading, setLoading] = useState<boolean>(false);
  const topic = useAppSelector(state => state.application.topic);
  //@ts-ignore
  const subTopics = useAppSelector(state => state.application.subTopics) || [];

  const lang = useAppSelector(state => state.application.appLanguage);
  const [tutors, setTutors] = useState<UserInfo[]>([]);
  const me = useAppSelector(state => state.user);
  const [title, setTitle] = useState<string>(
    `${t('any_gender')} • ${t('any_country')} • ${[
      //@ts-ignore
      ...new Set([languageMap[lang].native, ...me.languages]),
    ].join(',')}`,
  );
  const onFilter = () => {
    navigation?.push(Stack.FilterNavigation, {
      callback(tutors, title) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setTutors(tutors);
        setTitle(title);
      },
    });
  };

  const filterResult = useCallback((_tutors: UserInfo[], _sort: SortType) => {
    console.log('THE SORT: ', _sort);
    const res = sortTutors(_tutors, _sort);
    setTutors(res);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, []);

  const onSort = () => {
    navigation?.push(Stack.SortScreen, {
      callback(_) {
        setSort(_);
        filterResult(tutors, _);
      },
      sort,
    });
  };

  const onRefresh = useCallback(async () => {
    setLoading(true);
    console.log('We refresh: ');
    const res = await filterTutors({
      //@ts-ignore
      languages: [...new Set([...me.languages, languageMap[lang]])],
      topic,
      subTopics,
    });
    filterResult(res, sort);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setLoading(false);
  }, [me.languages, lang, topic, subTopics, filterResult, sort]);

  useEffect(() => {
    //dispatch(addTopics({}))
    requestUserPermission();
    if (
      Platform.OS === 'android' &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    (async () => {
      onRefresh();
      //const li = await Linking.getInitialURL();
      //console.log('THE CURRENT LINK: ', li)
    })();
  }, [onRefresh]);

  return (
    <>
      <Screen backgroundColor={'background2'} edges={['top']}>
        <ViewHeader
          withTopic
          withFavorite
          showBorder
          enableSearch={() =>
            navigation.navigate(HomeStackScreens.SearchScreen)
          }
        />
        <Header
          title={title}
          tutors={tutors}
          onFilter={onFilter}
          onSort={onSort}
          t={t}
          theme={theme}
        />
        <AllTutor loading={loading} tutors={tutors} onRefresh={onRefresh} />
      </Screen>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  filterText: {
    marginLeft: 'auto',
    alignItems: 'center',
    marginRight: 0,
    paddingLeft: 10,
  },
  filterView: {
    paddingHorizontal: 5,
    width: '100%',
    height: 30,
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
