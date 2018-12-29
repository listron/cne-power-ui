import React, { Component } from "react";
import styles from './handleRemove'

class HandleRemoveContainer extends Component{
  static propTypes = {
  }
    constructor(props,context){
        super(props,context)
    }
    render(){
        return(
            <div>
                手动解除容器
            </div>
        )
    }
}
export default (HandleRemoveContainer)