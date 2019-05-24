import React from "react";
import PropTypes from "prop-types";
import styles from "./partInfoBox.scss";
import { Modal ,Button} from 'antd';

class CopyParts extends React.Component{
  static propTypes = {

    changePartInfoStore: PropTypes.func,
    closeComParts: PropTypes.func,
    detailPartsInfo: PropTypes.object,
    showCopyParts: PropTypes.bool,
  }
    constructor(props,context){
        super(props,context)
    }
    handleCancel = () => {
      this.props.closeComParts()
    }
    render(){
      let{showCopyParts}=this.props;
        return(
          <div>
          <div className={styles.copyPartsStyle} ref="copyPartsStyle"></div>
          <Modal
          title="复制组件"
          visible={showCopyParts}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          centered={true}
          mask={false}
          footer={null}
          closable
          maskClosable={false}
          getContainer={()=>this.refs.copyPartsStyle}
          wrapClassName={'test'}
        >
          <div className={styles.copyPartsBox}>
            <div className={styles.content}>
              <div className={styles.leftTree}>
                请选择部件结构

              
              </div>
              <div className={styles.rightTree}>
                请选择应用设备
                
              
              
              </div>
            </div>
            <div className={styles.footer}>
            <Button onClick={this.handleCancel} >取消</Button>
            <Button className={styles.confire} >确认复制</Button>
            </div>
          </div>
         
        
        </Modal>
        
        </div>
        )
    }
}
export default (CopyParts)