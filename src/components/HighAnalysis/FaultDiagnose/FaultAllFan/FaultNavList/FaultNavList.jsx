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
    stationCode: PropTypes.string,
    match: PropTypes.object,
    faultInfo: PropTypes.object,
    getTenMinutesBefore: PropTypes.func,
    getTenMinutesAfter: PropTypes.func,
    getTenMinutesDiff: PropTypes.func,
    getStandAloneList: PropTypes.func,
    getSimilarityList: PropTypes.func,
    getAllFanResultList: PropTypes.func,
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
      }
    } = this;
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
      faultInfo: {
        stationCode,
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
    } = this.props;
    // 当前点击的数据
    const { deviceFullcode, deviceName, date } = data;
    // 故障日期时间
    const dateArr = date && date.split(",");
    // 判断如果date有数据
    const timeValue = date && date ? dateArr[dateArr.length - 1] : endTime;
    const taskId = localStorage.getItem("taskId");
    // 发电机前驱温度
    const preParams = {
      stationCode,
      pointCode: "GN010", //前驱测点-固定字段
      deviceFullcodes: [], // 默认传空代表所有风机
      startTime: moment(timeValue).subtract(1,'months').utc().format() ,
      endTime: moment(timeValue).add(1, "days").utc().format(),
      queryFlag: true // 判断是否重新存贮时间轴
    };
    // 发电机后驱温度
    const afterParams = {
      stationCode,
      pointCode: "GN011", //后驱测点-固定字段
      deviceFullcodes: [], // 默认传空代表所有风机
      startTime: moment(timeValue).subtract(1,'months').utc().format(),
      endTime: moment(timeValue).add(1, "days").utc().format(),
      queryFlag: true // 判断是否重新存贮时间轴
    };
    // 发电机后驱温度
    const diffParams = {
      stationCode,
      pointCode: "GN010-GN011", //温度差-固定字段
      deviceFullcodes: [], // 默认传空代表所有风机
      startTime: moment(timeValue).subtract(1,'months').utc().format(),
      endTime: moment(timeValue).add(1, "days").utc().format(),
      queryFlag: true // 判断是否重新存贮时间轴
    };
    // 单机自适应模块
    const singleParams = {
      taskId,
      deviceFullCode: deviceFullcode
    };
    // 相似性热图
    const heatAndAllFansParams = {
      taskId,
      date: faultDate
    };
    this.setState({
      fansFlag: index
    }, () => {
      // 改变设备选中
      onChangeFilter({
        deviceName,
        deviceFullCode: deviceFullcode,
        warnId,
        faultDate: timeValue, // 故障详情页选择日期
        faultDateList: date, // 预警日期-有故障的日期
        preDate: [// 前驱温度时间选择
          moment(timeValue, "YYYY/MM/DD").subtract(1,'months'),
          moment(timeValue, "YYYY/MM/DD")
        ],
        afterDate: [// 后驱温度时间选择
          moment(timeValue, "YYYY/MM/DD").subtract(1,'months'),
          moment(timeValue, "YYYY/MM/DD")
        ],
        diffDate: [// 后驱温度时间选择
          moment(timeValue, "YYYY/MM/DD").subtract(1,'months'),
          moment(timeValue, "YYYY/MM/DD")
        ],
        preDataZoomStart: 0, // 保存echarts dataZoom滑块位置
        preDataZoomEnd: 100,
        afterDataZoomStart: 0, // 保存echarts dataZoom滑块位置
        afterDataZoomEnd: 100,
        diffDataZoomStart: 0, // 保存echarts dataZoom滑块位置
        diffDataZoomEnd: 100,
      });
      // 请求接口
      getTenMinutesBefore(preParams);
      getTenMinutesAfter(afterParams);
      getTenMinutesDiff(diffParams);
      // warnId等于1是有故障
      if (warnId === 1) {
        getStandAloneList(singleParams);
        getSimilarityList(heatAndAllFansParams);
        getAllFanResultList(heatAndAllFansParams);
      }
    })
  };


  render() {
    const { openFlag, fansFlag } = this.state;
    const {
      showFlag,
      faultInfo: {
        deviceDatas
      },
    } = this.props;
    const item = deviceDatas && deviceDatas.map((cur, index) => {
      return (
        <div
          key={`${cur.deviceName}${index}`}
          style={{backgroundColor: index === fansFlag ?  "#ffffff" : "#199475"}}
          className={Number(cur.type) === 1 ? styles.yellowWarn : styles.blueWarn}
          onClick={() => {return this.handlerFansClick(cur, index, Number(cur.type))}}
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
