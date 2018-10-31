import React from 'react';
import { FlatList, View } from 'react-native';

import theme from 'src/constants/Theme';
import { materialStandardEasing } from 'src/constants/Transitions';
import PendingFriendshipItem from 'src/components/People/PendingFriendshipItem';

export default class PendingFriendshipList extends React.Component {
  _keyExtractor = (item, index) => item.userProfile.id;

  _renderItem = ({ item }) => (
    // TODO Fix enter animation
    // TODO Also animate remove
    <PendingFriendshipItem
      item={item}
      onPressItem={this.props.onPressItem}
      onAcceptItem={this.props.onAcceptItem}
      onDeleteItem={this.props.onDeleteItem}
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
