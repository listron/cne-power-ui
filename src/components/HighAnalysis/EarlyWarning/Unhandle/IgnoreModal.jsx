import React, { Component } from 'react';
import echarts from 'echarts';
import styles from './unhandle.scss';
import PropTypes from 'prop-types';
import { Select, Table, Button, DatePicker, Modal, Radio, message } from 'antd';
import InputLimit from '../../../Common/InputLimit';


class IgnoreModal extends Component {
    static propTypes = {
        ignoreReason: PropTypes.array,
        onChange: PropTypes.func,
        ingoreVisible: PropTypes.bool,

    }
    constructor(props) {
        super(props);
        this.state = {
            ignoreReasonCode: '', // 忽略原因
            otherReason: '',// 其他原因
        }
    }
  
    handleIngoreOk = () => { // 忽略原因点击确定
        const { ignoreReasonCode, otherReason } = this.state;
        const { ignoreReason } = this.props;
        if (ignoreReasonCode === 1407 && otherReason.length === 0) {
            message.warning('请填写忽略原因');
        } else {
            this.props.onChange({
                ignoreReasonCode: ignoreReasonCode,
                ignoreReason: ignoreReasonCode !== 1407 ? ignoreReason.filter(e => e.id === ignoreReasonCode)[0].name : otherReason,
                buttonStatus:'sure'
            })
        }
        
    }

    handleIngoreCancel = () => { // 忽略原因点击取消
        this.props.onChange({buttonStatus:'cancle'})
        this.setState({ignoreReasonCode:'',otherReason:''})

    }

    inputChange = (value) => { //输入其他的原因
        this.setState({ otherReason: value })
    }

    resonClick = (e) => { // 原因的选择
        this.setState({ ignoreReasonCode: e.target.value })
    }

    render() {
        const { ignoreReason, ingoreVisible } = this.props
        const { otherReason, ignoreReasonCode } = this.state;
        return (
            <div>
                <Modal
                    visible={ingoreVisible}
                    onOk={this.handleIngoreOk}
                    onCancel={this.handleIngoreCancel}
                    width={710}
                    closable={false}
                    centered={true}
                    wrapClassName={styles.stationModal}
                >
                    <div className={styles.reasonItem} >
                        <p className={styles.title} >忽略选中预警</p>
                        <div className={styles.label} >
                            <p> 忽略原因 <span>*</span></p>
                            <div className={styles.reasonName}>
                                <Radio.Group onChange={this.resonClick} value={ignoreReasonCode} >
                                    {ignoreReason.map((item) => {
                                        return <Radio.Button value={item.id} key={item.id}>{item.name}</Radio.Button>
                                    })}
                                </Radio.Group>
                            </div>
                        </div>
                        <div className={styles.descripe} >
                            <InputLimit placeholder="请描述，不超过80个汉字" onChange={this.inputChange} value={otherReason} disabled={ignoreReasonCode === 1407 ? false : true} />
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default IgnoreModal;


