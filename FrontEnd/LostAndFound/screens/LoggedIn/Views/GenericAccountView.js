import BaseInnerView from '../tabbedScreens/Search/InnerViews/BaseInnerView';
import NonTabbedScreenContainer from '../NonTabbedScreenContainer';
import AccountScreen from '../tabbedScreens/Account/Account';

/**
 * This class represents a generic account view that extends the BaseInnerView class.
 * It displays an AccountScreen component inside a NonTabbedScreenContainer component.
 * The class takes in props as a parameter in its constructor and renders the view by
 * passing these props to the AccountScreen component.
 */
export default class GenericAccountView extends BaseInnerView {

  /**
   * Constructs a new GenericAccountView with the given props.
   *
   * @param props the props to pass to the view
   */
  constructor(props) {
    super(props);
  }

  /**
   * Renders the GenericAccountView component.
   * It displays the AccountScreen component inside a NonTabbedScreenContainer component.
   * It also logs the user object passed as a parameter to the view to the console.
   *
   * @return the rendered view
   */
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
