import React from 'react';
import { FlatList, View } from 'react-native';

import UserItem from 'src/components/Around/UserItem';
import CommonStyles from 'src/styles/CommonStyles';

export default class UserList extends React.Component {
  _keyExtractor = (item, index) => item.userId;

  _renderItem = ({ item }) => (
    <UserItem
      userData={item}
      onPressItem={this.props.onPressItem}
    />
  );

  render() {
    return (
      <FlatList
        style={{ flex: 1 }}
        data={this.props.data}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />
    );
  }
}
