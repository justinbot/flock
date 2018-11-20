import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Button, Card, Text, Title } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { Transition } from 'react-navigation-fluid-transitions';

import theme from 'src/constants/Theme';
import CommonStyles from 'src/styles/CommonStyles';

class PendingFriendshipItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.item.userProfile);
  };

  _onAccept = () => {
    this.props.onAcceptItem(this.props.item.friendship);
  };

  _onDelete = () => {
    this.props.onDeleteItem(this.props.item.friendship);
  };

  render() {
    let userProfile = this.props.item.userProfile;

    let avatarImageSource = require('src/assets/images/placeholder.png');
    if (userProfile.get('avatar_url')) {
      avatarImageSource = { uri: userProfile.get('avatar_url') };
    }

    return (
      // TODO Show mutual friends
      <Card
        onPress={this._onPress}
        style={[CommonStyles.containerItem, { marginTop: 8, marginBottom: 14 }, this.props.style]}>
        <Card.Content style={[this.props.style, { flexDirection: 'row' }]}>
          {/*<Transition shared={'avatarImage' + userProfile.id}>*/}
            <Image
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
              }}
              source={avatarImageSource}
            />
          {/*</Transition>*/}
          <View style={{ flex: 1, marginLeft: theme.marginHorizontal }}>
            {/*<Transition shared={'displayName' + userProfile.id}>*/}
              <Title numberOfLines={1} style={{ fontWeight: 'bold' }}>
                {userProfile.get('display_name')}
              </Title>
            {/*</Transition>*/}
          </View>
        </Card.Content>
        <Card.Actions style={{ justifyContent: 'flex-end' }}>
          <Button onPress={this._onDelete}>
            <Text style={{ color: theme.colors.accent }}>Delete</Text>
          </Button>
          <Button onPress={this._onAccept}>
            <Text style={{ color: theme.colors.accent }}>Confirm</Text>
          </Button>
        </Card.Actions>
      </Card>
    );
  }
}

export default Animatable.createAnimatableComponent(PendingFriendshipItem);
