import React from 'react';

/**
A class that controls data communication with a remote API
@param {string} url - The base URL of the API to communicate with
*/
export default class DataController extends React.Component {
  /**
Constructs a new DataController object with the given base URL for the API.
@param {string} url - The base URL of the API.
*/
  constructor(url) {
    super(url);
    this.url = url + 'api/';
    this.sessionToken = null;
  }

  /**
Returns the headers for a request, including an authorization header if a session token is set.
@returns {Object} - The headers for a request.
*/
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

  /**
Sets the session token for the DataController object.
@param {string} token - The token to set.
*/
  setToken(token) {
    this.token = token;
  }

  /**
Makes a base request to the API with the given route, request type, and data.
@param {string} route - The route to make the request to.
@param {string} type - The type of request to make (e.g. 'Get', 'Put', 'Delete', or 'Post').
@param {Object} data - The data to include in the request.
@param {string} _route - (Optional) The full URL of the route to make the request to .
@param {string} contentType - The content type of the request .
@param {string} boundary - The boundary to use for multipart/form-data requests.
@returns {Promise<Object>} - A Promise that resolves to the response data from the API.
*/
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
        body: data,
      };
      console.log('req: ');
      console.log(req);

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

  /**
 * Sends a GET request to the API server with the specified route.
 *
 * @param route The endpoint to send the GET request to.
 * @return A Promise that resolves to an object containing the data and status of the response.
 */
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

  /**
 * Sends a PUT request to the API with the specified data for the given route.
 *
 * @param route         The route of the API endpoint to send the request to.
 * @param data          The data to send in the request body.
 * @param contentType   The content type of the data being sent'.
 * @param boundary      The boundary string used to separate parts of the data being sent.
 * @return              A Promise that resolves with an object containing the response data and status code, or rejects with an error.
 */
  async put(route, data, contentType, boundary) {
    return await this.baseRequest(
      route,
      'Put',
      data,
      undefined,
      contentType,
      boundary,
    )
      .then(res => {
        console.log('putRes:' + JSON.stringify(res));
        return res;
      })
      .catch(error => console.log('putError' + JSON.stringify(error)));
  }

  /**
 * Sends a DELETE request to the API server with the specified route.
 *
 * @param route the endpoint to send the DELETE request to
 * @return a Promise that resolves to an object containing the response data and status code
 * @throws Error if there is an error while sending the request
 */
  async del(route) {
    console.log('dataC post del called');
    return await this.baseRequest(route, 'Delete')
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

  /**
 * Sends a POST request to the specified route with the provided data and content type..
 *
 * @param route the API endpoint to send the request to
 * @param data the data to send in the request body
 * @param contentType the content type of the request
 * @param boundary the boundary to use
 * @return a Promise that resolves to the response object with the data and status code of the request
 */
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
