import React from 'react';
import PropTypes from 'prop-types';
import styles from './style.scss';
import { Progress } from 'antd';


/**
 * 此组件是用来进度条，增加一个竖的提示，可以从左边开始，可以从右边开始
 * 说明：
    1.要求组件必须传输属性：percent number 默认为0 进度条 
    2.选填属性：
        successPercent  number 默认为0 完成的进度条
        fromRight 是否从右边开始 默认为false
        active: false,  状态 有动画
 */

class OwnProgress extends React.Component {
    static propTypes = {
        percent: PropTypes.any,
        successPercent: PropTypes.any,
        fromRight: PropTypes.bool,
        active: PropTypes.bool,
        theme: PropTypes.theme,
    }

    static defaultProps = {
        percent: 0,
        successPercent: 0,
        fromRight: false,
        active: false,
    }

    constructor(props, context) {
        super(props, context);
    }

    initColor = {
        dark: {
            normalColor: '#00f8ff',
            overcolor: '#1BD77B',
        },
        light: {
            normalColor: '#199475',
            overcolor: '#3e97d1',
        },
    }

    render() {
        const { percent, successPercent, fromRight, active = true, theme = 'light' } = this.props;
        const status = fromRight ? { right: 0 } : { left: 0 };
        const { overcolor, normalColor } = this.initColor[theme];
        const lineColor = successPercent > 100 ? overcolor : normalColor;
        const currentSuccessPercent = successPercent > 100 ? 100 : successPercent;
        const progressColor = percent > 100 ? overcolor : normalColor;
        return (
            <div className={`${styles.progressOuter} ${styles[theme]}`}>
                <div className={styles.progressInner}>
                    <div className={`${styles.progressBg} ${active && styles.active}`}
                        style={{ width: Math.abs(percent) + '%', ...status, background: progressColor }} >
                    </div>
                    {(successPercent || successPercent === '0') &&
                        <div className={styles.line} style={{ left: currentSuccessPercent + '%', background: lineColor }}></div> || null}
                </div>
            </div >
        );
    }
}
export default (OwnProgress);
