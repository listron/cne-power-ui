import React, { Component } from "react";
import styles from "./manufacturers.scss";
import PropTypes from 'prop-types';
import Search from './Search';

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

      </div>
    )
  }
}

export default Manufacturers