import React, { Component } from "react";
import styles from './handleRemove.scss'
import WarningStatisticTop from '../commonArea/WarningStatisticTop';


class HandleRemoveContainer extends Component {
    static propTypes = {
    }
    constructor(props, context) {
        super(props, context)
    }
    render() {
        return (
            <div className={styles.handleRemoveContainer}>
                <WarningStatisticTop warningStatus={'3'} />
            </div>
        )
    }
}
export default (HandleRemoveContainer)