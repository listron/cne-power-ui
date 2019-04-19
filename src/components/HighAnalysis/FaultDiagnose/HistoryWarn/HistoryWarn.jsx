import React from "react";
import PropTypes from "prop-types";
import ModalFilter from '../Filter/Modal/ModalFilter';
import DateFilter from '../Filter/Date/DateFilter';
import FilteredItems from './FilteredItems/FilteredItems';
import HistoryWarnTable from './HistoryWarnTable/HistoryWarnTable';
import styles from "./historyWarn.scss";
import StationSelect from "../../../Common/StationSelect/index";
import DeviceSelect from "../../../Common/DeviceSelect/index";
import {Button, Icon} from "antd";
import CommonPagination from "../../../Common/CommonPagination/index";

const pageSize = 10, pageNum = 1, total = 100;
export default class HistoryWarn extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    stations: PropTypes.object,
    stationCode: PropTypes.number,
    deviceTypeCode:PropTypes.number,
    queryParam: PropTypes.object,
    onChangeFilter: PropTypes.func,
    selectDeviceCode: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.state = {
      showFilter: ""
    };
  }

  componentDidMount() {
  }

  onFilterShowChange = (filterText) => {
    const { showFilter } = this.state;
    if(showFilter === filterText){
      this.setState({
        showFilter: ''
      })
    }else{
      this.setState({
        showFilter: filterText
      })
    }
  };

  onOk = (selectDevice) => {
    const deviceFullCode = selectDevice.map(e => e.deviceCode);
    const { onChangeFilter } = this.props;
    onChangeFilter({
      deviceFullCode,
      selectDeviceCode: selectDevice
    })
  };

  selectStation = (value) => {
    const { onChangeFilter } = this.props;
    const { stationCode } = value[0];
    onChangeFilter({
      stationCode: stationCode
    });
  };

  render() {
    const { showFilter } = this.state;
    const {
      stations,
      stationCode,
      selectDeviceCode
    } = this.props;
    return (
      <div className={styles.historyWarn}>
        <div className={styles.topSearch}>
          <span>筛选条件</span>
          <Button onClick={()=>this.onFilterShowChange('modal')}>
            算法模型<Icon type={showFilter ==='modal' ? "up" : "down"} />
          </Button>
          <Button onClick={()=>this.onFilterShowChange('time')}>
            检测日期<Icon type={showFilter ==='time' ? "up" : "down"} />
          </Button>
        </div>
        <div className={styles.filterBox}>
          {showFilter==='modal' && <ModalFilter {...this.props} />}
          {showFilter==='time' && <DateFilter {...this.props} />}
        </div>
        <div className={styles.filterWrap}>
          <FilteredItems {...this.props} />
        </div>
        <div className={styles.topQuery}>
          <div>
            <span>电站名称</span>
            <StationSelect
              data={stations.toJS().filter(e => e.stationType === 0)}
              style={{ width: '200px' }}
              onOK={this.selectStation}
              disabledStation={stations.toJS().filter(e => e.isConnected === 0).map(e => e.stationCode)}
            />
          </div>
          <div>
            <span>风机名称</span>
            <DeviceSelect
              disabled={!+stationCode}
              stationCode={+stationCode}
              deviceTypeCode={101}
              style={{ width: 'auto', minWidth: '198px' }}
              onOK={this.onOk}
              multiple={true}
              deviceShowNumber={true}
              holderText={'请选择'}
              needAllCheck={true}
              value={selectDeviceCode}
            />
          </div>
          <div className={styles.check}>
            <Button>查询</Button>
            <span>重置</span>
          </div>
        </div>
        <div className={styles.topPage}>
          <CommonPagination pageSize={pageSize} currentPage={pageNum} total={total} onPaginationChange={this.onPaginationChange} />
        </div>
        <HistoryWarnTable {...this.props} />
      </div>
    );
  }
}
