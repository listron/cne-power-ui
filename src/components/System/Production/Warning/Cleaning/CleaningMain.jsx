import React, {Component} from "react";
import {Input,Button} from 'antd';
import styles from "./cleaning.scss";

class CleaningMain extends Component {
  constructor(props){
    super(props);
    this.state = {
      isShow : false,
      defaultThresholdt : 70.00,//默认阈值
    }
  }
 
  componentDidMount(){
    const { enterpriseId} = this.props;
    this.props.getCleaningData({enterpriseId});
  }

  modify = () => { // '修改'按钮
    this.setState({
      isShow : true,
    })
  } 
 
  changeCount = (e) => { //设置'阈值'
    const val = e.target.value;
    if(!isNaN(val)){
      this.props.changeStore({lossPowerPercent:val});
    }
  }

  handleClear = () => { //'恢复默认值'按钮
    this.props.changeStore({lossPowerPercent:this.state.defaultThresholdt});
  }

  handleSubmit = () =>{ //'保存'按钮
    this.setState({
      isShow : false,
    })
    const {lossPowerPercent,enterpriseId} = this.props;
    console.log(lossPowerPercent);
    this.props.addCleaningData({lossPowerPercent,enterpriseId});
  }

  handleCancel = (e) => { //'取消'按钮
    const {enterpriseId} = this.props;
    this.setState({
      isShow:false,
    })
    this.props.getCleaningData({enterpriseId});
  }



render(){
  const { isShow } = this.state;
  const {lossPowerPercent} = this.props;
  let thresholdtNum = lossPowerPercent?lossPowerPercent:'--'
 
  return(
    !isShow ?
    <div className={styles.cleaningBox}>
      <div className={styles.thresholdt}>
        <span className={styles.thresholdtText}>电量损失比阈值</span>
        <span className={styles.thresholdtNum}>{thresholdtNum}</span>
        <span>%</span>
      </div>

      <div className={styles.btn}>
        <Button onClick={this.modify}>修改</Button>
      </div>
    </div> :

    <div className={styles.cleaningBoxCopy}>
      <div className={styles.thresholdt}>
        <span className={styles.thresholdtText}>电量损失比阈值</span>
        <Input className={styles.thresholdtNum} value={lossPowerPercent} onChange={this.changeCount} />
        <span>%</span>
      </div>

      <div className={styles.btn}>
        <Button className={styles.btnBottom} onClick={this.handleClear} >恢复默认值</Button> 
        <Button className={styles.btnBottom} type="submit" onClick={this.handleSubmit} >保存</Button> 
        <Button className={styles.btnBottom} onClick={this.handleCancel}>取消</Button> 
      </div>
  </div>
  )
}
}
export default CleaningMain;