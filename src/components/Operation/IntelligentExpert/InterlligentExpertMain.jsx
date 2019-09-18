import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Select, Icon } from 'antd';
import styles from './intelligentExpert.scss';
import IntelligentSearch from './IntelligentSearch';
import IntelligentTable from './IntelligentTable';

class InterlligentExpertMain extends Component {
  static propTypes = {
    theme: PropTypes.string,
  }

  constructor(props) {
    super(props);

  }

  componentDidMount() {
    const { listParams, getIntelligentTable } = this.props;
    getIntelligentTable(listParams);
  }


  componentWillReceiveProps(nextProps) {
    const { getStationTypeDeviceTypes, stationType, listParams, getIntelligentTable } = nextProps;
    if (this.props.stationType !== nextProps.stationType) {
      getIntelligentTable({ ...listParams, type: stationType });
    }
  }


  queryTargetData = (value) => { // 切换电站
    const { getStationTypeDeviceTypes, listParams } = this.props;
    this.props.changeIntelligentExpertStore({ stationType: value, listParams: { ...listParams, deviceTypeCodes: [], defectTypeCode: [] } });
    getStationTypeDeviceTypes({ type: value });
  }


  render() {
    const { theme, stationTypeCount, stationType } = this.props;
    return (
      <div className={`${styles.intelligentContent} ${styles[theme]}`}>
        {stationTypeCount === 'multiple' &&
          <div className={styles.stationType}>
            <p className={`${stationType === '0' && styles.activeStation} `} onClick={() => { this.queryTargetData('0'); }}>风电</p>
            <p className={`${stationType === '1' && styles.activeStation} `} onClick={() => { this.queryTargetData('1'); }}>光伏</p>
          </div>
        }
        <IntelligentSearch {...this.props} />
        <IntelligentTable {...this.props} />
      </div>
    );
  }
}

export default InterlligentExpertMain;
