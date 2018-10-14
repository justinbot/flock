import React from 'react';
import { FlatList, View } from 'react-native';
import { Icon } from 'expo';
import { Card, Headline, Title } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';

import theme from 'src/constants/Theme';
import UserItem from 'src/components/Around/UserItem';
import CommonStyles from 'src/styles/CommonStyles';

export default class UserList extends React.Component {
  _keyExtractor = (item, index) => item.id;

  _renderItem = ({ item }) => (
    // TODO Also animate remove
    <UserItem
      animation="fadeIn"
      duration={150}
      easing="ease-out"
      userProfile={item}
      onPressItem={this.props.onPressItem}
    />
  );

  _listFooterComponent = () => {
    if (this.props.loadingItem) {
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Animatable.View
            animation="rotate"
            duration={1000}
            easing="ease-out-back"
            iterationCount="infinite">
            <Icon.Feather name="compass" size={60} color={theme.colors.disabled} />
          </Animatable.View>
        </View>
      );
    } else {
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Animatable.View
            animation="tada"
            duration={1600}
            easing="linear"
            iterationCount="infinite"
            iterationDelay={400}>
            <Icon.Feather name="radio" size={60} color={theme.colors.disabled} />
          </Animatable.View>
        </View>
      );
    }
  };

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
        ListFooterComponent={this._listFooterComponent}
      />
    );
  }
}
