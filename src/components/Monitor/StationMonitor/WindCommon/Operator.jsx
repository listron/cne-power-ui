
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './windCommon.scss';


class Operator extends Component {
    static propTypes = {
        operatorList: PropTypes.array,
        operatorTime: PropTypes.number,
        theme: PropTypes.string,
    }

    shouldComponentUpdate(nextProps) {
        const preTime = this.props.operatorTime;
        const { operatorTime, theme } = nextProps;
        if (operatorTime !== preTime || theme !== this.props.theme) { // 数据重新请求后重绘。
            return true;
        }
        return false;
    }


    render() {
        const { operatorList = [], theme = 'light' } = this.props;
        return (
            <div className={`${styles.operator} ${styles[theme]}`}>
                {operatorList.length > 0 &&
                    <div className={styles.newOperatorList}>
                        <div className={styles.scrollAnmiate}>
                            {operatorList.map((item, index) => {
                                return <span key={index} className={styles.spanLine}>{item.roleDesc} {item.userFullName || item.userName} {item.phoneNum}   </span>;
                            })}
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default Operator;
