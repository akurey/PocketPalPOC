/* eslint-disable react/react-in-jsx-scope */
import {View, StyleProp, ViewStyle} from 'react-native';
import styles from './styles';

export interface CardProps {
  customStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export default function Card({customStyle, children}: CardProps) {
  return <View style={[styles.card, customStyle]}>{children}</View>;
}
