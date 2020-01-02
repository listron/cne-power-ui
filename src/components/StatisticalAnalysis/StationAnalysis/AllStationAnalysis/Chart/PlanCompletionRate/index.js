import React from 'react';
import styles from './styles.scss';
import PropTypes from 'prop-types';
import WaterWave from './WaterWave';
import { Radio } from 'antd';
import moment from 'moment';
import Cookie from 'js-cookie';
import { monitordataFormat, dataFormat } from '../../../../../../utils/utilFunc';

class PlancompletionRate extends React.Component {
  static propTypes = {
    allStationAvalibaData: PropTypes.array,
    allStationStatisticData: PropTypes.object,
    getAllStationStatisticData: PropTypes.func,
    dateType: PropTypes.string,
    showPage: PropTypes.string,
    singleStationCode: PropTypes.string,
    getSingleStationStatisticData: PropTypes.func,
    changeAllStationStore: PropTypes.func,
  }
  constructor(props, context) {
    super(props, context);
  }
  handleTime = (e) => {
    const changeYear = Number(e.target.value);
    const { getAllStationStatisticData, dateType, stationType, getSingleStationStatisticData, singleStationCode, changeAllStationStore } = this.props;
    const userId = Cookie.get('userId');
    getAllStationStatisticData && getAllStationStatisticData({ userId, year: changeYear, dateType, stationType });
    getSingleStationStatisticData && getSingleStationStatisticData({ stationCode: singleStationCode, year: changeYear, dateType });
    changeAllStationStore({ selectYear: changeYear });
  }

  selectYear() {
    const { allStationAvalibaData, selectYear } = this.props;
    if (allStationAvalibaData.length > 0) {
      return (
        <Radio.Group value={`${selectYear}`} buttonStyle="solid" onChange={this.handleTime}>
          {allStationAvalibaData.map((e, index) => {
            if (e.isTrue === true) {
              return <Radio.Button value={e.year} key={index} style={{ margin: '0 5px' }}>{e.year}</Radio.Button>;
            }
            return <Radio.Button value={e.year} key={index} disabled style={{ margin: '0 5px' }}>{e.year}</Radio.Button>;

          })}
        </Radio.Group>
      );
    }

  }

  render() {
    const { dateType, allStationStatisticData = {}, showPage, year, singeleMonth, theme } = this.props;
    const planSummary = allStationStatisticData;
    const completeRate = monitordataFormat(planSummary.completeRate);
    return (
      <div className={`${styles.allStationData} ${styles[theme]}`}>
        <div className={styles.textStyle}>计划完成情况
          {dateType === 'year' && this.selectYear()}
          {dateType === 'month' && ` ( ${year} 年  ) `}
          {dateType === 'day' && ` ( ${year} 年 ${singeleMonth} 月 ) `}
        </div>
        <div className={`${styles.allStationDataContainer}`} >
          <div className={styles.leftPic}>
            <WaterWave percent={completeRate} height={100} title="" theme={theme} />
            <div className={styles.powerGeneration}>
              <div className={styles.stationTargetData}>
                <div className={styles.stationTargetName}>实际发电量</div>
                <div className={styles.stationTargetValue}>{monitordataFormat(planSummary.actualPower)}
                  <span className={styles.unit}>万kWh</span></div>
              </div>
              <div className={styles.stationTargetData}>
                <div className={styles.stationTargetName}>计划发电量 </div>
                <div className={styles.stationTargetValue}>{monitordataFormat(planSummary.planPower)}
                  <span className={styles.unit}>万kWh</span></div>
              </div>
            </div>
          </div>
          <div className={styles.dataSummary}>
            {/*<div className={styles.stationTargetData}>*/}
              {/*<div className={styles.stationTargetName}>累计光辐射总量 : </div>*/}
              {/*<div className={styles.stationTargetValue}>{monitordataFormat(planSummary.rayRadiation)}*/}
                {/*<span className={styles.unit}> MJ/㎡</span></div>*/}
            {/*</div>*/}
            <div className={styles.stationTargetData}>
              <div className={styles.stationTargetName}>电站可利用率 : </div>
              <div className={styles.stationTargetValue}>{monitordataFormat(planSummary.stationAvailability)}% </div>
            </div>
            {/*<div className={styles.stationTargetData}>*/}
              {/*<div className={styles.stationTargetName}>等效利用小时数 : </div>*/}
              {/*<div className={styles.stationTargetValue}>{monitordataFormat(planSummary.equivalentHours)}*/}
                {/*<span className={styles.unit}>h</span></div>*/}
            {/*</div>*/}
            <div className={styles.stationTargetData}>
              <div className={styles.stationTargetName}>故障台次数 : </div>
              <div className={styles.stationTargetValue}>{dataFormat(planSummary.faultDeviceNum, '--', 2)}</div>
            </div>
            <div className={styles.stationTargetData}>
              <div className={styles.stationTargetName}>损失电量 : </div>
              <div className={styles.stationTargetValue}>{monitordataFormat(planSummary.lostPower)}
                <span className={styles.unit}>万kWh</span></div>
            </div>
            <div className={styles.stationTargetData}>
              <div className={styles.stationTargetName}>限电率 : </div>
              <div className={styles.stationTargetValue}>{monitordataFormat(planSummary.lostPowerRate)}%</div>
            </div>
            <div className={styles.stationTargetData}>
              <div className={styles.stationTargetName}>装机容量 : </div>
              <div className={styles.stationTargetValue}>{monitordataFormat(planSummary.realCapacity)}
                <span className={styles.unit}>MW</span></div>
            </div>
            <div className={styles.stationTargetData}>
              <div className={styles.stationTargetName}>PR : </div>
              <div className={styles.stationTargetValue}>{monitordataFormat(planSummary.pr)}%</div>
            </div>
          </div>
        </div>
      </div>


    );
  }
}
export default (PlancompletionRate);
