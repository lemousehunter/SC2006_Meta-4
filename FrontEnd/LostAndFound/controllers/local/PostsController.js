import {Component} from 'react';
import moment from 'moment';

/**
 * This class represents a controller for posts. It extends the Component class
 * from the React library and provides methods for searching, retrieving, and converting posts.
 */
export default class PostsController extends Component {
  /**
   * Creates a new instance of PostsController.
   *
   * @param {Object} dataC - The data controller to use for data operations.
   * @param {Object} loginC - The login controller to use for login operations.
   */
  constructor(dataC, loginC) {
    super(dataC, loginC);
    this.user = '';
    this.loggedIn = true;
    this.loginController = loginC;
    this.dataController = dataC;
  }
  /**
   * Converts a post to a post item object.
   *
   * @param {Object} post - The post object to convert.
   * @returns {Object} A post item object containing the converted post data.
   */
  convertPost2PostItem(post) {
    console.log('converting...');
    console.log('post!!:' + JSON.stringify(post));
    let date = new moment(post.date);
    console.log('date:' + JSON.stringify(date));
    console.log('o_time' + JSON.stringify(post.time));
    let time = new moment(post.time, 'HH:mm:SS');
    console.log('time:' + JSON.stringify(time));
    date
      ?.hour(time ? time.hours() : date.hours())
      .minute(time ? time.minutes() : date.minutes());
    console.log('datetime:' + JSON.stringify(date));
    let currentTime = moment();
    console.log(
      'test:' + moment.utc(moment().diff(moment())).format('DD:hh:mm:ss'),
    );
    let timeDelta = moment.utc(currentTime.diff(date));
    let days = timeDelta.format('DD');
    let hours = timeDelta.format('hh');
    let mins = timeDelta.format('mm');
    let sec = timeDelta.format('ss');
    let timing = '';
    if (days !== '00') {
      timing += days + ' days';
    }
    if (hours !== '00') {
      timing += ' ' + hours + ' h';
    }
    if (mins !== '00') {
      timing += ' ' + mins + ' mins';
    }
    if (sec !== '00') {
      timing += ' ' + sec + ' s';
    }
    console.log('isLost!:' + JSON.stringify(post.isLost));
    console.log('timing:' + timing);
    console.log('post to convert:');
    console.log(JSON.stringify(post));
    return {
      name: post.itemName,
      type: post.isLost === true ? 'Lost' : 'Found',
      location: post.location,
      timing: timing,
      item: post.itemName,
      description: post.itemDescription,
      category: post.category.name,
      categoryID: post.category._id,
      postID: post._id,
      isResolved: post.isResolved,
      listedBy: post.listedBy,
      image: post.images[0],
      coordinates: {latitude: post.latitude, longitude: post.longitude},
    };
  }

  /**
   * Searches for posts based on the given search term, search type, and category ID.
   *
   * @param {string} searchTerm - The search term to use.
   * @param {string} searchType - The search type to use.
   * @param {string} categoryID - The category ID to search in.
   * @returns {Array} An array of post item objects that match the search criteria.
   */
  async searchPost(searchTerm, searchType, categoryID) {
    const _category = categoryID === 'All' ? '' : '&category=' + categoryID;
    const params =
      '' + searchTerm + '?' + 'searchType=' + searchType + _category;
    const posts = await this.dataController
      .get('searchType/search/' + params)
      .then(res => {
        return res.data;
      });
    const postLst = [];
    for (let i = 0; i < posts.length; i++) {
      const post = await this.getPostByID(posts[i].id).then(_p => {
        return _p;
      });
      postLst.push(this.convertPost2PostItem(post));
    }
    return postLst;
  }

  /**
Retrieves a post by its ID.
@param postID the ID of the post to retrieve
@return the post object retrieved by the ID
@throws any exceptions that occur during the API request
*/
  async getPostByID(postID) {
    console.log('getting posts by id....');
    const posts = await this.dataController.get('posts/' + postID).then(_p => {
      console.log('_p' + JSON.stringify(_p));
      return _p.data;
    });
    return posts;
  }

  /**
Gets a post with the specified name.
@param {string} name - The name of the post to retrieve.
@param {string} categoryID - The ID of the category to search within. Defaults to "All" if not specified.
@return {Promise} - A Promise that resolves to an array of post items matching the specified name and category.
@throws {Error} - If there is an error retrieving the post items.
*/
  async getPostsFromUser(name, categoryID) {
    const userLst = await this.loginController
      .getUserListByName(name)
      .then(result => {
        console.log('userListByName:' + JSON.stringify(result));
        return result;
      });
    console.log('userListS:', JSON.stringify(userLst));
    const postLst = [];
    for (let i = 0; i < userLst.length; i++) {
      console.log('userID:' + JSON.stringify(userLst[i]._id));
      const posts = await this.getPostItemsByUserID(userLst[i]._id).then(
        _posts => {
          console.log('userResponse:' + JSON.stringify(_posts));
          return _posts;
        },
      );
      console.log('userResponse2:' + JSON.stringify(posts));
      posts.map(_p => postLst.push(_p));
    }
    return postLst;
  }

  /**
   * Searches for posts that match the given item and category.
   *
   * @param item the search term for the post item
   * @param category the category to filter the search by
   * @return a list of post items that match the search criteria
   * @throws {Error} if there is an error retrieving the data
   */
  async searchByItemAndCat(item, category) {
    let url = '';
    if (category === 'All') {
      url = 'posts/search/' + item;
    } else {
      url = 'posts/search/' + item + '?category=' + category;
    }
    const posts = await this.dataController.get(url).then(res => {
      console.log('searchByItemAndCat:' + JSON.stringify(res));
      return res.data;
    });
    const postList = [];
    posts.map(post => {
      const obj = this.convertPost2PostItem(post);
      postList.push(obj);
    });
    return postList;
  }

  /**
Retrieves an array of post items for a given user and category using an asynchronous HTTP request.
@param {string} userID - The ID of the user whose posts will be retrieved.
@param {string} categoryID - The ID of the category to which the posts belong.
@returns {Promise<Array>} - A Promise that resolves to an array of post items matching the specified user and category.
*/
  async getPostItemsByUserAndCategory(userID, categoryID) {
    const posts = await this.dataController.get('users/userposts/');
  }

  /**
   * Retrieves all posts from the data source.
   *
   * @return A Promise that resolves with an array of post objects if successful,
   *         or rejects with an error message if an error occurred.
   */
  async getAllPosts() {
    console.log('getting all posts');
    const posts = await this.dataController
      .get('posts/get/UrgentPosts')
      .then(res => {
        console.log('getAllPostsRes:' + JSON.stringify(res));
        return res.data;
      });
    const postItems = [];
    posts.map(post => {
      const obj = this.convertPost2PostItem(post);
      postItems.push(obj);
    });
    return postItems;
  }

  /**
   * Retrieves all post items created by a given user ID.
   *
   * @param {string} userID - The ID of the user whose post items will be retrieved.
   * @returns {Promise<Array>} - A promise that resolves to an array of post items created by the user with the given ID.
   * @throws {Error} - If the request to the data controller fails or returns an error.
   */
  async getPostItemsByUserID(userID, postStatus) {
    const posts = await this.getPostsByUserID(userID, postStatus).then(res => {
      return res;
    });
    console.log('getPostItemsByUserID:', JSON.stringify(posts));
    let array = [];
    posts.map(post => {
      const obj = this.convertPost2PostItem(post);
      array.push(obj);
    });
    return array;
  }

  /**
Retrieves a list of posts created by a given user ID.
@param {string} userID - The ID of the user whose posts to retrieve.
@param {string} categoryID - The ID of the category to filter the posts by.
@returns {Array} An array of post objects created by the given user.
@throws {Error} If an error occurs while retrieving the posts.
*/
  async getPostsByUserID(userID, postStatus) {
    let response = null;
    if (postStatus === 0) {
      // console.log('session token is:', this.dataController.sessionToken);
      response = await this.dataController
        .get('posts/userposts/' + userID) // posts/get/Resolved/ // posts/get/UrgentPosts/
        .then(res => {
          console.log('res:');
          return res;
        })
        .catch(error => console.log(error));
    } else if (postStatus === 1) {
      response = await this.dataController
        .get('posts/get/UrgentPosts/' + userID) // posts/get/Resolved/ // posts/get/UrgentPosts/
        .then(res => {
          console.log('res:');
          return res;
        })
        .catch(error => console.log(error));
    } else {
      response = await this.dataController
        .get('posts/get/Resolved/' + userID) // posts/get/Resolved/ // posts/get/UrgentPosts/
        .then(res => {
          console.log('res:');
          return res;
        })
        .catch(error => console.log(error));
    }
    console.log('getPostsResponse' + JSON.stringify(response));
    if (response.status === 200) {
      return response.data;
    } else {
      console.log('responseError');
      console.log(JSON.stringify(response));
    }
  }

  /**
Creates a new FormData object with the given key-value pairs.
@param {object} data - An object containing key-value pairs to be added to the FormData.
@returns {FormData} A new FormData object with the key-value pairs added to it.
*/
  createFormData(
    photos,
    photoTypes,
    photoNames,
    type,
    date,
    categoryID,
    item,
    desc,
    location,
    listedBy,
  ) {
    let formdata = new FormData();
    formdata.append('itemName', item);
    formdata.append('isLost', type !== 'found');
    for (let i = 0; i < 4; i++) {
      if (photos[i] !== null) {
        let img = {
          uri: photos[i],
          type: photoTypes[i],
          name: photoNames[i],
        };
        console.log('img:');
        console.log(img);
        formdata.append('images', img);
      }
    }
    console.log('getDate:');
    console.log(date.getDate());
    console.log('getTime:');
    console.log(date.getTime());
    formdata.append('location', location);
    formdata.append('listedBy', listedBy);
    formdata.append('date', date.toDateString());
    formdata.append('time', date.getTime());
    formdata.append('itemDescription', desc);
    formdata.append('category', categoryID);
    formdata.append('isResolved', false);
    console.log('formData:');
    console.log(formdata);
    return formdata;
  }

  /**

Edits the specified post with the given updates.
@param {string} postID - The ID of the post to edit.
@param {string} itemName - The updated name of the item.
@param {string} itemDescription - The updated description of the item.
@param {string} location - The updated location where the item was found/lost.
@param {string} categoryID - The ID of the updated category.
@param {Array} images - An array of updated image URLs for the post.
@returns {Object} An object representing the edited post.
@throws {Error} If the post does not exist or if the user is not authorized to edit the post.
*/
  editPost(
    photos,
    photoTypes,
    photoNames,
    type,
    date,
    categoryID,
    item,
    desc,
    location,
    listedBy,
    postID,
  ) {
    console.log('editing post:', postID);
    const formData = this.createFormData(
      photos,
      photoTypes,
      photoNames,
      type,
      date,
      categoryID,
      item,
      desc,
      location,
      listedBy,
    );
    const response = this.dataController
      .put('posts/' + postID, formData, 'multipart/form-data')
      .then(res => {
        return res.data;
      });
    return response;
  }

  /**
   * Deletes a post with the specified post ID.
   *
   * @param {string} postID - The ID of the post to be deleted.
   * @returns {Promise<boolean>} A promise that resolves with a boolean value indicating whether the post was successfully deleted.
   * @throws {Error} If the post ID is invalid or if there was an error deleting the post.
   */
  async deletePost(postID) {
    console.log('deleting....');
    return await this.dataController.del('posts/' + postID).then(res => {
      return res.data;
    });
  }

  /**
   * Creates a new post with the given details.
   *
   * @param {string} itemName - The name of the lost/found item.
   * @param {string} itemDescription - A description of the lost/found item.
   * @param {string} location - The location where the item was lost/found.
   * @param {string} categoryID - The ID of the category the item belongs to.
   * @param {string} image - A URL pointing to the image of the lost/found item.
   * @param {number} latitude - The latitude of the location where the item was lost/found.
   * @param {number} longitude - The longitude of the location where the item was lost/found.
   * @param {boolean} isLost - A flag indicating whether the item is lost or found.
   * @param {string} listedBy - The name of the user who listed the post.
   *
   * @returns {Promise} A Promise that resolves to the newly created post if successful, or rejects with an error if the post could not be created.
   */
  async createPost(
    photos,
    photoTypes,
    photoNames,
    type,
    date,
    categoryID,
    item,
    desc,
    location,
    listedBy,
  ) {
    const formdata = this.createFormData(
      photos,
      photoTypes,
      photoNames,
      type,
      date,
      categoryID,
      item,
      desc,
      location,
      listedBy,
    );
    const response = await this.dataController
      .post('posts/', formdata, 'multipart/form-data')
      .then(res => {
        console.log('dcCreatePost:' + res);
        return res.data;
      });
    return response;
  }
}
