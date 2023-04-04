import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import * as ImagePicker from 'react-native-image-crop-picker';
import React from 'react';
import NCard from '../../../../components/reusable/Neuromorphic/Cards/NCard';
import {Image, Pressable, TouchableOpacity} from 'react-native';

export default class CameraLibraryCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pickerResponse: null,
      imgUri: null,
      type: null,
      name: null,
    };
    this.settings = this.props.settings;
    this.winW = this.props._style.winW;
    this.winH = this.props._style.winH;
    this.getStylesheet();
    this.onCameraPress = this.onCameraPress.bind(this);
    this.onImageLibraryPress = this.onImageLibraryPress.bind(this);
    // this.getPhotoUri = this.getPhotoUri.bind(this);
  }

  getPhotoUri() {
    return this.state.imgUri;
  }
  getPhotoName() {
    return this.state.name;
  }
  getPhotoType() {
    return this.state.type;
  }
  setPhotoUri(uri, mimeType) {
    console.log('set uri: ' + uri);
    this.setState({imgUri: uri, type: mimeType});
  }

  getStylesheet() {
    this.styles = {
      placeholder: {
        width: 15,
        height: 15,
        tintColor: '#808080',
      },
      img: {
        width: this.winH * 0.8 * 0.8 * 0.32,
        height: this.winH * 0.8 * 0.8 * 0.32,
        borderRadius: 20,
      },
    };
  }

  onImageLibraryPress() {
    const options = {
      width: this.winH * 0.8 * 0.8 * 0.3,
      height: this.winH * 0.8 * 0.8 * 0.3,
      cropping: true,
      multiple: false,
    };
    ImagePicker.openPicker(options)
      .then(response => {
        this.setState({
          pickerResponse: response,
          imgUri: response.path,
          type: response.mime,
          name: response.filename,
        });
        console.log('pickerResponse:', JSON.stringify(response));
        console.log('imgUri: ' + JSON.stringify(this.state.imgUri));
      })
      .catch(error => console.log('error: ' + JSON.stringify(error)));
  }

  onCameraPress() {
    const options = {
      width: this.winH * 0.8 * 0.8 * 0.25,
      height: this.winH * 0.8 * 0.8 * 0.25,
      cropping: true,
      multiple: false,
    };
    ImagePicker.openCamera(options).then(response => {
      this.setState({
        pickerResponse: response,
        imgUri: response.path,
      });
      console.log('imgUri: ' + JSON.stringify(this.state.imgUri));
    });
  }

  render() {
    //const source = uri ? { uri: 'data:image/jpeg;base64,' + this.state.pickerResponse.data } : null;
    return (
      <TouchableOpacity onPress={this.onImageLibraryPress}>
        <NCard settings={this.settings}>
          {this.state.imgUri === null ? (
            <Image
              source={require('../../../../assets/icons/post.png')}
              style={this.styles.placeholder}
            />
          ) : (
            <Image
              source={{uri: this.state.imgUri}}
              style={this.styles.img}
              resizeMode="contain"
            />
          )}
        </NCard>
      </TouchableOpacity>
    );
  }
}
