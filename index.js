/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './app/App';
import {name as appName} from './app.json';

import 'react-native-gesture-handler';
import 'react-native-reanimated';
import './app/lang/i18n';
import './app/utils/logbox';

AppRegistry.registerComponent(appName, () => App);
