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
        changeFlowStore: PropTypes.func,
        theme: PropTypes.string,
    }

    onCancelEdit = () => {
        this.props.changeFlowStore({ showPage: 'list' });
    };

    render() {
        const { showPage, docketDetail = {}, theme } = this.props;
        const { docketInfo = {} } = docketDetail;
        const { operTitle } = docketInfo;
        return (
            <div className={styles.workflowDeatil}>
                <div className={styles.header}>
                    <div className={styles.text}>{showPage === 'add' ? '新建' : operTitle}</div>
                    <i className={`iconfont icon-fanhui ${styles.backIcon}`} title="返回" onClick={this.onCancelEdit} />
                </div>
                {showPage === 'add' && <CreateFlow {...this.props} type={'work'} />}
                {showPage === 'detail' && <DeatilFlow {...this.props} type={'work'} />}
            </div>
        );
    }
}


export default WorkFlowSide;
