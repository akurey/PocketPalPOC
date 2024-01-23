/* eslint-disable react/react-in-jsx-scope */
import {View, Image} from 'react-native';
import styles from './styles';

export default function Avatar() {
  return (
    <View style={styles.avatarContainer}>
      <Image
        style={styles.image}
        source={require('../../../assets/images/avatar.jpeg')}
      />
    </View>
  );
}
