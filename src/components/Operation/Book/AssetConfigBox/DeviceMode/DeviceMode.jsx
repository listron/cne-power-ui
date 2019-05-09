import React from "react";
import PropTypes from "prop-types";
import styles from "./deviceMode.scss";
import { Button, Table, Form, Input, Icon } from 'antd';
import Pagination from '../../../../Common/CommonPagination';
import WarningTip from '../../../../Common/WarningTip';
const FormItem = Form.Item;
class DeviceMode extends React.Component {
  static propTypes = {
    changeAssetConfigStore: PropTypes.func,
    getDeviceModesList: PropTypes.func,
    deleteDeviceModes: PropTypes.func,
    deviceModesList: PropTypes.array,
    pageSize: PropTypes.number,
    pageNum: PropTypes.number,
    total: PropTypes.number,
    orderField: PropTypes.string,
    orderMethod: PropTypes.string,
    deviceModeName: PropTypes.string,
    form: PropTypes.object,
  }
  constructor(props, context) {
    super(props, context)
    this.state = {
      showWarningTip: false,
      warningTipText: '',
      tableRecord: {},
      isSaveStyle:false,
    }
  }
  onCancelWarningTip = () => {//信息提示栏隐藏
    this.setState({
      showWarningTip: false
    });
  }
  onConfirmWarningTip = () => {
    const { tableRecord } = this.state;
    const modeId = tableRecord.modeId;
    this.setState({
      showWarningTip: false,
    });
    this.props.deleteDeviceModes({ modeId });
  }

  onPaginationChange = ({ currentPage, pageSize }) => {
    this.changFilter({ pageNum: currentPage, pageSize })
  }
  deleteDeviceMode = (record) => {
    this.setState({
      showWarningTip: true,
      warningTipText: '确认删除?',
      tableRecord: record,
    })
  }
  changFilter = (value) => {
    const { getDeviceModesList, orderField, orderMethod, pageNum, pageSize, deviceModeName } = this.props;
    const params = { orderField, orderMethod, pageNum, pageSize, deviceModeName };
    getDeviceModesList({ ...params, ...value })
  }
  showEditTable=(record)=>{
    const{isSaveStyle}=this.state;
    this.setState({isSaveStyle:!isSaveStyle})
  }
  submitForm = (e) => {
    // this.props.form.validateFieldsAndScroll((err, values) => {
    //   if (!err) {
    //   console.log('发送请求，并且刷新别的数据')
    //   }
    // });
  }
  searchFactory = (value) => {
    console.log('value: ', value);
    this.changFilter({
      deviceModeName: value,
    })

  }
  tableChange = (pagination, filters, sorter) => {
    const { field, order } = sorter;
    const sortInfo = {
      deviceModeCode: '1',
      deviceModeName: '2',
      manufactorName: '3',
      createTime: '4',
      operateUser: '5',
    };
    const orderField = sortInfo[field] ? sortInfo[field] : '';
    const orderCommand = order ? (sorter.order === 'ascend' ? 'asc' : 'desc') : '';
    this.changFilter({ orderField, orderCommand })

  }
  render() {
    const { pageSize, pageNum, total, } = this.props;
    const deviceModesList = [{
      deviceModeCode: '编码',
      deviceModeName: '设备型号名称',
      manufactorName: '厂家名',
      createTime: '时间',
      operateUser: '操作人',
      modeId: 'id',
    }];
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { showWarningTip, warningTipText ,isSaveStyle} = this.state;
    const columns = [
      {
        title: '编码',
        dataIndex: 'deviceModeCode',
        sorter: true,
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '设备型号',
        dataIndex: 'deviceModeName',
        sorter: true,
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '设备厂家',
        dataIndex: 'manufactorName',
        sorter: true,
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '创建时间',
        dataIndex: 'createTime',
        sorter: true,
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '操作人',
        dataIndex: 'operateUser',
        sorter: true,
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '操作',
        render: (text, record, index) =>
          (<div>
            <span style={{ marginRight: '4px' }} title="编辑" className={isSaveStyle?"iconfont icon-doned":"iconfont icon-edit"} onClick={() => this.showEditTable(record)}></span>
            <span title="删除" className="iconfont icon-del" onClick={() => this.deleteDeviceMode(record)}></span>
          </div>)
      },
    ]
    return (
      <div className={styles.deviceMode}>
        <div className={styles.title}>
          <div className={styles.leftAdd}>
            <Form className={styles.editPart}>
              <FormItem className={styles.formItemStyle} colon={false} label="所属厂家">
                {getFieldDecorator('addFactory', {
                  rules: [{
                    required: true,
                    message: '请输入30字以内的设备厂家',
                  }],
                })(
                  <Input placeholder="不超过30字" />
                )}
              </FormItem>
              <FormItem className={styles.formItemStyle} colon={false} label="设备型号">
                {getFieldDecorator('deviceMode', {
                  rules: [{
                    required: true,
                    message: '请输入30字以内的设备厂家',
                    type: "string",
                    max: 30,
                  }],
                })(
                  <Input placeholder="不超过30字" />
                )}
              </FormItem>
              <Button className={styles.addButton} onClick={this.submitForm}>添加</Button>
            </Form>
          </div>
          <div className={styles.rightSeach}>
            <Input.Search
              placeholder="不超过30字"
              allowClear
              onSearch={this.searchFactory}
            />
          </div>
        </div>
        <div className={styles.tableStyles}>
          <div className={styles.paginationStyle}>
            <Pagination pageSize={pageSize} currentPage={pageNum} onPaginationChange={this.onPaginationChange} total={total} />
          </div>
          <Table
            loading={false}
            dataSource={deviceModesList}
            columns={columns}
            pagination={false}
            onChange={this.tableChange}
            locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
          />
        </div>
        {showWarningTip && <WarningTip
          style={{ marginTop: '350px', width: '240px', height: '88px' }}
          onCancel={this.onCancelWarningTip}
          hiddenCancel={false}
          onOK={this.onConfirmWarningTip}
          value={warningTipText} />}
      </div>
    )
  }
}
export default Form.create()(DeviceMode)