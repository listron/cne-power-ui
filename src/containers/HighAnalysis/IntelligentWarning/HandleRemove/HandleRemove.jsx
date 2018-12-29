import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./handleRemove";
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';

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
                手动解除
                <Footer />
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
    }
}
const mapDispatchToProps = (dispatch) => ({
})
export default connect(mapStateToProps, mapDispatchToProps)(HandleRemove)