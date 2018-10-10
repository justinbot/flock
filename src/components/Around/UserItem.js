import React from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, View } from 'react-native';
import { Card, Paragraph, Text, Title } from 'react-native-paper';

import CommonStyles from 'src/styles/CommonStyles';

export default class UserItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.userProfile);
  };

  render() {
    return (
      <Card onPress={this._onPress} style={CommonStyles.containerItem}>
        <Card.Content style={{ flexDirection: 'row' }}>
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
