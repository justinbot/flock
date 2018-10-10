import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Card, Paragraph, Text, Title } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';

import CommonStyles from 'src/styles/CommonStyles';

class UserItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.userProfile);
  };

  render() {
    return (
      <Card onPress={this._onPress} style={[CommonStyles.containerItem, this.props.style]}>
        <Card.Content style={[{ flexDirection: 'row' }, this.props.style]}>
          <Image
            style={[{ width: 60, height: 60 }, CommonStyles.avatarImage]}
            source={{ uri: this.props.userProfile.get('avatar_url') }}
          />
          <View style={{ flex: 1, marginLeft: 20 }}>
            <Title numberOfLines={1}>{this.props.userProfile.get('display_name')}</Title>
            <Paragraph>Card content</Paragraph>
          </View>
        </Card.Content>
      </Card>
    );
  }
}

export default Animatable.createAnimatableComponent(UserItem);
