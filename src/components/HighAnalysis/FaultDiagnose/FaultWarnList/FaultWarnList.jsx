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
    algoModelData: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      showPage: "modal", // 风场选择
      showStationSelect: false, //控制电场选择
    };
  }

  componentDidMount() {
    const { main } = this;
    main && main.addEventListener('click', this.hideStationChange, true);
  }

  componentWillUnmount() {
    const { main } = this;
    main && main.removeEventListener('click', this.hideStationChange, true);
  }

  hideStationChange = () => {
    this.setState({
      showStationSelect: false
    });
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
      sortField: "prediction_date",
      sortMethod: "desc",
    };
    onChangeFilter({
      viewType: 3 //展示列表
    });
    getList(listParams);
  };

  algorithmModalNumFunc = () => {
    const {
      algoModelData: {
        healthList,
        largeSizeList,
        natureList
    }} = this.props;
    const arr = []; //保存有故障的
    healthList.forEach(item => {
      if (item.windTurbines.length !== 0) {
        arr.push(item);
      }
    });
    largeSizeList.forEach(item => {
      if (item.windTurbines.length !== 0) {
        arr.push(item);
      }
    });
    natureList.forEach(item => {
      if (item.windTurbines.length !== 0) {
        arr.push(item);
      }
    });
    return arr.length;
  };

  allFansWarnNum = () => {
    const { stations, singleStationCode } = this.props;
    const faultAllWarnList = JSON.parse(localStorage.getItem("faultAllWarnList"));
    const stationItems = stations && stations.toJS();
    const stationItem = stationItems.filter(e => (e.stationCode === +singleStationCode))[0] || {};
    // 判断当前风场的名字和存储的名字相等取出故障数量和总数量
    let faultUnitCount = 0;
    let stationUnitCount = 0;
    faultAllWarnList.forEach((cur) => {
      if (cur.stationName === stationItem.stationName) {
        faultUnitCount = cur.faultUnitCount;
        stationUnitCount = cur.stationUnitCount;
      }
    });
    return (
      <div className={styles.num}>
        <span>{faultUnitCount}</span>
        <span>{`/${Number(stationUnitCount)}`}</span>
      </div>
    );
  };

  render() {
    const { stations, singleStationCode, viewType } = this.props;
    const { showStationSelect } = this.state;
    const stationItems = stations && stations.toJS();
    const stationItem = stationItems.filter(e => (e.stationCode === +singleStationCode))[0] || {};
    return (
      <div className={styles.faultWarnMain} ref={(ref) => {this.main = ref;}}>
        <div className={styles.title}>
          {showStationSelect &&
          <ChangeStation stations={stationItems.filter(e => e.stationType === 0)} stationName={stationItem.stationName} baseLinkPath="/analysis/faultDiagnose/fanWarn" hideStationChange={this.hideStationChange} />
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
                <i className="iconfont icon-grid" />
              </div>
              <div style={viewType === 1 ? { color: "#ffffff" } : { color: "#595959" }}>
                算法模型
              </div>
              <div className={styles.num}>
                <span>{this.algorithmModalNumFunc()}</span>
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
              {this.allFansWarnNum()}
            </div>
            <div
              style={viewType === 3 ? { backgroundColor: "#199475" } : { backgroundColor: "#ffffff" }}
              onClick={this.clickListType}
            >
              <div
                style={viewType === 3 ? { color: "#ffffff" } : { color: "#595959" }}
                className={styles.iconBgc}
              >
                <i className="iconfont icon-table" />
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
          {(viewType === 1) && (<FaultWarnAlgorithm {...this.props} />)}
          {(viewType === 2) && (<FaultWarnFan {...this.props} />)}
          {(viewType === 3) && (<FaultWarnTable {...this.props} />)}
        </div>
      </div>
    );
  }
}
