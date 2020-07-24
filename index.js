'use strict';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import {
  createNavigatorFactory,
  NavigationHelpersContext,
  TabRouter,
  TabActions,
  useNavigationBuilder
} from '@react-navigation/native';

const renderIcon = ({
  color,
  size,
  options,
  route
}) => {
  if (options.tabBarIcon) {
    return typeof options.tabBarIcon === 'function'
      ? options.tabBarIcon({ size, color })
      : options.tabBarIcon;
  }
  return null;
};

const renderLabel = ({
  color,
  labelText
}) => (
    <Text style={[styles.label, { color }]}>
      {labelText}
    </Text>
  );

export const AnotherRNBottomTabNavigator = (props) => {
  const {
    initialRouteName,
    children,
    screenOptions,
    tabBarOptions,
    tabBarStyle,
    contentStyle
  } = props;
  const { state, navigation, descriptors } = useNavigationBuilder(TabRouter, {
    children,
    screenOptions,
    initialRouteName,
  });

  return (
    <NavigationHelpersContext.Provider value={navigation}>
      <View style={[styles.contentContainer, contentStyle]}>
        {descriptors[state.routes[state.index].key].render()}
      </View>
      <View style={[tabBarStyle, styles.bar]}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const options = descriptors[route.key].options;
          const color = tabBarOptions[
            focused ? 'activeTintColor' : 'inactiveTintColor'
          ] || '#CCCCCC';

          const labelText = descriptors[route.key].options.title || route.name;

          const backgroundColor = tabBarOptions[
            focused ? 'activeBackgroundColor' : 'inactiveBackgroundColor'
          ] || '#FFFFFF';

          return (
            <TouchableOpacity
              activeOpacity={0.95}
              key={route.key}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!event.defaultPrevented) {
                  navigation.dispatch({
                    ...TabActions.jumpTo(route.name),
                    target: state.key,
                  });
                }
              }}
              style={[styles.item, { backgroundColor }]}
            >
              <View style={styles.iconContainer}>
                <View style={styles.iconWrapper}>
                  {renderIcon({
                    color,
                    focused,
                    size: tabBarOptions.iconSize,
                    options,
                    route
                  })}
                </View>
              </View>
              <View style={styles.labelContainer}>
                <View style={styles.labelWrapper}>
                  {renderLabel({ color, labelText })}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </NavigationHelpersContext.Provider>
  );
};

const styles = StyleSheet.create({
  contentContainer: { flex: 1 },
  bar: {
    elevation: 4,
    flexDirection: 'row',
    left: 0,
    right: 0,
    bottom: 0
  },
  item: {
    flex: 1,
    flexDirection: 'column',
    paddingVertical: 5
  },
  iconContainer: {
    height: 24,
    width: 24,
    marginTop: 2,
    marginHorizontal: 12,
    alignSelf: 'center'
  },
  iconWrapper: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center'
  },
  labelContainer: {
    height: 16,
    paddingBottom: 2,
  },
  labelWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  label: {
    fontSize: 12,
    textAlign: 'center',
    backgroundColor: 'transparent',
    ...(Platform.OS === 'web' ? { whiteSpace: 'nowrap', } : null),
  }

});

export const createAnotherRNBottomTabNavigator =
  createNavigatorFactory(AnotherRNBottomTabNavigator);
