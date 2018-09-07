

import React, { Component } from 'react';
import { Icon, Button } from 'antd';
import PropTypes from 'prop-types';
import styles from './stationSide.scss';
import Footer from '../../../../Common/Footer';

class StationManageEdit extends Component {
  static propTypes = {
    onShowSideChange: PropTypes.func,
    changeStationManageStore: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
    }
  }

  backToDetail = () => {
    this.props.onShowSideChange({showSidePage:'detail'});
    this.props.changeStationManageStore({showPage: 'detail'});
  }

  render(){
    return (
      <div className={styles.stationManageEdit} >
        <div>
          这里是编辑区域
        </div>
        <Button onClick={this.backToDetail}>返回详情哈！</Button>
      </div>
    )
  }
}

export default StationManageEdit;
