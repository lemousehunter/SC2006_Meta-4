import {FlatList, ScrollView, StyleSheet, Text, View} from 'react-native';
import {AppContext} from '../../../../contexts/Contexts';
import BaseScreen from '../../../BaseScreen';
import TitleFlatList from '../../../../components/TitleFlatList';
import React from 'react';
import BaseListItem from '../../../../components/ListItems/BaseListItem';
import NCard from '../../../../components/reusable/Neuromorphic/Cards/NCard';
import NButton from '../../../../components/reusable/Neuromorphic/Buttons/NButton';
import OwnReqListItem from '../../../../components/ListItems/OwnReqListItem';
import BaseLoggedInScreen from '../../BaseLoggedInScreen';
import BaseInnerView from '../Search/InnerViews/BaseInnerView';
import ReportsReceivedListItem from '../../../../components/ListItems/ReportsReceivedListItem';

export default class ActivityScreen extends BaseInnerView {
  constructor(props) {
    super(props);
    console.log('props:' + this.props);
    this.createStylesheet();
    this.createSettings();
    this.state = {
      requestLst: [],
    };
  }

  static contextType = AppContext;

  createStylesheet() {
    this.styles = StyleSheet.create({
      bg: {
        backgroundColor: this.getBgColor(),
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      scrollViewC: {
        width: this.getWinW(),
        height: this.getWinH(),
        justifyContent: 'center',
        alignItems: 'center',
      },
      verticalSpacer: {
        height: this.getWinH() * 0.05,
      },
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
        color: this.getPrimaryColor(),
        width: this.getWinW() * 0.8 * 0.3,
        height: this.getWinH() * 0.8 * 0.03,
        shadowRadius: 2,
      },
      rejectBtn: {
        color: this.getCallColor(),
        width: this.getWinW() * 0.8 * 0.3,
        height: this.getWinH() * 0.8 * 0.03,
        shadowRadius: 2,
      },
    };
  }

  onFocus = async () => {
    const requests = await this.getRequestsController()
      .getRequestsByRecipient(this.getUser())
      .then(res => {
        return res;
      });
    const requestLst = [];
    requests.map(request => {
      let status = '';
      console.log('requestStatus:', request.state);
      if (request.state === 0) {
        status = 'Pending';
      } else if (request.status === -1) {
        status = 'Rejected';
      } else {
        status = 'Approved';
      }
      const isLost = request.isLost ? 'Found' : 'Lost';
      const r = {
        title: isLost + request.post.itemName,
        userName: request.sender.name,
        status: status,
        requestID: request.id,
      };
      requestLst.push(r);
    });
    console.log('getRequestsByUser:', JSON.stringify(requests));
    this.setState({
      requestLst: requestLst,
    });
    const reports = await this.getReportsController()
      .getReportsByRecipient(this.getUser())
      .then(res => {
        return res;
      });
    console.log('getReportsByRecipient:', JSON.stringify(reports));
    const reportLst = [];
    reports.map(report => {
      let status = '';
      if (report.state === 0) {
        status = 'Pending';
      } else if (report.state === 1) {
        status = 'Resolved';
      }
      const r = {
        title: report.title,
        userName: 'Hidden',
        status: status,
        reportID: report.id,
        reason: report.description,
      };
      reportLst.push(r);
    });
    this.setState({reportLst: reportLst});
  };

  async componentDidMount() {
    console.log('component did mount');
    this.focusSub = this.props.navigation.addListener('focus', () => {
      this.onFocus();
    });
    await this.onFocus();
  }

  render() {
    const params = {
      bgColor: this.getBgColor(),
      winW: this.getWinW(),
      winH: this.getWinH(),
      buttonFont: this.getButtonFont(),
      callColor: this.getCallColor(),
      primaryColor: this.getPrimaryColor(),
      requestsC: this.getRequestsController(),
      onFocus: this.onFocus,
    };
    const labels = {
      line2LeftLabel: 'User',
      line2RightLabel: 'Status',
    };
    console.log('User is:' + this.getLoginController().getUser());
    return (
      <View style={this.styles.bg}>
        <View style={this.styles.scrollViewC}>
          <TitleFlatList
            title={'Received Requests'}
            bgColor={this.getBgColor()}
            winW={this.getWinW()}
            winH={this.getWinH()}>
            <FlatList
              ContainerStyle={{padding: 20}}
              style={{padding: 10}}
              data={this.state.requestLst}
              renderItem={({item}) => (
                <OwnReqListItem _data={item} params={params} labels={labels} />
              )}
              ItemSeparatorComponent={() => <View style={{height: 20}} />}
            />
          </TitleFlatList>
          <View style={this.styles.verticalSpacer} />
          <TitleFlatList
            title={'Received Reports'}
            bgColor={this.getBgColor()}
            winW={this.getWinW()}
            winH={this.getWinH()}>
            <FlatList
              ContainerStyle={{padding: 20}}
              style={{padding: 10}}
              data={this.state.reportLst}
              renderItem={({item}) => (
                <ReportsReceivedListItem
                  _data={item}
                  params={params}
                  labels={labels}
                />
              )}
              ItemSeparatorComponent={() => <View style={{height: 20}} />}
            />
          </TitleFlatList>
          <View style={this.styles.verticalSpacer} />
          <View style={this.styles.verticalSpacer} />
        </View>
      </View>
    );
  }
}
