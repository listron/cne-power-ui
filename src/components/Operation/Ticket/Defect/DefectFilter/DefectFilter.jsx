import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Switch, Icon, Radio } from 'antd';
import DateFilter from './DateFilter';
import StationTypeFilter from './StationTypeFilter';
import StationFilter from './StationFilter';
import DeviceTypeFilter from './DeviceTypeFilter';
import DefectLevelFilter from './DefectLevelFilter';
import DefectTypeFilter from './DefectTypeFilter';
import FilteredItems from './FilteredItems';
import styles from './defectFilter.scss';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class DefectFilter extends Component {
  static propTypes = {
    stations: PropTypes.object, //电站列表
    defectTypes: PropTypes.object, //缺陷类型列表
    deviceTypes: PropTypes.object, //设备类型列表 
    stationType: PropTypes.string,
    stationCodes: PropTypes.string,
    defectLevel: PropTypes.string,
    createTimeStart: PropTypes.string,
    createTimeEnd: PropTypes.string,
    deviceTypeCode: PropTypes.string,
    defectTypeCode: PropTypes.string,
    handleUser: PropTypes.string,
    username: PropTypes.string,
    status: PropTypes.string,
    onChangeFilter: PropTypes.func,
    defectStatusStatistics: PropTypes.object,
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

  onUserSelect = (value) => {
    const { username } = this.props;
    this.props.onChangeFilter({
      handleUser: value ? username : '',
    });
  }

  onChangeTab = (e) => {
    this.props.onChangeFilter({
      status: e.target.value,
    });
  }

  render() {
    const { showFilter } = this.state;
    const { stations, defectStatusStatistics, handleUser, username, theme } = this.props;
    const isOneType = stations.groupBy(item => item.get('stationType')).size === 1;
    const waitSubmitNum = defectStatusStatistics.get('submitNum');
    const waitReviewNum = defectStatusStatistics.get('examineNum');
    const inProcessNum = defectStatusStatistics.get('executeNum');
    const waitCheckNum = defectStatusStatistics.get('checkNum');
    return (
      <div className={`${styles.defectFilter} ${styles[theme]}`}>
        <div className={styles.topSearch}>
          <span className={styles.text}>筛选条件</span>
          <Button onClick={() => this.onFilterShowChange('time')}>
            发生时间{showFilter === 'time' ? <Icon type="up" /> : <Icon type="down" />}
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
          <Button onClick={() => this.onFilterShowChange('defectLevel')}>
            缺陷级别{showFilter === 'defectLevel' ? <Icon type="up" /> : <Icon type="down" />}
          </Button>
          <Button onClick={() => this.onFilterShowChange('defectType')}>
            缺陷类型{showFilter === 'defectType' ? <Icon type="up" /> : <Icon type="down" />}
          </Button>
          <span>
            <Switch checked={handleUser === username} onChange={this.onUserSelect} /><span>我参与的</span>
          </span>
        </div>
        <div className={styles.filterBox}>
          {showFilter === 'time' && <DateFilter {...this.props} />}
          {showFilter === 'stationType' && <StationTypeFilter {...this.props} />}
          {showFilter === 'stationName' && <StationFilter {...this.props} />}
          {showFilter === 'deviceType' && <DeviceTypeFilter {...this.props} />}
          {showFilter === 'defectLevel' && <DefectLevelFilter {...this.props} />}
          {showFilter === 'defectType' && <DefectTypeFilter {...this.props} />}
        </div>
        <FilteredItems {...this.props} />
        <div className={styles.statusGroup}>
          <div className={styles.text}><span>状</span><span>态</span></div>
          <RadioGroup onChange={this.onChangeTab} defaultValue="5" value={this.props.status}>
            <RadioButton value="5">全部</RadioButton>
            <RadioButton value="0">{`待提交  ${waitSubmitNum}`}</RadioButton>
            <RadioButton value="1">{`待审核  ${waitReviewNum}`}</RadioButton>
            <RadioButton value="2">{`执行中  ${inProcessNum}`}</RadioButton>
            <RadioButton value="3">{`待验收  ${waitCheckNum}`}</RadioButton>
            <RadioButton value="4">{'已完成'}</RadioButton>
          </RadioGroup>
        </div>
      </div>
    );
  }

}

export default DefectFilter;
