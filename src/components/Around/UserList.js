import React from 'react';
import { FlatList, View } from 'react-native';
import { Icon } from 'expo';
import * as Animatable from 'react-native-animatable';

import theme from 'src/constants/Theme';
import { materialStandardEasing } from 'src/constants/Transitions';
import UserItem from 'src/components/Around/UserItem';
import CommonStyles from 'src/styles/CommonStyles';

export default class UserList extends React.Component {
  _keyExtractor = (item, index) => item.id;

  _renderItem = ({ item }) => (
    // TODO Fix enter animation
    // TODO Also animate remove
    <UserItem
      userProfile={item}
      onPressItem={this.props.onPressItem}
      animation="cardEnter"
      duration={300}
      easing={materialStandardEasing}
      useNativeDriver
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
            iterationCount="infinite"
            useNativeDriver>
            <Icon.Feather name="compass" size={60} color={theme.colors.disabled} />
          </Animatable.View>
        </View>
      );
    } else {
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Animatable.View
            animation="tada"
            duration={1800}
            easing="linear"
            iterationCount="infinite"
            iterationDelay={800}
            useNativeDriver>
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
        ListFooterComponent={this._listFooterComponent}
      />
    );
  }
}
