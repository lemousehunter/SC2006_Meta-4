import React from 'react';

export default class DataController extends React.Component {
  constructor(url) {
    super(url);
    this.url = url + 'api/';
    this.sessionToken = null;
  }

  getHeader() {
    if (this.state.token == null) {
      return {
        'Content-type': 'application/json',
        Accept: 'application/json',
      };
    } else {
      return {
        Authorization: 'Bearer ' + this.sessionToken,
        'Content-type': 'application/json',
        Accept: 'application/json',
      };
    }
  }

  setToken(token) {
    this.token = token;
  }

  async baseRequest(route, type, data, _route, contentType, boundary) {
    let url = '';
    if (_route !== undefined) {
      url = _route;
    } else {
      url = this.url + route;
    }

    if (contentType === 'multipart/form-data') {
      const req = {
        method: type,
        headers: {
          Authorization: 'Bearer ' + this.sessionToken,
          Accept: 'application/json',
        },
        body: JSON.stringify(data),
      };
      console.log('req: ' + JSON.stringify(req));

      console.log('full url is: ' + this.url + route);
      return await fetch(url, req)
        .then(result => {
          console.log('baseReqResult: ' + JSON.stringify(result));
          return result.json().then(_data => {
            return {
              data: _data,
              status: result.status,
            };
          });
        })
        .catch(error => {
          console.log('baseReqError: ');
          console.log(error);
        });
    } else {
      const req = {
        method: type,
        headers: {
          Authorization: 'Bearer ' + this.sessionToken,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(data),
      };
      console.log('req: ' + JSON.stringify(req));

      console.log('full url is: ' + this.url + route);
      return await fetch(url, req)
        .then(result => {
          console.log('baseReqResult: ' + JSON.stringify(result));
          return result.json().then(_data => {
            return {
              data: _data,
              status: result.status,
            };
          });
        })
        .catch(error => {
          console.log('baseReqError: ');
          console.log(error);
        });
    }
  }

  async get(route) {
    return await this.baseRequest(route, 'Get')
      .then(res => {
        console.log(
          'data:' + JSON.stringify(res.data) + ' status:' + res.status,
        );
        return res;
      })
      .catch(error => {
        console.log('baseReqError: ');
        console.log(error);
      });
  }

  async post(route, data, contentType, boundary) {
    const postRes = await this.baseRequest(
      route,
      'Post',
      data,
      undefined,
      contentType,
      boundary,
    )
      .then(res => {
        console.log('postRes:' + JSON.stringify(res));
        return res;
      })
      .catch(error => console.log('postError' + JSON.stringify(error)));
    return postRes;
  }
}
