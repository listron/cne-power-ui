import keyMirror from 'keymirror';

module.exports = {
  Action: keyMirror({
    GET_DEFECT_LIST_SAGA: null,
    GET_DEFECT_LIST_SUCCESS: null,
    GET_DEFECT_LIST_FAIL: null,
  })
};