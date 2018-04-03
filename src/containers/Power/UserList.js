import { connect } from 'react-redux';
import axios from 'axios';

import UserList from '../../components/Power/UserList';

import {
  GET_USERS_SUCESS,
  GET_USERS_FAIL
} from '../../constants/actionTypes';

import {
  GET_USERS_URL
} from '../../constants/url';

const mapStateToProps = (state) => ({
  // users: state.users   // 合并的reducer
  users: state.users.users    // 单独的reducer
});

const mapDispatchToProps = (dispatch) => ({
  fetchUsers: () => {
    dispatch(() => {
      axios.get(GET_USERS_URL)
        .then((response) => {
          dispatch({ type: GET_USERS_SUCESS, users: response.data })
        })
        .catch((error) => {
          dispatch({ type: GET_USERS_FAIL, error })
        })
    })
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(UserList);