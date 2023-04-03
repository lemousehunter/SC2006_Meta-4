import NCard from '../Cards/NCard';
import React, {Component} from 'react';
import {TextInput, StyleSheet, ScrollView} from 'react-native';

export default class NTextInput extends Component {
  constructor(props) {
    super(props);
    this.state = {text: '', pressing: false};
    this.props = props;
    this.label = this.props.label;
    this.maxLen = this.props.maxLen;
    this.getDefault();
    this.kbType = this.props.kbType;
    this.settings = this.props.settings;
    this.secureEntry = this.props.secureEntry;
    this.placeholder = this.props.placeholder;
    this.label = this.props.label;
    this.createStyleSheet();
    this.value = this.props.value;
    this.self = this.props.self;
    this.textInputRef = React.createRef();
    this.autocapitalize =
      this.props.autocapitalize == null ? 'none' : this.props.autocapitalize;
    this.settings = {
      ...this.settings,
      //blur: !!this.state.pressing,
    };
    this.inputMode = this.props.inputMode;
  }

  getDefault() {
    //console.log('blur:' + this._blur);
    this.editable = this.props.editable == null ? true : this.props.editable;
    //this._blur = this.props.blur == null ? true : this.props.blur;
    //this.innerShadow = this.props.innerShadow == null ? true : this.props.blur;
    this.shadowRadius = this.shadowRadius == null ? -3 : this.shadowRadius;
  }

  createStyleSheet() {
    this.styles = StyleSheet.create({
      input: {
        flex: 1,
        borderWidth: 0,
        borderRadius: 10,
        padding: 10,
      },
    });
  }

  getText() {
    return this.state.text;
  }

  setText(text) {
    this.setState({text: text});
  }

  render() {
    //this.settings.innerShadow = !!this.state.pressing;

    return (
      <NCard
        circle={this.circle}
        innerShadow={this.innerShadow}
        settings={this.settings}>
        <TextInput
          ref={this.textInputRef}
          onFocus={() => {
            this.setState({pressing: true});
            //this.settings.blur = !this.settings.blur;
            //this.textInputRef.current.focus();
            //this.textInputRef.current.blur();
            //this.settings.innerShadow = true;
            // this.settings.shadowRadius = -this.settings.shadowRadius;
            console.log('pressedIn');
          }}
          onBlur={() => {
            this.setState({pressing: false});
            //this.settings.blur = !this.settings.blur;
            //this.textInputRef.current.focus();
            //this.settings.innerShadow = false;
            // this.settings.shadowRadius = -this.settings.shadowRadius;
            console.log('pressedOut');
          }}
          onChangeText={text => {
            this.setState({text: text});
          }}
          inputMode={this.inputMode}
          value={this.state.text}
          style={this.styles.input}
          maxLength={this.maxLen}
          editable={this.editable}
          keyboardType={this.kbType}
          secureTextEntry={this.secureEntry}
          placeholder={this.placeholder}
          label={this.label}
          name={this.name}
          autoCapitalize={this.autocapitalize}

          //value={this.state.text}
        />
      </NCard>
    );
  }
}
