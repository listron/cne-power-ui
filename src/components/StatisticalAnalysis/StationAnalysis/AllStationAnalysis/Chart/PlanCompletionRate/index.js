import React from "react";
import styles from './styles.scss';
import PropTypes from "prop-types";
import WaterWave from './WaterWave';
import { Radio } from "antd";
import moment from 'moment';
import Cookie from 'js-cookie';
import { monitordataFormat, dataFormat } from '../../../../../../utils/utilFunc'

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
    super(props, context)
  }
  handleTime = (e) => {
    const changeYear = Number(e.target.value);
    const { getAllStationStatisticData, dateType, stationType, getSingleStationStatisticData, singleStationCode, changeAllStationStore } = this.props;
    const userId = Cookie.get('userId')
    getAllStationStatisticData && getAllStationStatisticData({ userId, year: changeYear, dateType, stationType })
    getSingleStationStatisticData && getSingleStationStatisticData({ stationCode: singleStationCode, year: changeYear, dateType, })
    changeAllStationStore({ selectYear: changeYear })
  }

  selectYear() {
    const { allStationAvalibaData, selectYear } = this.props;
    if (allStationAvalibaData.length > 0) {
      return (
        <Radio.Group value={`${selectYear}`} buttonStyle="solid" onChange={this.handleTime}>
          {allStationAvalibaData.map((e, index) => {
            if (e.isTrue === true) {
              return <Radio.Button value={e.year} key={index} style={{ margin: '0 5px' }}>{e.year}</Radio.Button>
            } else {
              return <Radio.Button value={e.year} key={index} disabled style={{ margin: '0 5px' }}>{e.year}</Radio.Button>
            }
          })}
        </Radio.Group>
      )
    }

  }

  render() {
    const { dateType, allStationStatisticData, showPage, year, singeleMonth } = this.props;
    let planSummary = showPage === 'single' ? allStationStatisticData : (allStationStatisticData && allStationStatisticData.planSummary && allStationStatisticData.planSummary[0])
    const completeRate = planSummary && monitordataFormat(planSummary.completeRate);
    return (
      <div className={styles.allStationData}>
        <div className={styles.textStyle}>计划完成情况
          {dateType === 'year' && this.selectYear()}
          {dateType === 'month' && ` ( ${year} 年  ) `}
          {dateType === "day" && ` ( ${year} 年 ${singeleMonth} 月 ) `}
        </div>
        <div className={styles.allStationDataContainer}>
          <div className={styles.leftPic}>
            <WaterWave percent={completeRate} height={100} title="" />
          </div>
          <div className={styles.powerGeneration}>
            <div className={styles.stationTargetData}>
              <div className={styles.stationTargetValue}>{planSummary && monitordataFormat(planSummary.actualPower)}</div>
              <div className={styles.stationTargetName}>实际发电量 万kWh</div>
            </div>
            <div className={styles.stationTargetData}>
              <div className={styles.stationTargetValue}>{planSummary && monitordataFormat(planSummary.planPower)}</div>
              <div className={styles.stationTargetName}>计划发电量 万kWh</div>
            </div>
          </div>
          <div className={styles.dataSummary}>
            <div className={styles.rightDataSummary}>
              <div className={styles.stationTargetData}>
                <div className={styles.stationTargetValue}>{planSummary && monitordataFormat(planSummary.rayRadiation)}</div>
                <div className={styles.stationTargetName}>累计光辐射总量 MJ/㎡</div>
              </div>
              <div className={styles.stationTargetData}>
                <div className={styles.stationTargetValue}>{planSummary && monitordataFormat(planSummary.stationAvailability)}%</div>
                <div className={styles.stationTargetName}>电站可利用率</div>
              </div>
            </div>
            <div className={styles.rightDataSummary}>
              <div className={styles.stationTargetData}>
                <div className={styles.stationTargetValue}>{planSummary && monitordataFormat(planSummary.equivalentHours)}</div>
                <div className={styles.stationTargetName}>等效利用小时数  h</div>
              </div>
              <div className={styles.stationTargetData}>
                <div className={styles.stationTargetValue}>{planSummary && monitordataFormat(planSummary.lostPower)}</div>
                <div className={styles.stationTargetName}>损失电量  万kWh</div>
              </div>
            </div>
            <div className={styles.rightDataSummary}>
              <div className={styles.stationTargetData}>
                <div className={styles.stationTargetValue}>{planSummary && monitordataFormat(planSummary.realCapacity)}</div>
                <div className={styles.stationTargetName}>装机容量 MW</div>
              </div>
              <div className={styles.stationTargetData}>
                <div className={styles.stationTargetValue}>{planSummary && dataFormat(planSummary.faultDeviceNum,'--', 2)}</div>
                <div className={styles.stationTargetName}>故障台次数</div>
              </div>
            </div>
            <div className={styles.rightDataSummary}>
              <div className={styles.stationTargetData}>
                <div className={styles.stationTargetValue}>{planSummary && monitordataFormat(planSummary.pr)}%</div>
                <div className={styles.stationTargetName}>PR</div>
              </div>
              <div className={styles.stationTargetData}>
                <div className={styles.stationTargetValue}>{planSummary && monitordataFormat(planSummary.lostPowerRate)}%</div>
                <div className={styles.stationTargetName}>限电率</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }
}
export default (PlancompletionRate)
