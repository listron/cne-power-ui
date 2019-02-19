import React, { Component } from "react";
import { Input, Button, message, Radio } from 'antd';
import PropTypes from 'prop-types';
import styles from "./score.scss";
import WarningTip from '../../../Common/WarningTip';
import DetailTable from './DetailTable';
import EditTable from './EditTable';
class ScoreMain extends Component {
    static propTypes = {
        getScoreConfig: PropTypes.func,
        basicScore: PropTypes.string,
        indexList: PropTypes.array,
        changeScoreStore: PropTypes.func,
        editScoreConfig: PropTypes.func,
        getPvStionType: PropTypes.func,
        canSave: PropTypes.bool,
        reportType: PropTypes.string,
    };
    constructor(props) {
        super(props);
        this.state = {
            edit: false, // 是否处于一个编辑状态
            stationTypes: props.reportType, // 电站类型
            warningTipText: '是否放弃当前修改',
            showWarningTip: false,
            allData: [],
            basicScore: props.basicScore
        }
    }

    componentDidMount() {
        this.props.getScoreConfig({ reportType: "1", isInitValue: 0 })
    }

    componentWillReceiveProps(nextProps) {
        // if(!this.props.reset && nextProps.basicScore){this.setState({basicScore:nextProps.basicScore})}
        if (this.props.reset && !nextProps.reset) { this.setState({ basicScore: nextProps.basicScore }) }
    }

    stationCheck = (e) => {// 电站切换
        const { edit } = this.state;
        if (edit) {
            this.setState({ showWarningTip: true, stationTypes: e.target.value })
        } else {
            this.setState({ edit: false, stationTypes: e.target.value })
            this.props.getScoreConfig({ reportType: `${e.target.value}`, isInitValue: 0 })
        }
    }

    initChange = (e) => { //初始值的修改
        const value = e.target.value && e.target.value.trim();
        this.setState({ basicScore: value })
        if (isNaN(value) || !value || value < 0) {
            this.props.changeScoreStore({ canSave: false, })
            message.config({ top: 220, maxCount: 1 })
            message.warn('填写电站初始分不正确，请重新填写！！！', 2);
        } else {
            this.props.changeScoreStore({ canSave: true })
        }
    }

    edit = () => { // 修改配置
        this.setState({ edit: true })
    }

    cancle = () => { // 取消
        this.setState({ edit: false })
    }

    default = () => { // 恢复默认
        const { reportType } = this.props;
        this.props.changeScoreStore({ reset: true })
        this.props.getScoreConfig({ reportType, isInitValue: 1 })
    }

    save = () => { //保存
        const { canSave } = this.props;
        const { stationTypes, allData, basicScore } = this.state;
        if (canSave) {
            this.setState({ edit: false })
            this.props.editScoreConfig({ reportType: stationTypes, basicScore, indexList: allData, })
        } else {
            message.warn('请先填完信息')
        }
    }

    confirmWarningTip = () => { // 确认跳转
        const { stationTypes } = this.state;
        this.setState({ edit: false, showWarningTip: false, stationTypes: stationTypes, basicScore: this.props.basicScore })
        this.props.getScoreConfig({ reportType: stationTypes, isInitValue: 0 })
    }

    cancelWarningTip = () => { // 取消
        const { stationTypes } = this.state;
        this.setState({ showWarningTip: false, stationTypes: stationTypes === '2' ? "1" : "2" })
        this.props.getScoreConfig({ reportType: stationTypes === '2' ? "1" : "2", isInitValue: 0 })
    }

    totalInfoChange = (rest) => { // 表格的数据
        this.setState({ allData: rest })
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
        const { edit, stationTypes, showWarningTip, warningTipText, basicScore } = this.state;
        const { indexList } = this.props;
        const editData = this.deepClone(indexList);
        console.log('basicScore',basicScore)
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
                        <Button type="default" onClick={this.edit}>修改配置</Button>
                    </div>}
                {!!edit &&
                    <div className={styles.scoreLine}>
                        <div><span>电站初始分</span>
                            {!!edit &&  < Input placeholder="请填写" onChange={this.initChange} value={basicScore} /> }
                        </div>
                        <div className={styles.buttonGroups}>
                            <Button onClick={this.cancle}>取消</Button>
                            <Button type="default" onClick={this.default}>恢复默认</Button>
                            <Button type="default" onClick={this.save}>保存</Button>
                        </div>
                    </div>
                }

                {edit === false && <DetailTable indexList={indexList} /> || <EditTable editData={editData} totalInfoChange={this.totalInfoChange} {...this.props} />}

            </div>
        )
    }
}
export default ScoreMain;