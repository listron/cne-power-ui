import React, { Component } from "react";
import styles from './realTimeWarning.scss';
import RealTimeWarningTop from './RealTimeWarningTop';
import RealTimeWarningFilter from './RealTimeWarningFilter';
import RealTimeWarningTable from './RealTimeWarningTable';


class RealTimeWarningContainer extends Component{
 static propTypes = {
   }
    constructor(props,context){
        super(props,context)
    }
    render(){
        return(
            <div className={styles.realTimeWarningContainer}>
                <RealTimeWarningTop warningStatus={1} />
                <RealTimeWarningFilter />
                <RealTimeWarningTable />
            </div>
        )
    }
}
export default (RealTimeWarningContainer)