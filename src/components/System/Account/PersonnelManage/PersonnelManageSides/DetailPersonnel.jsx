

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './side.scss';

class PersonnelManageSides extends Component {
  static propTypes = {
    pageKey: PropTypes.string,
    changeStore: PropTypes.func,
  }

  testToList = () => {
    this.props.changeStore({ pageKey: 'list' });
  }
  testToEdit = () => {
    this.props.changeStore({ pageKey: 'editPersonnel' });
  }

  render(){
    const { pageKey } = this.props;
    return (
      <div style={['addPersonnel', 'editPersonnel'].includes(pageKey) ? {display: 'none'} : {}}>
        <button onClick={this.testToList}>返回列表页面</button>
        <button onClick={this.testToEdit}>编辑这些详情</button>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
        <div>详情展示</div>
      </div>
    );
  }
}

export default PersonnelManageSides;
