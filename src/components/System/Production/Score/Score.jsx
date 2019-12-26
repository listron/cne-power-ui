import React, { Component } from "react";
import { Input, Button, message, Radio } from 'antd';
import PropTypes from 'prop-types';
import styles from "./score.scss";
import WarningTip from '../../../Common/WarningTip';
import DetailTable from './DetailTable';
import EditTable from './EditTable';
import { handleRight } from '@utils/utilFunc';
import { ifError } from "assert";
class ScoreMain extends Component {
    static propTypes = {
        getScoreConfig: PropTypes.func,
        basicScore: PropTypes.string,
        indexList: PropTypes.array,
        changeScoreStore: PropTypes.func,
        editScoreConfig: PropTypes.func,
        getPvStionType: PropTypes.func,
        changeIsVaild: PropTypes.func,
        hasInitScore: PropTypes.bool,
        reset: PropTypes.bool,
        edit: PropTypes.bool,
        reportType: PropTypes.string,
        isVaild: PropTypes.array,
        resetStore: PropTypes.func,
    };
    constructor(props) {
        super(props);
        this.state = {
            stationTypes: props.reportType, // 电站类型
            warningTipText: '是否放弃当前修改',
            showWarningTip: false,
            allData: [],
            basicScore: "",
        }
    }

    componentDidMount() {
        this.props.getScoreConfig({ reportType: "1", isInitValue: 0 })
    }

    componentWillReceiveProps(nextProps) {
        const { reportType, basicScore, reset, indexList } = nextProps;
        if (this.props.reportType !== reportType || !this.props.basicScore && basicScore || this.props.reset && !reset) { this.setState({ basicScore, allData: indexList }) }
    }

    componentWillUnmount() {
        this.props.resetStore(); // 重置数据
    }

    stationCheck = (e) => {// 电站切换
        const { edit } = this.props;
        if (edit) {
            this.setState({ showWarningTip: true, stationTypes: e.target.value })
        } else {
            this.setState({ stationTypes: e.target.value })
            this.props.changeScoreStore({ edit: false })
            this.props.getScoreConfig({ reportType: `${e.target.value}`, isInitValue: 0 })
        }
    }

    initChange = (e) => { //初始值的修改
        const value = e.target.value && e.target.value.trim();
        this.setState({ basicScore: value })
        message.config({ top: 220, maxCount: 1 })
        if (!value) {
            this.props.changeScoreStore({ hasInitScore: false, })
            message.warn('填写电站初始分不能为空！！！', 2);
            return false
        }
        if (isNaN(value)) {
            this.props.changeScoreStore({ hasInitScore: false, })
            message.warn('电站初始分请填写数字！！！', 2);
            return false
        }
        if (value < 0 || value > 100) {
            this.props.changeScoreStore({ hasInitScore: false, })
            message.warn('填写电站初始分为0-100分之间！！！', 2);
            return false
        }
        this.props.changeScoreStore({ hasInitScore: true })
    }

    edit = () => { // 修改配置
        this.props.changeScoreStore({ edit: true })
    }

    cancle = () => { // 取消
        this.props.changeScoreStore({ edit: false })
        this.props.changeIsVaild()
    }

    default = () => { // 恢复默认
        const { reportType } = this.props;
        this.props.changeIsVaild()
        this.props.changeScoreStore({ reset: true })
        this.props.getScoreConfig({ reportType, isInitValue: 1 })
    }

    save = () => { //保存
        const { hasInitScore, isVaild, indexList } = this.props;
        const { stationTypes, allData, basicScore } = this.state;
        const editData = allData.length > 0 && allData || indexList;
        let newIndexList = [];
        editData.forEach(item => {
            newIndexList.push({
                indexCode: item.indexCode,
                indexPercent: item.indexPercent,
                indexLowerLimit: item.indexLowerLimit,
                indexUpperLimit: item.indexUpperLimit,
                indexIncrDecrStandard: item.indexIncrDecrStandard,
                indexIncrDecrValue: item.indexIncrDecrValue,
            })
        })
        const isVaildError = isVaild.some(e => e.includes(false))
        if (hasInitScore && !isVaildError) {
            this.dataCheck(editData) && this.props.editScoreConfig({ reportType: stationTypes, basicScore, indexList: newIndexList })
        } else {
            message.warn('请正确填写需要填写的信息')
        }
    }


    dataCheck = (data) => { // 点击保存的时候校验
        // 规则4 指标权重<100%
        let flag = true;
        const indexPercentArray = [];
        data.forEach(e => indexPercentArray.push(e.indexPercent));
        const sum = indexPercentArray.reduce(function (prev = 0, curr = 0, idx, arr) {
            return +prev + +curr;
        })
        if (sum > 100) {
            message.warn(`指标权重填写的已超出总和上限（100）`, 2);
            flag = false
        }
        if (sum < 100) {
            message.warn(`指标权重填写的总和小于100`, 2);
            flag = false
        }
        //规则5 判断标准 左边数《= 右边数
        data.forEach(item => {
            if (+item.indexLowerLimit > +item.indexUpperLimit) {
                message.warn(`${item.indexName}判断标准的下限已经超过上限，请修改`, 2);
                flag = false
            }
        })
        return flag
    }

    confirmWarningTip = () => { // 确认跳转
        const { stationTypes } = this.state;
        this.setState({ showWarningTip: false, stationTypes: stationTypes, basicScore: this.props.basicScore })
        this.props.changeScoreStore({ edit: false })
        this.props.getScoreConfig({ reportType: stationTypes, isInitValue: 0 })
        this.props.changeIsVaild()
    }

    cancelWarningTip = () => { // 取消
        const { stationTypes } = this.state;
        this.setState({ showWarningTip: false, stationTypes: stationTypes === '2' ? "1" : "2" })
        this.props.getScoreConfig({ reportType: stationTypes === '2' ? "1" : "2", isInitValue: 0 })
    }

    totalInfoChange = (rest) => { // 表格的数据
        this.setState({ allData: rest || this.props.indexList })
    }


    deepClone = (source) => {
        let targetObj = source.constructor === Array ? [] : {}; // 判断复制的目标是数组还是对象
        for (let keys in source) { // 遍历目标
            if (source.hasOwnProperty(keys)) {
                if (source[keys] && typeof source[keys] === 'object') { // 如果值是对象，就递归一下
                    targetObj[keys] = source[keys].constructor === Array ? [] : {};
                    targetObj[keys] = this.deepClone(source[keys]);
                } else { // 如果不是，就直接赋值
                    targetObj[keys] = source[keys];
                }
            }
        }
        return targetObj;
    }

    render() {
        const { stationTypes, showWarningTip, warningTipText, basicScore } = this.state;
        const { indexList, edit } = this.props;
        const editData = this.deepClone(indexList);
        const scoreOperation = handleRight('config_score_modify');
        return (
            <div className={styles.scoreBox}>
                {showWarningTip &&
                    <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
                <div className={styles.topSelect}>
                    <Radio.Group value={stationTypes} onChange={this.stationCheck} buttonStyle="solid">
                        <Radio.Button value="1">集中式光伏电站</Radio.Button>
                        <Radio.Button value="2">分布式光伏电站</Radio.Button>
                    </Radio.Group>
                    <span> 评分标准</span>
                </div>
                {!edit &&
                    <div className={styles.scoreLine}>
                        <div className={styles.initScore}>电站初始分 {this.props.basicScore}</div>
                        {scoreOperation && <Button type="default" onClick={this.edit}>修改配置</Button>}
                    </div>}
                {!!edit &&
                    <div className={styles.scoreLine}>
                        <div>
                            <span>电站初始分</span>
                            <Input placeholder="请填写" onChange={this.initChange} value={basicScore} />
                            <span>  注：请输入0-100分的初始分值</span>
                        </div>
                        <div className={styles.buttonGroups}>
                            <Button onClick={this.cancle}>取消</Button>
                            <Button type="default" onClick={this.default}>恢复默认</Button>
                            <Button type="default" onClick={this.save}>保存</Button>
                        </div>
                    </div>
                }

                {edit === false &&
                    <DetailTable indexList={indexList} /> ||
                    <EditTable editData={editData} totalInfoChange={this.totalInfoChange} {...this.props} />}
                <div className={styles.explanation}>
                    样例：如完成率指标判定标准为95%~105%，增减分标准为1%，增减分值为2。则当完成率＞105%时，每多出1%（不足1%时，按1%计算），完成率得分+2；当完成率＜95%时，每减少1%，完成率得分-2。
                </div>
            </div>
        )
    }
}
export default ScoreMain;