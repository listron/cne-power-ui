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
    stationDeviceList: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      openFlag: true, // 控制打开关闭
    };
  }

  componentDidMount() {
    const {
      navList: { clientHeight },
      props: {
        onChangeFilter,
        getStationDeviceList,
        stationCode
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


  render() {
    const { openFlag } = this.state;
    const {
      showFlag,
      stationDeviceList: {
        context: deviceList
      }
    } = this.props;
    console.log(deviceList, "deviceList");
    const item = deviceList && deviceList.map(cur => {
      return (
        <div key={cur.deviceCode}>
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
