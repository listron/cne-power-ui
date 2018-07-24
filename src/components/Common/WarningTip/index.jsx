

import React, { Component } from 'react';
import { Icon, Modal } from 'antd';
import PropTypes from 'prop-types';
import styles from './style.scss'

/*
  全局共用信息提示组件：
  1. 必须传入参数(props): 确认/取消操作的回调函数onCancel(function),onOK(function);组件的文字提示value(string);
  2. 可选参数(props): 传递下来的style值(object)，用于组件总体样式 {width:'500px'}
*/
class WarningTip extends Component {
  static propTypes = {
    onCancel: PropTypes.func,
    onOK: PropTypes.func,
    style: PropTypes.object,
    value: PropTypes.string
  }
  static defaultProps = {
    style:{width: '210px',height:'88px'}
  }

  constructor(props){
    super(props);
  }

  onCancel = () => {
    this.props.onCancel()
  }
  onOK = () => {
    this.props.onOK()
  }
  
  render(){
    const { style, value } = this.props;
    return (
      <Modal
        onOk={this.onOK}
        onCancel={this.onCancel}
        visible={true}
        footer={null}
        closable={false}
        maskClosable={false}
        maskStyle={{backgroundColor:'rgba(153,153,153,0.2)'}}
        wrapClassName={styles.warningTipWrapBox}
        width={style.width}
      >
        <div className={styles.warningTip} style={{...style}}>
          <div className={styles.textArea}>
            <Icon type="exclamation-circle-o" className={styles.icon} />
            <span className={styles.text}>{value}</span>
          </div>
          <div className={styles.handle}>
            <span onClick={this.onCancel}>取消</span>
            <span onClick={this.onOK}>确认</span>
          </div>
        </div>
        
      </Modal>
      
    )
  }
}

export default WarningTip;
