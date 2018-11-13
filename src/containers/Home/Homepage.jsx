import React, { Component } from 'react';
import { Button } from 'antd';
import styles from './homepage.scss';
import { Link } from 'react-router-dom';

class Homepage extends Component {

  render() {   
    return (
        <div className={styles.homepage}>
          <div className={styles.topBox}>
            顶部标题
          </div>
          <div className={styles.leftBox}>
            左侧四列
          </div>
          <div className={styles.middleBox}>
            中间地图
          </div>
          <div className={styles.rightBox}>
            右侧4列
          </div>
        </div>
    );
  }
}


export default Homepage;