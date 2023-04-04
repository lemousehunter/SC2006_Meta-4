import {Component} from 'react';
import moment from 'moment';

export default class PostsController extends Component {
  constructor(dataC) {
    super(dataC);
    this.user = '';
    this.loggedIn = true;
    this.dataController = dataC;
  }
  convertPost2PostItem(Post) {
    return {
      name: 'PlaceholderName', // convert Post.listedBy to meaningful name
      type: Post.isLost === 1 ? 'Lost' : 'Found',
      location: 'placeHolderLoc', // to convertCoords to meaningful name
      coordinates: Post.location,
      timing: 'placeHolderTiming', // to convert datetime to timedelta
      item: Post.itemName,
      category: 'PlaceholderCat', // convert categoryVal to meaningful cat,
      postID: Post.postID,
      isResolved: false,
      image: Post.images[0], // first image
    };
  }

  async getPostItemsByUser(user) {
    const posts = await this.getPostsByUser(user).then(res => {
      return res;
    });
    let array = [];
    posts.map(post => {
      console.log('post:' + JSON.stringify(post));
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
      console.log('timing:' + timing);
      let obj = {
        name: post.itemName,
        type: post.isLost === 1 ? 'Lost' : 'Found',
        location: post.location,
        timing: timing,
        item: post.itemName,
        category: post.category.name,
        categoryID: post.category._id,
        postID: post._id,
        isResolved: post.isResolved,
        listedBy: post.listedBy,
        image: post.images[0],
      };
      array.push(obj);
    });
    return array;
  }

  getMarkers() {
    const markers = [
      {
        title: 'Test1',
        latitude: 1.343082,
        longitude: 1.680181,
        description: 'Jerome',
      },
      {
        title: 'Test2',
        latitude: 1.343654,
        longitude: 103.682199,
        description: 'Rodmond',
      },
      {
        title: 'Test3',
        latitude: 1.343586,
        longitude: 103.683148,
        description: 'Bernard',
      },
      {
        title: 'Test4',
        latitude: 1.342513,
        longitude: 103.683003,
        description: 'Jia Rong',
      },
      {
        title: 'Test5',
        latitude: 1.344181,
        longitude: 103.680224,
        description: 'YuanLin',
      },
    ];
    return markers;
  }

  async getPostsByUser(user) {
    // to replace with fetch function call
    console.log('session token is:', this.dataController.sessionToken);
    const response = await this.dataController
      .get('users/userposts/' + user)
      .then(res => {
        console.log('res:');
        return res;
      })
      .catch(error => console.log(error));
    console.log('getPostsResponse' + JSON.stringify(response));
    if (response.status === 200) {
      console.log('responseData:' + JSON.stringify(response.data));
      return response.data;
    } else {
      console.log('Error');
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

  getPostByID(postID) {
    const Post = {
      listedBy: 'testUser',
      postID: postID,
      itemName: 'testName',
      isLost: 'Lost',
      images: [null, null, null, null, null],
      location: 'testLocation',
      datetime: new Date('2023-05-04T07:46:51.000Z'),
      itemDesc: 'testDesc',
      category: 'e1',
      isResolved: false,
    };
    return Post;
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
      formdata.append(
        'images',
        JSON.stringify({
          uri: photos[i],
          type: photoTypes[i],
          name: photoNames[i],
        }),
      );
    }
    formdata.append('location', location);
    formdata.append('listedBy', listedBy);
    formdata.append('date', date);
    formdata.append('time', date);
    formdata.append('itemDescription', desc);
    formdata.append('category', categoryID);
    formdata.append('isResolved', false);
    console.log('formData:', JSON.stringify(formdata));
    const response = await this.dataController
      .post('posts/', formdata, 'multipart/form-data')
      .then(res => {
        console.log('dcCreatePost:' + res);
        return res.data;
      });
    return response;
  }
}
