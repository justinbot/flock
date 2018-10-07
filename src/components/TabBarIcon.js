import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'expo';

export default class TabBarIcon extends React.Component {
  render() {
    return <Icon.Feather name={this.props.name} size={24} color={this.props.tintColor} />;
  }
}

TabBarIcon.propTypes = {
  color: PropTypes.string,
  name: PropTypes.string,
};
