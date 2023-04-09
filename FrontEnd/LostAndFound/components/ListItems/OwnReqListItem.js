import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import NButton from '../reusable/Neuromorphic/Buttons/NButton';
import BaseListItem from './BaseListItem';

export default class OwnReqListItem extends Component {
  constructor(props) {
    super(props);
    this.createStylesheet();
    this.createSettings();
  }

  createStylesheet() {
    this.styles = StyleSheet.create({
      btns: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
    });
  }

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

  processReq() {
    // this.props.params.dataC.
  }

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
