import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './abnormalItem.scss';
import { Icon, Modal, Checkbox } from 'antd';
const confirm = Modal.confirm;

class AbnormalItem extends Component {
  static propTypes = {
    item: PropTypes.object,
    status: PropTypes.string, //view,delete,select
    onSelect: PropTypes.func,
    onDelete: PropTypes.func,
    onShowDetail: PropTypes.func,
    selected: PropTypes.bool, //已选择转工单
    disabled: PropTypes.bool, //选择转工单已设置给后端
    checked: PropTypes.bool,
    width: PropTypes.number,
    height: PropTypes.number,
  }

  static defaultProps = {
    width: 240,
    height: 30,
  }

  constructor(props) {
    super(props);
  }

  onSelectItem = (e) => {
    const checked = e.target.checked;
    this.props.onSelect(this.props.item.get('abnormalId'), checked);
  }

  onDeleteItem = () => {
    confirm({
      title: '确认删除异常设备？',
      content: '如点击确认，将删除此异常设备信息，记录将无法找回',
      okText: '确认',
      onOk: () => {
        this.props.onDelete({ abnormalId: this.props.item.get('abnormalId') });
      },
      onCancel() {
      },
    });
  }

  render() {
    const rightHandler = localStorage.getItem('rightHandler');
    // const checkInspectRight = rightHandler && rightHandler.split(',').includes('workExamine_inspection_check');
    const checkInspectRight = true;
    const { item, selected, checked, disabled, status, height, width, onShowDetail } = this.props;
    if (status === 'delete') {
      return (
        <div className={styles.selectedItem}
          style={{
            height: height,
            width: width,
            color: selected ? '#fff' : '#666',
            backgroundColor: selected ? '#199475' : '#f1f1f1',
          }}
        >
          {/* //   <div className={styles.itemLabel} onClick={()=>{onShowDetail(item)}}>
        //     {item.get('deviceName')}
        //   </div>
        //   <Icon type="close" className={styles.deleteIcon} onClick={this.onDeleteItem} /> */}

          <div style={{ marginLeft: checkInspectRight ? 0 : 24 }} className={styles.itemLabel} onClick={() => { onShowDetail(item); }}>
            {checkInspectRight && <Checkbox checked={checked} onChange={this.onSelectItem} style={{ marginRight: 8 }} disabled={disabled} />}
            {item.get('deviceName')}
          </div>
          <Icon type="close" className={styles.deleteIcon} onClick={this.onDeleteItem} />
        </div>


      );
    } else if (status === 'select') {
      return (
        <div className={styles.selectedItem}
          style={{
            height: height,
            width: width,
            color: selected ? '#fff' : disabled ? '#dfdfdf' : '#666',
            backgroundColor: selected ? '#199475' : '#f1f1f1',
          }}
        >
          <div style={{ marginLeft: checkInspectRight ? 0 : 24 }} className={styles.itemLabel} onClick={() => { onShowDetail(item); }}>
            {checkInspectRight && <Checkbox checked={checked} onChange={this.onSelectItem} style={{ marginRight: 8 }} disabled={disabled} />}
            {item.get('deviceName')}
          </div>

        </div>
      );
    } else if (status === 'view') {
      return (
        <div className={styles.deleteItem}
          style={{
            height: height,
            width: width,
            color: selected ? '#fff' : checked ? '#dfdfdf' : '#666',
            backgroundColor: selected ? '#199475' : '#f1f1f1',
          }}
        >
          <div className={styles.itemLabel} onClick={() => { onShowDetail(item); }}>{item.get('deviceName')}</div>
          <Checkbox checked={checked} style={{ marginRight: 8 }} disabled={true} />
        </div>
      );
    }

  }
}

export default AbnormalItem;
