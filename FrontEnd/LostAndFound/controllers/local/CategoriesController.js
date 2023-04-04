import {Component} from 'react';

export default class CategoriesController extends Component {
  constructor(dataC) {
    super(dataC);
    this.dataController = dataC;
  }

  async getCategories() {
    const categories = [
      {label: 'All', value: 'e1'},
      {label: 'Electronics', value: 'e2'},
      {label: 'Clothing', value: 'e3'},
      {label: 'Valuables', value: 'e4'},
      {label: 'Others', value: 'e5'},
    ];
    let response = await this.dataController.get('categories/').then(result => {
      return result.data;
    });

    const array = [];
    response.map(category => {
      array.push({label: category.name, value: category._id});
    });
    console.log('catCtrlCats:' + JSON.stringify(array));
    return array;
  }
}
