import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './index.scss';
import { Radio, Form, Icon } from 'antd';
import CreateFlow from './CreateFlow';
import BaseInfo from './BaseInfo';
import TimeLine from './TimeLine';
import HandleForm from './HandleForm/HandleForm';


class DeatilFlow extends Component {
    static propTypes = {
        stations: PropTypes.array,
        docketDetail: PropTypes.object,
        getDocketHandle: PropTypes.func,
        getNodeImg: PropTypes.func,
        nodeImg: PropTypes.array,
        changeWorkFlowStore: PropTypes.func,
        getDocketDetail: PropTypes.func,
        docketId: PropTypes.number,
        downLoadFile: PropTypes.func,
        type: PropTypes.string,
    }


    constructor() {
        super();
        this.state = {
        };
    }

    componentDidMount() {
        const { docketId } = this.props;
        this.props.getDocketDetail({ docketId });
    }

    componentWillUnmount() {
        this.props.changeWorkFlowStore({ docketDetail: {}, docketId: null });
    }


    render() {
        const { docketDetail = {}, downLoadFile, type } = this.props;
        const { distributionInfo = [], docketInfo = {}, docketProcess = [], defectInfo } = docketDetail;
        const { operTitle, operWinType, taskId } = docketInfo;
        const lastChild = docketProcess && docketProcess[docketProcess.length - 1] || {};
        const right = lastChild.childProcess ? lastChild.childProcess[lastChild.childProcess.length - 1].isAbleOper : lastChild.isAbleOper; // 0 没有操作权限 1 有操作权限
        return (
            <div className={styles.detailFlow}>
                <div className={styles.content}>
                    <div className={styles.basic}>
                        {operWinType !== 0 ?
                            <BaseInfo docketInfo={docketInfo} distributionInfo={distributionInfo} type={type} />
                            : <CreateFlow {...this.props} reject={true} />
                        }
                    </div>
                    <div className={styles.right}>
                        <div className={styles.timeLines}>
                            <TimeLine
                                processData={docketProcess}
                                getNodeImg={this.props.getNodeImg}
                                nodeImg={this.props.nodeImg}
                                operWinType={operWinType}
                                downLoadFile={downLoadFile}
                                docketId={this.props.docketId}
                                taskId={taskId}
                            />
                        </div>
                        <div className={styles.form}>
                            {right && <HandleForm
                                getDocketHandle={this.props.getDocketHandle}
                                operTitle={operTitle}
                                operStatus={operWinType}
                                taskId={taskId} /> || ''}

                        </div>
                    </div>

                </div>
            </div>
        );
    }
}


export default DeatilFlow;
