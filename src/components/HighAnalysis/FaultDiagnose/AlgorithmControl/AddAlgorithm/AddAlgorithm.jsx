import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Icon, Form, Row, Col, Button, DatePicker, Select} from 'antd';
import CancelModal from './CancelModal/CancelModal';
import SureModal from './SureModal/SureModal';
import StationSelect from '../../../../Common/StationSelect/index';

import styles from './addAlgorithm.scss';

const FormItem = Form.Item;
const Option = Select.Option;
const disabledDate = current => current && current > moment().subtract(0, 'days');

class AddAlgorithm extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    form: PropTypes.object,
    stations: PropTypes.object,
    onAddControlFunc: PropTypes.func,
    stationCode: PropTypes.string,
    getAlgoOptionList: PropTypes.func,
    algoOptionList: PropTypes.array,
    algorithmModalName: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.state = {
      cancelFlag: false, // 控制取消弹框
      sureFlag: false, // 控制下发弹框
      actionAndEndTime: true, // 控制训练开始日期/检测结束日期
      actionAndEndDisabledDate: new Date(), // 当前选中时间
      actionDiffTime: 90, // 训练时长
      endDiffTime: 7, // 检测时长
      downLink: {
        modal: '',
        selectStationName: '',
        actionTime: '',
        startTime: '',
        endTime: '',
      }, //保存下发数据
    };
    this.actionTime = '';
    this.endTime = '';
    this.nowTime = '';
  }

  componentDidMount() {
    const {getAlgoOptionList} = this.props;
    getAlgoOptionList();
  }

  onStartTimeChange = (date) => {
    const { form } = this.props;
    /**
     * 1.测开始时间有值或发生变化时，actionTime自动赋值为检测开始日期-90
     * 2.测开始时间有值或发生变化时，endTime自动赋值为检测日期+6
     */
    // 有时间
    this.actionTime = moment(date).subtract(90, 'days');
    this.endTime = moment(date).add(6, 'days');
    this.nowTime = moment(date);
    if (date) {
      this.setState({
        actionAndEndTime: false,
        actionAndEndDisabledDate: date,
        actionDiffTime: this.nowTime.diff(this.actionTime, 'days'),
        endDiffTime: this.endTime.diff(this.nowTime, 'days') + 1,
      }, () => {
        form.setFieldsValue({
          actionTime: this.actionTime,
          endTime: this.endTime,
        });
      });
    }
    // 时间清空之后
    if (!date) {
      this.setState({
        actionAndEndTime: true,
        actionAndEndDisabledDate: new Date(),
      }, () => {
        form.setFieldsValue({
          actionTime: null,
          endTime: null,
        });
      });
    }
  };

  onActionChange = (date) => {
    this.actionTime = moment(date);
    this.setState({
      actionDiffTime: this.nowTime.diff(this.actionTime, 'days'),
    });
  };

  onEndChange = (date) => {
    this.endTime = moment(date);
    this.setState({
      endDiffTime: this.endTime.diff(this.nowTime, 'days') + 1,
    });
  };

  cancelFunc = () => {
    this.cancelModalFunc(true);
  };

  cancelModalFunc = (flag) => {
    this.setState({
      cancelFlag: flag,
    });
  };

  sureModalFunc = (flag) => {
    this.setState({
      sureFlag: flag,
    });
  };

  handlerResetForm = () => {
    const { form } = this.props;
    this.setState({
      actionAndEndTime: true,
    }, () => {
      form.setFieldsValue({
        actionTime: null,
        endTime: null,
        startTime: null,
        modal: 1,
        selectStationName: [''],
      });
    });
  };

  handleSend = event => {
    event.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const {
        modal,
        selectStationName,
        actionTime,
        startTime,
        endTime,
      } = fieldsValue;
      this.setState({
        sureFlag: true,
        downLink: {
          modal,
          selectStationName,
          actionTime,
          startTime,
          endTime,
        },
      });
    });
  };

  render() {
    const {
      cancelFlag,
      sureFlag,
      actionAndEndTime,
      actionAndEndDisabledDate,
      actionDiffTime,
      endDiffTime,
      downLink,
    } = this.state;
    const { form, stations, algoOptionList } = this.props;
    const { getFieldDecorator } = form;
    const optionItem = algoOptionList && algoOptionList.map(cur => {
      return (
        <Option key={cur.algorithmId} value={cur.algorithmId}>{cur.algorithmName}</Option>
      );
    });
    return (
      <div className={styles.addAlgorithm}>
        <div className={styles.addCenter}>
          <div className={styles.title}>
            <div>
              新建
            </div>
            <div onClick={this.cancelFunc}>
              <Icon type="arrow-left" className={styles.backIcon} />
            </div>
          </div>
          <div className={styles.addContent}>
            <div className={styles.addForm}>
              <Form onSubmit={this.handleSend} layout="inline">
                <Row style={{paddingLeft: 28}}>
                  <Col>
                    <FormItem label="算法模型">
                      {getFieldDecorator('modal', {
                        rules: [{ required: true, message: '请输入算法模型'}],
                        initialValue: 1,
                      })(<Select style={{ width: 200 }}>
                          {optionItem}
                      </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row style={{paddingLeft: 28}}>
                  <Col>
                    <FormItem label="电站名称">
                      {getFieldDecorator('selectStationName', {
                        rules: [{ required: true, message: '请输入电站名称'}],
                      })(
                        <StationSelect
                          data={stations.toJS().filter(e => e.stationType === 0)}
                          style={{ width: '200px' }}
                          disabledStation={stations.toJS().filter(e => e.isConnected === 0).map(e => e.stationCode)}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FormItem label="检测开始日期">
                      {getFieldDecorator('startTime', {
                        rules: [{ required: true, message: '请输入检测开始日期'}],
                      })(
                        <DatePicker
                          style={{ width: '200px' }}
                          disabledDate={disabledDate}
                          onChange={this.onStartTimeChange}
                          placeholder="请选择时间"
                        />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FormItem label="训练开始日期">
                      {getFieldDecorator('actionTime', {
                        rules: [{ required: true, message: '请输入训练开始日期'}],
                      })(
                        <DatePicker
                          style={{ width: '200px' }}
                          disabled={actionAndEndTime}
                          disabledDate={current => current && current > moment(actionAndEndDisabledDate).subtract(90, 'days')}
                          onChange={this.onActionChange}
                          placeholder="请选择时间"
                        />)}
                    </FormItem>
                    <FormItem style={{color: '#999999'}}>
                      {(!actionAndEndTime) && (`（训练时长${actionDiffTime}天）`)}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FormItem label="检测结束日期">
                      {getFieldDecorator('endTime', {
                        rules: [{ required: true, message: '请输入检测结束日期'}],
                      })(<DatePicker
                          style={{ width: '200px' }}
                          disabled={actionAndEndTime}
                          disabledDate={current => current && current > moment(actionAndEndDisabledDate).add(6, 'days') || current && current < moment(actionAndEndDisabledDate).subtract(0, 'days')}
                          onChange={this.onEndChange}
                          placeholder="请选择时间"
                      />)}
                    </FormItem>
                    <FormItem style={{color: '#999999'}}>
                      {(!actionAndEndTime) && (`（检测时长${endDiffTime}天）`)}
                    </FormItem>
                  </Col>
                </Row>
                <Row style={{display: 'flex', paddingLeft: 110}}>
                  <Col>
                    <Button style={{ width: '88px' }} onClick={this.handlerResetForm}>
                      重置
                    </Button>
                  </Col>
                  <Col style={{marginLeft: 24}}>
                    <Button style={{ width: '88px' }} htmlType="submit" type="primary">
                      下发
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </div>
        <CancelModal cancelModalFunc={this.cancelModalFunc} cancelFlag={cancelFlag} {...this.props} />
        <SureModal
          downLink={downLink}
          actionDiffTime={actionDiffTime}
          endDiffTime={endDiffTime}
          sureModalFunc={this.sureModalFunc}
          sureFlag={sureFlag}
          {...this.props}
        />
      </div>
    );
  }
}

export default Form.create()(AddAlgorithm);
