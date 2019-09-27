import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './intelligentExpert.scss';
import IntelligentSearch from './IntelligentSearch';
import IntelligentTable from './IntelligentTable';

class InterlligentExpertMain extends Component {
  static propTypes = {
    theme: PropTypes.string,
    stationType: PropTypes.string,
    stationTypeCount: PropTypes.string,
    listParams: PropTypes.object,
    getStationTypeDeviceTypes: PropTypes.func,
    resetStore: PropTypes.func,
    changeIntelligentExpertStore: PropTypes.func,
    getIntelligentTable: PropTypes.func,
  }

  constructor(props) {
    super(props);

  }

  componentDidMount() {
    const { listParams, getIntelligentTable } = this.props;
    getIntelligentTable(listParams);
  }


  componentWillReceiveProps(nextProps) {
    const { stationType, listParams, getIntelligentTable } = nextProps;
    if (this.props.stationType !== nextProps.stationType) {
      getIntelligentTable({ ...listParams, type: stationType });
    }
  }


  queryTargetData = (value) => { // 切换电站
    const { getStationTypeDeviceTypes } = this.props;
    const initlistParams = { // 切换电站类型的时候 请求图表的数据恢复最初
      deviceTypeCodes: [],
      faultTypeIds: [],
      faultDescription: '',
      recorder: '',
      pageNum: 1,
      pageSize: 10,
      orderField: 'like_count',
      sortMethod: 'desc',
    };
    this.props.changeIntelligentExpertStore({
      stationType: value,
      selectedRowKeys: [],
      listParams: { ...initlistParams, type: value },
    });
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
