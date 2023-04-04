import React from 'react';

export default class DataController extends React.Component {
  constructor(url) {
    super(url);
    this.url = url + 'api/';
    this.sessionToken = null;

    this.state = {token: null};
  }

  getHeader() {
    if (this.state.token === null) {
      return {
        'Content-type': 'application/json',
        'Accept': 'application/json',
      };
    } else {
      return {
        Authorization: 'Bearer ' + this.sessionToken,
        'Content-type': 'application/json',
        'Accept': 'application/json',
      };
    }
  }

  setToken(token) {
    this.setState({token: token});
  }

  async baseRequest(route, type, data) {
    const req = {
      method: type,
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    };
    console.log('req: ' + JSON.stringify(req));
    const url = this.url + route;
    console.log('full url is: ' + this.url + route);
    return await fetch(url, req)
      .then(result => {
        console.log('baseReqResult: ' + JSON.stringify(result));
        return result
          .json()
          .then(_data => {
            return {
              data: _data,
              status: result.status,
            };
          })
          .then(res => {
            console.log(
              'data:' + JSON.stringify(res.data) + ' status:' + res.status,
            );
            return res;
          });
      })
      .catch(error => {
        console.log('baseReqError: ');
        console.log(error);
      });
  }

  async get(route, data) {
    return await this.baseRequest(route, 'Get', data)
      .then(res => res.json())
      .catch(error => console.log('getError: ' + JSON.stringify(error)));
  }

  post(route, data) {
    const postRes = this.baseRequest(route, 'Post', data)
      .then(res => {
        console.log('postRes:' + JSON.stringify(res));
        return res;
      })
      .catch(error => console.log('postError' + JSON.stringify(error)));
    return postRes;
  }
}
