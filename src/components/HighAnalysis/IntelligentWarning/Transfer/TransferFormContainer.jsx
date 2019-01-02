import React, { Component } from "react";
import styles from './transferForm.scss';
class TransferFormContaienr extends Component{
 static propTypes = {
   }
    constructor(props,context){
        super(props,context)
    }
    render(){
        return(
            <div className={styles.transferFormContaienr}>
                已转工单容器
            </div>
        )
    }
}
export default (TransferFormContaienr)