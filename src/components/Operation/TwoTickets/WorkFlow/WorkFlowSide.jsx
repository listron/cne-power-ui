import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './workFlow.scss';
import { Radio, Form, Icon } from 'antd';
import CreateFlow from '../Common/CreateFlow';
import DeatilFlow from '../Common/DeatilFlow';


class WorkFlowSide extends Component {
    static propTypes = {
        stations: PropTypes.array,
        form: PropTypes.object,
        docketDetail: PropTypes.object,
        showPage: PropTypes.string,
        changeWorkFlowStore: PropTypes.func,
    }

    onCancelEdit = () => {
        this.props.changeWorkFlowStore({ showPage: 'list' });
    };

    render() {
        const { showPage, docketDetail = {} } = this.props;
        const { docketInfo = {} } = docketDetail;
        const { operTitle } = docketInfo;
        return (
            <div className={styles.workflowDeatil}>
                <div className={styles.header}>
                    <div className={styles.text}>{showPage === 'add' ? '新建' : operTitle}</div>
                    <Icon type="arrow-left" className={styles.backIcon} onClick={this.onCancelEdit} />
                </div>
                {showPage === 'add' && <CreateFlow {...this.props} type={'work'} />}
                {showPage === 'detail' && <DeatilFlow {...this.props} type={'work'} />}
            </div>
        );
    }
}


export default WorkFlowSide;
