
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './cleanStyle.scss';
import { Button } from 'antd';
// import StationManageDetail from './StationManageDetail';
// import StationManageEdit from './StationManageEdit';
import Footer from '../../../Common/Footer';

class CleanWarningSide extends Component {
  static propTypes = {
    onShowSideChange: PropTypes.func,
    changeCleanWarningStore: PropTypes.func,
  }

  backToList = () => {
    this.props.changeCleanWarningStore({showPage: 'list'});
  }

  render(){
    return (
      <div className={styles.clearWarningSide}>
        相关内容侧边。
        <Button onClick={this.backToList}>返回主页面</Button>
        <Footer />
      </div>
    )
  }
}

export default CleanWarningSide;
