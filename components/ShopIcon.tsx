import React from 'react';
import {View, StyleSheet} from 'react-native';

interface IconProps {
  color?: string;
  size?: number;
}

export const ShopIcon = ({color = '#FFFFFF', size = 20}: IconProps) => (
  <View style={[styles.shop, {width: size, height: size}]}>
    <View style={[styles.shopRoof, {borderBottomColor: color, borderLeftColor: color, borderRightColor: color}]} />
    <View style={[styles.shopBase, {borderColor: color, width: size * 0.8, height: size * 0.5}]} />
    <View style={[styles.shopDoor, {borderColor: color, width: size * 0.25, height: size * 0.3}]} />
  </View>
);

const styles = StyleSheet.create({
  shop: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shopRoof: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderBottomWidth: 4,
    borderTopWidth: 0,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  shopBase: {
    borderWidth: 1.5,
    borderRadius: 1,
    marginTop: -1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 2,
  },
  shopDoor: {
    borderWidth: 1.5,
    borderRadius: 1,
  },
});


