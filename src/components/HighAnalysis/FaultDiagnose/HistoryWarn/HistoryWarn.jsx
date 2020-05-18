import React from 'react';
import PropTypes from 'prop-types';
import ModalFilter from '../Filter/Modal/ModalFilter';
import DateFilter from '../Filter/Date/DateFilter';
import FilteredItems from './FilteredItems/FilteredItems';
import HistoryWarnTable from './HistoryWarnTable/HistoryWarnTable';
import styles from './historyWarn.scss';
import StationSelect from '../../../Common/StationSelect/index';
import DeviceSelect from '../../../Common/DeviceSelect/index';
import { Button, Icon } from 'antd';
import CommonPagination from '../../../Common/CommonPagination/index';
import CneButton from '../../../Common/Power/CneButton';

export default class HistoryWarn extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    stations: PropTypes.object,
    stationCode: PropTypes.number,
    deviceTypeCode: PropTypes.number,
    queryParam: PropTypes.object,
    onChangeFilter: PropTypes.func,
    selectDeviceCode: PropTypes.array,
    getFaultWarnHistory: PropTypes.func,
    faultWarnHistoryData: PropTypes.object,
    pageSize: PropTypes.number,
    pageNum: PropTypes.number,
    createTimeStart: PropTypes.string,
    createTimeEnd: PropTypes.string,
    sortField: PropTypes.string,
    sortMethod: PropTypes.string,
    algorithmModalId: PropTypes.array,
    getAlgoOptionList: PropTypes.func,
    changeHistoryWarnStore: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      showFilter: '',
    };
  }

  componentDidMount() {
    const { getFaultWarnHistory, getAlgoOptionList } = this.props;
    const params = {
      stationCode: null,
      deviceFullCodes: [],
      algorithmIds: [],
      startTime: '',
      endTime: '',
      pageSize: 10,
      pageNum: 1,
      sortField: '',
      sortMethod: '',
    };
    // 算法列表
    getAlgoOptionList();
    // 历史列表
    getFaultWarnHistory(params);
  }

  onFilterShowChange = (filterText) => {
    const { showFilter } = this.state;
    if (showFilter === filterText) {
      this.setState({
        showFilter: '',
      });
    } else {
      this.setState({
        showFilter: filterText,
      });
    }
  };

  onOk = (selectDevice) => {
    const deviceFullCode = selectDevice.map(e => e.deviceCode);
    const { changeHistoryWarnStore } = this.props;
    changeHistoryWarnStore({
      deviceFullCode,
      selectDeviceCode: selectDevice,
    });
  };

  onPaginationChange = ({ currentPage, pageSize }) => {
    const {
      onChangeFilter,
    } = this.props;
    onChangeFilter({
      pageSize,
      pageNum: currentPage,
    });
  };

  selectStation = (value) => {
    const {
      changeHistoryWarnStore,
    } = this.props;
    const { stationCode } = value[0];
    changeHistoryWarnStore({
      stationCode,
      selectDeviceCode: [],
    });
  };

  resetSelectFunc = () => {
    const { onChangeFilter } = this.props;
    onChangeFilter({
      selectDeviceCode: [],
      stationCode: 0,
    });
  };

  //查询
  searchFunc = () => {
    const {
      onChangeFilter,
      stationCode,
      selectDeviceCode,
    } = this.props;

    onChangeFilter({
      stationCode,
      selectDeviceCode,
    });
  };


  render() {
    const { showFilter } = this.state;
    const {
      stations,
      stationCode,
      selectDeviceCode,
      faultWarnHistoryData: {
        count,
      },
      pageSize,
      pageNum,
    } = this.props;
    return (
      <div className={styles.historyWarn}>
        <div className={styles.serchWrap}>
          <div className={styles.topSearch}>
            <span>筛选条件</span>
            <Button onClick={() => this.onFilterShowChange('modal')}>
              算法模型<Icon type={showFilter === 'modal' ? 'up' : 'down'} />
            </Button>
            <Button onClick={() => this.onFilterShowChange('time')}>
              检测日期<Icon type={showFilter === 'time' ? 'up' : 'down'} />
            </Button>
          </div>
          <div className={styles.filterBox}>
            {showFilter === 'modal' && <ModalFilter {...this.props} />}
            {showFilter === 'time' && <DateFilter {...this.props} />}
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
                value={stations.toJS().filter(e => e.stationCode === stationCode)}
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
              <CneButton onClick={this.searchFunc} lengthMode="short">查询</CneButton>
              {(!!+stationCode) && (<span onClick={this.resetSelectFunc}>重置</span>)}
            </div>
          </div>
        </div>
        <CommonPagination pageSize={pageSize} currentPage={pageNum} total={count} onPaginationChange={this.onPaginationChange} className={styles.topPage} />
        <HistoryWarnTable {...this.props} />
      </div>
    );
  }
}
