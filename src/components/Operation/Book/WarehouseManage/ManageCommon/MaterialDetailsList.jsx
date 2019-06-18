import React, { Component } from 'react';
import { Modal, Table, Button, Icon } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import { dataFormats } from '../../../../../utils/utilFunc';
import styles from './manageCommon.scss';

export default class MaterialDetailsList extends Component {

  static propTypes = {
    total: PropTypes.number,
    value: PropTypes.array,
    materialDetailsList: PropTypes.array,
    onChange: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      modalShow: false,
      checkedMaterial: props.value || [],
    }
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
      render: (text) => <span>{dataFormats(text, '--', 2, true)}</span>,
    }, {
      title: '入库人',
      dataIndex: 'goodsName',
      render: (text) => <span title={text} className={styles.goodsName} >{text || '--'}</span>,
    }, {
      title: '备注',
      dataIndex: 'remarks',
      render: (text) => <span title={text} className={styles.remarks} >{text || '--'}</span>,
    }
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
    const { checkedMaterial } =  this.state;
    this.setState({ modalShow: false });
    this.props.onChange(checkedMaterial);
  }

  render(){
    const { modalShow, checkedMaterial } = this.state;
    const { value = [], materialDetailsList, total } = this.props;
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
            <Table
              columns={this.createColumn()}
              dataSource={materialDetailsList.map(e => ({ ...e, key: e.materialCode }))}
              pagination={false}
              scroll={{y: 280}}
              rowSelection={{
                selectedRowKeys: checkedMaterial.map(e => e.materialCode),
                onChange: this.selectMaterial
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
    )
  }
}
