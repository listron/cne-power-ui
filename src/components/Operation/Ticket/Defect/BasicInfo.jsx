import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import styles from './style.scss';
import classnames from 'classnames';
import {Icon, Modal} from 'antd';
const confirm = Modal.confirm;

class BasicInfo extends Component {
  static propTypes = {
    basicInfo: PropTypes.object,
    dealInfo: PropTypes.object,
    images: PropTypes.array,
  }

  static defaultProps = {
    width: 240,
    height: 30
  }

  constructor(props) {
    super(props);
    this.state = {
    };
    this.onSelectItem = this.onSelectItem.bind(this);
    this.onDeleteItem = this.onDeleteItem.bind(this);
    
  }

  onSelectItem() {
    this.props.onSelect(this.props.label, !this.props.selected);
  }

  onDeleteItem() {
    confirm({
      title: '确认删除异常设备？',
      content: '点击确认，删除此异常设备信息，记录将无法保存',
      okText: "确认",
      onOk() {
        this.props.onDelete(this.props.label);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  render() {
    if(this.props.status === "delete") {
      return (
        <div 
          onClick={()=>{this.props.onshowDetail(this.props.label)}}
          className={styles.deleteItem}
          className={classnames({
            [styles.deleteItem]: !this.props.selected,
            [styles.selectedItem]: this.props.selected
          })}
          style={{height: this.props.height, width: this.props.width}}
        >
          <Icon style="eye-o" />
          <div className={styles.itemLabel}>{this.props.label}</div>
          <Icon type="close" onClick={this.onDeleteItem} />
        </div>
      )
    } else if(this.props.status === "select") {
      return ( 
        <div 
          className={classnames({
            [styles.disabledItem]: this.props.disabled,
            [styles.selectedItem]: this.props.selected,
            [styles.normalItem]: !this.props.disabled && !this.props.selected
          })} 
          style={{height: this.props.height, width: this.props.width}}
          onClick={this.onSelectItem}
        >
          <Icon style="eye-o" />
          <div className={styles.itemLabel}>{this.props.label}</div>
          {this.props.selected && <Icon type="check" />}
        </div>
      );
    } else if(this.props.status === "view") {
      return ( 
        <div 
          className={classnames({
            [styles.disabledItem]: this.props.selected,
            [styles.normalItem]: !this.props.selected
          })} 
          style={{height: this.props.height, width: this.props.width}}
        >
          <div className={styles.itemLabel}>{this.props.label}</div>
        </div>
      );
    }
    
  }
}

export default BasicInfo;