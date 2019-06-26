import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from './workFlow.scss';
import { connect } from "react-redux";
import { workFlowAction } from './workFlowAction';
import { commonAction } from '../../../../containers/alphaRedux/commonAction';
import Header from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';
import TransitionContainer from '../../../../components/Common/TransitionContainer';
import TableList from '../../../../components/Operation/TwoTickets/WorkFlow/TableList';
import Condition from '../../../../components/Operation/TwoTickets/WorkFlow/Condition';
import WorkFlowSide from '../../../../components/Operation/TwoTickets/WorkFlow/FlowSide/WorkFlowSide';

class WorkFlow extends Component {
    static propTypes = {
        showPage: PropTypes.string,
        resetStore: PropTypes.func,
    }

    constructor() {
        super()
        this.state = {
        }

    }

    componentWillUnmount(){
        this.props.resetStore()
    }

    render() {
        const { showPage } = this.props;
        console.log('tets',showPage)
        return (
            <div className={styles.workflow}>
                <Header breadData={[{ name: '工作票' }]} style={{ marginLeft: '38px' }} />
                <div className={styles.contentBox}>
                    <div className={styles.container}>
                        <div className={styles.workflowList}>
                            <Condition {...this.props} />
                            <TableList {...this.props} />
                        </div>
                        <TransitionContainer
                            show={showPage !== 'list'}
                            timeout={500}
                            effect="side"
                        >
                            <WorkFlowSide {...this.props} />
                        </TransitionContainer>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        ...state.operation.workFlow.toJS(),
        stations: state.common.get('stations').toJS(),
    }
}

const mapDispatchToProps = (dispatch) => ({
    changeWorkFlowStore: payload => dispatch({ type: workFlowAction.changeWorkFlowStore, payload }),
    resetStore: () => dispatch({ type: workFlowAction.resetStore }),
    getFlowList: payload => dispatch({ type: workFlowAction.getFlowList, payload }),
    getDocketStatus: payload => dispatch({ type: workFlowAction.getDocketStatus, payload }),
    getStopRight: payload => dispatch({ type: workFlowAction.getStopRight, payload }),
    getDocketTypeList: payload => dispatch({ type: workFlowAction.getDocketTypeList, payload }),
    getDefectList: payload => dispatch({ type: workFlowAction.getDefectList, payload }),
    addDockect: payload => dispatch({ type: workFlowAction.addDockect, payload }),
    noDistributionList: payload => dispatch({ type: workFlowAction.noDistributionList, payload }),
    getDocketDetail: payload => dispatch({ type: workFlowAction.getDocketDetail, payload }),
    getNodeImg: payload => dispatch({ type: workFlowAction.getNodeImg, payload }),
    getDocketHandle: payload => dispatch({ type: workFlowAction.getDocketHandle, payload }),
    getNewImg: payload => dispatch({ type: workFlowAction.getNewImg, payload }),
    handleBatch: payload => dispatch({ type: workFlowAction.handleBatch, payload }),
    stopBatch: payload => dispatch({ type: workFlowAction.stopBatch, payload }),
    delDocket: payload => dispatch({ type: workFlowAction.delDocket, payload }),
    downLoadFile: payload => dispatch({
        type: commonAction.downLoadFile,
        payload: {
          ...payload,
          actionName: workFlowAction.changeWorkFlowStore
        }
      })
})

export default connect(mapStateToProps, mapDispatchToProps)(WorkFlow)