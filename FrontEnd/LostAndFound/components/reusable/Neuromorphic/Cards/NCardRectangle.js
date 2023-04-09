import NCardBase from './NCardBase';

export default class NCardRectangle extends NCardBase {
  constructor(props) {
    super(props);
    this.borderRadius = this.borderRadius == null ? 20 : this.borderRadius;
    this.createStylesheet(); // update stylesheet with borderRadius
  }
}
