import BaseInnerView from './tabbedScreens/Search/InnerViews/BaseInnerView';
import NonTabbedScreenContainer from './NonTabbedScreenContainer';
import NCard from '../../components/reusable/Neuromorphic/Cards/NCard';
import {StyleSheet, View, Text} from 'react-native';
import NTextInput from '../../components/reusable/Neuromorphic/TextInput/NTextInput';
import NButton from '../../components/reusable/Neuromorphic/Buttons/NButton';
import React from 'react';

/**
ReportsView is a React component that allows the user to report a post. It extends the BaseInnerView class.
*/
export default class ReportsView extends BaseInnerView {

  /**
ReportsView constructor that initializes the component's state and sets up necessary references.
@param {object} props - React props object that includes navigation and route params.
*/
  constructor(props) {
    super(props);
    this.createSettings();
    this.createStylesheet();
    this.reportReasonField = React.createRef(null);
  }

  /**
Creates and sets the stylesheet object for this component.
*/
  createStylesheet() {
    this.styles = StyleSheet.create({
      innerContainer: {
        width: this.getWinW() * 0.8 * 0.8,
        height: this.getWinH() * 0.8 * 0.5,
        justifyContent: 'center',
        alignItems: 'center',
      },
      labelText: {
        fontFamily: 'Quicksand',
        fontSize: 25,
        fontWeight: 'bold',
      },
      verticalSpacer: {
        height: '10%',
        width: '100%',
      },
    });
  }

  /**
Creates and sets the settings object for this component.
*/
  createSettings() {
    this.nSettings = {
      contentCard: {
        color: this.getBgColor(),
        width: this.getWinW() * 0.8,
        height: this.getWinH() * 0.3,
        blur: false,
        shadowRadius: 4,
      },
      textInput: {
        color: this.getBgColor(),
        width: this.winW * 0.8 * 0.7,
        height: this.winH * 0.8 * 0.08,
        shadowRadius: 3,
        innerShadow: false,
        blur: false,
      },
      submitButton: {
        color: this.getPrimaryColor(),
        width: this.winW * 0.8 * 0.7,
        height: this.winH * 0.8 * 0.08,
        shadowRadius: 2,
      },
    };
  }

  /**
Renders the ReportsView component.
@return {ReactElement} - The rendered component.
*/
  render() {
    return (
      <NonTabbedScreenContainer
        route={{params: this.getParams()}}
        navigation={this.props.navigation}
        title={'Post'}>
        <NCard settings={this.nSettings.contentCard}>
          <View style={this.styles.innerContainer}>
            <Text style={this.styles.labelText}>Reason for report:</Text>
            <View style={this.styles.verticalSpacer} />
            <NTextInput
              ref={this.reportReasonField}
              placeholder={'Reason'}
              settings={this.nSettings.textInput}
            />
            <View style={this.styles.verticalSpacer} />
            <NButton
              fontFamily={this.getButtonFont()}
              textColor={this.getSecondaryColor()}
              label={'Submit Report'}
              settings={this.nSettings.submitButton}
              onPress={async () => {
                console.log(
                  'postID in reportsView:',
                  this.props.route.params.postID,
                );
                const response = await this.getReportsController()
                  .createReport(
                    this.props.route.params.postID,
                    this.props.route.params.currentUser,
                    this.reportReasonField.current.getText(),
                  )
                  .then(res => {
                    return res;
                  });
                this.props.navigation.goBack();
              }}
            />
          </View>
        </NCard>
      </NonTabbedScreenContainer>
    );
  }
}
