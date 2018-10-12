

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Footer from '../../../../Common/Footer';
import styles from './planMain.scss';
import PlanTable from './PlanTable'
import PlanSearch from './PlanSearch'


//部门主页面。部门查询组件，分页及表格组件；
class PlanMain extends Component {
  static propTypes = {
    changePlanStore: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }

  componentWillUnmount() {

  }



  render() {
    return (
        <div className={styles.planMain}>
          <div className={styles.contentMain}>
            <PlanSearch {...this.props}/>
            {this.props.planData.length>0 ? <PlanTable {...this.props}/>:''}
          </div>
          <Footer />
        </div>

    )
  }
}

export default PlanMain;
