import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Select, Table } from 'antd';
import AutoSelect from '@components/Common/AutoSelect';
import searchUtil from '@utils/searchUtil';
import styles from './device.scss';
const { Option } = Select;

class DeviceTable extends PureComponent{
  static propTypes = {
    deviceFilterName: PropTypes.string,
    deveiceLoading: PropTypes.bool,
    theme: PropTypes.string,
    devicesData: PropTypes.object,
    deviceTopData: PropTypes.object,
    deviceParam: PropTypes.object,
    history: PropTypes.object,
    devicePointsList: PropTypes.array,
    deviceCheckedList: PropTypes.array,
    deviceIndicators: PropTypes.array,
    changeOverviewStore: PropTypes.func,
    getConnectedDevices: PropTypes.func,
    getOverviewPoints: PropTypes.func,
  }

  constructor(props){
    super(props);
    const { devicesData, deviceIndicators, deviceCheckedList } = this.props;
    const { deviceData = [] } = devicesData;
    let tableColumn = this.baseColumn.map(e => ({ ...e, fixed: false, width: undefined })); // 取消定位和指定宽度
    if (deviceData.length > 0) { // 有数据, 直接渲染。
      const filteredDevice = deviceData.map(e => ({ //测点筛选
        ...e,
        pointData: e.pointData.filter(m => deviceCheckedList.includes(m.pointCode)),
      }));
      tableColumn = this.createColumn(this.baseColumn, filteredDevice, deviceIndicators);
    }
    this.state = { tableColumn };
  }

  componentWillReceiveProps(nextProps){
    const { deveiceLoading, devicesData, deviceIndicators } = nextProps;
    const preLoading = this.props.deveiceLoading;
    if (!deveiceLoading && preLoading) { // 请求数据得到
      const { deviceData = [] } = devicesData;
      this.setState({ // 基于返回的测点数据生成表头
        tableColumn: this.createColumn(this.baseColumn, deviceData, deviceIndicators),
      });
    }
  }

  indicators = ['validCount', 'invalidCount', 'lostCount']

  baseColumn = [
    {
      title: '设备名称',
      dataIndex: 'deviceName',
      fixed: 'left',
      sorter: (a, b) => (a.deviceSortName) && a.deviceSortName.localeCompare(b.deviceSortName),
      width: 125,
      className: styles.deviceName,
      render: (text, record) => (
        <span
          className={styles.deviceLink}
          data-code={record.deviceFullcode}
          onClick={this.checkDevice}
          title={text}
        >{text}</span>
      ),
    }, {
      title: '真实数据量',
      dataIndex: 'realCount',
      fixed: 'left',
      width: 130,
      // className: styles.realCount,
      sorter: (a, b) => a.realCount - b.realCount,
    }, {
      title: '设备数据完整率',
      dataIndex: 'completeRate',
      fixed: 'left',
      width: 155,
      // className: styles.completeRate,
      sorter: (a, b) => a.completeRate - b.completeRate,
    },
  ]

  checkDevice = ({ target = {} }) => {
    const { code } = target.dataset || {};
    if (code) {
      const { history, deviceTopData, deviceParam, devicePointsList, deviceCheckedList } = this.props;
      const { stationCode, deviceTypeCode } = deviceParam;
      const { pathname, search } = history.location;
      const { pages = '' } = searchUtil(search).parse();
      const allPages = pages.split('_').filter(e => !!e); // 开启的tab页面
      !allPages.includes('point') && allPages.push('point');
      const pointParam = { // 请求参数
        ...deviceParam,
        deviceFullcode: code,
      };
      this.props.changeOverviewStore({ // 已得基础信息传入设备页 - 减少不必要请求
        tab: 'point', // 激活的tab页, station, device, point
        autoDevice: false, // 按指定传入项处理选中设备 - 拒绝默认
        pages: allPages, // 开启的tab页面
        pointTopData: deviceTopData,
        pointParam, // 请求参数保存
        pointList: devicePointsList,
        pointsCheckedList: deviceCheckedList,
        pointsData: [], // 清空原数据
      });
      this.props.getConnectedDevices({ // 电站,设备类型下可用的设备列表
        stationCode,
        deviceTypeCode,
        isConnected: 1,
      });
      this.props.getOverviewPoints({ // 基于已有数据重新请求测点数据
        ...pointParam,
        pointCodes: deviceCheckedList,
      });
      const newSearch = searchUtil(search).replace({ // 路径 替换/添加 device信息
        point: JSON.stringify(pointParam),
        pages: allPages.join('_'), // 激活项添加
        tab: 'point', // 激活页切换
      }).stringify();
      history.push(`${pathname}?${newSearch}`); // 路径保存
    }
  }

  pointsCheck = (pointsChecked) => { // 测点筛选
    const pointsCode = pointsChecked.map(e => e.value);
    const { devicesData, deviceIndicators } = this.props;
    const { deviceData = [] } = devicesData;
    // const { indicators } = this.state;
    const filteredDevice = deviceData.map(e => ({ //测点筛选
      ...e,
      pointData: e.pointData.filter(m => pointsCode.includes(m.pointCode)),
    }));
    this.setState({
      tableColumn: this.createColumn(this.baseColumn, filteredDevice, deviceIndicators),
    });
    this.props.changeOverviewStore({
      deviceCheckedList: pointsChecked.map(e => e.value),
    });
  }

  changeNumType = (deviceIndicators) => { // 指标类型筛选
    const { devicesData, deviceCheckedList } = this.props;
    const { deviceData = [] } = devicesData;
    const filteredDevice = deviceData.map(e => ({ //测点筛选
      ...e,
      pointData: e.pointData.filter(m => deviceCheckedList.includes(m.pointCode)),
    }));
    const tableColumn = this.createColumn(this.baseColumn, filteredDevice, deviceIndicators);
    this.props.changeOverviewStore({ deviceIndicators });
    this.setState({ tableColumn });
  }

  createColumn = (baseColumn, deviceData = [], indicators) => {
    const indicatorNames = {
      validCount: '有效值数',
      invalidCount: '无效值数',
      lostCount: '缺失值数',
    };
    const { pointData = [] } = deviceData[0] || {};
    const extraColum = pointData.map((e, i) => ({
      title: () => (
        <div
          title={e.pointName}
          className={styles.eachIndicateTitle}
          style={{width: `${indicators.length * 110 - 32}px`}}
        >{e.pointName}</div>
      ),
      dataIndex: `${e.pointCode}`,
      className: styles.eachIndicate,
      children: indicators.map(indicate => ({
        title: indicatorNames[indicate],
        key: `${e.pointCode}.${indicate}`,
        dataIndex: 'pointData',
        sorter: true,
        width: 110,
        render: (text, record) => {
          const { pointData = [] } = record;
          const pointInfo = pointData.find(point => point.pointCode === e.pointCode) || {};
          return pointInfo[indicate];
        },
      })),
    }));
    // const newBaseColumn = [...baseColumn]
    // let tableWidth = '100%', scrollable = { x: scrollWidth };
    const scrollWidth = 410 + pointData.length * indicators.length * 110; // 计算的长度
    if ((this.tableRef && scrollWidth < this.tableRef.offsetWidth) || !this.tableRef) {
      return baseColumn.map(e => ({ ...e, fixed: false, width: undefined })).concat(extraColum);
    }
    return baseColumn.concat(extraColum);
  }

  render(){
    const { devicePointsList, deviceCheckedList, devicesData, theme, deviceIndicators, deveiceLoading, deviceFilterName } = this.props;
    const { tableColumn } = this.state;
    const { deviceData = [] } = devicesData;
    // const { pointData = []} = deviceData[0] || {};
    // const actualPoints = pointData.filter(e => deviceCheckedList.includes(e.pointCode)); // 选中测点与实际测点数据的交集才是实际数据列
    // const scrollWidth = 410 + actualPoints.length * deviceIndicators.length * 110;
    const scrollWidth = 410 + deviceCheckedList.length * (deviceIndicators.length * 110 + 1); // 经讨论, 选中测点即是表格的测点列。 +1 是为了适配多余的border宽度
    const dataSource = deviceFilterName ? [deviceData.find(e => e.deviceName === deviceFilterName)] : deviceData; // 图表筛选
    // if (this.tableRef && scrollWidth < this.tableRef.offsetWidth) {
    // //   tableWidth = `${scrollWidth}px`;
    //   scrollable = {x: this.tableRef.offsetWidth}; // 横向铺满
    // }
    return(
      <div className={styles.devicePoints} ref={(ref) => { this.tableRef = ref; }}>
        <div className={styles.pointHandle}>
          <span className={styles.text}>测点</span>
          <AutoSelect
            theme={theme}
            data={[{
              value: 'points',
              label: '测点',
              children: devicePointsList,
            }]}
            value={deviceCheckedList}
            onChange={this.pointsCheck}
            style={{width: '200px', marginRight: '8px'}}
            maxTagCount={0}
          />
          <span className={styles.text}>指标名称</span>
          <span ref={(ref) => { this.pointRef = ref; }} />
          <Select
            onChange={this.changeNumType}
            placeholder="请选择"
            mode="tags"
            style={{width: '288px'}}
            className={styles.eachType}
            value={deviceIndicators}
            getPopupContainer={() => this.pointRef}
          >
            <Option value="validCount">有效值数</Option>
            <Option value="invalidCount">无效值数</Option>
            <Option value="lostCount">缺失值数</Option>
          </Select>
        </div>
        <Table
          className={styles.pointTable}
          columns={tableColumn}
          dataSource={dataSource}
          bordered
          pagination={false}
          // style={{ width: tableWidth }}
          loading={{
            spinning: deveiceLoading,
            delay: 200,
          }}
          scroll={{ x: dataSource.length > 0 ? scrollWidth : true }}
        />
      </div>
    );
  }
}

export default DeviceTable;
