import {Component} from 'react';

export default class ReportsController extends Component {
  constructor(dataC, postC) {
    super(dataC);
    this.dataController = dataC;
    this.postController = postC;
  }

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
