import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Flex} from 'app/components/layout/Flex';
import {Screen} from 'app/components/layout/Screen';
import {
  AppStackParamList,
  BottomTabsStackParamList,
} from 'app/routes/screens/Screens.types';
import {BottomTabsScreens} from 'app/routes/screens/Stack';
import React, {useCallback, useEffect, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {isMeetingUpcoming, listenStatus} from 'app/utils/tools';
import {ViewHeader} from 'app/components/Util/ViewHeader';
import {Text} from 'app/components/core/Text/Text';
import {
  Button,
  ButtonEmphasis,
  ButtonSize,
} from 'app/components/core/Button/Button';
import {Booking, useBooking} from 'app/hooks/useBooking';
import BookingItem from './Components/BookingItem';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {FlatList, StyleSheet} from 'react-native';

type Props = NativeStackScreenProps<
  BottomTabsStackParamList & AppStackParamList,
  BottomTabsScreens.AgendaSreen
>;

const Tab = createMaterialTopTabNavigator();

type ListProps = {
  bookings: Booking[];
  onFind: () => void;
  renderItem: ({item}: {item: Booking}) => React.JSX.Element;
  onRefresh: () => void;
  refreshing: boolean;
};

const RenderList = ({
  bookings,
  onFind,
  renderItem,
  onRefresh,
  refreshing,
}: ListProps) => {
  return (
    <FlatList
      data={bookings}
      renderItem={renderItem}
      onRefresh={onRefresh}
      refreshing={refreshing}
      keyExtractor={item => `${item.id}`}
      contentContainerStyle={styles.tabBarContentContainer}
      ListEmptyComponent={<EmptyComponent onFind={onFind} />}
    />
  );
};

const AgendaScreen: React.FC<Props> = ({navigation}): JSX.Element => {
  //@ts-ignore
  const {t} = useTranslation();
  const theme = useAppTheme();
  const me = useAppSelector(state => state.user);
  const {bookings, onRefresh, refreshing} = useBooking();

  //console.log('bookings', bookings);

  const extractBookings = useMemo(() => {
    const upcomingBookings = bookings.filter(booking =>
      isMeetingUpcoming(booking, me.timeZone),
    );

    const archivedBookings = bookings.filter(
      booking => !isMeetingUpcoming(booking, me.timeZone),
    );

    return {upcomingBookings, archivedBookings};
  }, [me.timeZone, bookings]);

  const {upcomingBookings, archivedBookings} = extractBookings;

  useEffect(() => {
    (async () => {
      listenStatus(me?.id as string);
    })();
  }, [me.id]);

  const onFind = useCallback(() => {
    navigation.navigate(BottomTabsScreens.HomeStack);
  }, [navigation]);

  const renderItem = useCallback(({item}: {item: Booking}) => {
    return <BookingItem booking={item} />;
  }, []);

  const UpComingView = useMemo(() => {
    return () => (
      <RenderList
        bookings={upcomingBookings}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onFind={onFind}
        renderItem={renderItem}
      />
    );
  }, [upcomingBookings, onFind, renderItem, onRefresh, refreshing]);

  const ArchivedView = useMemo(() => {
    return () => (
      <RenderList
        bookings={archivedBookings}
        refreshing={refreshing}
        onFind={onFind}
        onRefresh={onRefresh}
        renderItem={renderItem}
      />
    );
  }, [archivedBookings, onFind, renderItem, onRefresh, refreshing]);

  return (
    <Screen backgroundColor={'background2'} edges={['top']}>
      <ViewHeader title={t('n_schedule') as string} withNotice />
      <Flex gap={'spacing10'} flex={1} backgroundColor={'background0'}>
        <Tab.Navigator
          screenOptions={{
            tabBarLabelStyle: {fontSize: 12},
            tabBarStyle: {
              backgroundColor: theme.colors.background2,
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.background3,
            },
            tabBarActiveTintColor: theme.colors.textPrimary,
            tabBarInactiveTintColor: theme.colors.textSecondary,
            tabBarIndicatorStyle: {
              backgroundColor: theme.colors.textPrimary,
            },
            lazy: false,
          }}>
          <Tab.Screen name={t('up_coming')} component={UpComingView} />
          <Tab.Screen name={t('archived')} component={ArchivedView} />
        </Tab.Navigator>
      </Flex>
    </Screen>
  );
};

export default AgendaScreen;

type EmptyProps = {
  onFind: () => void;
};

const EmptyComponent = ({onFind}: EmptyProps): React.JSX.Element => {
  const {t} = useTranslation();
  return (
    <>
      <Text mt={'spacing4'} variant={'buttonLabelMedium'} color={'textPrimary'}>
        {t('agenda_empty')}
      </Text>
      <Text
        marginVertical={'spacing4'}
        variant={'bodySmall'}
        color={'textPrimary'}>
        {t('n_schedule_desc')}
      </Text>
      <Button
        backgroundColor={'accentAction'}
        emphasis={ButtonEmphasis.Outline}
        size={ButtonSize.Medium}
        style={{borderRadius: 7.5, marginTop: 10}}
        onPress={onFind}>
        {t('find_tutor')}
      </Button>
    </>
  );
};

const styles = StyleSheet.create({
  tabBarContentContainer: {
    paddingBottom: 100,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
});
