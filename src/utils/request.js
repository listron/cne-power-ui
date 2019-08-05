
import axios from 'axios';

const query = (options = {}) => axios({
  method: 'get',
  ...options,
  headers: {
    'Authorization': 'bearer ' + (localStorage.getItem('authData') || ''),
    ...options.headers,
  },
}).then(data => data.data || {});

const request = (options) => query(options);

request.get = (url, options = {}) => query({ url, ...options });

request.post = (url, data = {}, options = {}) => query({
  method: 'post',
  url,
  data,
  ...options,
});

request.put = (url, data = {}, options = {}) => query({
  method: 'put',
  url,
  data,
  ...options,
});

request.delete = (url, data = {}, options = {}) => query({
  url,
  method: 'delete',
  data,
  ...options,
});

request.download = (url, data = {}, options = {}) => query({ // 下载。
  url,
  responseType: 'blob',
  data,
  method: 'post',
  ...options,
}).then(data => data.data);

export default request;

