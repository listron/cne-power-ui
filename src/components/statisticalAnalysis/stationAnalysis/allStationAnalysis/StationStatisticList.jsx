import React from "react";
import styles from './stationStatisticList.scss';
import Pagination from '../../../../components/Common/CommonPagination/index';


class StationStatisticList extends React.Component {
  constructor(props, context) {
    super(props, context)
  }
  render() {
    return (
      <div className={styles.stationStatisticList}>
        <div className={styles.stationStatisticFilter}>
          <div className={styles.leftTime}>
            <div>综合指标统计表</div>
            这里是一个时间组件
            </div>
            <Pagination />
        </div>
        <div>这里面放table</div>


      </div>
    )
  }
}
export default (StationStatisticList)