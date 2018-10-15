
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'antd';
import styles from './reportDetail.scss';
class ReportEdit extends Component {
  static propTypes = {
    onSidePageChange: PropTypes.func,
    toChangeDayReportStore: PropTypes.func,
  }

  constructor(props){
    super(props);
  }

  backToDetail = () => {
    this.props.onSidePageChange({ sidePage : 'detail'});
    this.props.toChangeDayReportStore({
      showPage: 'detail'
    })
  }

  render(){
    return (
      <div className={styles.reportDetail} >
        <div className={styles.reportDetailTitle} >
          <span className={styles.reportDetailTitleTip}>日报编辑</span>
          <div className={styles.reportDetailTitleRight}>
            <Button  className={styles.reportEdit}>保存</Button>
            <Icon type="arrow-left" className={styles.backIcon}  onClick={this.backToDetail} />
          </div>
        </div>
        
      </div>
    )
  }
}

export default ReportEdit;
