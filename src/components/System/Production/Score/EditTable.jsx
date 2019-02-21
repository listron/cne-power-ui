import React, { Component } from "react";
import { Input, Switch, Button, message, } from 'antd';
import PropTypes from 'prop-types';
import styles from "./score.scss";


const InputContent = ({ keyWord, dataCheck, valueChange, editData = [], index }) => {
    return (
        <Input
            placeholder="--"
            value={editData.length > 0 && editData[index][keyWord] || null}
            onBlur={e => dataCheck(e.target.value, keyWord, index)}
            onChange={e => valueChange({
                [keyWord]: e.target.value && e.target.value.trim(),
                index: index,
            })}
        />

    )
}

class EditTable extends Component {
    static propTypes = {
        editData: PropTypes.array,
        changeScoreStore: PropTypes.func,
        totalInfoChange: PropTypes.func,
        isVaild: PropTypes.array,
    };
    constructor(props) {
        super(props);
        this.state = {
            editData: this.props.editData,
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.reset && !nextProps.reset) { this.setState({ editData: nextProps.editData })}
    }

    Basefun = (keyWord, index) => {
        let indexArray = ['计划完成率', 'PR完成率', '损失电量等效时', '损失电量等效时', '消缺率', '消缺率(A级故障)', '消缺率(B级故障)', '消缺率(C级故障)'];
        let name = '';
        switch (keyWord) {
            case "indexPercent": name = '指标权重'; break;
            case "indexLowerLimit": name = '判断标准下限'; break;
            case "indexUpperLimit": name = '判断标准上限'; break;
            case "indexIncrDecrStandard": name = '增减分标准'; break;
            case "indexIncrDecrValue": name = '增减分值'; break;
            default: name = '';
        }
        return `${indexArray[index]}的${name}`
    }

    dataCheck = (value, keyWord, index) => { // input脱焦时，检查该脱焦数据
        // 1 数值校验 2 非负校验  3 小数点位校验。 4 指标权重>100%  5 判断标准 左边数《= 右边数
        let pointLength = 2;
        let checkingValue = value.trim();
        const configText = this.Basefun(keyWord, index)
        const { isVaild } = this.props;
        let indexArray = ['indexPercent', 'indexLowerLimit', 'indexUpperLimit', 'indexIncrDecrStandard', 'indexIncrDecrValue'];
        message.config({ top: 220, maxCount: 1 })
        if (!checkingValue) { // 规则  为空校验
            message.warn(`${configText}不能为空`, 2);
            isVaild[index][indexArray.findIndex(e=>e===keyWord)] = false
            this.props.changeScoreStore({ isVaild });
            return false
        }
        if (isNaN(checkingValue)) { // 规则1 数值校验
            message.warn(`${configText}请填写数字，最多保留小数点后${pointLength}位`, 2)
            isVaild[index][indexArray.findIndex(e=>e===keyWord)] = false
            this.props.changeScoreStore({ isVaild });
            return false
        }
        if (checkingValue < 0) { // 规则2非负校验
            message.warn(`${configText}数值不能为负数，请重新填写`, 2);
            isVaild[index][indexArray.findIndex(e=>e===keyWord)] = false
            this.props.changeScoreStore({ isVaild });
            return false
        }
        if (`${checkingValue}`.includes('.')) { // 规则3小数点位校验。
            const demicalLength = `${checkingValue}`.split('.')[1].trim().length;
            if (demicalLength > pointLength) {
                message.warn(`${configText}请填写数字，最多保留小数点后${pointLength}位`, 2)
                isVaild[index][indexArray.findIndex(e=>e===keyWord)] = false
                this.props.changeScoreStore({ isVaild });
                return false
            }
        }
        isVaild[index][indexArray.findIndex(e=>e===keyWord)] = true
        this.props.changeScoreStore({ isVaild })
    }

    valueChange = (param) => { // 直接替换数据。
        const { editData } = this.state;
        const { index } = param;
        delete param.index;
        editData[index] = {
            ...editData[index],
            ...param,
        }
        this.setState({ editData: editData })
        this.props.totalInfoChange(editData)
    }


    render() {
        const { editData } = this.state;
        return (
            <div className={styles.editTable}>
                <div className={styles.tHead}>
                    <div className={styles.classification}>分类</div>
                    <div className={styles.type}>指标</div>
                    <div className={styles.examContent}>考核内容</div>
                    <div className={styles.typeWeight}>指标权重</div>
                    <div className={styles.judgeStandard}>判定标准</div>
                    <div className={styles.inOrDePoints}>增减分标准</div>
                    <div className={styles.inOrDeScore}>增减分值</div>
                    <div className={styles.assessInstruct}>考核说明</div>
                </div>
                <div className={styles.tBody}>
                    <div className={styles.classification}>
                        <div className={styles.level}>发电水平</div>
                        <div className={styles.manage}>运维管理</div>
                    </div>
                    <div className={styles.type}>
                        <div className={styles.oneColumn}> 计划完成率</div>
                        <div className={styles.oneColumn}> PR完成率</div>
                        <div className={styles.oneColumn}> 损失电量等效时</div>
                        <div className={styles.twoColumn}> 综合厂用电率</div>
                        <div className={styles.oneColumn}> 消缺率</div>
                        <div className={styles.threeColumn}> 消缺及时性</div>
                    </div>
                    <div className={styles.examContent}>
                        <div className={styles.oneColumn}>  实际上网电量/计划发电量*100%</div>
                        <div className={styles.oneColumn}> 实际PR/计划PR*100%</div>
                        <div className={styles.oneColumn}> 损失电量等效时（h）</div>
                        <div className={styles.twoColumn}>（实际发电量-上网电量+购网电量）<br />/实际发电量*100%</div>
                        <div className={styles.oneColumn}> 已消缺数/总故障数*100%</div>
                        <div className={styles.oneColumn}> A级故障平均处理时长（h）</div>
                        <div className={styles.oneColumn}> B级故障平均处理时长（h）</div>
                        <div className={styles.oneColumn}> C级故障平均处理时长（h）</div>
                    </div>
                    <div className={styles.typeWeight}>
                        <div className={styles.oneColumn}>
                            <InputContent editData={editData} keyWord="indexPercent" dataCheck={this.dataCheck} valueChange={this.valueChange} index={0} /> %
                        </div>
                        <div className={styles.oneColumn}>
                            <InputContent editData={editData} keyWord="indexPercent" dataCheck={this.dataCheck} valueChange={this.valueChange} index={1} /> %
                        </div>
                        <div className={styles.oneColumn}>
                            <InputContent editData={editData} keyWord="indexPercent" dataCheck={this.dataCheck} valueChange={this.valueChange} index={2} /> %
                        </div>
                        <div className={styles.twoColumn}>
                            <InputContent editData={editData} keyWord="indexPercent" dataCheck={this.dataCheck} valueChange={this.valueChange} index={3} /> %
                        </div>
                        <div className={styles.oneColumn}>
                            <InputContent editData={editData} keyWord="indexPercent" dataCheck={this.dataCheck} valueChange={this.valueChange} index={4} /> %
                        </div>
                        <div className={styles.oneColumn}>
                            <InputContent editData={editData} keyWord="indexPercent" dataCheck={this.dataCheck} valueChange={this.valueChange} index={5} /> %
                        </div>
                        <div className={styles.oneColumn}>
                            <InputContent editData={editData} keyWord="indexPercent" dataCheck={this.dataCheck} valueChange={this.valueChange} index={6} /> %
                        </div>
                        <div className={styles.oneColumn}>
                            <InputContent editData={editData} keyWord="indexPercent" dataCheck={this.dataCheck} valueChange={this.valueChange} index={7} /> %
                        </div>
                    </div>
                    <div className={styles.judgeStandard}>
                        <div className={styles.oneColumn}>
                            <InputContent editData={editData} keyWord="indexLowerLimit" dataCheck={this.dataCheck} valueChange={this.valueChange} index={0} /> ～
                            <InputContent editData={editData} keyWord="indexUpperLimit" dataCheck={this.dataCheck} valueChange={this.valueChange} index={0} /> %
                        </div>
                        <div className={styles.oneColumn}>
                            <InputContent editData={editData} keyWord="indexLowerLimit" dataCheck={this.dataCheck} valueChange={this.valueChange} index={1} />  ～
                            <InputContent editData={editData} keyWord="indexUpperLimit" dataCheck={this.dataCheck} valueChange={this.valueChange} index={1} /> %
                        </div>
                        <div className={styles.oneColumn}>
                            <InputContent editData={editData} keyWord="indexLowerLimit" dataCheck={this.dataCheck} valueChange={this.valueChange} index={2} /> ～
                            <InputContent editData={editData} keyWord="indexUpperLimit" dataCheck={this.dataCheck} valueChange={this.valueChange} index={2} />
                        </div>
                        <div className={styles.twoColumn}>
                            <InputContent editData={editData} keyWord="indexLowerLimit" dataCheck={this.dataCheck} valueChange={this.valueChange} index={3} /> ～
                            <InputContent editData={editData} keyWord="indexUpperLimit" dataCheck={this.dataCheck} valueChange={this.valueChange} index={3} />
                        </div>
                        <div className={styles.oneColumn}>
                            <InputContent editData={editData} keyWord="indexLowerLimit" dataCheck={this.dataCheck} valueChange={this.valueChange} index={4} /> ～
                            <InputContent editData={editData} keyWord="indexUpperLimit" dataCheck={this.dataCheck} valueChange={this.valueChange} index={4} /> %
                        </div>
                        <div className={styles.oneColumn}>
                            <InputContent editData={editData} keyWord="indexLowerLimit" dataCheck={this.dataCheck} valueChange={this.valueChange} index={5} /> ～
                            <InputContent editData={editData} keyWord="indexUpperLimit" dataCheck={this.dataCheck} valueChange={this.valueChange} index={5} />
                        </div>
                        <div className={styles.oneColumn}>
                            <InputContent editData={editData} keyWord="indexLowerLimit" dataCheck={this.dataCheck} valueChange={this.valueChange} index={6} /> ～
                            <InputContent editData={editData} keyWord="indexUpperLimit" dataCheck={this.dataCheck} valueChange={this.valueChange} index={6} />
                        </div>
                        <div className={styles.oneColumn}>
                            <InputContent editData={editData} keyWord="indexLowerLimit" dataCheck={this.dataCheck} valueChange={this.valueChange} index={7} /> ～
                            <InputContent editData={editData} keyWord="indexUpperLimit" dataCheck={this.dataCheck} valueChange={this.valueChange} index={7} />
                        </div>
                    </div>
                    <div className={styles.inOrDePoints}>
                        <div className={styles.oneColumn}>
                            <InputContent editData={editData} keyWord="indexIncrDecrStandard" dataCheck={this.dataCheck} valueChange={this.valueChange} index={0} /> %
                        </div>
                        <div className={styles.oneColumn}>
                            <InputContent editData={editData} keyWord="indexIncrDecrStandard" dataCheck={this.dataCheck} valueChange={this.valueChange} index={1} /> %
                        </div>
                        <div className={styles.oneColumn}>
                            <InputContent editData={editData} keyWord="indexIncrDecrStandard" dataCheck={this.dataCheck} valueChange={this.valueChange} index={2} />
                        </div>
                        <div className={styles.twoColumn}>
                            <InputContent editData={editData} keyWord="indexIncrDecrStandard" dataCheck={this.dataCheck} valueChange={this.valueChange} index={3} /> %
                        </div>
                        <div className={styles.oneColumn}>
                            <InputContent editData={editData} keyWord="indexIncrDecrStandard" dataCheck={this.dataCheck} valueChange={this.valueChange} index={4} /> %
                        </div>
                        <div className={styles.oneColumn}>
                            <InputContent editData={editData} keyWord="indexIncrDecrStandard" dataCheck={this.dataCheck} valueChange={this.valueChange} index={5} />
                        </div>
                        <div className={styles.oneColumn}>
                            <InputContent editData={editData} keyWord="indexIncrDecrStandard" dataCheck={this.dataCheck} valueChange={this.valueChange} index={6} />
                        </div>
                        <div className={styles.oneColumn}>
                            <InputContent editData={editData} keyWord="indexIncrDecrStandard" dataCheck={this.dataCheck} valueChange={this.valueChange} index={7} />
                        </div>
                    </div>
                    <div className={styles.inOrDeScore}>
                        <div className={styles.oneColumn}>
                            <InputContent editData={editData} keyWord="indexIncrDecrValue" dataCheck={this.dataCheck} valueChange={this.valueChange} index={0} />
                        </div>
                        <div className={styles.oneColumn}>
                            <InputContent editData={editData} keyWord="indexIncrDecrValue" dataCheck={this.dataCheck} valueChange={this.valueChange} index={1} />
                        </div>
                        <div className={styles.oneColumn}>
                            <InputContent editData={editData} keyWord="indexIncrDecrValue" dataCheck={this.dataCheck} valueChange={this.valueChange} index={2} />
                        </div>
                        <div className={styles.twoColumn}>
                            <InputContent editData={editData} keyWord="indexIncrDecrValue" dataCheck={this.dataCheck} valueChange={this.valueChange} index={3} />
                        </div>
                        <div className={styles.oneColumn}>
                            <InputContent editData={editData} keyWord="indexIncrDecrValue" dataCheck={this.dataCheck} valueChange={this.valueChange} index={4} />
                        </div>
                        <div className={styles.oneColumn}>
                            <InputContent editData={editData} keyWord="indexIncrDecrValue" dataCheck={this.dataCheck} valueChange={this.valueChange} index={5} />
                        </div>
                        <div className={styles.oneColumn}>
                            <InputContent editData={editData} keyWord="indexIncrDecrValue" dataCheck={this.dataCheck} valueChange={this.valueChange} index={6} />
                        </div>
                        <div className={styles.oneColumn}>
                            <InputContent editData={editData} keyWord="indexIncrDecrValue" dataCheck={this.dataCheck} valueChange={this.valueChange} index={7} />
                        </div>
                    </div>
                    <div className={styles.assessInstruct}>
                        每一项指标拥有同样初始分，在判定标准范围外，增/减数值达到相应标准，则能获得/扣除相应分值。
                   </div>
                </div>
            </div >
        )
    }
}
export default EditTable;