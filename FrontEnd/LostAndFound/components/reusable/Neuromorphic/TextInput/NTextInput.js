import NCard from '../Cards/NCard';
import React, {Component} from 'react';
import {TextInput, StyleSheet, ScrollView} from 'react-native';

/**
A custom text input component that wraps around the TextInput component from react-native.
*/
export default class NTextInput extends Component {
  /**
   * Constructs a new NTextInput with the given props.
   * 
   * @param {Boolean} autocorrect - Whether autocorrect should be enabled or not. Defaults to true.
   * @param {String} label - Label for the input.
   * @param {Number} maxLen - Maximum length of the input.
   * @param {String} kbType - Keyboard type for the input.
   * @param {Object} settings - Settings for the input.
   * @param {Boolean} secureEntry - Whether the input is a secure text entry or not.
   * @param {String} placeholder - Placeholder text for the input.
   * @param {Function} onSubmit - Function to be called when the input is submitted.
   * @param {String} autocapitalize - Autocapitalization type for the input.
   * @param {String} inputMode - The input mode of the text input, such as "text", "numeric", "email", etc.
   * @param {Boolean} editable - Whether the input is editable or not. Defaults to true.
   * @returns {JSX.Element} - Returns a JSX element that includes a TextInput wrapped in a custom NCard component.
   */
  constructor(props) {
    super(props);
    this.autocorrect = this.props.autocorrect;
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
    this.onSubmit = this.props.onSubmit;
    this.autocapitalize =
      this.props.autocapitalize == null ? 'none' : this.props.autocapitalize;
    this.settings = {
      ...this.settings,
      //blur: !!this.state.pressing,
    };
    this.inputMode = this.props.inputMode;
  }

  /**
Initializes the component's default values.
@private
*/
  getDefault() {
    //console.log('blur:' + this._blur);
    this.editable = this.props.editable == null ? true : this.props.editable;
    //this._blur = this.props.blur == null ? true : this.props.blur;
    //this.innerShadow = this.props.innerShadow == null ? true : this.props.blur;
    this.shadowRadius = this.shadowRadius == null ? -3 : this.shadowRadius;
  }

  /**
Creates the component's stylesheet.
@private
*/
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

  /**
Gets the current text value of the input.
@returns {String} - The current text value of the input.
*/
  getText() {
    return this.state.text;
  }

  /**
Sets the text value of the input.
@param {String} text - The new text value of the input.
*/
  setText(text) {
    this.setState({text: text});
  }

/**
Called after a component is mounted. Setting state here will trigger re-rendering.
*/
  componentDidMount() {
    if (this.props.text !== undefined) {
      this.setState({text: this.props.text});
    }
  }

/**
 * Renders the NTextInput component onto the screen.
 *
 * @return {JSX.Element} The rendered component.
 */
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
          autoCorrect={this.autocorrect}
          onSubmitEditing={this.onSubmit}
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
