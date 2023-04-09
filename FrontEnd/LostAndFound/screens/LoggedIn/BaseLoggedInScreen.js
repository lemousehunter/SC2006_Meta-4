import BaseScreen from '../BaseScreen';

export default class BaseLoggedInScreen extends BaseScreen {
  constructor(props) {
    super(props);
    // console.log(this.props);
  }

  //static contextType = AppContext;

  getUser() {
    return this.getLoginController().getUser();
  }

  logOut() {
    this.getLoginController().logOut();
    this.navigate('PreLoginHomepage', this.getParams());
  }

  getPostsController = () => {
    return this.getControllers().postsController;
  };

  getReportsController = () => {
    return this.getControllers().reportsController;
  };

  getRequestsController = () => {
    return this.getControllers().requestsController;
  };

  nav = (tabScreenName, params) => {
    console.log('jumping to:', tabScreenName);
    this.props.navigation.jumpTo(tabScreenName, params);
  };

  render() {
    console.log('TabUser is:' + this.getLoginController().getUser());
    //console.log('User is:' + this.getUser());
    //this.getBottomNav();
    //console.log('homeScreen user:' + this.getUser());
  }
}
