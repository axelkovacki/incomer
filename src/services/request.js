const axios = require('axios');

const httpMethods = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH'];

const headersPass = ({ domain, endpoint, method }) => {
  if(!domain || !endpoint || !method) {
    return false;
  }

  let isHttpMethod = httpMethods.filter((item) => item === method);

  if(isHttpMethod.length === 0) {
    return false;
  }
  
  return true;
}

const make = async ({ domain, authorization, method, endpoint, data }) => {

  // Set default settings for Axios.
  axios.defaults.baseURL = domain;

  if (authorization) {
    axios.defaults.headers.common['Authorization'] = authorization;
  }

  if(!headersPass({ domain, method, endpoint })) {
    return {
      success: false,
      data: 'FAIL TO PASS HTTP TEST'
    };
  }

  if(method === 'GET') {
    try {
      const { data } = await axios.get(endpoint);

      return {
        success: true,
        data: data
      };
    } catch(err) {
      console.log(err)
      return {
        success: false,
        data: err.response
      };
    }
  }

  if(method === 'POST') {
    try {
      const { data } = await axios.post(endpoint, data);
      
      return {
        success: true,
        data: data
      };
    } catch(err) {
      return {
        success: false,
        data: err.response
      };
    }
  }

  return {
    success: false,
    data: 'THE METHOD IS NOT AVAILABLE IN THIS MOMENT'
  };
}

module.exports = { make };