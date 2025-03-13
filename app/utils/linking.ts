/**
 * @Project Summarised
 * @File linking.ts
 * @Path app/utils
 * @Author BRICE ZELE
 * @Date 26/03/2023
 */
import {theme} from '../themes/Theme';
import {Logger} from './logger';
import {Alert, Linking} from 'react-native';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';

const ALLOWED_EXTERNAL_URI_SCHEMES = ['http://', 'https://'];

export const openUri = async (
  uri: string,
  openExternalBrowser = false,
  isSafeUri = false,
): Promise<void> => {
  const trimmedURI = uri.trim();
  if (
    !isSafeUri &&
    !ALLOWED_EXTERNAL_URI_SCHEMES.some(scheme => trimmedURI.startsWith(scheme))
  ) {
    Logger.error(
      'linking',
      'openUri',
      `potentially unsafe URI scheme provided ${uri}`,
    );
    return;
  }

  const supported = await Linking.canOpenURL(uri);
  if (!supported) {
    Logger.warn('linking', 'openUri', `Cannot open URI: ${uri}`);
    return;
  }

  try {
    if (openExternalBrowser) {
      await Linking.openURL(uri);
    } else {
      try {
        if (await InAppBrowser.isAvailable) {
          const result = await InAppBrowser.open(uri, {
            // iOS Properties
            dismissButtonStyle: 'cancel',
            preferredBarTintColor: theme.colors.userThemeColor,
            preferredControlTintColor: 'white',
            readerMode: false,
            animated: true,
            modalPresentationStyle: 'fullScreen',
            modalTransitionStyle: 'coverVertical',
            modalEnabled: true,
            enableBarCollapsing: false,
            // Android Properties
            showTitle: true,
            toolbarColor: theme.colors.userThemeColor,
            secondaryToolbarColor: 'black',
            navigationBarColor: 'black',
            navigationBarDividerColor: 'white',
            enableUrlBarHiding: true,
            enableDefaultShare: true,
            forceCloseOnRedirection: false,
            // Specify full animation resource identifier(package:anim/name)
            // or only resource name(in case of animation bundled with app).
            animations: {
              startEnter: 'slide_in_right',
              startExit: 'slide_out_left',
              endEnter: 'slide_in_left',
              endExit: 'slide_out_right',
            },
          });
        } else {
          await Linking.openURL(uri);
        }
      } catch (error) {
        Logger.error('linking', 'openUri', '' + error);
        Alert.alert('' + error);
      }
    }
  } catch (error) {
    Logger.error('linking', 'openUri', `${error}`);
  }
};
