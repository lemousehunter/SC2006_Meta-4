import {Component} from 'react';
import moment from 'moment';

export default class PostsController extends Component {
  constructor(dataC, loginC) {
    super(dataC, loginC);
    this.user = '';
    this.loggedIn = true;
    this.loginController = loginC;
    this.dataController = dataC;
  }
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

  async getPostByID(postID) {
    console.log('getting posts by id....');
    const posts = await this.dataController.get('posts/' + postID).then(_p => {
      console.log('_p' + JSON.stringify(_p));
      return _p.data;
    });
    return posts;
  }

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

  async getPostItemsByUserAndCategory(userID, categoryID) {
    const posts = await this.dataController.get('users/userposts/');
  }

  async getAllPosts() {
    console.log('getting all posts');
    const posts = await this.dataController.get('posts').then(res => {
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

  async getPostItemsByUserID(userID) {
    const posts = await this.getPostsByUserID(userID).then(res => {
      return res;
    });
    let array = [];
    posts.map(post => {
      const obj = this.convertPost2PostItem(post);
      array.push(obj);
    });
    return array;
  }

  async getPostsByUserID(userID) {
    // to replace with fetch function call
    console.log('session token is:', this.dataController.sessionToken);
    const response = await this.dataController
      .get('users/userposts/' + userID)
      .then(res => {
        console.log('res:');
        return res;
      })
      .catch(error => console.log(error));
    console.log('getPostsResponse' + JSON.stringify(response));
    if (response.status === 200) {
      return response.data;
    } else {
      console.log('responseError');
      console.log(JSON.stringify(response));
    }
  }

  editPost(
    postID,
    itemName,
    isLost,
    images,
    location,
    date,
    time,
    itemDesc,
    category,
    isResolved,
  ) {
    console.log(
      'itemName: ' +
        itemName +
        ' isLost: ' +
        isLost +
        ' images: ' +
        images +
        ' postID: ' +
        postID,
    );
  }

  // getPostByID(postID) {
  //   const Post = {
  //     listedBy: 'testUser',
  //     postID: postID,
  //     itemName: 'testName',
  //     isLost: 'Lost',
  //     images: [null, null, null, null, null],
  //     location: 'testLocation',
  //     datetime: new Date('2023-05-04T07:46:51.000Z'),
  //     itemDesc: 'testDesc',
  //     category: 'e1',
  //     isResolved: false,
  //   };
  //   return Post;
  // }

  async deletePost(postID) {
    console.log('deleting....');
    return await this.dataController.del('posts/' + postID).then(res => {
      return res.data;
    });
  }

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
    const response = await this.dataController
      .post('posts/', formdata, 'multipart/form-data')
      .then(res => {
        console.log('dcCreatePost:' + res);
        return res.data;
      });
    return response;
  }
}
