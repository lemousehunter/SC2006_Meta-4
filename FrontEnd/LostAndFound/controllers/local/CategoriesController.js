import {Component} from 'react';


/**
 * A controller for managing categories of items.
 */
export default class CategoriesController extends Component {

   /**
   * Constructs a new CategoriesController with the given data controller.
   *
   * @param {object} dataC - The data controller to use for fetching category data.
   */
  constructor(dataC) {
    super(dataC);
    this.dataController = dataC;
  }

  /**
   * Retrieves the list of available categories.
   *
   * @returns {array} An array of category objects with label and value properties.
   * @throws {Error} If an error occurs while fetching category data.
   */
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
