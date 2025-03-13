/**
 * @Project Summarised
 * @File logbox.ts
 * @Path app/utils
 * @Author BRICE ZELE
 * @Date 11/03/2023
 */
import {LogBox} from 'react-native';

// Ignore errors coming from AnimatedComponent, either from React Native itself or possibly an animation lib
// https://github.com/facebook/react-native/issues/22186
LogBox.ignoreLogs([
  'Warning: Using UNSAFE_componentWillMount',
  'Warning: Using UNSAFE_componentWillReceiveProps',
  // https://github.com/software-mansion/react-native-gesture-handler/issues/1036
  'Warning: findNodeHandle',
  'findHostInstance_DEPRECATED',
  // Ignore since it's difficult to filter out just these styles and they are often shared styles
  'FlashList only supports padding related props and backgroundColor in contentContainerStyle.',
  // This is enabled conditionally in bash profile only for dev mode
  'The native module for Flipper seems unavailable.',
]);
LogBox.ignoreAllLogs();
