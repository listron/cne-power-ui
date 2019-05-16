import React from "react";
import PropTypes from "prop-types";
import { Icon } from "antd";
import styles from "./faultNavList.scss";

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
      }
    } = this;
    getStationDeviceList();
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
    const { onChangeFilter } = this.props;
    // 目前先不用掉接口
    this.setState({
      fansFlag: index
    }, () => {
      // 改变设备选中
      onChangeFilter({
        warnId
      });
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
          key={`${cur.algorithmName}${index}`}
          style={{backgroundColor: index === fansFlag ?  "#ffffff" : "#199475"}}
          className={cur.warnId === 1 ? styles.redWarn : styles.blueWarn}
          onClick={() => {return this.handlerFansClick(cur, index, cur.warnId)}}
        >
          {cur.algorithmName}
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
