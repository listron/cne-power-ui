import React, { Component } from "react";
import { Select, Table, Modal, Button } from 'antd';
import PropTypes from 'prop-types';
import styles from "./warnConfig.scss";

class DetailRule extends Component {
  static propTypes = {
    resetStore: PropTypes.func,
  }

  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() { // 初始请求数据
   
  }

  render() {
    return (
      <div className={styles.detailRule} >
        
      </div>
    )
  }
}

export default DetailRule