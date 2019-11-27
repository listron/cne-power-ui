

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Input } from 'antd';
import styles from './list.scss';

class ListSearch extends Component {
  static propTypes = {
    showDepartmentStationModal: PropTypes.bool,
    stations: PropTypes.array,
    departmentStations: PropTypes.array,
    changeStore: PropTypes.func,
  }

  toSearchList = () => { // 查询
    const { } = this.state;
    const { } = this.props;
    console.log('to search user list');
  }

  toResetList = () => { // 重置
    const { } = this.state;
    const { } = this.props;
    console.log('to search user list');
  }

  render(){
    const { } = this.props;
    return (
      <div className={styles.listSearch}>
        <span>姓名</span>
        <Input />
        <span>电话</span>
        <span>请输入电话框</span>
        <span>负责电站</span>
        <span>请输入负责电站框</span>
        <Button onClick={this.toSearchList}>查询</Button>
        <Button onClick={this.toResetList}>重置</Button>
      </div>
    );
  }
}

export default ListSearch;
