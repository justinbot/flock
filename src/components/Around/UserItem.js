import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Card, Paragraph, Text, Title } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { Transition } from 'react-navigation-fluid-transitions';

import CommonStyles from 'src/styles/CommonStyles';

class UserItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.userProfile);
  };

  render() {
    return (
      <Card onPress={this._onPress} style={[CommonStyles.containerItem, this.props.style]}>
        <Card.Content style={[this.props.style, { flexDirection: 'row' }]}>
          <Transition shared={'avatarImage' + this.props.userProfile.id}>
            <Image
              style={{ width: 60, height: 60, borderRadius: 30 }}
              source={{ uri: this.props.userProfile.get('avatar_url') }}
            />
          </Transition>
          <View style={{ flex: 1, marginLeft: 20 }}>
            <Transition shared={'displayName' + this.props.userProfile.id}>
              <Title numberOfLines={1}>{this.props.userProfile.get('display_name')}</Title>
            </Transition>
            <Transition shared={'details' + this.props.userProfile.id}>
              <Paragraph>{this.props.userProfile.get('details')}</Paragraph>
            </Transition>
          </View>
        </Card.Content>
      </Card>
    );
  }
}

export default Animatable.createAnimatableComponent(UserItem);
