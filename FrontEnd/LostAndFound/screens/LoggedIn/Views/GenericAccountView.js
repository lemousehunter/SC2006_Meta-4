import BaseInnerView from '../tabbedScreens/Search/InnerViews/BaseInnerView';
import NonTabbedScreenContainer from '../NonTabbedScreenContainer';
import AccountScreen from '../tabbedScreens/Account/Account';

export default class GenericAccountView extends BaseInnerView {
  constructor(props) {
    super(props);
  }

  render() {
    console.log('genericAccountUser:', this.props.route.params.user);
    return (
      <NonTabbedScreenContainer
        route={{params: this.getParams()}}
        navigation={this.props.navigation}>
        <AccountScreen
          navigation={this.props.navigation}
          route={{
            params: {
              ...this.getParams(),
              user: this.props.route.params.user,
            },
          }}
        />
      </NonTabbedScreenContainer>
    );
  }
}
