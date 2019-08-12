import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Radio, DatePicker, Button } from 'antd';
import styles from './dailyQuery.scss';
import StationSelect from '../../../Common/StationSelect';
// import AutoSelect from '../../../Common/AutoSelect';

const { RangePicker } = DatePicker;

class DailySearch extends Component {
  static propTypes = {
    stations: PropTypes.array,
    stationTypeCount: PropTypes.string,
    selectStationType: PropTypes.number, // 选中的电站类型
    changeDailyQueryStore: PropTypes.func,
    queryParam: PropTypes.object,

  }

  onStationTypeChange = (selectStationType) => {
    const { changeDailyQueryStore } = this.props;
    changeDailyQueryStore({
      selectStationType,
    });
  }

  checkWind = () => this.onStationTypeChange(0); // 选中风电站
  checkPv = () => this.onStationTypeChange(1); // 选中光伏电站

  onCategory = () => { // 切换查询类别
    
  }

  onQuotaChange = () => { // 选择指标

  }

  onChangeTime = () => { // 选择时间

  }

  render(){
    const { stationTypeCount, selectStationType, stations, queryParam } = this.props;
    const { stationCode } = queryParam;
    return(
      <div className={styles.dailySearch}>
        {stationTypeCount === 'multiple' && <div className={styles.typeCheck}>
          <div className={selectStationType === 0 ? styles.typeActive: styles.typeNormal} onClick={this.checkWind}>风电</div>
          <div className={selectStationType === 1 ? styles.typeActive: styles.typeNormal} onClick={this.checkPv}>光伏</div>
          <div className={styles.holder} />
        </div>}
        <div className={styles.searchPart}>
          <div className={styles.category}>
            <span className={styles.text}>查询类别</span>
            <Radio.Group defaultValue="quota" buttonStyle="solid" onChange={this.onCategory}>
              <Radio.Button value="quota">关键指标</Radio.Button>
              <Radio.Button value="fault">故障信息</Radio.Button>
              <Radio.Button value="limit">限电信息</Radio.Button>
            </Radio.Group>
          </div>
          <div className={styles.searchChange}>
            <div className={styles.stationSelect}>
              <span className={styles.text}>电站名称</span>
              <StationSelect
                data={typeof(selectStationType) === 'number' ? stations.filter(e => e.stationType === selectStationType) : stations}
                onOK={this.selectStation}
                value={stations.filter(e => e.stationCode === stationCode)}
                disabledStation={stations.filter(e => e.isConnected === 0).map(e => e.stationCode)}
                multiple={true}
                stationShowNumber={true}
              />
            </div>
            <div className={styles.quotaSelect}>
              <span className={styles.text}>选择指标</span>
              {/* <AutoSelect
                style={{width: '150px'}}
                holderText="请选择"
                data={quotaInfo}
                value={quotas}
                maxTagCount={0}
                multiple={true}
                onChange={this.onQuotaChange}
              /> */}
            </div>
            <div className={styles.timeSelect}>
              <span className={styles.text}>时间</span>
              <RangePicker format="YYYY-MM-DD" onChange={this.onChangeTime} />
            </div>
            <Button>查询</Button>
            <Button>重置</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default DailySearch;
