
export const ticketAction = {
    //ticket
    TICKET_FETCH: Symbol('TICKET_FETCH'),
    CHANGE_SHOW_CONTAINER_SAGA: Symbol('CHANGE_SHOW_CONTAINER_SAGA'),
    CHANGE_SHOW_CONTAINER: Symbol('CHANGE_SHOW_CONTAINER'),

    //Defect
    CHANGE_DEFECT_STORE_SAGA: Symbol('CHANGE_DEFECT_STORE_SAGA'),
    CHANGE_DEFECT_STORE: Symbol('CHANGE_DEFECT_STORE'),
    CLEAR_DEFECT_STATE_SAGA: Symbol('CLEAR_DEFECT_STATE_SAGA'),
    CLEAR_DEFECT_STATE: Symbol('CLEAR_DEFECT_STATE'),
    GET_DEFECT_FETCH_SUCCESS: Symbol('GET_DEFECT_FETCH_SUCCESS'),
    GET_DEFECT_LIST_SAGA: Symbol('GET_DEFECT_LIST_SAGA'),
    GET_DEFECT_ID_LIST_SAGA: Symbol('GET_DEFECT_ID_LIST_SAGA'),
    GET_DEFECT_DETAIL_SAGA: Symbol('GET_DEFECT_DETAIL_SAGA'),
    GET_DEFECT_LANGUAGE_SAGA: Symbol('GET_DEFECT_LANGUAGE_SAGA'),
    GET_DEFECT_TYPE_SAGA: Symbol('GET_DEFECT_TYPE_SAGA'),
    DEFECT_CREATE_SAGA: Symbol('DEFECT_CREATE_SAGA'),
    SUBMIT_DEFECT_SAGA: Symbol('SUBMIT_DEFECT_SAGA'),
    SET_DEFECT_FAIL: Symbol('SET_DEFECT_FAIL'),
   
    //Batch operation
    DELETE_BATCH_DEFECT_SAGA: Symbol('DELETE_BATCH_DEFECT_SAGA'),
    SEND_BATCH_DEFECT_SAGA: Symbol('SEND_BATCH_DEFECT_SAGA'),
    REJECT_BATCH_DEFECT_SAGA: Symbol('REJECT_BATCH_DEFECT_SAGA'),
    CLOSE_BATCH_DEFECT_SAGA: Symbol('CLOSE_BATCH_DEFECT_SAGA'),
    CHECK_BATCH_DEFECT_SAGA: Symbol('CHECK_BATCH_DEFECT_SAGA'),
    //Operation
    SEND_DEFECT_SAGA: Symbol('SEND_DEFECT_SAGA'),
    REJECT_DEFECT_SAGA: Symbol('REJECT_DEFECT_SAGA'),
    CLOSE_DEFECT_SAGA: Symbol('CLOSE_DEFECT_SAGA'),
    HANDLE_DEFECT_SAGA: Symbol('HANDLE_DEFECT_SAGA'),
    CHECK_DEFECT_SAGA: Symbol('CHECK_DEFECT_SAGA'),
    
    //Inspaect
    CHANGE_INSPECT_STORE: Symbol('CHANGE_INSPECT_STORE'),
    CHANGE_INSPECT_STORE_SAGA: Symbol('CHANGE_INSPECT_STORE_SAGA'),
    CLEAR_INSPECT_STATE_SAGA: Symbol('CLEAR_INSPECT_STATE_SAGA'),
    CLEAR_INSPECT_STATE: Symbol('CLEAR_INSPECT_STATE'),
    GET_INSPECT_FETCH_SUCCESS: Symbol('GET_INSPECT_FETCH_SUCCESS'),
    GET_INSPECT_LIST_SAGA: Symbol('GET_INSPECT_LIST_SAGA'),
    GET_INSPECT_ID_LIST_SAGA: Symbol('GET_INSPECT_ID_LIST_SAGA'),
    GET_INSPECT_DETAIL_SAGA: Symbol('GET_INSPECT_DETAIL_SAGA'),
    GET_INSPECT_STANDARD_SAGA: Symbol('GET_INSPECT_STANDARD_SAGA'),

    ADD_INSPECT_ABNORMAL_SAGA: Symbol('ADD_INSPECT_ABNORMAL_SAGA'),
    SET_INSPECT_CHECK_SAGA: Symbol('SET_INSPECT_CHECK_SAGA'),
    FINISH_INSPECT_SAGA: Symbol('FINISH_INSPECT_SAGA'),
    CREATE_INSPECT_SAGA: Symbol('CREATE_INSPECT_SAGA'),
    DELETE_ABNORMAL_SAGA: Symbol('DELETE_ABNORMAL_SAGA'),
    CHECK_BATCH_INSPECT_SAGA: Symbol('CHECK_BATCH_INSPECT_SAGA'),
    TRANSFORM_DEFECT_SAGA: Symbol('TRANSFORM_DEFECT_SAGA'),
    SET_INSPECT_FAIL: Symbol('SET_INSPECT_FAIL'),
    getInspectDetailRecord: Symbol('getInspectDetailRecord'),
    



};
