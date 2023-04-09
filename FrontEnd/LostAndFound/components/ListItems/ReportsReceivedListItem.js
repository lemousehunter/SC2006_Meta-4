import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import NButton from '../reusable/Neuromorphic/Buttons/NButton';
import BaseListItem from './BaseListItem';

/**
 * Represents a single item in a list of received reports.
 */
export default class ReportsReceivedListItem extends Component {
  /**
   * Constructs a new ReportsReceivedListItem component with the given props.
   *
   * @param {object} props - The props that were passed to the component.
   */
  constructor(props) {
    super(props);
    this.createStylesheet();
  }
  /**
   * Creates the styles for this component.
   */
  createStylesheet() {
    this.styles = StyleSheet.create({
      textC: {
        flex: 1,
      },
    });
  }
  /**
   * Processes the request data for this report.
   */
  processReq() {
    // this.props.params.dataC.
  }
  /**
   * Renders the component.
   *
   * @returns - The rendered component from BaseListItem
   */
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
