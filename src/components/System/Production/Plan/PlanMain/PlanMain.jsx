import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Footer from '../../../../Common/Footer';
import styles from './planMain.scss';
import PlanTable from './PlanTable'
import PlanSearch from './PlanSearch'


class PlanMain extends Component {
  static propTypes = {
    changePlanStore: PropTypes.func,
    planData: PropTypes.array,
  }

  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div className={styles.planMain}>
        <div className={styles.contentMain}>
          <PlanSearch {...this.props}/>
          <PlanTable {...this.props}/>
        </div>
        <Footer/>
      </div>

    )
  }
}

export default PlanMain;
