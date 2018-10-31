import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Card, Paragraph, Text, Title } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { Transition } from 'react-navigation-fluid-transitions';

import theme from 'src/constants/Theme';
import CommonStyles from 'src/styles/CommonStyles';

class FriendshipItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.userProfile);
  };

  render() {
    return (
      <Card
        onPress={this._onPress}
        style={[CommonStyles.containerItem, { marginTop: 8, marginBottom: 14 }, this.props.style]}>
        <Card.Content style={[this.props.style, { flexDirection: 'row' }]}>
          <Transition shared={'avatarImage' + this.props.userProfile.id}>
            <Image
              style={{
                width: 60,
                height: 60,
                borderRadius: 50,
              }}
              source={{ uri: this.props.userProfile.get('avatar_url') }}
            />
          </Transition>
          <View style={{ flex: 1, marginLeft: theme.marginHorizontal }}>
            <Transition shared={'displayName' + this.props.userProfile.id}>
              <Title numberOfLines={1} style={{ fontWeight: 'bold' }}>
                {this.props.userProfile.get('display_name')}
              </Title>
            </Transition>
          </View>
        </Card.Content>
      </Card>
    );
  }
}

export default Animatable.createAnimatableComponent(FriendshipItem);
