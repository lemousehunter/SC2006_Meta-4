import {Component} from 'react';

export default class PostsController extends Component {
  constructor(props) {
    super(props);
    this.user = '';
    this.loggedIn = true;
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

  getPosts(user) {
    // to replace with fetch function call
    return [
      {
        name: 'jerome',
        type: 'Found',
        location: 'NTU Hall 8',
        coordinates: [1111, 2222],
        timing: '12s',
        item: 'iPad',
        category: 'Electronics',
        postID: 'A',
        isResolved: false,
        image: 'Post.images[0]', // first image
      },
      {
        name: 'Jia Rong',
        type: 'Lost',
        location: 'NTU Can B',
        coordinates: [1111, 2222],
        timing: '2 Days',
        item: 'MacBook',
        category: 'Electronics',
        postID: 'B',
        isResolved: false,
        image: 'Post.images[0]', // first image
      },
      {
        name: 'Rodmond',
        type: 'Found',
        location: 'N4.1',
        coordinates: [1111, 2222],
        timing: '1 Day',
        item: 'Water Bottle',
        postID: 'C',
        isResolved: false,
        image: 'Post.images[0]', // first image
      },
      {
        name: 'Bernard',
        type: 'Found',
        location: 'NYA',
        coordinates: [1111, 2222],
        timing: '2 Days',
        item: 'item',
        postID: 'D',
        isResolved: false,
        image: 'Post.images[0]', // first image
      },
      {
        name: 'Yuan Lin',
        type: 'Lost',
        location: 'NYH',
        coordinates: [1111, 2222],
        timing: '1 Week',
        item: 'Folder',
        postID: 'E',
        isResolved: false,
        image: 'Post.images[0]', // first image
      },
    ];
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
      'itemName: ' + itemName + ' isLost: ' + isLost + ' images: ' + images + ' postID: ' + postID,
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

  createPost(
    itemName,
    isLost,
    images,
    location,
    date,
    time,
    itemDesc,
    category,
    listedBy,
  ) {
    const isResolved = false;
    console.log('itemName:' + itemName + ' isLost' + isLost);
  }
}
