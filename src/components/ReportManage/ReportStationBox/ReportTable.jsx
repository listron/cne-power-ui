import React from 'react';
import PropTypes from 'prop-types';
import styles from './reportStationBox.scss';
import CommonPagination from '../../Common/CommonPagination';
import TableColumnTitle from '../../Common/TableColumnTitle';
import { Button, Table } from 'antd';

class ReportTable extends React.Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context);
  }
  tableChange = () => {

  }
  planWidth = (length, paddingSize = 16, width = 20) => {
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
      }
    ));
  }
  render() {
    const { pageNum, pageSize, total } = this.props;
    const data = Array(30).fill({ '理论发电量': '22222' });
    const power = [
      { name: '理论发电量', unit: '万kWh', dataIndex: '理论发电量' },
      { name: '逆变器发电量', unit: '万kWh', dataIndex: '逆变器发电量' },
      { name: '集电线路发电量', unit: '万kWh', dataIndex: '集电线路发电量' },
      { name: '上网电量', unit: '万kWh', dataIndex: '上网电量' },
      { name: '购网电量', unit: '万kWh', dataIndex: '购网电量' },
      { name: '等效利用小时数', unit: 'h', dataIndex: '等效利用小时数' },
    ];
    const powerUse = [
      { name: '综合厂用电量', unit: '万kWh', dataIndex: '综合厂用电量' },
      { name: '综合厂用电率 ', unit: '%', dataIndex: '综合厂用电率 ' },
      { name: '厂用电量', unit: '万kWh', dataIndex: '厂用电量' },
      { name: '厂用电率', unit: '%', dataIndex: '厂用电率' },
      { name: '站用变电量', unit: '万kWh', dataIndex: '站用变电量' },
      { name: '厂损率', unit: '%', dataIndex: '厂损率' },
    ];
    const lost = [
      { name: '光伏方阵吸收损耗等效时', unit: 'h', dataIndex: '光伏方阵吸收损耗等效时' },
      { name: '逆变器损耗等效时 ', unit: 'h', dataIndex: '逆变器损耗等效时 ' },
      { name: '集电线路及箱变损耗等效时', unit: 'h', dataIndex: '集电线路及箱变损耗等效时' },
      { name: '升压站损耗等效时', unit: 'h', dataIndex: '升压站损耗等效时' },
    ];
    const sport = [
      { name: '综合效率', unit: '%', dataIndex: '综合效率' },
      { name: '可利用率', unit: '%', dataIndex: '可利用率' },
    ];
    const sportArr = this.tableChildren(sport);

    const jianpai = [
      { name: '节省标准煤', unit: 'h', dataIndex: '节省标准煤' },
      { name: '减排二氧化碳', unit: 'h', dataIndex: '减排二氧化碳' },
    ];
    const columns = [
      {
        title: '电站名称',
        dataIndex: 'stationName',
        key: 'stationName',
        width: 120,
        fixed: 'left',
        sorter: true,
      },
      {
        title: '统计时段',
        dataIndex: 'time',
        key: 'time',
        width: 120,
        fixed: 'left',
        sorter: true,
      },
      {
        title: '资源指标',
        children: [
          {
            title: '辐射总量(MJ/㎡)',
            children: [
              {
                title: '水平面',
                dataIndex: 'street',
                key: 'street',
                width: 110,
                className: styles.rightStyle,
              },
              {
                title: '倾斜面',
                dataIndex: '倾斜面',
                key: '倾斜面',
                width: 110,
                className: styles.rightStyle,
              },
            ],
          },
          {
            title: () => <TableColumnTitle title="峰值日照时数" unit="h" />,
            dataIndex: 'age',
            key: 'age',
            width: 120,
            className: styles.rightStyle,
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
              dataIndex: 'powervalue',
              key: 'powervalue',
              width: 120,
              className: styles.rightStyle,
            }, {
              title: '对应时间',
              dataIndex: 'time2',
              key: 'time2',
              // width: 120,
              className: styles.rightStyle,
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
          <div><Button type="primary">导出</Button></div>
          <div>
            <CommonPagination total={total} pageSize={pageSize} currentPage={pageNum} />
          </div>

        </div>
        <Table
          columns={columns}
          onChange={this.tableChange}
          dataSource={data}
          bordered
          scroll={{ x: 3200, y: 460 }}
          pagination={false}
        />

      </div>
    );
  }
}
export default (ReportTable);
/**
 [
          {
            title: () => <TableColumnTitle title="理论发电量" unit="万kWh" />,
            dataIndex: '理论发电量',
            key: '理论发电量',
            width: 120,
          },
          {
            title: () => <TableColumnTitle title="峰值日照时数" unit="h" />,
            dataIndex: '峰值日照时数',
            key: '峰值日照时数',
            width: 120,
          },
          {
            title: () => <TableColumnTitle title="集电线路发电量" unit="万kWh" />,
            dataIndex: '集电线路发电量',
            key: '集电线路发电量',
            width: 160,
          },
          {
            title: () => <TableColumnTitle title="上网电量" unit="万kWh" />,
            dataIndex: '上网电量',
            key: '上网电量',
            width: 120,
          },
          {
            title: () => <TableColumnTitle title="购网电量" unit="万kWh" />,
            dataIndex: '购网电量',
            key: '购网电量',
            width: 220,
          },
          {
            title: () => <TableColumnTitle title="等效利用小时数" unit="h" />,
            dataIndex: '等效利用小时数',
            key: '等效利用小时数',
            width: 120,
          },
        ],
 */
