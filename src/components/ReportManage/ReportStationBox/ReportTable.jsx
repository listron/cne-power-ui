import React from 'react';
import PropTypes from 'prop-types';
import styles from './reportStationBox.scss';
import CommonPagination from '../../Common/CommonPagination';
import TableColumnTitle from '../../Common/TableColumnTitle';
import { Button, Table, message } from 'antd';
import { dataFormat } from '../../../utils/utilFunc';
import path from '../../../constants/path';
import moment from 'moment';
const { APIBasePath } = path.basePaths;
const { reportManage } = path.APISubPaths;

class ReportTable extends React.Component {
  static propTypes = {
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    total: PropTypes.number,
    loading: PropTypes.bool,
    exportLoading: PropTypes.bool,
    getReportStationList: PropTypes.func,
    exportReportStationList: PropTypes.func,
    downLoadFile: PropTypes.func,
    changeStore: PropTypes.func,
    startTime: PropTypes.string,
    dateType: PropTypes.string,
    endTime: PropTypes.string,
    stationCodes: PropTypes.array,
    reportStationList: PropTypes.array,
    orderFiled: PropTypes.string,
    orderType: PropTypes.string,
  }
  constructor(props, context) {
    super(props, context);
  }
  changePage = ({ currentPage, pageSize }) => {
    this.props.changeStore({
      pageSize,
      pageNum: currentPage,
    });
    this.searchReportData({
      pageSize,
      pageNum: currentPage,
    });

  }
  tableChange = (pagination, filter, sorter) => {
    const { field, order } = sorter;
    const orderFiled = field === 'stationName' ? 'station_name' : 'report_time';
    const orderType = order === 'ascend' ? 'asc' : 'desc';
    this.searchReportData({
      orderFiled,
      orderType,
    });

  }
  searchReportData = (value) => {
    const { startTime, endTime, stationCodes, dateType, orderFiled, orderType, pageNum, pageSize } = this.props;
    const params = { startTime, endTime, stationCodes, dateType, orderFiled, orderType, pageNum, pageSize };
    this.props.getReportStationList({
      ...params,
      ...value,
    });
  }

  planWidth = (length, paddingSize = 16, width = 28) => {
    return 14 * length + paddingSize + width;
  }
  tableChildren = (nameArr) => {
    return nameArr.map((e, i) => (
      {
        title: () => <TableColumnTitle title={e.name} unit={e.unit} />,
        dataIndex: e.dataIndex,
        key: e.dataIndex,
        className: styles.rightStyle,
        width: (e.name && e.name.length) && this.planWidth(e.name.length),
        render: (text) => (dataFormat(text, '--', 2)),
      }
    ));
  }
  exportReportStation = () => {
    const { startTime, endTime, stationCodes, dateType, orderFiled, orderType } = this.props;
    const timeLength = moment(endTime).diff(startTime, 'day') + 1;
    const limitMax = stationCodes.length * timeLength > 200000;
    if (limitMax) {
      message.warning('数据量过大，请减少电站数量或缩短时间范围的选择');
    } else {
      const params = { startTime, endTime, stationCodes, dateType, orderFiled, orderType };
      this.props.downLoadFile({
        url: `${APIBasePath}${reportManage.exportReportStationList}`,
        params: { ...params },
      });
    }

  }
  render() {
    const { pageNum, pageSize, total, loading, reportStationList, exportLoading } = this.props;


    const disabledExport = !reportStationList.length;
    const power = [
      { name: '理论发电量', unit: '万kWh', dataIndex: 'theoryPower', key: 'theoryPower' },
      { name: '逆变器发电量', unit: '万kWh', dataIndex: 'genInverter', key: 'genInverter' },
      { name: '集电线路发电量', unit: '万kWh', dataIndex: 'genIntegrated', key: 'genIntegrated' },
      { name: '上网电量', unit: '万kWh', dataIndex: 'genInternet', key: 'genInternet' },
      { name: '购网电量', unit: '万kWh', dataIndex: 'buyPower', key: 'buyPower' },
      { name: '等效利用小时数', unit: 'h', dataIndex: 'equivalentHours', key: 'equivalentHours' },
    ];
    const powerUse = [
      { name: '综合厂用电量', unit: '万kWh', dataIndex: 'comPlantPower', key: 'comPlantPower' },
      { name: '综合厂用电率 ', unit: '%', dataIndex: 'complantPowerRate', key: 'complantPowerRate' },
      { name: '厂用电量', unit: '万kWh', dataIndex: 'dayPlantUsePower', key: 'dayPlantUsePower' },
      { name: '厂用电率', unit: '%', dataIndex: 'plantPowerRate', key: 'plantPowerRate' },
      { name: '站用变电量', unit: '万kWh', dataIndex: 'genPlantConsume', key: 'genPlantConsume' },
      { name: '厂损率', unit: '%', dataIndex: 'plantLossRate', key: 'plantLossRate' },
    ];
    const lost = [
      { name: '光伏方阵吸收损耗等效时', unit: 'h', dataIndex: 'pvMatrixLossHours', key: 'pvMatrixLossHours' },
      { name: '逆变器损耗等效时 ', unit: 'h', dataIndex: 'inverterLostEH', key: 'inverterLostEH' },
      { name: '集电线路及箱变损耗等效时', unit: 'h', dataIndex: 'integratedLostEH', key: 'integratedLostEH' },
      { name: '升压站损耗等效时', unit: 'h', dataIndex: 'internetLostEH', key: 'internetLostEH' },
    ];
    const sport = [
      { name: '综合效率', unit: '%', dataIndex: 'comPR', key: 'comPR' },
      { name: '可利用率', unit: '%', dataIndex: 'stationAvailability', key: 'stationAvailability' },
    ];
    const sportArr = this.tableChildren(sport);

    const jianpai = [
      { name: '节省标准煤', unit: '吨', dataIndex: 'markCoal', key: 'markCoal' },
      { name: '减排二氧化碳', unit: '吨', dataIndex: 'carbonDioxide', key: 'carbonDioxide' },
    ];
    const columns = [
      {
        title: '电站名称',
        dataIndex: 'stationName',
        key: 'stationName',
        width: 120,
        fixed: 'left',
        sorter: true,
        render: (text) => (<div className={styles.stationName} title={text}>{text ? text : '--'}</div>),
      },
      {
        title: '统计时段',
        dataIndex: 'date',
        key: 'date',
        width: 125,
        fixed: 'left',
        sorter: true,
        render: (text) => (<div className={styles.stationName} title={text}>{text ? text : '--'}</div>),
      },
      {
        title: '资源指标',
        children: [
          {
            title: '辐射总量(MJ/㎡)',
            children: [
              {
                title: '水平面',
                dataIndex: 'resourceValue',
                key: 'resourceValue',
                width: 120,
                className: styles.rightStyle,
                render: (text) => (<div className={styles.stationName} title={text}>{text ? text : '--'}</div>),
              },
              {
                title: '倾斜面',
                dataIndex: 'slopeAccRadiationSum',
                key: 'slopeAccRadiationSum',
                width: 120,
                className: styles.rightStyle,
                render: (text) => (<div className={styles.stationName} title={text}>{text ? text : '--'}</div>),
              },
            ],
          },
          {
            title: () => <TableColumnTitle title="峰值日照时数" unit="h" />,
            dataIndex: 'topSunshineHours',
            key: 'topSunshineHours',
            width: 120,
            className: styles.rightStyle,
            render: (text) => (<div className={styles.stationName} title={text}>{text ? text : '--'}</div>),

          },
        ],
      }, {
        title: '电量指标',
        children: this.tableChildren(power),
      }, {
        title: '能耗指标',
        children: this.tableChildren(powerUse),
      }, {
        title: '损耗指标',
        children: this.tableChildren(lost),
      }, {
        title: '运动水平指标',
        children: [{
          title: '最大出力',
          children: [
            {
              title: '功率值(MW)',
              dataIndex: 'outputPowerMax',
              key: 'outputPowerMax',
              // width: 120,
              className: styles.rightStyle,
              render: (text) => (<div className={styles.stationName} title={text}>{text ? text : '--'}</div>),

            }, {
              title: '对应时间',
              dataIndex: 'dayPowerMaxTime',
              key: 'dayPowerMaxTime',
              width: 180,
              className: styles.rightStyle,
              render: (text) => (<div className={styles.timeStyle} title={text}>{text ? text : '--'}</div>),

            },
          ],
        },
        ...sportArr,
        ],
      }, {
        title: '减排量',
        children: this.tableChildren(jianpai),
      },
    ];
    return (
      <div className={styles.reportList}>
        <div className={styles.handlePage}>
          <div><Button type="primary" onClick={this.exportReportStation} loading={exportLoading} disabled={disabledExport}>导出</Button></div>
          <div>
            <CommonPagination total={total} pageSize={pageSize} currentPage={pageNum} onPaginationChange={this.changePage} />
          </div>

        </div>
        <Table
          loading={loading}
          columns={columns}
          onChange={this.tableChange}
          dataSource={reportStationList.map((e, i) => ({ ...e, key: i }))}
          bordered
          scroll={{ x: 3480, y: 450 }}
          pagination={false}
        />

      </div>
    );
  }
}
export default (ReportTable);
