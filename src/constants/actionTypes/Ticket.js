import keyMirror from 'keymirror';



module.exports = {

  Action: keyMirror({
    GET_DEFECT_LIST_SAGA: null,
    GET_DEFECT_LIST_SUCCESS: null,
    GET_DEFECT_LIST_FAIL: null,
  })
};
export const TICKET_FETCH = 'TICKET_FETCH';

// 缺陷
export const GET_DEFECT_LIST_SAGA = 'GET_DEFECT_LIST_SAGA';
export const GET_DEFECT_LIST_SUCCESS = 'GET_DEFECT_LIST_SUCCESS';
export const GET_DEFECT_LIST_FAIL = 'GET_DEFECT_LIST_FAIL';

export const DELETE_BATCH_DEFECT_SAGA = 'DELETE_BATCH_DEFECT_SAGA';
export const DELETE_BATCH_DEFECT_FAIL = 'DELETE_BATCH_DEFECT_FAIL';

export const SEND_BATCH_DEFECT_SAGA = 'SEND_BATCH_DEFECT_SAGA';
export const SEND_BATCH_DEFECT_FAIL = 'SEND_BATCH_DEFECT_FAIL';

export const REJECT_BATCH_DEFECT_SAGA = 'REJECT_BATCH_DEFECT_SAGA';
export const REJECT_BATCH_DEFECT_FAIL = 'REJECT_BATCH_DEFECT_FAIL';

export const CLOSE_BATCH_DEFECT_SAGA = 'CLOSE_BATCH_DEFECT_SAGA';
export const CLOSE_BATCH_DEFECT_FAIL = 'CLOSE_BATCH_DEFECT_FAIL';

export const CHECK_BATCH_DEFECT_SAGA = 'CHECK_BATCH_DEFECT_SAGA';
export const CHECK_BATCH_DEFECT_FAIL = 'CHECK_BATCH_DEFECT_FAIL';

export const SEND_DEFECT_SAGA = 'SEND_DEFECT_SAGA';
export const SEND_DEFECT_FAIL = 'SEND_DEFECT_FAIL';

export const REJECT_DEFECT_SAGA = 'REJECT_DEFECT_SAGA';
export const REJECT_DEFECT_FAIL = 'REJECT_DEFECT_FAIL';

export const CLOSE_DEFECT_SAGA = 'CLOSE_DEFECT_SAGA';
export const CLOSE_DEFECT_FAIL = 'CLOSE_DEFECT_FAIL';

export const HANDLE_DEFECT_SAGA = 'HANDLE_DEFECT_SAGA';
export const HANDLE_DEFECT_FAIL = 'HANDLE_DEFECT_FAIL';

export const CHECK_DEFECT_SAGA = 'CHECK_DEFECT_SAGA';
export const CHECK_DEFECT_FAIL = 'CHECK_DEFECT_FAIL';

export const SET_DEFECT_ID_SAGA = 'SET_DEFECT_ID_SAGA';
export const SET_DEFECT_ID = 'SET_DEFECT_ID';

export const SET_SELECTED_DEFECT_SAGA = 'SET_SELECTED_DEFECT_SAGA';
export const SET_SELECTED_DEFECT= 'SET_SELECTED_DEFECT';

export const CHANGE_SHOW_CONTAINER_SAGA = 'CHANGE_SHOW_CONTAINER_SAGA';
export const CHANGE_SHOW_CONTAINER = 'CHANGE_SHOW_CONTAINER';

export const GET_DEFECT_DETAIL_SAGA = 'GET_DEFECT_DETAIL_SAGA';
export const GET_DEFECT_DETAIL_SUCCESS = 'GET_DEFECT_DETAIL_SUCCESS';
export const GET_DEFECT_DETAIL_FAIL = 'GET_DEFECT_DETAIL_FAIL';

export const GET_LANGUAGE_SAGA = 'GET_LANGUAGE_SAGA';
export const GET_LANGUAGE_SUCCESS = 'GET_LANGUAGE_SUCCESS';
export const GET_LANGUAGE_FAIL = 'GET_LANGUAGE_FAIL';

export const GET_DEFECTTYPES_SAGA = 'GET_DEFECTTYPES_SAGA';
export const GET_DEFECTTYPES_SAGA_SUCCESS = 'GET_DEFECTTYPES_SAGA_SUCCESS';
export const GET_DEFECTTYPES_SAGA_FAIL = 'GET_DEFECTTYPES_SAGA_FAIL';

export const DEFECT_CREATE_SAGA = 'DEFECT_CREATE_SAGA';
export const DEFECT_CREATE_SAGA_SUCCESS = 'DEFECT_CREATE_SAGA_SUCCESS';
export const DEFECT_CREATE_SAGA_FAIL = 'DEFECT_CREATE_SAGA_FAIL';

export const GET_DEFECT_LANGUAGE_SAGA = 'GET_DEFECT_LANGUAGE_SAGA';
export const GET_DEFECT_LANGUAGE_SUCCESS = 'GET_DEFECT_LANGUAGE_SUCCESS';
export const GET_DEFECT_LANGUAGE_FAIL = 'GET_DEFECT_LANGUAGE_FAIL';

export const CLEAR_DEFECT_STATE_SAGA = 'CLEAR_DEFECT_STATE_SAGA';
export const CLEAR_DEFECT_STATE = 'CLEAR_DEFECT_STATE';

export const TRANSFORM_DEFECT_SAGA = 'TRANSFORM_DEFECT_SAGA';
export const TRANSFORM_DEFECT_SUCCESS = 'TRANSFORM_DEFECT_SUCCESS';
export const TRANSFORM_DEFECT_FAIL = 'TRANSFORM_DEFECT_FAIL';

// 巡检
export const GET_INSPECT_LIST_SAGA = 'GET_INSPECT_LIST_SAGA';
export const GET_INSPECT_LIST_SUCCESS = 'GET_INSPECT_LIST_SUCCESS';
export const GET_INSPECT_LIST_FAIL = 'GET_INSPECT_LIST_FAIL';

export const SET_INSPECT_ID_SAGA = 'SET_INSPECT_ID_SAGA';
export const SET_INSPECT_ID = 'SET_INSPECT_ID';
export const GET_INSPECT_DETAIL_SAGA = 'GET_INSPECT_DETAIL_SAGA';
export const GET_INSPECT_DETAIL_SUCCESS = 'GET_INSPECT_DETAIL_SUCCESS';
export const GET_INSPECT_DETAIL_FAIL = 'GET_INSPECT_DETAIL_FAIL';

export const ADD_INSPECT_ABNORMAL_SAGA = 'ADD_INSPECT_ABNORMAL_SAGA';
export const ADD_INSPECT_ABNORMAL_SUCCESS = 'ADD_INSPECT_ABNORMAL_SUCCESS';
export const ADD_INSPECT_ABNORMAL_FAIL = 'ADD_INSPECT_ABNORMAL_FAIL';

export const CLEAR_INSPECT_STATE_SAGA = 'CLEAR_INSPECT_STATE_SAGA';
export const CLEAR_INSPECT_STATE = 'CLEAR_INSPECT_STATE';

export const SET_INSPECT_CHECK_SAGA = 'SET_INSPECT_CHECK_SAGA';
export const SET_INSPECT_CHECK_SUCCESS = 'SET_INSPECT_CHECK_SUCCESS';
export const SET_INSPECT_CHECK_FAIL = 'SET_INSPECT_CHECK_FAIL';

export const FINISH_INSPECT_SAGA = 'FINISH_INSPECT_SAGA';
export const FINISH_INSPECT_SUCCESS = 'FINISH_INSPECT_SUCCESS';
export const FINISH_INSPECT_FAIL = 'FINISH_INSPECT_FAIL';

export const CREATE_INSPECT_SAGA = 'CREATE_INSPECT_SAGA';
export const CREATE_INSPECT_SUCCESS = 'CREATE_INSPECT_SUCCESS';
export const CREATE_INSPECT_FAIL = 'CREATE_INSPECT_FAIL';

export const DELETE_ABNORMAL_SAGA = 'DELETE_ABNORMAL_SAGA';
export const DELETE_ABNORMAL_SUCCESS = 'DELETE_ABNORMAL_SUCCESS';
export const DELETE_ABNORMAL_FAIL = 'DELETE_ABNORMAL_FAIL';

  
export const GET_INSPECT_STANDARD_SAGA = 'GET_INSPECT_STANDARD_SAGA';
export const GET_INSPECT_STANDARD_SUCCESS = 'GET_INSPECT_STANDARD_SUCCESS';
export const GET_INSPECT_STANDARD_FAIL = 'GET_INSPECT_STANDARD_FAIL';

export const INSPECT_CHECK_BATCH_SAGA = 'INSPECT_CHECK_BATCH_SAGA';
export const INSPECT_CHECK_BATCH_SUCCESS = 'INSPECT_CHECK_BATCH_SUCCESS';
export const INSPECT_CHECK_BATCH_FAIL = 'INSPECT_CHECK_BATCH_FAIL';