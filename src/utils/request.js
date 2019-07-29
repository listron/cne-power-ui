
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

request.get = (options) => query(options);

request.post = (options) => query({
  method: 'post',
  ...options,
});

request.put = (options) => query({
  method: 'put',
  ...options,
});

request.delete = (options) => query({
  method: 'delete',
  ...options,
});

request.download = (options) => query({ // 下载。
  responseType: 'blob',
  method: 'post',
  ...options,
}).then(data => data.data);

export default request;

