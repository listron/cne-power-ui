import keyMirror from 'keymirror';

module.exports = {
  ticketAction: keyMirror({
    //ticket
    TICKET_FETCH: null,
    CHANGE_SHOW_CONTAINER_SAGA: null,
    CHANGE_SHOW_CONTAINER: null,

    //Defect
    CHANGE_DEFECT_STORE_SAGA: null,
    CHANGE_DEFECT_STORE: null,
    CLEAR_DEFECT_STATE_SAGA: null,
    CLEAR_DEFECT_STATE: null,
    GET_DEFECT_FETCH_SUCCESS: null,
    GET_DEFECT_LIST_SAGA: null,
    GET_DEFECT_ID_LIST_SAGA: null,
    GET_DEFECT_DETAIL_SAGA: null,
    GET_DEFECT_LANGUAGE_SAGA: null,
    GET_DEFECT_TYPE_SAGA: null,
    DEFECT_CREATE_SAGA: null,
    SUBMIT_DEFECT_SAGA: null,
    SET_DEFECT_FAIL: null,

    //Batch operation
    DELETE_BATCH_DEFECT_SAGA: null,
    SEND_BATCH_DEFECT_SAGA: null,
    REJECT_BATCH_DEFECT_SAGA: null,
    CLOSE_BATCH_DEFECT_SAGA: null,
    CHECK_BATCH_DEFECT_SAGA: null,
    //Operation
    SEND_DEFECT_SAGA: null,
    REJECT_DEFECT_SAGA: null,
    CLOSE_DEFECT_SAGA: null,
    HANDLE_DEFECT_SAGA: null,
    CHECK_DEFECT_SAGA: null,
    
    //Inspaect
    CHANGE_INSPECT_STORE: null,
    CHANGE_INSPECT_STORE_SAGA: null,
    CLEAR_INSPECT_STATE_SAGA: null,
    CLEAR_INSPECT_STATE: null,
    GET_INSPECT_FETCH_SUCCESS: null,
    GET_INSPECT_LIST_SAGA: null,
    GET_INSPECT_ID_LIST_SAGA: null,
    GET_INSPECT_DETAIL_SAGA: null,
    GET_INSPECT_STANDARD_SAGA: null,

    ADD_INSPECT_ABNORMAL_SAGA: null,
    SET_INSPECT_CHECK_SAGA: null,
    FINISH_INSPECT_SAGA: null,
    CREATE_INSPECT_SAGA: null,
    DELETE_ABNORMAL_SAGA: null,
    CHECK_BATCH_INSPECT_SAGA: null,
    TRANSFORM_DEFECT_SAGA: null,
    SET_INSPECT_FAIL: null,
  })
};
