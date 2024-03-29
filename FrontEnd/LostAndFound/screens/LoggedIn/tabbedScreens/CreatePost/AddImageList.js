import {Component, useCallback, useState} from 'react';
import React from 'react';
import {FlatList, Image, Pressable, Text, View} from 'react-native';
import NCard from '../../../../components/reusable/Neuromorphic/Cards/NCard';
import CameraLibraryCard from './CameraLibraryCard';

export default class AddImageList extends Component {
  constructor(props) {
    super(props);
    this.imageRefs = [
      {_ref: React.createRef(null)},
      {_ref: React.createRef(null)},
      {_ref: React.createRef(null)},
      {_ref: React.createRef(null)},
    ];
    this.color = this.props.color;
    this.winW = this.props.winW;
    this.winH = this.props.winH;
    this.createStylesheet();
    this.getNSettings();
  }

  setImageUris(uris) {
    for (let i = 0; i < 4; i++) {
      console.log('setting uris');
      if (uris[i] !== null) {
        this.imageRefs[i]._ref.current.setPhotoUri(uris[i]);
      } else {
        this.imageRefs[i]._ref.current.setPhotoUri(null);
      }
    }
  }

  getImageUris() {
    console.log(this.imageRefs[0]);
    return [
      this.imageRefs[0]._ref.current.getPhotoUri(),
      this.imageRefs[1]._ref.current.getPhotoUri(),
      this.imageRefs[2]._ref.current.getPhotoUri(),
      this.imageRefs[3]._ref.current.getPhotoUri(),
    ];
  }
  getPhotoTypes() {
    return [
      this.imageRefs[0]._ref.current.getPhotoType(),
      this.imageRefs[1]._ref.current.getPhotoType(),
      this.imageRefs[2]._ref.current.getPhotoType(),
      this.imageRefs[3]._ref.current.getPhotoType(),
    ];
  }

  getPhotoNames() {
    return [
      this.imageRefs[0]._ref.current.getPhotoName(),
      this.imageRefs[1]._ref.current.getPhotoName(),
      this.imageRefs[2]._ref.current.getPhotoName(),
      this.imageRefs[3]._ref.current.getPhotoName(),
    ];
  }

  createStylesheet() {
    this.styles = {
      mainContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
      },
    };
  }

  getNSettings() {
    this.nSettings = {
      container: {
        color: this.color,
        width: this.winH * 0.8 * 0.8 * 0.33,
        height: this.winH * 0.8 * 0.8 * 0.33,
        innerPadding: 10,
        flexDirection: 'column',
        shadowRadius: 4,
        blur: false,
      },
    };
  }

  render() {
    console.log('nSettings:', this.nSettings);
    return (
      <View>
        <FlatList
          contentContainerStyle={this.styles.mainContainer}
          horizontal={true}
          data={this.imageRefs}
          renderItem={({item}) => {
            return (
              <CameraLibraryCard
                ref={item._ref}
                settings={this.nSettings.container}
                _style={{winW: this.winW, winH: this.winH}}
              />
            );
          }}
          ItemSeparatorComponent={() => <View style={{width: 20}} />}
        />
      </View>
    );
  }
}
