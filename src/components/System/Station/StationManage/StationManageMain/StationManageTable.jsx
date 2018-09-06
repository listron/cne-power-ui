

import React, { Component } from 'react';
import { Input, Button, Icon } from 'antd';
import CommonPagination from '../../../../Common/CommonPagination';
import styles from './stationMain.scss';
import PropTypes from 'prop-types';


class StationManageTable extends Component {
  static propTypes = {
    
  }

  constructor(props){
    super(props);
    this.state = {

    }
  }

  onStationAdd = () => {
    console.log('add 电站')
  }

  onPaginationChange = (...rest) => {
    console.log(rest)
  }

  downloadTemplet = () => {
    console.log('down load templet')
  }

  render(){
    return (
      <div>
        <div>
          <Button onClick={this.onStationAdd}>
            <Icon type="plus" />
            <span>电站</span>
          </Button>
          <Button onClick={this.downloadTemplet}>下载电站配置模板</Button>
          <CommonPagination total={100} onPaginationChange={this.onPaginationChange} />
        </div>
        this is a station manage table part
      </div>
    )
  }
}

export default StationManageTable;
