import React from 'react';
import { FlatList, View } from 'react-native';
import { Icon } from 'expo';
import { Subheading } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';

import theme from 'src/constants/Theme';
import { materialStandardEasing } from 'src/constants/Transitions';
import CommonStyles from 'src/styles/CommonStyles';
import PendingFriendshipItem from 'src/components/People/PendingFriendshipItem';

export default class UserList extends React.Component {
  _keyExtractor = (item, index) => item.userProfile.id;

  _renderItem = ({ item }) => (
    // TODO Fix enter animation
    // TODO Also animate remove
    <PendingFriendshipItem
      userProfile={item.userProfile}
      friendship={item.friendship}
      onPressItem={this.props.onPressItem}
      animation="cardEnter"
      duration={300}
      easing={materialStandardEasing}
      useNativeDriver
    />
  );

  render() {
    return (
      <FlatList
        data={this.props.data}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        ListFooterComponent={() => <View style={{ marginVertical: theme.marginVertical }} />}
      />
    );
  }
}
