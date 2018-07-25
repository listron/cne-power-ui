import keyMirror from 'keymirror';

module.exports = {
  TicketAction: keyMirror({
    TICKET_FETCH: null,
    //Defect
    GET_DEFECT_LIST_SAGA: null,
    GET_DEFECT_LIST_SUCCESS: null,
    GET_DEFECT_LIST_FAIL: null,
    //Batch operation --1122
    DELETE_BATCH_DEFECT_SAGA: null,
    DELETE_BATCH_DEFECT_FAIL: null,
    SEND_BATCH_DEFECT_SAGA: null,
    SEND_BATCH_DEFECT_FAIL: null,
    REJECT_BATCH_DEFECT_SAGA: null,
    REJECT_BATCH_DEFECT_FAIL: null,
    CLOSE_BATCH_DEFECT_SAGA: null,
    CLOSE_BATCH_DEFECT_FAIL: null,
    CHECK_BATCH_DEFECT_SAGA: null,
    CHECK_BATCH_DEFECT_FAIL: null,
    //Operation
    SEND_DEFECT_SAGA: null,
    SEND_DEFECT_FAIL: null,
    REJECT_DEFECT_SAGA: null,
    REJECT_DEFECT_FAIL: null,
    CLOSE_DEFECT_SAGA: null,
    CLOSE_DEFECT_FAIL: null,
    HANDLE_DEFECT_SAGA: null,
    HANDLE_DEFECT_FAIL: null,
    CHECK_DEFECT_SAGA: null,
    CHECK_DEFECT_FAIL: null,

    SET_DEFECT_ID_SAGA: null,
    SET_DEFECT_ID: null,
    SET_SELECTED_DEFECT_SAGA: null,
    SET_SELECTED_DEFECT: null,
    CHANGE_SHOW_CONTAINER_SAGA: null,
    CHANGE_SHOW_CONTAINER: null,

    GET_DEFECT_DETAIL_SAGA: null,
    GET_DEFECT_DETAIL_SUCCESS: null,
    GET_DEFECT_DETAIL_FAIL: null,
    GET_DEFECT_LANGUAGE_SAGA: null,
    GET_DEFECT_LANGUAGE_SUCCESS: null,
    GET_DEFECT_LANGUAGE_FAIL: null,
    GET_DEFECTTYPES_SAGA: null,
    GET_DEFECTTYPES_SAGA_SUCCESS: null,
    GET_DEFECTTYPES_SAGA_FAIL: null,
    DEFECT_CREATE_SAGA: null,
    DEFECT_CREATE_FAIL: null,
    CLEAR_DEFECT_STATE_SAGA: null,
    CLEAR_DEFECT_STATE: null,
    //Inspaect
    GET_INSPECT_LIST_SAGA: null,
    GET_INSPECT_LIST_SUCCESS: null,
    GET_INSPECT_LIST_FAIL: null,
    SET_INSPECT_ID_SAGA: null,
    SET_INSPECT_ID: null,
    GET_INSPECT_DETAIL_SAGA: null,
    GET_INSPECT_DETAIL_SUCCESS: null,
    GET_INSPECT_DETAIL_FAIL: null,
    ADD_INSPECT_ABNORMAL_SAGA: null,
    ADD_INSPECT_ABNORMAL_FAIL: null,
    CLEAR_INSPECT_STATE_SAGA: null,
    CLEAR_INSPECT_STATE: null,
    SET_INSPECT_CHECK_SAGA: null,
    SET_INSPECT_CHECK_SUCCESS: null,
    SET_INSPECT_CHECK_FAIL: null,
    FINISH_INSPECT_SAGA: null,
    FINISH_INSPECT_FAIL: null,
    CREATE_INSPECT_SAGA: null,
    CREATE_INSPECT_SUCCESS: null,
    CREATE_INSPECT_FAIL: null,
    DELETE_ABNORMAL_SAGA: null,
    DELETE_ABNORMAL_SUCCESS: null,
    DELETE_ABNORMAL_FAIL: null,
    GET_INSPECT_STANDARD_SAGA: null,
    GET_INSPECT_STANDARD_SUCCESS: null,
    GET_INSPECT_STANDARD_FAIL: null,
    INSPECT_CHECK_BATCH_SAGA: null,
    INSPECT_CHECK_BATCH_SUCCESS: null,
    INSPECT_CHECK_BATCH_FAIL: null,
    TRANSFORM_DEFECT_SAGA: null,
    TRANSFORM_DEFECT_FAIL: null,
  })
};
