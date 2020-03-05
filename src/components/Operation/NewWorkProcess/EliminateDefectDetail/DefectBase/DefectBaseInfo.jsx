import React, { Component } from 'react';
import styles from './baseinfo.scss';

export default class DefectBaseInfo extends Component {

  static propTypes = {

  };

  render() {
    return (
      <div className={styles.defectBaseInfo}>
        基本信息
      </div>
    );
  }
}
