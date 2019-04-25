import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Icon } from "antd";
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
    viewType: PropTypes.number,
    onChangeFilter: PropTypes.func,
    getAlgoModel: PropTypes.func,
    getList: PropTypes.func,
    getFanList: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      showPage: "modal", // 风场选择
      showStationSelect: false, //控制电场选择
    };
  }

  componentDidMount() {
  }

  hideStationChange = () => {
    this.setState({
      showStationSelect: false
    });
  };

  modalTypeFunc = () => {
    const {
      viewType,
    } = this.props;
    if (viewType === 1) {
      return <FaultWarnAlgorithm {...this.props} />;
    }
    if (viewType === 2) {
      return <FaultWarnFan {...this.props} />;
    }
    if (viewType === 3) {
      return <FaultWarnTable {...this.props} />
    }
  };

  clickModalType = () => {
    const {
      singleStationCode,
      getAlgoModel,
      onChangeFilter
    } = this.props;
    const algoParams = {
      stationCode: singleStationCode
    };
    onChangeFilter({
      viewType: 1 //展示算法
    });
    getAlgoModel(algoParams);
  };

  clickFanType = () => {
    const {
      onChangeFilter,
      singleStationCode,
      getFanList
    } = this.props;
    const fanParams = {
      stationCode: singleStationCode
    };
    onChangeFilter({
      viewType: 2 //展示风机
    });
    getFanList(fanParams);
  };

  clickListType = () => {
    const {
      singleStationCode,
      getList,
      onChangeFilter
    } = this.props;
    const listParams = {
      stationCode: singleStationCode,
      pageSize: 10,
      pageNum: 1,
      sortField: "",
      sortMethod: "",
    };
    onChangeFilter({
      viewType: 3 //展示列表
    });
    getList(listParams);
  };

  render() {
    const { stations, singleStationCode, viewType } = this.props;
    const { showStationSelect } = this.state;
    const stationItems = stations && stations.toJS();
    const stationItem = stationItems.filter(e => (e.stationCode === +singleStationCode))[0] || {};
    return (
      <div className={styles.faultWarnMain}>
        <div className={styles.title}>
          {showStationSelect &&
          <ChangeStation stations={stationItems.filter(e => e.stationType === 1)} stationName={stationItem.stationName} baseLinkPath="/analysis/faultDiagnose/fanWarn" hideStationChange={this.hideStationChange} />
          }
          <div className={styles.titleLeft}>
            <div onClick={() => this.setState({ showStationSelect: true })} className={styles.stationName}>
              <Icon className={styles.icon} type="swap" />
              <span>{stationItem.stationName}--{stationItem.provinceName}</span>
            </div>
          </div>
          <div className={styles.titleRight}>
            <div
              style={viewType === 1 ?
                { backgroundColor: "#199475" }
                : { backgroundColor: "#ffffff" }}
              onClick={this.clickModalType}
            >
              <div
                className={styles.iconBgc}
                style={viewType === 1 ? { color: "#ffffff" } : { color: "#595959" }}
              >
                <Icon className={styles.icon} type="swap" />
              </div>
              <div style={viewType === 1 ? { color: "#ffffff" } : { color: "#595959" }}>
                算法模型
              </div>
              <div className={styles.num}>
                <span>10</span>
              </div>
            </div>
            <div
              style={viewType === 2 ? { backgroundColor: "#199475" } : { backgroundColor: "#ffffff" }}
              onClick={this.clickFanType}
            >
              <div
                className={styles.iconBgc}
                style={viewType === 2 ? { color: "#ffffff" } : { color: "#595959" }}
              >
                <i className="iconfont icon-windlogo" />
              </div>
              <div style={viewType === 2 ? { color: "#ffffff" } : { color: "#595959" }}>
                风机
              </div>
              <div className={styles.num}>
                <span>8</span>
                <span>/13</span>
              </div>
            </div>
            <div
              style={viewType === 3 ? { backgroundColor: "#199475" } : { backgroundColor: "#ffffff" }}
              onClick={this.clickListType}
            >
              <div
                style={viewType === 3 ? { color: "#ffffff" } : { color: "#595959" }}
                className={styles.iconBgc}
              >
                <Icon className={styles.icon} type="swap" />
              </div>
              <div style={viewType === 3 ? { color: "#ffffff" } : { color: "#595959" }}>
                列表视图
              </div>
            </div>
          </div>
          <Link to="/analysis/faultDiagnose/faultWarn">
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
