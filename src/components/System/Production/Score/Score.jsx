import React, { Component } from "react";
import { Input, Switch, Button, message, InputNumber } from 'antd';
import PropTypes from 'prop-types';
import styles from "./score.scss";

class ScoreMain extends Component {
    static propTypes = {

    };
    constructor(props) {
        super(props);

    }

    componentDidMount() {
    }


    render() {
        return (
            <div className={styles.scoreBox}>

            </div>
        )
    }
}
export default ScoreMain;