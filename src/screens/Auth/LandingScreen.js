import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Button, Subheading, Text, Title, TouchableRipple } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';

import theme from 'src/constants/Theme';
import CommonStyles from 'src/styles/CommonStyles';

export default class LandingScreen extends React.Component {
  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.primary }}>
        <View style={{ flex: 2 }} />
        <Animatable.View
          style={{ flex: 1 }}
          animation="zoomIn"
          easing="ease-out-back"
          duration={1600}>
          <Image
            source={require('src/assets/flock_logo.png')}
            style={{ flex: 1, width: undefined, height: undefined, tintColor: '#ffffff' }}
            resizeMode="contain"
          />
        </Animatable.View>
        <View style={{ flex: 2 }} />
        <View style={[CommonStyles.containerItem, { flex: 7 }]}>
          <Button
            style={styles.registerButton}
            mode="contained"
            onPress={() => navigate('Register')}>
            <Subheading style={{ color: '#ffffff' }}>Sign up with email</Subheading>
          </Button>
          <Button style={styles.loginButton} mode="contained" onPress={() => navigate('Login')}>
            <Subheading style={{ color: '#ffffff' }}>Log in</Subheading>
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  registerButton: {
    borderColor: '#ffffff',
    borderWidth: 2,
    marginVertical: theme.marginVertical,
  },
  loginButton: {
    elevation: 0,
    marginVertical: theme.marginVertical,
  },
});
