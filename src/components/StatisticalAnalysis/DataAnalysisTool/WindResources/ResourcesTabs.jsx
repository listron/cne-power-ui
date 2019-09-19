import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Frequency from './Frequency.jsx';
import WindRose from './WindRose/WindRose.jsx';
import styles from './resources.scss';

class ResourcesTabs extends Component{
  constructor(props) {
    super(props);
    this.state = {
      activeKey: 2,
    };
  }

  checkType = (value) => {
    this.setState({
      activeKey: value,
    });
  };



  render(){
    const { activeKey } = this.state;
    return(
      <div className={styles.resourcesTabs}>
        <div className={styles.tabsBox}>
          <button className={activeKey === 1 ? styles.activeBtn : ''} onClick={() => {this.checkType(1);}}>风向&nbsp;&&nbsp;风能玫瑰图</button>
          <button className={activeKey === 2 ? styles.activeBtn : ''} onClick={() => {this.checkType(2);}}>风速&nbsp;&&nbsp;风能频率图</button>
        </div>
        {activeKey === 1 && <WindRose {...this.props} />}
        {activeKey === 2 && <Frequency {...this.props} />}
      </div>
    );
  }
}
export default ResourcesTabs;
