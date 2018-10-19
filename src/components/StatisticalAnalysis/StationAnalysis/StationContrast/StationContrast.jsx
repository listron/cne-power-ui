import React from "react";
import PropTypes from "prop-types";
import styles from './stationContrast.scss';
import StationSelectContrast from './StationSelectContrast';
import TimeSelect from '../../../Common/TimeSelect';
import StationContrastTable from './StationContrastTable';

class StationContrast extends React.Component {
  static propTypes = {
    form: PropTypes.object,
    stations: PropTypes.array,
    toChangeStationContrastStore: PropTypes.func,
    getStationContrast: PropTypes.func,
    stationCode: PropTypes.array,
    dateType: PropTypes.string,
    year: PropTypes.array,
    stationContrastDetail: PropTypes.array,
    stationContrastList: PropTypes.array,
  }
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  componentDidMount() {

  }

  stationSelected = (stations) => {
    const { dateType, year } = this.props;
    console.log(stations);
    this.props.toChangeStationContrastStore({
      stationCode: stations.map(e=>e.stationCode),
    });
    this.props.getStationContrast({
      stationCode: stations.map(e=>e.stationCode),
      dateType,
      year,
    });
  }

  render() {
    const { stations ,stationContrastList, stationContrastDetail } = this.props;
    return (
      <div className={styles.singleStationType}>
        <div className={styles.stationTimeFilter}>
          <div className={styles.leftFilter}>
            <div className={styles.stationFilter}>
              <StationSelectContrast
                data={stations}
                holderText={'请选择两个同一类型的电站进行对比'}
                multiple={true}
                onChange={this.stationSelected}
              />
            </div>
            <TimeSelect day={true} {...this.props} />
          </div>
          <span className={styles.rightContent}>数据统计截止时间8月20日</span>
        </div>
        <div className={styles.componentContainer}>
          <div className={styles.componentContainerTip} >
            <span>电站数据</span>
            {stationContrastList && stationContrastList.length===0 && <span>点击表格数据，可查看详细</span>}
          </div>
          {stationContrastList && stationContrastList.length===0?
            <div className={styles.nodata} ><img src="/img/nodata.png" /></div>
            : <StationContrastTable {...this.props} />
          }
        </div>
      </div>
    );
  }
}
export default StationContrast;