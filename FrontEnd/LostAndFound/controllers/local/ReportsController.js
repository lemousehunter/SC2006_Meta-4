import {Component} from 'react';

/**
 * A controller class for managing reports.
 */
export default class ReportsController extends Component {
  
  /**
   * Constructs a new ReportsController object.
   * 
   * @param dataC The data controller used to interact with the backend API.
   * @param postC The post controller used to manage posts.
   */
  constructor(dataC, postC) {
    super(dataC);
    this.dataController = dataC;
    this.postController = postC;
  }

  /**
   * Creates a new report and submits it to the backend API.
   *
   * @param postID The ID of the post being reported.
   * @param creatorID The ID of the user creating the report.
   * @param reason The reason for reporting the post.
   * @return A Promise that resolves to the report object returned by the API.
   */
  createReport = async (postID, creatorID, reason) => {
    console.log('reporting: ', postID);
    console.log('currentUser:', creatorID);
    const post = await this.postController.getPostByID(postID).then(res => {
      return res;
    });
    console.log('postCreateReport:', JSON.stringify(post));
    const type = post.isLost ? 'Lost' : 'Found';
    const body = {
      sender: creatorID,
      recipient: post.listedBy.id,
      post: postID,
      title: type + ' ' + post.itemName,
      description: reason,
    };
    const response = await this.dataController
      .post('reports/', body)
      .then(res => {
        return res.data;
      });
    return response;
  };
  
  /**
   * Retrieves all reports for a given recipient from the backend API.
   *
   * @param recipientID The ID of the recipient user.
   * @return A Promise that resolves to an array of report objects returned by the API.
   */
  getReportsByRecipient = async recipientID => {
    console.log('getting reports by recipient...');
    const reports = await this.dataController
      .get('users/userreportsreceived/' + recipientID)
      .then(res => {
        return res.data;
      });
    console.log('reportIDs are:', JSON.stringify(reports.data));
    const _reports = [];
    for (let i = 0; i < reports.length; i++) {
      const report = await this.dataController
        .get('reports/' + reports[i])
        .then(res => {
          console.log('reports are:', JSON.stringify(res.data));
          return res.data;
        });
      _reports.push(report);
    }
    return _reports;
  };
}
