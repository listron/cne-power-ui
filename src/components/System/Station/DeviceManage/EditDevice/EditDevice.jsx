import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from '../deviceSide.scss';

class EditDevice extends Component{
 static propTypes = {
   }
    constructor(props,context){
        super(props,context)
    }
    render(){
        return(
            <div className={styles.editDevice}>
                edit
            </div>
        )
    }
}
export default (EditDevice)