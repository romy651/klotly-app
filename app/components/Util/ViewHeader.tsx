import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Animated from 'react-native-reanimated';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {Text} from '../core/Text/Text';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import SlidingLoading from './SlidingLoading';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import ContextMenu, {ContextMenuAction} from 'react-native-context-menu-view';
import CoinIndicator from '../Coin/CoinIndicator';
import FastImage from 'react-native-fast-image';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {Stack} from 'app/routes/screens/Stack';
import {Flex} from '../layout/Flex';
import {useTranslation} from 'react-i18next';
import NotifIndicator from '../Coin/NotifIndicator';
import TouchableIcon from '../core/Button/TouchableIcon';

export function ViewHeader({
  title,
  showBackButton = false,
  hideOnScroll,
  showBorder,
  iconList,
  enableSearch,
  onShowMore,
  loading = false,
  withCoin = false,
  withProfile,
  withTopic,
  withNotice,
  withFavorite,
}: {
  title?: string;
  showBackButton?: boolean;
  hideOnScroll?: boolean;
  showOnDesktop?: boolean;
  showBorder?: boolean;
  renderButton?: () => JSX.Element;
  enableSearch?: () => void;
  loading?: boolean;
  withCoin?: boolean;
  onShowMore?: (ContextMenuAction & {action: () => void})[];
  withProfile?: boolean;
  withFavorite?: boolean;
  iconList?: {
    IconName: string;
    action: () => void;
    size?: number;
    color?: string;
  }[];
  withTopic?: boolean;
  withNotice?: boolean;
}) {
  const navigation = useNavigation<any>();
  //const {track} = useAnalytics()
  //const {isDesktop, isTablet} = useWebMediaQueries()
  const _theme = useAppTheme();
  const user = useAppSelector(state => state.user);
  const topic = useAppSelector(state => state.application.topic) || '';
  //@ts-ignore
  const {t} = useTranslation();
  const theme = useAppTheme();

  const onPressBack = React.useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  return (
    <>
      <Container
        loading={loading}
        hideOnScroll={hideOnScroll || false}
        showBorder={showBorder}>
        <View style={styles.leftComponent}>
          {withProfile && (
            <Touchable
              onPress={() => navigation.navigate(Stack.UserProfileScreen)}>
              <FastImage style={styles.image} source={{uri: user.avatar}} />
            </Touchable>
          )}
          {withTopic && (
            <Touchable
              onPress={() =>
                navigation.navigate(Stack.SelectTopic, {forced: false})
              }>
              <Flex
                alignItems={'center'}
                flexDirection={'row'}
                gap={'spacing4'}>
                <Text
                  color={'textPrimary'}
                  fontWeight={'bold'}
                  variant={'headlineSmall'}>
                  {t(topic)}
                </Text>
                <Ionicon
                  name="caret-down"
                  color={theme.colors.textPrimary}
                  size={18}
                />
              </Flex>
            </Touchable>
          )}
          {showBackButton ? (
            <TouchableIcon
              Component={Ionicon}
              name={Platform.OS === 'ios' ? 'chevron-back' : 'arrow-back'}
              color={_theme.colors.textPrimary}
              action={onPressBack}
              size={22}
            />
          ) : null}
        </View>
        {title && (
          <View
            style={{
              ...styles.centerComponent,
              ...(Platform.OS === 'android' && {
                left: showBackButton ? 60 : 10,
              }),
            }}>
            <View style={styles.titleContainer} pointerEvents="none">
              <Text
                color={'textPrimary'}
                variant={showBackButton ? 'headlineSmall' : 'headlineSmall'}
                fontWeight={showBackButton ? '600' : 'bold'}>
                {title}
              </Text>
            </View>
          </View>
        )}
        <View style={styles.rightComponent}>
          {withCoin && <CoinIndicator />}
          {withNotice && <NotifIndicator />}
          {withFavorite && (
            <TouchableIcon
              Component={MatComIcon}
              name="bookmark-outline"
              color={_theme.colors.textPrimary}
              action={() => navigation.navigate(Stack.FavoriteScreen)}
              size={22}
            />
          )}
          {iconList &&
            iconList.map((elt, index) => (
              <TouchableIcon
                key={index}
                Component={MatComIcon}
                name={elt.IconName}
                color={elt.color ? elt.color : _theme.colors.textSecondary}
                action={elt.action}
                size={elt.size ? elt.size : 28}
                style={{marginLeft: 10}}
              />
            ))}
          {enableSearch && (
            <TouchableIcon
              Component={Ionicon}
              name="search-outline"
              color={_theme.colors.textPrimary}
              action={enableSearch}
              size={22}
            />
          )}
          {onShowMore && (
            <ContextMenu
              dropdownMenuMode
              style={{marginHorizontal: 10}}
              actions={onShowMore.map(e => {
                return e as ContextMenuAction;
              })}
              onPress={e => onShowMore[e.nativeEvent.index]?.action()}>
              <MatComIcon
                name="dots-horizontal"
                size={28}
                color={_theme.colors.textSecondary}
              />
            </ContextMenu>
          )}
        </View>
      </Container>
    </>
  );
}

function Container({
  children,
  hideOnScroll,
  showBorder,
  loading,
}: {
  children: React.ReactNode;
  hideOnScroll: boolean;
  showBorder?: boolean;
  loading: boolean;
}) {
  const _theme = useAppTheme();

  if (!hideOnScroll) {
    return (
      <>
        <View
          style={[
            styles.header,
            showBorder && styles.border,
            {
              borderColor: _theme.colors.background3,
            },
          ]}>
          {children}
        </View>
        {loading && (
          <SlidingLoading
            trackColor={_theme.colors.accentWarning}
            size={SCREEN_WIDTH}
          />
        )}
      </>
    );
  }
  return (
    <Animated.View
      style={[
        styles.header,
        styles.headerFloating,
        showBorder && styles.border,
      ]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  leftComponent: {
    flexDirection: 'row',
    position: 'absolute',
    left: 10,
  },
  rightComponent: {
    flexDirection: 'row',
    position: 'absolute',
    right: 10,
    alignItems: 'center',
  },
  centerComponent: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    ...(Platform.OS === 'android' && {left: 55}),
  },
  image: {
    width: 30,
    height: 30,
    borderRadius: 5,
  },
  btnBack: {
    height: 44,
    width: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backbuttom: {
    width: 40,
    height: 40,
    borderRadius: 40,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinbuttom: {
    width: 80,
    height: 40,
    borderRadius: 40,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchalbe: {
    height: 40,
    width: 40,
    borderRadius: 45,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 'auto',
    marginLeft: 10,
  },
  header: {
    flexDirection: 'row',
    paddingVertical: 6,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  headerFloating: {
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  desktopHeader: {
    maxWidth: 600,
    marginRight: 'auto',
  },
  border: {
    borderBottomWidth: 1,
  },
  titleContainer: {},
  title: {
    fontWeight: 'bold',
  },
  backBtn: {
    width: 30,
    height: 30,
  },
  backBtnWide: {
    width: 30,
    height: 30,
    paddingHorizontal: 6,
  },
  backIcon: {
    marginTop: 6,
  },
});
