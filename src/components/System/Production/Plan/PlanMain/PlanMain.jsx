

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Footer from '../../../../Common/Footer';
import styles from './planMain.scss';
import PlanTable from './PlanTable'


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
            <PlanTable {...this.props}/>
          </div>
          <Footer />
        </div>

    )
  }
}

export default PlanMain;
