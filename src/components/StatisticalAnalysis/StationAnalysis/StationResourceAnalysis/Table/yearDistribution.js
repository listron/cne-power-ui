import React from 'react';
import styles from './styles.scss';
import { Table } from 'antd';

class TableGraph extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  onMouseEnter = (record) => {

    return (
      <div>xuanfukuang</div>
    );
  }
  //table排序
  getSort(a, b, sortBy, variable) {
    let result;
    sortBy === 'descend' ? result = -1 : result = 1;
    if (!a[variable]) {
      return 1 * result;
    }
    if (!b[variable]) {
      return -1 * result;
    }
    return a[variable] - b[variable];
  }

  getRadiationSort(a, b, sortBy, variable) {
    if (!a[variable].split('-')[1]) {
      return 1;
    }
    if (!b[variable].split('-')[1]) {
      return -1;
    }
    return a[variable].split('-')[0] - b[variable].split('-')[0];
  }

  render() {
    const { column, dataArray, theme } = this.props;
    const children = column.map((item) => {
      return {
        title: item,
        dataIndex: item,
        key: item,
        sorter: (a, b, sortBy) => this.getSort(a, b, sortBy, item),
        width: 90,
        render: text => (text || text === 0) ? text : '--',
      };
    });
    const columns = [
      {
        title: '瞬时辐射区间',
        dataIndex: 'radiationInterval',
        key: 'radiationInterval',
        width: 120,
        // fixed: 'left',
        defaultSortOrder: 'ascend',
        sorter: (a, b, sortBy) => this.getRadiationSort(a, b, sortBy, 'radiationInterval'),
        render: text => (text || text === 0) ? text : '--',
      }, {
        title: '辐射总量',
        children: children,
      }];
    const data = dataArray && dataArray.map((e, i) => ({ ...e, key: i }));
    return (
      <div className={`${styles.TableGraphContainer} ${styles[theme]}`} >
        <div className={styles.TableGraphContainerTitle}>
          <div>
            光资源分布排名
          </div>
          <div>
            瞬时辐射区间:w/㎡ ,辐射总量:MJ/㎡
          </div>
        </div>
        <Table
          className={styles.tableList}
          columns={columns}
          bordered
          dataSource={data}
          pagination={false}
          scroll={{ x: '150%', y: 151 }}
          size="small"
          onRow={(record) => { return { onMouseEnter: this.onMouseEnter }; }} />
      </div>
    );
  }
}
export default (TableGraph);
