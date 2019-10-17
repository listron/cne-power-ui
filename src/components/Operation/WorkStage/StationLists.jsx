import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './workPage.scss';

class StationLists extends PureComponent {

  static propTypes = {
    // theme: PropTypes.string,
    // stations: PropTypes.array,
    // resetStore: PropTypes.func,
    // changeStore: PropTypes.func,
    // getTaskList: PropTypes.func,
  };

  render(){
    return (
      <div>
        <span>工作台记事</span>
        <span>电站列表</span>
      </div>
    );
  }
}

export default StationLists;
