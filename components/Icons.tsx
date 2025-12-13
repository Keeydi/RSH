import React from 'react';
import {View, StyleSheet} from 'react-native';

interface IconProps {
  color?: string;
  size?: number;
}

export const HomeIcon = ({color = '#FFFFFF', size = 20}: IconProps) => (
  <View style={[styles.container, {width: size, height: size}]}>
    <View style={[styles.homeRoof, {borderBottomColor: color, borderLeftColor: color, borderRightColor: color}]} />
    <View style={[styles.homeBase, {backgroundColor: color, width: size * 0.6, height: size * 0.4}]} />
  </View>
);

export const CardIcon = ({color = '#FFFFFF', size = 20}: IconProps) => (
  <View style={[styles.card, {borderColor: color, width: size * 1.2, height: size * 0.8}]}>
    <View style={[styles.cardLine, {backgroundColor: color, width: size * 0.6}]} />
  </View>
);

export const BoxIcon = ({color = '#FFFFFF', size = 20}: IconProps) => (
  <View style={[styles.box, {borderColor: color, width: size, height: size}]}>
    <View style={[styles.boxLine, {backgroundColor: color}]} />
  </View>
);

export const BellIcon = ({color = '#FFFFFF', size = 20}: IconProps) => (
  <View style={[styles.bell, {borderColor: color, width: size * 0.9, height: size}]}>
    <View style={[styles.bellClapper, {backgroundColor: color, width: size * 0.15, height: size * 0.15}]} />
  </View>
);

export const UserIcon = ({color = '#FFFFFF', size = 20}: IconProps) => (
  <View style={[styles.user, {width: size, height: size}]}>
    <View style={[styles.userHead, {backgroundColor: color, width: size * 0.4, height: size * 0.4}]} />
    <View style={[styles.userBody, {backgroundColor: color, width: size * 0.6, height: size * 0.5}]} />
  </View>
);

export const NotificationIcon = ({color = '#FFFFFF', size = 16}: IconProps) => (
  <View style={[styles.notificationBell, {borderColor: color, width: size * 0.9, height: size}]}>
    <View style={[styles.notificationClapper, {backgroundColor: color, width: size * 0.15, height: size * 0.15}]} />
  </View>
);

export const PaymentIcon = ({color = '#FFFFFF', size = 20}: IconProps) => (
  <View style={[styles.paymentCard, {borderColor: color, width: size * 1.1, height: size * 0.75}]}>
    <View style={[styles.paymentLine, {backgroundColor: color, width: size * 0.55}]} />
  </View>
);

export const OrderIcon = ({color = '#FFFFFF', size = 20}: IconProps) => (
  <View style={[styles.orderBox, {borderColor: color, width: size * 0.9, height: size * 0.9}]}>
    <View style={[styles.orderLine, {backgroundColor: color}]} />
  </View>
);

export const DeliveryIcon = ({color = '#FFFFFF', size = 20}: IconProps) => (
  <View style={[styles.delivery, {width: size, height: size}]}>
    <View style={[styles.deliveryBody, {backgroundColor: color, width: size * 0.7, height: size * 0.5}]} />
    <View style={[styles.deliveryWheel1, {backgroundColor: color, width: size * 0.2, height: size * 0.2}]} />
    <View style={[styles.deliveryWheel2, {backgroundColor: color, width: size * 0.2, height: size * 0.2}]} />
  </View>
);

export const MapIcon = ({color = '#FFFFFF', size = 20}: IconProps) => (
  <View style={[styles.map, {width: size, height: size}]}>
    <View style={[styles.mapBase, {borderColor: color, width: size * 0.8, height: size * 0.8}]}>
      <View style={[styles.mapPin, {backgroundColor: color, width: size * 0.2, height: size * 0.2}]} />
    </View>
  </View>
);

export const PhoneIcon = ({color = '#FFFFFF', size = 20}: IconProps) => (
  <View style={[styles.phone, {width: size * 0.7, height: size}]}>
    <View style={[styles.phoneBody, {borderColor: color, width: size * 0.7, height: size}]}>
      <View style={[styles.phoneScreen, {backgroundColor: color, width: size * 0.5, height: size * 0.6}]} />
    </View>
  </View>
);

export const FocusIcon = ({color = '#FFFFFF', size = 20}: IconProps) => (
  <View style={[styles.focus, {width: size, height: size}]}>
    <View style={[styles.focusCircle, {borderColor: color, width: size, height: size, borderRadius: size / 2}]}>
      <View style={[styles.focusCenter, {backgroundColor: color, width: size * 0.3, height: size * 0.3}]} />
    </View>
  </View>
);

export const LearnIcon = ({color = '#FFFFFF', size = 20}: IconProps) => (
  <View style={[styles.learn, {width: size, height: size}]}>
    <View style={[styles.learnBook, {borderColor: color, width: size * 0.9, height: size * 0.7}]}>
      <View style={[styles.learnLine1, {backgroundColor: color, width: size * 0.6}]} />
      <View style={[styles.learnLine2, {backgroundColor: color, width: size * 0.5}]} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeRoof: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 5,
    borderTopWidth: 0,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  homeBase: {
    marginTop: -1,
  },
  card: {
    borderWidth: 1.5,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 3,
  },
  cardLine: {
    height: 2,
    marginTop: 2,
  },
  box: {
    borderWidth: 1.5,
    borderRadius: 2,
    position: 'relative',
  },
  boxLine: {
    position: 'absolute',
    top: 3,
    left: 3,
    right: 3,
    height: 1,
  },
  bell: {
    borderWidth: 1.5,
    borderRadius: 8,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 2,
  },
  bellClapper: {
    borderRadius: 10,
  },
  notificationBell: {
    borderWidth: 1.5,
    borderRadius: 7,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 1.5,
  },
  notificationClapper: {
    borderRadius: 8,
  },
  user: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  userHead: {
    borderRadius: 10,
    marginBottom: 2,
  },
  userBody: {
    borderRadius: 2,
  },
  paymentCard: {
    borderWidth: 1.5,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 2,
  },
  paymentLine: {
    height: 1.5,
    marginTop: 2,
  },
  orderBox: {
    borderWidth: 1.5,
    borderRadius: 2,
    position: 'relative',
  },
  orderLine: {
    position: 'absolute',
    top: 2.5,
    left: 2.5,
    right: 2.5,
    height: 1,
  },
  delivery: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  deliveryBody: {
    borderRadius: 1,
    marginBottom: 1,
  },
  deliveryWheel1: {
    borderRadius: 10,
    position: 'absolute',
    bottom: 0,
    left: 1,
  },
  deliveryWheel2: {
    borderRadius: 10,
    position: 'absolute',
    bottom: 0,
    right: 1,
  },
  map: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapBase: {
    borderWidth: 1.5,
    borderRadius: 2,
    position: 'relative',
  },
  mapPin: {
    borderRadius: 10,
    position: 'absolute',
    bottom: 2,
    left: '50%',
    marginLeft: -4,
  },
  phone: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneBody: {
    borderWidth: 1.5,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 2,
  },
  phoneScreen: {
    borderRadius: 1,
    marginTop: 2,
  },
  focus: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusCircle: {
    borderWidth: 2,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusCenter: {
    borderRadius: 10,
  },
  learn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  learnBook: {
    borderWidth: 1.5,
    borderRadius: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 2,
    paddingTop: 2,
  },
  learnLine1: {
    height: 1.5,
    marginBottom: 2,
  },
  learnLine2: {
    height: 1.5,
  },
});

