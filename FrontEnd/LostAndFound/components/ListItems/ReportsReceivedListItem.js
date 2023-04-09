import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import NButton from '../reusable/Neuromorphic/Buttons/NButton';
import BaseListItem from './BaseListItem';

export default class ReportsReceivedListItem extends Component {
  constructor(props) {
    super(props);
    this.createStylesheet();
  }

  createStylesheet() {
    this.styles = StyleSheet.create({
      textC: {
        flex: 1,
      },
    });
  }

  processReq() {
    // this.props.params.dataC.
  }

  render() {
    return (
      <BaseListItem
        _data={this.props._data}
        params={this.props.params}
        labels={this.props.labels}>
        <View style={this.styles.textC}>
          <Text>Reason: {this.props._data.reason}</Text>
        </View>
      </BaseListItem>
    );
  }
}
