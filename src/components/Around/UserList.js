import React from 'react';
import { FlatList, View } from 'react-native';
import { Icon } from 'expo';
import { Headline, Title } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';

import theme from 'src/constants/Theme';
import UserItem from 'src/components/Around/UserItem';
import CommonStyles from 'src/styles/CommonStyles';

export default class UserList extends React.Component {
  _keyExtractor = (item, index) => item.userId;

  _renderItem = ({ item }) => <UserItem userData={item} onPressItem={this.props.onPressItem} />;

  render() {
    return (
      <FlatList
        data={this.props.data}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        ListEmptyComponent={() => (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Title style={{ color: theme.colors.disabled }}>Looking around...</Title>
          </View>
        )}
        ListFooterComponent={() => (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Animatable.View
              animation="tada"
              duration={1600}
              easing="linear"
              iterationCount="infinite">
              <Icon.Feather name="radio" size={60} color={theme.colors.disabled} />
            </Animatable.View>
          </View>
        )}
      />
    );
  }
}
