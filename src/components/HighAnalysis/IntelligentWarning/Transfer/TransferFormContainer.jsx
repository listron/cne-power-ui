import React, { Component } from "react";
import styles from './transferForm.scss';
import WarningStatisticTop from '../commonArea/WarningStatisticTop';

class TransferFormContaienr extends Component{
 static propTypes = {
   }
    constructor(props,context){
        super(props,context)
    }
    render(){
        return(
            <div className={styles.transferFormContaienr}>
            <WarningStatisticTop warningStatus={2} />
            </div>
        )
    }
}
export default (TransferFormContaienr)