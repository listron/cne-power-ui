import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from './workFlowSide.scss';
import { Radio, Form, Icon } from 'antd';
import CreateFlow from './CreateFlow';
import DeatilFlow from './DeatilFlow';


class WorkFlowSide extends Component {
    static propTypes = {
        stations: PropTypes.array,
        form: PropTypes.object,
        showPage: PropTypes.string,
    }


    constructor() {
        super()
        this.state = {
        }

    }

    onCancelEdit = () => {
        this.props.changeWorkFlowStore({ showPage: 'list' })
    }

    render() {
        const { showPage, docketDetail = {}, } = this.props;
        const { docketInfo = {} } = docketDetail;
        const { operTitle } = docketInfo;
        return (
            <div className={styles.workflowDeatil}>
                <div className={styles.header}>
                    <div className={styles.text}>{showPage === 'add' ? '新建' : operTitle}</div>
                    <Icon type="arrow-left" className={styles.backIcon} onClick={this.onCancelEdit} />
                </div>
                {showPage === 'add' && <CreateFlow {...this.props} />}
                {showPage === 'detail' && <DeatilFlow {...this.props} />}
            </div>

        )
    }
}


export default WorkFlowSide;