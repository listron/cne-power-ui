import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './miniComponents.scss';

class MapResourceData extends Component{
  static propTypes = {
    detail: PropTypes.object,
  }

  render(){
    const { detail } = this.props;
    const { src, value } = detail;
    return (
      <div className={styles.resource}>
        {src && <img src={src} />}
        <div className={styles.resourceDetail}>
          <div className={styles.detailTop}>
            <span className={styles.value}>{value}</span>
            <span className={styles.unit}>{detail.unit}</span>
          </div>
          <div className={styles.name}>{detail.name}</div>
        </div>
      </div>
    );
  }
}

export default MapResourceData;
