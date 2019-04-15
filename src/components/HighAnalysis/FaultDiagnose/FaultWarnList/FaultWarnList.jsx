import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Icon } from "antd";
import { siblings } from "../../../../utils/utilFunc.js";
import ChangeStation from '../../../Monitor/StationMonitor/SingleStation/SingleStationCommon/ChangeStation';
import FaultWarnAlgorithm from "./FaultWarnAlgorithm/FaultWarnAlgorithm";
import FaultWarnFan from "./FaultWarnFan/FaultWarnFan";
import FaultWarnTable from "./FaultWarnTable/FaultWarnTable";
import styles from "./faultWarnList.scss";


export default class FaultWarn extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    history: PropTypes.object,
    stations: PropTypes.object,
    singleStationCode: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      showPage: "modal", // 风场选择
      showType: "algorithm" // 单风场模型
    };
  }

  componentDidMount() {
    this.addEvent();
  }

  hideStationChange = () => {
    this.setState({
      showStationSelect: false
    });
  };

  modalTypeFunc = () => {
    const { showType } = this.state;
    if (showType === "algorithm") {
      return <FaultWarnAlgorithm {...this.props} />;
    }
    if (showType === "fan") {
      return <FaultWarnFan {...this.props} />;
    }
    return <FaultWarnTable {...this.props} />
  };

  clickModalType = type => {
    this.setState({
      showType: type
    });
  };

  addEvent() {
    const { box } = this;
    const arr = box.children;
    const ways = [];
    for (let i = 0; i < arr.length; i+=1) {
      ways.push(arr[i]);
    }
    Array.prototype.forEach.call(ways, (item) => {
      item.addEventListener("click", this.checkType);
    });
  }

  checkType() {
    /* eslint-disable no-param-reassign */
    siblings(this).forEach((item, index, arr) => {
      arr[index].children[0].style.color = "#595959";
      arr[index].children[1].style.color = "#595959";
      arr[index].style.backgroundColor = "#ffffff";
    });
    this.children[0].style.color = "#ffffff";
    this.children[1].style.color = "#ffffff";
    this.style.backgroundColor = "#199475";
  }

  render() {
    const { stations, singleStationCode } = this.props;
    const { showStationSelect } = this.state;
    const stationItems = stations && stations.toJS();
    const stationItem = stationItems.filter(e => (e.stationCode === +singleStationCode))[0] || {};
    return (
      <div className={styles.faultWarnMain}>
        <div className={styles.title}>
          {showStationSelect &&
          <ChangeStation stations={stationItems.filter(e => e.stationType === 1)} stationName={stationItem.stationName} baseLinkPath="/statistical/stationaccount/allstation" hideStationChange={this.hideStationChange} />
          }
          <div className={styles.titleLeft}>
            <div onClick={() => this.setState({ showStationSelect: true })} className={styles.stationName}>
              <Icon className={styles.icon} type="swap" />
              <span>{stationItem.stationName}--{stationItem.provinceName}</span>
            </div>
          </div>
          <div className={styles.titleRight} ref={ref => this.box = ref}>
            <div onClick={() => {return this.clickModalType("algorithm")}}>
              <div className={styles.iconBgc}>
                <Icon className={styles.icon} type="swap" />
              </div>
              <div>
                算法模型
              </div>
              <div className={styles.num}>
                <span>10</span>
              </div>
            </div>
            <div onClick={() => {return this.clickModalType("fan")}}>
              <div className={styles.iconBgc}>
                <i className="iconfont icon-windlogo" />
              </div>
              <div className={styles.name}>
                风机
              </div>
              <div className={styles.num}>
                <span>8</span>
                <span>/13</span>
              </div>
            </div>
            <div onClick={() => {return this.clickModalType("list")}}>
              <div className={styles.iconBgc}>
                <Icon className={styles.icon} type="swap" />
              </div>
              <div>
                列表视图
              </div>
            </div>
          </div>
          <Link to="">
            <Icon type="arrow-left" className={styles.backIcon} />
          </Link>
        </div>
        <div className={styles.faultWarnMainCenter}>
          {this.modalTypeFunc()}
        </div>
      </div>
    );
  }
}
