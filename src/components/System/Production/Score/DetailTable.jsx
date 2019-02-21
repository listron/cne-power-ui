import React, { Component } from "react";
import PropTypes from 'prop-types';
import styles from "./score.scss";

class DetailTable extends Component {
    static propTypes = {
        indexList: PropTypes.array,
    };
    constructor(props) {
        super(props);
    }

    render() {
        const { indexList } = this.props;
        let indexLowerLimit = [], indexUpperLimit = [];
        indexList.forEach(e => {
            indexLowerLimit.push(e.indexLowerLimit)
            indexUpperLimit.push(e.indexUpperLimit)
        });
        return (
            <div className={styles.detailTable}>
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
                        <div className={styles.oneColumn}> {indexList.length > 0 && indexList[0].indexPercent}%</div>
                        <div className={styles.oneColumn}> {indexList.length > 0 && indexList[1].indexPercent}%</div>
                        <div className={styles.oneColumn}> {indexList.length > 0 && indexList[2].indexPercent}%</div>
                        <div className={styles.twoColumn}> {indexList.length > 0 && indexList[3].indexPercent}%</div>
                        <div className={styles.oneColumn}> {indexList.length > 0 && indexList[4].indexPercent}%</div>
                        <div className={styles.oneColumn}> {indexList.length > 0 && indexList[5].indexPercent}%</div>
                        <div className={styles.oneColumn}> {indexList.length > 0 && indexList[6].indexPercent}%</div>
                        <div className={styles.oneColumn}> {indexList.length > 0 && indexList[7].indexPercent}%</div>
                    </div>
                    <div className={styles.judgeStandard}>
                        <div className={styles.oneColumn}>{indexList.length > 0 && indexLowerLimit[0]}%~{indexList.length > 0 && indexUpperLimit[0]}%</div>
                        <div className={styles.oneColumn}> {indexList.length > 0 && indexLowerLimit[1]}%~{indexList.length > 0 && indexUpperLimit[1]}%</div>
                        <div className={styles.oneColumn}> {indexList.length > 0 && indexLowerLimit[2]}</div>
                        <div className={styles.twoColumn}> {indexList.length > 0 && indexLowerLimit[3]}%</div>
                        <div className={styles.oneColumn}>{indexList.length > 0 && indexLowerLimit[4]}%</div>
                        <div className={styles.oneColumn}>{indexList.length > 0 && indexLowerLimit[5]}~{indexList.length > 0 && indexUpperLimit[5]}</div>
                        <div className={styles.oneColumn}> {indexList.length > 0 && indexLowerLimit[6]}~{indexList.length > 0 && indexUpperLimit[6]}</div>
                        <div className={styles.oneColumn}>{indexList.length > 0 && indexLowerLimit[7]}~{indexList.length > 0 && indexUpperLimit[7]}</div>
                    </div>
                    <div className={styles.inOrDePoints}>
                        <div className={styles.oneColumn}> {indexList.length > 0 && indexList[0].indexIncrDecrStandard}%</div>
                        <div className={styles.oneColumn}> {indexList.length > 0 && indexList[1].indexIncrDecrStandard}%</div>
                        <div className={styles.oneColumn}> {indexList.length > 0 && indexList[2].indexIncrDecrStandard}</div>
                        <div className={styles.twoColumn}> {indexList.length > 0 && indexList[3].indexIncrDecrStandard}%</div>
                        <div className={styles.oneColumn}> {indexList.length > 0 && indexList[4].indexIncrDecrStandard}%</div>
                        <div className={styles.oneColumn}> {indexList.length > 0 && indexList[5].indexIncrDecrStandard}</div>
                        <div className={styles.oneColumn}> {indexList.length > 0 && indexList[6].indexIncrDecrStandard}</div>
                        <div className={styles.oneColumn}> {indexList.length > 0 && indexList[7].indexIncrDecrStandard}</div>
                    </div>
                    <div className={styles.inOrDeScore}>
                        <div className={styles.oneColumn}> {indexList.length > 0 && indexList[0].indexPercent}</div>
                        <div className={styles.oneColumn}> {indexList.length > 0 && indexList[1].indexIncrDecrValue}</div>
                        <div className={styles.oneColumn}> {indexList.length > 0 && indexList[2].indexIncrDecrValue}</div>
                        <div className={styles.twoColumn}> {indexList.length > 0 && indexList[3].indexIncrDecrValue}</div>
                        <div className={styles.oneColumn}> {indexList.length > 0 && indexList[4].indexIncrDecrValue}</div>
                        <div className={styles.oneColumn}> {indexList.length > 0 && indexList[5].indexIncrDecrValue}</div>
                        <div className={styles.oneColumn}> {indexList.length > 0 && indexList[6].indexIncrDecrValue}</div>
                        <div className={styles.oneColumn}> {indexList.length > 0 && indexList[7].indexIncrDecrValue}</div>
                    </div>
                    <div className={styles.assessInstruct}>
                        每一项指标拥有同样初始分，在判定标准范围外，增/减数值达到相应标准，则能获得/扣除相应分值。
                   </div>
                </div>
            </div >
        )
    }
}
export default DetailTable;