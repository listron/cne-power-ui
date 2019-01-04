import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./handleRemove.scss";
import { handleRemoveActive } from './handleRemoveActive';

import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';
import HandleRemoveContainer from '../../../../components/HighAnalysis/IntelligentWarning/HandleRemove/HandleRemoveContainer';


class HandleRemove extends Component {
    static propTypes = {
    }
    constructor(props, context) {
        super(props, context)
    }
    render() {
        const breadCrumbData = {
            breadData: [
                {
                    name: '手动解除',
                }
            ],
        };
        return (
            <div className={styles.handle}>
                <CommonBreadcrumb  {...breadCrumbData} style={{ marginLeft: '38px' }} />
                <div className={styles.handleRemoveBox}>
                <HandleRemoveContainer {...this.props} />
                </div>        
                <Footer />
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
    ...state.highAanlysisReducer.handleRemoveReducer.toJS(),

    }
}
const mapDispatchToProps = (dispatch) => ({
    getHandleRemoveStatistic: payload => dispatch({ type: handleRemoveActive.getHandleRemoveStatistic, payload }),

})
export default connect(mapStateToProps, mapDispatchToProps)(HandleRemove)