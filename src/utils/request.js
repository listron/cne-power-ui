/**
 * Created by wangyuqi on 2018/6/12.
 */
/**
 * React Fatch网络请求工具类
 * Songlcy create
 * params:请求参数
 * ES6 Promise 使用
 * resolve 成功时候返回
 * reject 失败时候返回
 */

import 'whatwg-fetch';

/**
 * 将对象转成 a=1&b=2的形式
 * @param obj 对象
 */
function obj2String(obj, arr = [], idx = 0) {
  for (let item in obj) {
    arr[idx++] = [item, obj[item]]
  }
  return new URLSearchParams(arr).toString()
}

function request(method, url, body) {
  let headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  method = method.toUpperCase();
  if (method === 'GET') {
    body = undefined;
    url += '?' + obj2String(body);
  } else {
    body = body && JSON.stringify(body);
  }
  let fetchObj = {
    method: method,
    headers,
    mode: 'cors',
    // credentials: 'include',
    body: body
  };
  return new Promise((resolve, reject) => {
    fetch(url, fetchObj)
      .then((response) => {
        if (response.ok) {  
          return response.json();  
        } else {  
          reject({status:response.status})  
        }  
      })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  });
}

export const get = (path, body) => request('GET', path, body);
export const post = (path, body) => request('POST', path, body);


