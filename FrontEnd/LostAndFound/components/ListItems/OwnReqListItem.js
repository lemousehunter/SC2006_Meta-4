import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import NButton from '../reusable/Neuromorphic/Buttons/NButton';
import BaseListItem from './BaseListItem';

/**
 * Represents a list item for an own request. The list item includes two buttons to approve or reject a request.
 */
export default class OwnReqListItem extends Component {
   /**
   * Constructor for OwnReqListItem component.
   * @param {Object} props - The props object.
   */
  constructor(props) {
    super(props);
    this.createStylesheet();
    this.createSettings();
  }
  /**
   * Creates the stylesheet for the component.
   */
  createStylesheet() {
    this.styles = StyleSheet.create({
      btns: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
    });
  }
  /**
   * Creates the settings object for the component.
   */
  createSettings() {
    this.nSettings = {
      approveBtn: {
        color: this.props.params.primaryColor,
        width: this.props.params.winW * 0.8 * 0.3,
        height: this.props.params.winH * 0.8 * 0.03,
        shadowRadius: 2,
      },
      rejectBtn: {
        color: this.props.params.callColor,
        width: this.props.params.winW * 0.8 * 0.3,
        height: this.props.params.winH * 0.8 * 0.03,
        shadowRadius: 2,
      },
    };
  }
  /**
   * Processes the request.
   */
  processReq() {
    // this.props.params.dataC.
  }
  /**
   * Renders the component.
   * @returns - The rendered component.
   */
  render() {
    return (
      <BaseListItem
        _data={this.props._data}
        params={this.props.params}
        labels={this.props.labels}>
        <View style={this.styles.btns}>
          <NButton
            onPress={async () => {
              await this.props.params.requestsC
                .processRequest(this.props._data.requestID, 1)
                .then(res => {
                  console.log('approveRequestRes:', JSON.stringify(res));
                  return res;
                });
              this.props.params.onFocus();
            }}
            settings={this.nSettings.approveBtn}
            label={'Approve'}
            fontFamily={this.props.params.buttonFont}
            textColor={this.props.params.bgColor}
          />
          <NButton
            onPress={async () => {
              await this.props.params.requestsC
                .processRequest(this.props._data.requestID, -1)
                .then(res => {
                  console.log('rejectRequests:', JSON.stringify(res));
                  return res;
                });
              this.props.params.onFocus();
            }}
            settings={this.nSettings.rejectBtn}
            label={'Reject'}
            fontFamily={this.props.params.buttonFont}
            textColor={this.props.params.bgColor}
          />
        </View>
      </BaseListItem>
    );
  }
}
