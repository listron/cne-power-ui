import Immutable from 'immutable';
import { othersAction } from './othersAction';

const initState = Immutable.fromJS({
  loading: false,
  newPhoneNum: '',//新手机号
  sendCode: false,//验证码
  error: {},
})

const othersReducer = (state = initState, action) => {
  switch (action.type) {
    case othersAction.OTHERS_FETCH :
      return state.set('loading', true)
    case othersAction.CHANGE_OTHERS_STORE:
      return state.merge(Immutable.fromJS(action.payload))
    case othersAction.GET_OTHERS_FETCH_SUCCESS:
      return state.merge(Immutable.fromJS(action.payload)).set('loading', false)
    case othersAction.SEND_CODE_SUCCESS:
      return state.set('loading', false)
                  .set('newPhoneNum', action.payload.newPhoneNum);
    case othersAction.PHONE_CODE_REGISTER_FAIL:
      return state.set('loading', false)
                  .set('error', Immutable.fromJS(action.data));
  }
  return state;
}

export default othersReducer;