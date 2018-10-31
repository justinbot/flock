import React from 'react';
import { FlatList, View } from 'react-native';
import { Icon } from 'expo';
import { Subheading } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';

import theme from 'src/constants/Theme';
import { materialStandardEasing } from 'src/constants/Transitions';
import FriendshipItem from 'src/components/People/FriendshipItem';
import CommonStyles from 'src/styles/CommonStyles';

export default class UserList extends React.Component {
  _keyExtractor = (item, index) => item.id;

  _renderFriendshipItem = ({ item }) => (
    // TODO Fix enter animation
    // TODO Also animate remove
    <FriendshipItem
      userProfile={item}
      onPressItem={this.props.onPressItem}
      animation="cardEnter"
      duration={300}
      easing={materialStandardEasing}
      useNativeDriver
    />
  );

  render() {
    return (
      <View>
        {/*<FlatList*/}
        {/*data={this.props.data}*/}
        {/*keyExtractor={this._keyExtractor}*/}
        {/*renderItem={this._renderItem}*/}
        {/*ListHeaderComponent={this._listHeaderComponent()}*/}
        {/*ListFooterComponent={() => <View style={{ marginVertical: theme.marginVertical }} />}*/}
        {/*/>*/}
        <FlatList
          data={this.state.friendships}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
        />
      </View>
    );
  }
}
