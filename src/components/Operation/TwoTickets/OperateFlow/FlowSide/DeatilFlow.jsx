import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from './workFlowSide.scss';
import { Radio, Form, Icon } from 'antd';
import CreateFlow from './CreateFlow';
import BaseInfo from './BaseInfo';
import TimeLine from './TimeLine';
import HandleForm from '../../Common//HandleForm/HandleForm';


class DeatilFlow extends Component {
    static propTypes = {
        stations: PropTypes.array,
        docketDetail: PropTypes.object,
        getDocketHandle: PropTypes.func,
    }


    constructor() {
        super()
        this.state = {
        }
    }

    componentDidMount() {
        const { docketId } = this.props;
        this.props.getDocketDetail({ docketId })
    }

    componentWillUnmount(){
        this.props.changeWorkFlowStore({docketDetail:{},docketId:null})
    }


    render() {
        const { docketDetail = {}, docketId,downLoadFile } = this.props;
        const { distributionInfo = [], docketInfo = {}, docketProcess = [], defectInfo } = docketDetail;
        console.log('docketDetail', docketDetail)
        const { operTitle, operWinType,taskId } = docketInfo;
        const lastChild = docketProcess && docketProcess[docketProcess.length - 1] || [];
        const right = lastChild.length > 0 && lastChild.childProcess ? lastChild.childProcess.isAbleOper : lastChild.isAbleOper; // 0 没有操作权限 1 有操作权限
        console.log('操作权限', right)
        return (
            <div className={styles.detailFlow}>
                <div className={styles.content}>
                    <div className={styles.basic}>
                    <CreateFlow {...this.props} reject={true} />
                        {/* {defectInfo ?
                            <CreateFlow {...this.props} reject={true} />
                            : <BaseInfo docketInfo={docketInfo} distributionInfo={distributionInfo} />} */}
                    </div>
                    <div className={styles.right}>
                        <div className={styles.timeLines}>
                            <TimeLine
                                processData={docketProcess}
                                getNodeImg={this.props.getNodeImg}
                                nodeImg={this.props.nodeImg}
                                docketId={this.props.docketId}
                                operWinType={operWinType}
                                downLoadFile={downLoadFile}
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

        )
    }
}


export default DeatilFlow;