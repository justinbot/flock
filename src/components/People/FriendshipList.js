import React from 'react';
import { FlatList, View } from 'react-native';

import theme from 'src/constants/Theme';
import { materialStandardEasing } from 'src/constants/Transitions';
import FriendshipItem from 'src/components/People/FriendshipItem';

export default class FriendshipList extends React.Component {
  _keyExtractor = (item, index) => item.userProfile.id;

  _renderItem = ({ item }) => (
    // TODO Fix enter animation
    // TODO Also animate remove
    <FriendshipItem
      item={item}
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
