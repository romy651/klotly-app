/**
 * @Project Summarised
 * @File useAddBackButton.ts
 * @Path app/hooks/theme
 * @Author BRICE ZELE
 * @Date 05/05/2023
 */
import {useEffect} from 'react';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import BackButton from '../../components/BackButton/BackButton';

const useAddBackButton = (navigation: NativeStackNavigationProp<any>): void => {
  useEffect((): void => {
    const shouldRenderBackButton = navigation.getState().index === 0;
    if (shouldRenderBackButton) {
      navigation.setOptions({
        headerLeft: () => <BackButton />,
      });
    }
  }, [navigation]);
};

export default useAddBackButton;
