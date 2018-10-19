import React from 'react';
import { FlatList, View } from 'react-native';
import { Icon } from 'expo';
import { Subheading } from 'react-native-paper';
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

  _listHeaderComponent = () => {
    let label;
    let indicator;
    if (this.props.loadingItem) {
      label = 'Found someone!';
      indicator = (
        <Animatable.View
          animation="rotate"
          duration={1000}
          easing="ease-out-back"
          iterationCount="infinite"
          useNativeDriver>
          <Icon.Feather name="compass" size={48} color={theme.colors.disabled} />
        </Animatable.View>
      );
    } else {
      label = 'Looking around...';
      indicator = (
        <Animatable.View
          animation="tada"
          duration={1800}
          easing="linear"
          iterationCount="infinite"
          iterationDelay={800}
          useNativeDriver>
          <Icon.Feather name="radio" size={48} color={theme.colors.disabled} />
        </Animatable.View>
      );
    }

    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: theme.marginVertical * 2,
          marginBottom: theme.marginVertical,
        }}>
        {indicator}
        <Subheading style={{ color: theme.colors.disabled, marginLeft: 10 }}>{label}</Subheading>
      </View>
    );
  };

  render() {
    return (
      <FlatList
        data={this.props.data}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        ListHeaderComponent={this._listHeaderComponent()}
        ListFooterComponent={() => <View style={{ marginVertical: theme.marginVertical }} />}
      />
    );
  }
}
