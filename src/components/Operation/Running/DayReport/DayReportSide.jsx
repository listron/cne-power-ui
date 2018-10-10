
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './dayReportAll.scss';
import Footer from '../../../Common/Footer';

class DayReportSide extends Component {
  static propTypes = {
    sidePage: PropTypes.string,
  }

  constructor(props){
    super(props);
  }

  render(){
    const { sidePage } = this.props;
    return (
      <div className={styles.dayReportSide}>
        { sidePage === 'report' && <div>report页面</div> }
        { sidePage === 'detail' && <div>详情页面</div> }
        { sidePage === 'edit' && <div>编辑页面</div> }
        <Footer />
      </div>
    )
  }
}

export default DayReportSide;
