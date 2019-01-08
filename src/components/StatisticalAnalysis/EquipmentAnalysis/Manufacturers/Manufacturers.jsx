import React, { Component } from "react";
import styles from "./manufacturers.scss";
import PropTypes from 'prop-types';
import Search from './Search';
import Charts from './chart';

class Manufacturers extends Component {
  static propTypes = {
    resetStore: PropTypes.func
  }

  constructor(props, context) {
    super(props, context)
  }
 
  render() {
    return (
      <div className={styles.manufacturers}>
        <Search {...this.props} />
        <div className={styles.manuCont}>
          <Charts graphId={"efficiency"} type={"efficiency"} hasData={false} xData={[]} yData={[]} />
          <Charts graphId={"duration"} type={"duration"} hasData={false} xData={[]} yData={[]} />
          <Charts graphId={"frequency"} type={"frequency"} hasData={false} xData={[]} yData={[]} />
          <Charts graphId={"capacity"} type={"capacity"} hasData={false} xData={[]} yData={[]} />
        </div>
      </div>
    )
  }
}

export default Manufacturers