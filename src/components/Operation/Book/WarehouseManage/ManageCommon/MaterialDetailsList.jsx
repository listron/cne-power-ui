import React, { Component } from 'react';
import { Modal, Table, Button, Icon } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import CommonPagination from '../../../../Common/CommonPagination';
import { dataFormats } from '../../../../../utils/utilFunc';
import styles from './manageCommon.scss';

export default class MaterialDetailsList extends Component {

  static propTypes = {
    materialListLoading: PropTypes.bool,
    total: PropTypes.number,
    materialListTotal: PropTypes.number,
    inventoryId: PropTypes.number,
    value: PropTypes.array,
    materialListParams: PropTypes.object,
    materialDetailsList: PropTypes.array,
    onChange: PropTypes.func,
    changeStore: PropTypes.func,
    getMaterialDetailsList: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      modalShow: false,
      checkedMaterial: props.value || [],
    };
  }

  componentWillUnmount(){ // 卸载组件时, 清空缓存的信息。
    this.props.changeStore({
      materialListParams: {
        sortField: '', // 'price'
        sortMethod: '', // "asc"：正序  "desc"：倒序
        pageNum: 1,
        pageSize: 10,
      },
      materialListTotal: 0,
    });
  }

  hideModal = () => this.setState({ modalShow: false });

  showModal = () => this.setState({ modalShow: true });

  selectMaterial = (selectedKeys, checkedMaterial) => {
    this.setState({ checkedMaterial });
  }

  createColumn = () => [
    {
      title: '物资编码',
      dataIndex: 'materialCode',
      width: 140,
    }, {
      title: '供货商',
      dataIndex: 'supplierName',
      render: (text) => <span className={styles.supplierName} title={text}>{text || '--'}</span>,
    }, {
      title: '入库时间',
      dataIndex: 'entryTime',
      width: 170,
      render: (text) => <span>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--'}</span>,
    }, {
      title: '单价/元',
      dataIndex: 'price',
      width: 100,
      sorter: true,
      render: (text) => <span>{dataFormats(text, '--', 2, true)}</span>,
    }, {
      title: '入库人',
      dataIndex: 'goodsName',
      render: (text) => <span title={text} className={styles.goodsName} >{text || '--'}</span>,
    }, {
      title: '备注',
      dataIndex: 'remarks',
      render: (text) => <span title={text} className={styles.remarks} >{text || '--'}</span>,
    },
  ]

  remove = (materialCode) => { // 移除选中项 且重置表格选中项。
    const { value, onChange } = this.props;
    const filteredMaterial = value.filter(e => e.materialCode !== materialCode);
    onChange(filteredMaterial);
    this.setState({ checkedMaterial: filteredMaterial });
  }

  reset = () => { // 删除已选
    this.setState({ checkedMaterial: [] });
  }

  confirm = () => { // 确认
    const { checkedMaterial } = this.state;
    this.setState({ modalShow: false });
    this.props.onChange(checkedMaterial);
  }

  paginationChange = ({ pageSize, currentPage }) => { // 翻页
    const { materialListParams, getMaterialDetailsList, changeStore, inventoryId } = this.props;
    const newParams = {
      ...materialListParams,
      pageNum: currentPage,
      pageSize,
    };
    changeStore({ materialListParams: {...newParams} });
    getMaterialDetailsList({ inventoryId, ...newParams });
  }

  tableChange = (pagination, filter, sorter) => {
    const { field, order } = sorter;
    const { materialListParams, changeStore, getMaterialDetailsList, inventoryId } = this.props;
    const sortTypeInfo = {
      descend: 'desc',
      ascend: 'asc',
    };
    const sortField = field ? 'price' : '';
    const sortMethod = order ? sortTypeInfo[order] : '';
    const newParams = { ...materialListParams, sortField, sortMethod };
    changeStore({ materialListParams: newParams });
    getMaterialDetailsList({ inventoryId, ...newParams });
  }

  render(){
    const { modalShow, checkedMaterial } = this.state;
    const { value = [], materialDetailsList, total, materialListParams, materialListTotal, materialListLoading } = this.props;
    const { pageSize, pageNum } = materialListParams;
    return (
      <div className={styles.materialDetailsList}>
        <p className={styles.title}>
          <span className={styles.checkButton} onClick={this.showModal}>
            <Icon type="plus" className={styles.plus} />
            <span>选择物资</span>
          </span>
          <span className={styles.total}>当前库存量 {dataFormats(total)}</span>
        </p>
        {value.length > 0 && <p className={styles.checkedStatis}>
          <span>已选择</span>
          <span className={styles.hightlight}>{value.length}</span>
          <span>个物资编码</span>
        </p>}
        {value.length > 0 && <div className={styles.recordsList}>
          {value.map(e => (
            <p key={e.materialCode} className={styles.eachInfo}>
              <span className={styles.text}>{e.materialCode}</span>
              <Icon type="close" className={styles.deleteIcon} onClick={() => this.remove(e.materialCode)} />
            </p>
          ))}
        </div>}
        <Modal
          title="选择物资"
          visible={modalShow}
          footer={null}
          onCancel={this.hideModal}
          maskClosable={false}
          width={950}
          wrapClassName={styles.materialListModal}
        >
          <div>
            <div className={styles.pagination}>
              <CommonPagination
                total={materialListTotal}
                pageSize={pageSize}
                currentPage={pageNum}
                onPaginationChange={this.paginationChange}
              />
            </div>
            <Table
              columns={this.createColumn()}
              dataSource={materialDetailsList.map(e => ({ ...e, key: e.materialCode }))}
              pagination={false}
              loading={materialListLoading}
              scroll={{y: 280}}
              onChange={this.tableChange}
              rowSelection={{
                selectedRowKeys: checkedMaterial.map(e => e.materialCode),
                onChange: this.selectMaterial,
              }}
              locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
            />
            <div className={styles.handle}>
              <Button onClick={this.reset} className={styles.reset}>重置</Button>
              <Button onClick={this.confirm} className={styles.confirm}>确认选择</Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
