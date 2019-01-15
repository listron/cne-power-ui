import React, { Component } from "react";
import { Select, Table, Modal, Button } from 'antd';
import PropTypes from 'prop-types';
import styles from "./warnConfig.scss";

class EditRule extends Component {
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
      <div className={styles.editRule} >
        
      </div>
    )
  }
}

export default EditRule