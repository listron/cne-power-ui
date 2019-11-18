

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './side.scss';

class HandlePersonnelInfo extends Component {
  static propTypes = {
    pageKey: PropTypes.string,
    changeStore: PropTypes.func,
  }

  testBackTolist = () => {
    this.props.changeStore({ pageKey: 'list' });
  }

  render(){
    const { pageKey } = this.props;
    return (
      <div style={pageKey === 'detailPersonnel' ? { display: 'none' } : {}}>
        <button onClick={this.testBackTolist}>返回列表页面</button>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
        <div>新增 / 编辑用户</div>
      </div>
    );
  }
}

export default HandlePersonnelInfo;
