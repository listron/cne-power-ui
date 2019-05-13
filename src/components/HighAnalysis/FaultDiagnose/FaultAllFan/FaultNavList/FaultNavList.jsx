import React from "react";
import PropTypes from "prop-types";
import { Icon } from "antd";
import styles from "./faultNavList.scss";
import moment from "moment";

export default class FaultNavList extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    showFlag: PropTypes.bool,
    onChangeFilter: PropTypes.func,
    getStationDeviceList: PropTypes.func,
    stationCode: PropTypes.string,
    stationDeviceList: PropTypes.array,
    match: PropTypes.object,
    faultInfo: PropTypes.object,
    getTenMinutesBefore: PropTypes.func,
    getTenMinutesAfter: PropTypes.func,
    getTenMinutesDiff: PropTypes.func,
    getStandAloneList: PropTypes.func,
    getSimilarityList: PropTypes.func,
    getAllFanResultList: PropTypes.func,
    preDate: PropTypes.array,
    afterDate: PropTypes.array,
    diffDate: PropTypes.array,
    faultDate: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      openFlag: true, // 控制打开关闭
      fansFlag: 0, // 选中风机
    };
  }

  componentDidMount() {
    const {
      navList: { clientHeight },
      props: {
        onChangeFilter,
        getStationDeviceList,
        match:{
          params: {
            stationCode
          }
        },
      }
    } = this;
    const params = {
      stationCode: stationCode,
      deviceTypeCode: "101"
    };
    getStationDeviceList(params);
    onChangeFilter({
      showFlag: clientHeight > 32
    });
  }

  componentDidUpdate() {
    const { navList: { clientHeight }, props: {onChangeFilter} } = this;
    onChangeFilter({
      showFlag: clientHeight > 32
    });
  }

  openFunc = () => {
    const { openFlag } = this.state;
    const { navBox } = this;
    this.setState({
      openFlag: !openFlag
    }, () => {
      if (openFlag) {
        // 改变box
        navBox.style.height = "auto";
        navBox.style.paddingBottom = "8px";
      }
      if (!openFlag) {
        // 改变box
        navBox.style.height = "32px";
        navBox.style.paddingBottom = "0";
      }
    });
  };

  handlerFansClick = (data, index, warnId) => {
    const {
      match:{
        params: {
          stationCode
        }
      },
      faultInfo: {
        endTime
      },
      faultDate,
      getTenMinutesBefore,
      getTenMinutesAfter,
      getTenMinutesDiff,
      getStandAloneList,
      getSimilarityList,
      getAllFanResultList,
      onChangeFilter,
      preDate,
      afterDate,
      diffDate
    } = this.props;
    const { deviceFullCode, deviceName } = data;
    const taskId = localStorage.getItem("taskId");
    // 发电机前驱温度
    const preParams = {
      stationCode,
      pointCode: "GN010", //前驱测点-固定字段
      deviceFullcodes: [], // 默认传空代表所有风机
      startTime: preDate.length === 0 ? moment(endTime).subtract(1,'months').utc().format() : moment(preDate[0]).utc().format(),
      endTime: preDate.length === 0 ? moment(endTime).utc().format() : moment(preDate[1]).utc().format()
    };
    // 发电机后驱温度
    const afterParams = {
      stationCode,
      pointCode: "GN011", //后驱测点-固定字段
      deviceFullcodes: [], // 默认传空代表所有风机
      startTime: afterDate.length === 0 ? moment(endTime).subtract(1,'months').utc().format() : moment(afterDate[0]).utc().format(),
      endTime: afterDate.length === 0 ? moment(endTime).utc().format() : moment(afterDate[1]).utc().format()
    };
    // 发电机后驱温度
    const diffParams = {
      stationCode,
      pointCode: "GN010-GN011", //温度差-固定字段
      deviceFullcodes: [], // 默认传空代表所有风机
      startTime: diffDate.length === 0 ? moment(endTime).subtract(1,'months').utc().format() : moment(diffDate[0]).utc().format(),
      endTime: diffDate.length === 0 ? moment(endTime).utc().format() : moment(diffDate[1]).utc().format()
    };
    // 单机自适应模块
    const singleParams = {
      taskId,
      deviceFullCode
    };
    // 相似性热图
    const heatAndAllFansParams = {
      taskId,
      date: faultDate || endTime
    };
    this.setState({
      fansFlag: index
    }, () => {
      // 改变设备选中
      onChangeFilter({
        deviceName,
        deviceFullCode,
        warnId,
      });
      // 请求接口
      getTenMinutesBefore(preParams);
      getTenMinutesAfter(afterParams);
      getTenMinutesDiff(diffParams);
      getStandAloneList(singleParams);
      getSimilarityList(heatAndAllFansParams);
      getAllFanResultList(heatAndAllFansParams);
    })
  };


  render() {
    const { openFlag, fansFlag } = this.state;
    const {
      showFlag,
      stationDeviceList
    } = this.props;
    const item = stationDeviceList && stationDeviceList.map((cur, index) => {
      return (
        <div
          key={`${cur.deviceName}${index}`}
          style={{backgroundColor: index === fansFlag ?  "#ffffff" : "#199475"}}
          className={cur.warnId === 1 ? styles.yellowWarn : styles.blueWarn}
          onClick={() => {return this.handlerFansClick(cur, index, cur.warnId)}}
        >
          {cur.deviceName}
        </div>
      );
    });
    return (
      <div className={styles.faultNavList} ref={ref => {this.navBox = ref}}>
        <div className={styles.navListRight} ref={ ref => {this.navList = ref} }>
          {item}
        </div>
        {(showFlag) && (
          <div className={styles.navListLeft}>
            <div onClick={this.openFunc}>
              <span>{openFlag ? "展开" : "关闭"}</span><Icon type={openFlag ? "caret-down" : "caret-up"} />
            </div>
          </div>
        )}
      </div>
    );
  }
}
