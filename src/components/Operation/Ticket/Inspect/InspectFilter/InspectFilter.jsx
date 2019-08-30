import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Switch, Icon, Radio } from 'antd';
import DateFilter from '../../Defect/DefectFilter/DateFilter';
import StationTypeFilter from '../../Defect/DefectFilter/StationTypeFilter';
import StationFilter from '../../Defect/DefectFilter/StationFilter';
import DeviceTypeFilter from '../../Defect/DefectFilter/DeviceTypeFilter';
import FilteredItems from './FilteredItems';
import styles from './inspectFilter.scss';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class InspectFilter extends Component {
  static propTypes = {
    inspectStatusStatistics: PropTypes.object,
    stations: PropTypes.object,
    deviceTypes: PropTypes.object, //设备类型列表
    stationType: PropTypes.string,
    stationCodes: PropTypes.string,
    timeInterval: PropTypes.string,
    status: PropTypes.string,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    createTimeStart: PropTypes.string,
    createTimeEnd: PropTypes.string,
    deviceTypeCode: PropTypes.string,
    sort: PropTypes.string,
    hasAbnormal: PropTypes.bool,
    username: PropTypes.string,
    handleUser: PropTypes.string,
    onChangeFilter: PropTypes.func,
    defectStatusStatistics: PropTypes.object,
    theme: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      showFilter: '',
    };
  }
  onFilterShowChange = (filterText) => {
    const { showFilter } = this.state;
    if (showFilter === filterText) {
      this.setState({
        showFilter: '',
      });
    } else {
      this.setState({
        showFilter: filterText,
      });
    }
  }
  onUserSelect = (value) => {//check 我参与的
    const { username } = this.props;
    this.props.onChangeFilter({
      handleUser: value ? username : '',
    });
  }
  onAbnormalSelect = (value) => {//check 是否异常
    this.props.onChangeFilter({
      hasAbnormal: value,
    });
  }
  onChangeTab = (e) => {
    this.props.onChangeFilter({
      status: e.target.value,
    });
  }


  render() {
    const { showFilter } = this.state;
    const { stations, inspectStatusStatistics, handleUser, hasAbnormal, username, theme } = this.props;
    const inProcessNum = inspectStatusStatistics.get('executeNum');
    const waitCheckNum = inspectStatusStatistics.get('checkNum');
    const isOneType = stations.groupBy(item => item.get('stationType')).size === 1;
    return (
      <div className={`${styles.inspectFilter} ${styles[theme]}`}>
        <div className={styles.wrap}>
          <div className={styles.topSearch}>
            <span className={styles.text}>筛选条件</span>
            <Button onClick={() => this.onFilterShowChange('time')}>
              创建时间{showFilter === 'time' ? <Icon type="up" /> : <Icon type="down" />}
            </Button>
            {!isOneType && <Button onClick={() => this.onFilterShowChange('stationType')}>
              电站类型{showFilter === 'stationType' ? <Icon type="up" /> : <Icon type="down" />}
            </Button>}
            <Button onClick={() => this.onFilterShowChange('stationName')}>
              电站名称{showFilter === 'stationName' ? <Icon type="up" /> : <Icon type="down" />}
            </Button>
            <Button onClick={() => this.onFilterShowChange('deviceType')}>
              设备类型{showFilter === 'deviceType' ? <Icon type="up" /> : <Icon type="down" />}
            </Button>
            {/* <span>
            <Switch checked={handleUser===username} onChange={this.onUserSelect} /><span>我参与的</span>
          </span>
          <span>
            <Switch checked={hasAbnormal} onChange={this.onAbnormalSelect} /><span>有异常</span>
          </span> */}
          </div>
          <div className={styles.filterBox}>
            {showFilter === 'time' && <DateFilter {...this.props} />}
            {showFilter === 'stationType' && <StationTypeFilter {...this.props} />}
            {showFilter === 'stationName' && <StationFilter {...this.props} />}
            {showFilter === 'deviceType' && <DeviceTypeFilter {...this.props} />}
          </div>
          <FilteredItems {...this.props} />
        </div>
        <div className={styles.statusGroup}>
          <div className={styles.text}><span>状</span><span>态</span></div>
          <RadioGroup onChange={this.onChangeTab} defaultValue="5" value={this.props.status}>
            <RadioButton value="5">全部</RadioButton>
            <RadioButton value="2">{`执行中  ${inProcessNum}`}</RadioButton>
            <RadioButton value="3">{`待验收  ${waitCheckNum}`}</RadioButton>
            <RadioButton value="4">{'已完成'}</RadioButton>
          </RadioGroup>
        </div>
      </div>
    );
  }

}

export default InspectFilter;
