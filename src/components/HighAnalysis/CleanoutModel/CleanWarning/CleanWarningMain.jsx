

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Table } from 'antd';
// import StationManageSearch from './StationManageSearch';
// import StationManageTable from './StationManageTable';
import Footer from '../../../Common/Footer';
import styles from './cleanStyle.scss';

class CleanWarningMain extends Component { // 电站管理列表页
  static propTypes = {
    changeCleanWarningStore: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }

  showDetail = () => {
    this.props.changeCleanWarningStore({
      showPage: 'detail',
    })
  }

  render(){
    return (
      <div className={styles.cleanWarningMain}>
        <div className={styles.stationContent}>
          <div>
            电站筛选
          </div>
          <div>
            分页器
          </div>
          <Table
            columns={[]}
            pagination={null}
            dataSource={[]}
          />
          <Button onClick={this.showDetail}>按钮</Button>
        </div>
        <Footer />
      </div>
    )
  }
}

export default CleanWarningMain;
