import {StyleSheet} from 'react-native';
import React from 'react';
import {EdgeInsets} from 'react-native-safe-area-context';
import {
  BottomTabDescriptorMap,
  BottomTabNavigationEventMap,
} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import {
  CommonActions,
  NavigationHelpers,
  ParamListBase,
  TabNavigationState,
} from '@react-navigation/core';
import {AnimatedFlex} from 'app/components/layout/Flex';
import {isIos} from 'app/utils/PlatformUtils';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {BottomNavigation} from 'react-native-paper';
import {FontFamily} from 'app/themes/Font';

type Props = {
  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>;
  state: TabNavigationState<ParamListBase>;
  descriptors: BottomTabDescriptorMap;
  insets: EdgeInsets;
};

const TabBarComponent = ({
  navigation,
  state,
  descriptors,
  insets,
}: Props): JSX.Element => {
  const theme = useAppTheme();

  return (
    <>
      <AnimatedFlex zIndex="tooltip">
        <BottomNavigation.Bar
          labeled
          activeColor={theme.colors.textPrimary}
          getBadge={({route}) => descriptors[route.key]?.options.tabBarBadge}
          getLabelText={({route}): string => {
            // @ts-ignore
            const {options} = descriptors[route.key];
            return options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : // @ts-ignore
                route.title;
          }}
          inactiveColor={theme.colors.textSecondary}
          activeIndicatorStyle={{
            backgroundColor: theme.colors.accentActionSoft,
          }}
          navigationState={state}
          renderIcon={({route, focused, color}): React.ReactNode => {
            // @ts-ignore
            const {options} = descriptors[route.key];
            if (options.tabBarIcon) {
              return options.tabBarIcon({focused, color, size: 24});
            }

            return null;
          }}
          safeAreaInsets={{...insets, bottom: isIos ? insets.bottom - 20 : 0}}
          style={{
            backgroundColor: isIos ? theme.colors.background2 : '#042330',
            borderTopColor: theme.colors.background3,
            borderTopWidth: 1,
          }}
          theme={{
            fonts: {
              labelMedium: {
                fontSize: 12,
                fontFamily: FontFamily.sansSerif.regular,
                fontWeight: 'bold',
              },
            },
            mode: 'adaptive',
          }}
          onTabPress={({route, preventDefault}): void => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
              navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
        />
      </AnimatedFlex>
    </>
  );
};

export default TabBarComponent;

const styles = StyleSheet.create({
  blurBackgroundColor: {
    ...(isIos && {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    }),
    zIndex: 1070,
  },
});
