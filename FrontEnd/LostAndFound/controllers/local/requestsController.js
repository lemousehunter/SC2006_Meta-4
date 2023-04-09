import {Component} from 'react';

export default class RequestsController extends Component {
  constructor(dataC, postC, loginC) {
    super(dataC, loginC);
    this.dataController = dataC;
    this.postsController = postC;
    this.loginController = loginC;
  }

  async submitRequest(postID, submittedID) {
    const post = await this.postsController.getPostByID(postID).then(_p => {
      return _p;
    });
    console.log('resquestPost:', JSON.stringify(post));
    const body = {
      sender: submittedID,
      recipient: post.listedBy.id,
      postID: postID,
      isLost: post.isLost,
    };
    return await this.dataController
      .post('requests/' + postID, body)
      .then(res => {
        console.log('requestCSubmitRes:', res);
        return res;
      });
  }

  async processRequest(requestID, state) {
    console.log('processing requests');
    return await this.dataController
      .put('requests/' + requestID, {state: state})
      .then(res => {
        return res;
      });
  }

  async getRequestsByRecipient(recipientID) {
    console.log('getting requests by recipientID....');
    return await this.dataController
      .get('users/receivedrequests/' + recipientID)
      .then(res => {
        return res.data;
      });
  }

  async validateRequest(senderID, postID) {
    console.log('validating requests...');
    console.log(senderID);
    return await this.dataController
      .post('requests/validate/' + postID, {user: senderID})
      .then(res => {
        console.log('validateRequest:', res);
        return res.data.check;
      });
  }
}
