import React, { Component } from 'react';
import styles from './unhandle.scss';
import PropTypes from 'prop-types';
import { Select, DatePicker, Modal, Radio, message, Form } from 'antd';
import InputLimit from '../../../Common/InputLimit';
import moment from 'moment';
import CneButton from '@components/Common/Power/CneButton';
const FormItem = Form.Item;
const Option = Select.Option;

class IgnoreModal extends Component {
    static propTypes = {
        ignoreReason: PropTypes.array,
        onChange: PropTypes.func,
        ingoreVisible: PropTypes.bool,
        form: PropTypes.object,
    }

    constructor(props) {
        super(props);
        this.state = {
            ignoreReasonCode: '', // 忽略原因
            otherReason: '', // 其他原因
            timeType: 'sevenDay',
            otherData: '',
            deadline: moment().add(7, 'days').utc().format(),
        };
    }

    onChangeDuration = (value) => { // 修改截止时间
        this.setState({
            timeType: value,
        });
        let deadline;
        if (value === 'sevenDay') {
            deadline = moment().add(7, 'days').utc().format('');
        } else if (value === 'oneDay') {
            deadline = moment().add(1, 'days').utc().format();
        } else if (value = 'threeDay') {
            deadline = moment().add(3, 'days').utc().format('');
        }
        this.setState({
            deadline: deadline,
        });
    }

    handleIngoreOk = () => { // 忽略原因点击确定
        const { ignoreReasonCode, otherReason, timeType, deadline, otherData } = this.state;
        const { ignoreReason } = this.props;
        message.config({ top: 188, duration: 2, maxCount: 1 });
        if (ignoreReasonCode === 1407 && otherReason.trim().length === 0) {
            message.warning('请填写其他忽略原因');
        } else if (!ignoreReasonCode) {
            message.warning('请填写忽略原因');
        } else if (timeType === 'other' && !otherData) {
            message.warning('请填写截止时间');
        } else {
            this.props.onChange({
                ignoreReasonCode: ignoreReasonCode,
                ignoreReason: ignoreReasonCode !== 1407 ? ignoreReason.filter(e => e.id === ignoreReasonCode)[0].name : otherReason,
                buttonStatus: 'sure',
                deadline: timeType === 'other' ? otherData : deadline,
                ignoreTime: moment().utc().format(),
            });
            this.setState({ // 恢复初始值
                ignoreReasonCode: '', // 忽略原因
                otherReason: '', // 其他原因
                timeType: 'sevenDay',
                otherData: '',
                deadline: moment().add(7, 'days').utc().format(),
            });
        }
    }

    handleIngoreCancel = () => { // 忽略原因点击取消
        this.props.onChange({ buttonStatus: 'cancle' });
        this.setState({ ignoreReasonCode: '', otherReason: '' });

    }

    inputChange = (value) => { //输入其他的原因
        this.setState({ otherReason: value });
    }

    resonClick = (e) => { // 原因的选择
        this.setState({ ignoreReasonCode: e.target.value });
    }

    disabledDate = (current) => {
        return current && current < moment().endOf('day');
    }

    timeSelect = (date, dateString) => {
        this.setState({ otherData: moment(date).utc().format() });
    }


    render() {
        const { ignoreReason, ingoreVisible } = this.props;
        const { otherReason, ignoreReasonCode, timeType } = this.state;
        return (
            <React.Fragment>
                <span ref="modal" />
                <Modal
                    visible={ingoreVisible}
                    width={750}
                    closable={false}
                    centered={true}
                    footer={null}
                    wrapClassName={styles.stationModal}
                    // getContainer={() => this.refs.modal}
                    onCancel={this.handleIngoreCancel}
                >
                    <div className={styles.reasonItem} >
                        <p className={styles.title} >忽略选中预警</p>
                        <div className={styles.label} >
                            <div className={styles.timeline}>
                                <p className={styles.labels}> 截至时间 <span>*</span></p>
                                <Select className={styles.duration} style={{ width: 120, marginRight: 20 }} value={timeType} onChange={this.onChangeDuration}>
                                    <Option value="oneDay">1天</Option>
                                    <Option value="threeDay">3天</Option>
                                    <Option value="sevenDay">7天</Option>
                                    <Option value="other">其他</Option>
                                </Select>
                                {timeType === 'other' &&
                                    <DatePicker placeholder="请输入" disabledDate={this.disabledDate} onChange={this.timeSelect} />
                                }
                            </div>
                            <div className={styles.ignoreReason}>
                                <div className={styles.ignoreReasonTop}>
                                    <p className={styles.labels}> 忽略原因 <span>*</span></p>
                                    <div className={styles.reasonName}>
                                        <Radio.Group onChange={this.resonClick} value={ignoreReasonCode} >
                                            {ignoreReason.map((item) => {
                                                return <Radio.Button value={item.id} key={item.id}>{item.name}</Radio.Button>;
                                            })}
                                        </Radio.Group>
                                    </div>
                                </div>
                                <div className={styles.descripe} >
                                    <InputLimit placeholder="请描述，不超过80个汉字" onChange={this.inputChange} value={otherReason} disabled={ignoreReasonCode === 1407 ? false : true} />
                                </div>
                            </div>
                            <div className={styles.handlerBtn}>
                                <span onClick={this.handleIngoreCancel}>取消</span>
                                <CneButton
                                    lengthMode="short"
                                    onClick={this.handleIngoreOk}
                                >
                                    保存
                              </CneButton>
                            </div>
                        </div>
                    </div>
                </Modal>
            </React.Fragment>


        );
    }
}


export default IgnoreModal;


