import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';

class PostList extends Component {
  static propTypes = {
    fetchPosts: PropTypes.func,
    posts: PropTypes.array
  }

  static defaultProps = {
    posts: []
  }

  state = {

  };

  componentWillMount() {
    this.props.fetchPosts();
  }

  render() {
    const { posts } = this.props;

    const columns = [{
      title: '用户编号',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    }];

    return (
      <div>
        <Table rowKey="id" dataSource={posts} columns={columns} />
      </div>
    );
  }
}

export default PostList;