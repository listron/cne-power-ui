import React, { Component } from "react";
import { Select, Table, Modal, Button } from 'antd';
import PropTypes from 'prop-types';
import styles from "./warnConfig.scss";
import AddRule from './AddRule';
import EditRule from './EditRule';
import DetailRule from './DetailRule';

class WarnCofigSide extends Component {
    static propTypes = {
        showPage: PropTypes.string,
    }

    constructor(props, context) {
        super(props, context)
    }

    componentDidMount() { // 初始请求数据

    }

    render() {
        const { showPage } = this.props;
        return (
            <div className={styles.warnCofigSide}>
                {showPage === 'add' && <AddRule />}
                {showPage === 'edit' && <EditRule />}
                {showPage === 'detail' && <DetailRule />}
            </div>
        )
    }
}

export default WarnCofigSide