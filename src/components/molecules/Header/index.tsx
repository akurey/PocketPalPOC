/* eslint-disable react/react-in-jsx-scope */
import {View} from 'react-native';
import styles from './styles';
import {Avatar, Logo} from '../../atoms';

export default function Header() {
  return (
    <View style={styles.headerContainer}>
      <Logo />
      <Avatar />
    </View>
  );
}
