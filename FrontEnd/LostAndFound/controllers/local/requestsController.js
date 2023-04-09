import {Component} from 'react';

/**
 * A controller class for managing requests related to posts and users.
 */
export default class RequestsController extends Component {

  /**
   * Constructor for creating a new instance of the RequestsController.
   *
   * @param dataC The data controller used to manage data.
   * @param postC The posts controller used to manage posts.
   * @param loginC The login controller used to manage user authentication.
   */
  constructor(dataC, postC, loginC) {
    super(dataC, loginC);
    this.dataController = dataC;
    this.postsController = postC;
    this.loginController = loginC;
  }

  /**
   * Submits a request for a post with the given ID from a user with the given ID.
   *
   * @param postID The ID of the post to request.
   * @param submittedID The ID of the user submitting the request.
   * @return A promise that resolves with the result of the request submission.
   */
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

  /**
   * Processes a request with the given ID and state.
   *
   * @param requestID The ID of the request to process.
   * @param state The new state of the request.
   * @return A promise that resolves with the result of the request processing.
   */
  async processRequest(requestID, state) {
    console.log('processing requests');
    return await this.dataController
      .put('requests/' + requestID, {state: state})
      .then(res => {
        return res;
      });
  }

  /**
   * Gets all requests made to a user with the given ID.
   *
   * @param recipientID The ID of the user to get requests for.
   * @return A promise that resolves with an array of request objects.
   */
  async getRequestsByRecipient(recipientID) {
    console.log('getting requests by recipientID....');
    return await this.dataController
      .get('users/receivedrequests/' + recipientID)
      .then(res => {
        return res.data;
      });
  }

  /**
   * Validates a request made by a user with the given ID for a post with the given ID.
   *
   * @param senderID The ID of the user who made the request.
   * @param postID The ID of the post to validate the request for.
   * @return A promise that resolves with a boolean indicating whether the request is valid.
   */
  async validateRequest(senderID, postID) {
    console.log(postID);
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
