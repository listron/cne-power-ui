import React, { Component } from "react";
import styles from './handleRemove.scss'

class HandleRemoveContainer extends Component{
  static propTypes = {
  }
    constructor(props,context){
        super(props,context)
    }
    render(){
        return(
            <div className={styles.handleRemoveContainer}>
                手动解除
            </div>
        )
    }
}
export default (HandleRemoveContainer)