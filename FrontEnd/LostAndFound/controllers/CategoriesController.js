import {Component} from 'react';

export default class CategoriesController extends Component {
  constructor(props) {
    super(props);
  }

  getCategories() {
    const categories = [
      {label: 'All', value: 'e1'},
      {label: 'Electronics', value: 'e2'},
      {label: 'Clothing', value: 'e3'},
      {label: 'Valuables', value: 'e4'},
      {label: 'Others', value: 'e5'},
    ];
    return categories;
  }
}
