import { connect } from 'react-redux';
import axios from 'axios';

import { GET_POSTS_SAGA } from '../../constants/actionTypes';
import PostList from '../../components/Power/PostList';

const mapStateToProps = (state) => ({
  // posts: state.posts   // 合并的reducer
  posts: state.posts.posts    // 单独的reducer
});

const mapDispatchToProps = (dispatch) => ({
  fetchPosts: () => dispatch({ type: GET_POSTS_SAGA })
});

export default connect(mapStateToProps, mapDispatchToProps)(PostList);