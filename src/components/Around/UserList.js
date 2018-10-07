import React from 'react';
import { FlatList, View } from 'react-native';

import UserItem from 'src/components/Around/UserItem';
import CommonStyles from 'src/styles/CommonStyles';

export default class UserList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [
        { id: 'UWS9F656WWZCuZhSHbgs', title: 'Devin' },
        { id: '2', title: 'Jackson' },
        { id: '3', title: 'James' },
        { id: '4', title: 'Joel' },
        { id: '5', title: 'John' },
        { id: '6', title: 'Jillian' },
        { id: '7', title: 'Jimmy' },
        { id: '8', title: 'Julie' },
      ],
    };
  }

  _keyExtractor = (item, index) => item.id;

  _onPressItem = id => {
    console.log('press from list item! ' + id);
  };

  _renderItem = ({ item }) => (
    <UserItem
      id={item.id}
      title={item.title}
      onPressItem={this.props.onPressItem}
    />
  );

  render() {
    return (
      <FlatList
        style={{ flex: 1 }}
        data={this.state.items}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />
    );
  }
}
