import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Select, Table } from 'antd';
import AutoSelect from '@components/Common/AutoSelect';
import styles from './device.scss';
const { Option } = Select;

class DeviceTable extends PureComponent{
  static propTypes = {
    devicesData: PropTypes.object,
    devicePointsList: PropTypes.array,
    deviceCheckedList: PropTypes.array,
  }

  state = {
    indicators: ['validCount', 'invalidCount', 'lostCount'], // validCount	有效值数;invalidCount	无效值数;lostCount	缺失值数
  }

  baseColumn = [
    {
      title: '设备名称',
      dataIndex: 'deviceName',
    }, {
      title: '真实数据量',
      dataIndex: 'actualNum',
    }, {
      title: '设备数据完整率',
      dataIndex: 'completeRate',
    },
  ]

  pointsCheck = (a, b, c) => { // 测点筛选
    console.log(a, b, c);
  }

  changeNumType = (a, b, c) => { // 指标类型筛选
    console.log(a, b, c);
  }

  createColumn = (points, indicators) => {
    const indicatorNames = {
      validCount: '有效值数',
      invalidCount: '无效值数',
      lostCount: '缺失值数',
    };
    const extraColum = points.map(e => ({
      title: e.label,
      children: indicators.map(t => ({
        title: indicatorNames[t],
        dataIndex: `${e.value}.${t}`,
        width: 90,
      })),
    }));
    return this.baseColumn.concat(extraColum);
    // return this.baseColumn;
  }

  render(){
    const { devicePointsList, deviceCheckedList, devicesData } = this.props;
    const { indicators } = this.state;
    const tableColumn = this.createColumn(devicePointsList, indicators);
    // console.log(tableColumn, devicesData.deviceData);
    return(
      <div className={styles.devicePoints}>
        <div className={styles.pointHandle}>
          <span className={styles.text}>测点</span>
          <AutoSelect
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
          <Select
            onChange={this.changeNumType}
            placeholder="请选择"
            mode="tags"
            style={{width: '288px'}}
            className={styles.eachType}
          >
            <Option value="validCount">有效值数</Option>
            <Option value="invalidCount">无效值数</Option>
            <Option value="lostCount">缺失值数</Option>
          </Select>
        </div>
        <Table
          className={styles.pointTable}
          columns={this.createColumn(devicePointsList, indicators)}
          dataSource={devicesData.deviceData}
          bordered
          size="middle"
          scroll={{ x: '130%', y: 240 }}
        />
      </div>
    );
  }
}

export default DeviceTable;
