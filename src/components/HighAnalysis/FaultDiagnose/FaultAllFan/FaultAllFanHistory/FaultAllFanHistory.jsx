import React from "react";
import PropTypes from "prop-types";
import { Modal, Table } from 'antd';
import CommonPagination from '../../../../Common/CommonPagination';
import styles from "./faultAllFanHistory.scss";

const pageSize = 10, pageNum = 1, total = 100;
export default class FaultAllFanHistory extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    visibleFlag: PropTypes.bool,
    onVisible: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  componentDidMount() {

  }

  handleCancel = () => {
    const { onVisible } = this.props;
    onVisible(false);
  };

  onPaginationChange = ({ currentPage, pageSize }) => {
    const { onChangeFilter } = this.props;
    onChangeFilter({
      pageNum: currentPage,
      pageSize
    });
  };


  render() {
    const { visibleFlag } = this.props;
    const { loading } = this.props;
    const columns = [{
      title: '检测开始时间',
      dataIndex: 'defectLevel',
      key: 'defectLevel',
    }, {
      title: '检测结束时间',
      dataIndex: 'stationName',
      key: 'stationName',
    }, {
      title: '计划执行时间',
      dataIndex: 'deviceName',
      key: 'deviceName',
    }, {
      title: '执行开始时间',
      dataIndex: 'defectTypeName',
      key: 'defectTypeName',
    }, {
      title: '执行结束时间',
      dataIndex: 'defectDescribe',
      key: 'defectDescribe',
    }, {
      title: '状态',
      dataIndex: 'result',
      key: 'result',
      render: (text, record) => (
        <span>
          <i className="iconfont icon-look" onClick={() => { this.onShowDetail(record) }} />
        </span>
      )
    },{
      title: '预警台数',
      dataIndex: 'num',
      key: 'num',
      sorter: true,
    }];
    return (
      <Modal
        visible={visibleFlag}
        footer={null}
        width={1390}
        onCancel={this.handleCancel}
      >
        <div className={styles.faultAllFanHistory}>
          <div className={styles.fanHistoryPagination}>
            <CommonPagination pageSize={pageSize} currentPage={pageNum} total={total} onPaginationChange={this.onPaginationChange} />
          </div>
          <Table
            pagination={false}
            loading={loading}
            columns={columns}
            locale={{ emptyText: <div className={styles.noData}><img src="/img/nodata.png" style={{ width: 223, height: 164 }} /></div> }}
          />
        </div>
      </Modal>
    );
  }
}
