import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './operateFlow.scss';
import { connect } from 'react-redux';
import { operateFlowAction } from './operateFlowAction';
import { commonAction } from '../../../../containers/alphaRedux/commonAction';
import Header from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';
import TransitionContainer from '../../../../components/Common/TransitionContainer';
import TableList from '../../../../components/Operation/TwoTickets/OperateFlow/TableList';
import Condition from '../../../../components/Operation/TwoTickets/OperateFlow/Condition';
import OperateSide from '../../../../components/Operation/TwoTickets/OperateFlow/OperateSide';

class OperateFlow extends Component {
    static propTypes = {
        showPage: PropTypes.string,
        resetStore: PropTypes.func,
    }

    constructor() {
        super();
        this.state = {
        };

    }

    componentWillUnmount() {
        this.props.resetStore();
    }

    render() {
        const { showPage } = this.props;
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
                            <OperateSide {...this.props} />
                        </TransitionContainer>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        ...state.operation.operateFlow.toJS(),
        stations: state.common.get('stations').toJS(),
    };
};

const mapDispatchToProps = (dispatch) => ({
    changeFlowStore: payload => dispatch({ type: operateFlowAction.changeFlowStore, payload }),
    resetStore: () => dispatch({ type: operateFlowAction.resetStore }),
    getFlowList: payload => dispatch({ type: operateFlowAction.getFlowList, payload }),
    getDocketStatus: payload => dispatch({ type: operateFlowAction.getDocketStatus, payload }),
    getStopRight: payload => dispatch({ type: operateFlowAction.getStopRight, payload }),
    getDefectList: payload => dispatch({ type: operateFlowAction.getDefectList, payload }),
    addDockect: payload => dispatch({ type: operateFlowAction.addDockect, payload }),
    noDistributionList: payload => dispatch({ type: operateFlowAction.noDistributionList, payload }),
    getDocketDetail: payload => dispatch({ type: operateFlowAction.getDocketDetail, payload }),
    getNodeImg: payload => dispatch({ type: operateFlowAction.getNodeImg, payload }),
    getDocketHandle: payload => dispatch({ type: operateFlowAction.getDocketHandle, payload }),
    getNewImg: payload => dispatch({ type: operateFlowAction.getNewImg, payload }),
    handleBatch: payload => dispatch({ type: operateFlowAction.handleBatch, payload }),
    stopBatch: payload => dispatch({ type: operateFlowAction.stopBatch, payload }),
    delDocket: payload => dispatch({ type: operateFlowAction.delDocket, payload }),
    downLoadFile: payload => dispatch({
        type: commonAction.downLoadFile,
        payload: {
            ...payload,
            actionName: operateFlowAction.changeFlowStore,
        },
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(OperateFlow)
    ;
