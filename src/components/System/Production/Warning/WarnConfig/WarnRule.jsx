import React, { Component } from 'react';
import { InputNumber, Select, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import styles from './warnConfig.scss'
const Option = Select.Option;

class WarnRule extends Component {
    static propTypes = {
        value: PropTypes.array,
        onChange: PropTypes.func,
    }

    changeCompare = (e) => {
        const { onChange, value } = this.props;
        onChange([e, value[1], value[2]])
    }

    changeRule = (e) => {
        const { onChange, value } = this.props;
        onChange([value[0], e, value[2]])
    }

    changeGap = (e) => {
        const { onChange, value } = this.props;
        onChange([value[0], value[1], e])
    }


    warnDetail = () => { // 预警详情
        return (<div>
            <span>{'预警规则举例： '}</span>
            <div>
                <span>{'1. 大于2，震荡区间 0.1'}</span>
                <div>{'当测点值大于2 会产生预警，当测点值小于等于1.9 时预警才会消失'}</div>
            </div>
            <div>
                <span>{'2. 小于2, 震荡区间 0.1'}</span>
                <div>{'当测点值小于2 会产生预警，当测点值 大于等于2.1 时预警才会消失'}</div>
            </div>
        </div>)
    }

    render() {
        const [warningRuler, warningValue, warningDeadZone] = this.props.value;
        return (
            <div>
                <div className={styles.tooltipName}>
                    <Tooltip placement="top" overlayStyle={{ maxWidth: 500, fontSize: '12px' }} title={this.warnDetail} > <i className="iconfont icon-help"></i>
                    </Tooltip>
                </div>
                <div className={styles.gap}>
                    <Select className={styles.contrastSelect} placeholder="请选择" onChange={this.changeCompare} value={warningRuler}>
                        <Option value={0}>{'大于'}</Option>
                        <Option value={1}>{'小于'}</Option>
                    </Select>
                    <InputNumber min={0} step={0.01} onChange={this.changeRule} placeholder={'请输入'} value={warningValue} className={styles.gapWarn} />
                </div>
                <div>
                    <span className={styles.gapZone}> 震荡区间</span>
                    <InputNumber min={0} step={0.01} onChange={this.changeGap} placeholder={'请输入'} value={warningDeadZone}
                    />
                </div>
            </div>
        )
    }
}

export default WarnRule;
