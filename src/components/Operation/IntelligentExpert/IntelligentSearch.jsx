import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './intelligentExpert.scss';
import FilterCondition from '../../../components/Common/FilterCondition/FilterCondition';

class IntelligentSearch extends Component {
  static propTypes = {
    resetStore:  PropTypes.func,
    deviceTypeCode: PropTypes.array,
    defectTypeCode: PropTypes.array,
  }

  // componentDidMount(){
  //   const { deviceTypeCode, defectTypeCode } = this.props;
  //   let filter = {
  //     deviceTypeCode,
  //     defectTypeCode,
  //   }
  // }

  // filterCondition = (changeValue) => { // 设备、缺陷筛选栏
  //   const { deviceTypeCode, defectTypeCode } = this.props;
  //   let filter = {
  //     deviceTypeCode,
  //     defectTypeCode,
  //   }
  // }

  render() {
    const { deviceTypes, deviceTypeCode, defectTypes, defectTypeCode,  } = this.props;
    return (
      <div className={styles.IntelligentSearch}>
        {/* <FilterCondition
        option={['deviceType', 'defectType']}
        defectTypes={defectTypes}
        deviceTypes={deviceTypes}
        defaultValue={{
          deviceTypeCode: deviceTypeCode,
          defectTypeCode: defectTypeCode,
        }}
        onChange={this.filterCondition}
        /> */}
      </div>
      )
    }
  }

export default IntelligentSearch;