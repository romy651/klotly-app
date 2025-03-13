import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {
  AppStackParamList,
  MeetingPlace,
} from 'app/routes/screens/Screens.types';
import {Stack} from 'app/routes/screens/Stack';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Alert,
  StyleSheet,
  TouchableNativeFeedback as Touchable,
} from 'react-native';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {Flex} from 'app/components/layout/Flex';
import {useAppSelector} from 'app/hooks/state/useAppSelector';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ViewHeader} from 'app/components/Util/ViewHeader';
import moment from 'moment';
import MapView, {MarkerAnimated} from 'react-native-maps';
import {
  GooglePlaceData,
  GooglePlacesAutocomplete,
} from 'react-native-google-places-autocomplete';
import {CircularActivityIndicator} from 'app/components/ChatUI';
import geocode from 'app/utils/geocode';
import {Screen} from 'app/components/layout/Screen';
import {Text} from 'app/components/core/Text/Text';
import {isAndroid} from 'app/utils/PlatformUtils';

moment.locale('fr');

type Props = NativeStackScreenProps<AppStackParamList, Stack.AddLocationScreen>;

const AddLocationScreen: React.FC<Props> = ({
  navigation,
  route,
}): JSX.Element => {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  //@ts-ignore
  const {t} = useTranslation();
  const {booking, id} = route.params;
  const inset = useSafeAreaInsets();
  const [place, setPlace] = useState<MeetingPlace | undefined>(
    booking?.location,
  );
  const ref = useRef<MapView>();
  const language = useAppSelector(state => state.application.language);

  const onSubmit = useCallback(() => {
    if (typeof place === 'undefined') {
      Alert.alert(t('error'), t('location_error') as string);
    } else {
      navigation.push(Stack.BookingConfirmationScreen, {
        ...route.params,
        location: place,
        id,
      });
    }
  }, [place]);

  useEffect(() => {
    if (place) {
      ref.current?.animateToRegion({
        latitude: place.lat,
        longitude: place.lng,
        latitudeDelta: 0.025,
        longitudeDelta: 0.025,
      });
    }
  }, []);

  const footerComponent = useCallback(
    () => (
      <Flex
        backgroundColor={'background0'}
        position={'absolute'}
        bottom={0}
        borderTopColor={'background3'}
        borderTopWidth={1}
        paddingVertical={'spacing10'}
        px={'spacing20'}
        style={{
          paddingBottom: isAndroid ? 10 : insets.bottom,
        }}
        width="100%">
        <Touchable onPress={onSubmit}>
          <Flex
            alignItems={'center'}
            borderRadius={'rounded8'}
            justifyContent={'center'}
            width={'100%'}
            height={45}
            backgroundColor={'accentActive'}>
            <Text variant={'buttonLabelLarge'} color={'white'}>
              {t('continue')}
            </Text>
          </Flex>
        </Touchable>
      </Flex>
    ),
    [onSubmit, place],
  );

  const onSetPlace = async (data: GooglePlaceData) => {
    const req = await geocode.from(data.place_id);
    const res = req.results[0].geometry.location;
    setPlace({...res, description: data.description});
    ref.current?.animateToRegion({
      latitude: res.lat,
      longitude: res.lng,
      latitudeDelta: 0.025,
      longitudeDelta: 0.025,
    });
  };

  const getInput = () => (
    <GooglePlacesAutocomplete
      placeholder="Search"
      currentLocation
      suppressDefaultStyles
      numberOfLines={2}
      enablePoweredByContainer={false}
      styles={{
        textInput: {...styles.input, color: theme.colors.textPrimary},
        listView: {
          paddingHorizontal: 10,
          backgroundColor: theme.colors.background0,
          marginTop: -3,
          borderTopWidth: 1,
          borderTopColor: theme.colors.background3,
        },
        row: {
          marginVertical: 7.5,
        },
        description: {
          color: theme.colors.textPrimary,
        },
      }}
      listLoaderComponent={
        <CircularActivityIndicator
          color={theme.colors.accentActive}
          size={18}
        />
      }
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        //console.log(data)
        onSetPlace(data);
      }}
      query={{
        key: 'YOUR GOOGLE API KEY',
        language,
      }}
    />
  );

  return (
    <Screen edges={['top']} gap={'none'} backgroundColor={'background2'}>
      <ViewHeader
        title={t('add_location') as string}
        showBorder
        showBackButton
      />
      <Flex flex={1} backgroundColor={'background0'}>
        <MapView
          ref={(elt: MapView) => (ref.current = elt)}
          style={{
            ...styles.map,
            top: 70,
            height: SCREEN_HEIGHT - inset.top - inset.bottom - 175,
          }}
          zoomEnabled>
          {place && (
            <MarkerAnimated
              coordinate={{latitude: place.lat, longitude: place.lng}}
            />
          )}
        </MapView>
        {getInput()}
      </Flex>
      {footerComponent()}
    </Screen>
  );
};

const styles = StyleSheet.create({
  containStyle: {
    paddingLeft: 10,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  input: {
    borderRadius: 10,
    fontSize: 14,
    lineHeight: 20,
    padding: 8,
    paddingVertical: 10,
    backgroundColor: 'rgba(151, 151, 151, 0.25)',
    width: SCREEN_WIDTH - 20,
    marginHorizontal: 10,
  },
});

export default AddLocationScreen;
