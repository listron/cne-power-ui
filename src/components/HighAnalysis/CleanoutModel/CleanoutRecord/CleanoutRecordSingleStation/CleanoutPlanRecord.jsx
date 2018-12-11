

import React, { Component } from 'react';

import WarningTip from '../../../../Common/WarningTip';
import PropTypes from 'prop-types';
import styles from './cleanoutPlanRecord.scss';
import PlanRecordTable from './PlanRecordTable';
import Pagination from '../../../../../components/Common/CommonPagination/index';
import InputLimit from '../../../../Common/InputLimit';
import moment from 'moment';
import { Table, Icon, Modal, Form, DatePicker, Input, Button ,TreeSelect} from 'antd';
const FormItem = Form.Item;

const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const { RangePicker } = DatePicker;
class CleanoutPlanRecord extends Component {
  static propTypes = {
    totalNum: PropTypes.number,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    selectedStationIndex: PropTypes.number,
    stationList: PropTypes.array,
    queryListParams: PropTypes.object,
    stationDetail: PropTypes.object,
    onShowSideChange: PropTypes.func,
    changeCleanoutRecordStore: PropTypes.func,
    getStationDetail: PropTypes.func,
    getOtherPageStationDetail: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      showWarningTip: false,
      warningTipText: '',
      showAddRecordModal: false,
    }
  }

  preStation = () => { // 上一个电站详情
    const { queryListParams, selectedStationIndex, pageNum, pageSize, getOtherPageStationDetail, getStationDetail, stationList } = this.props;
    if (selectedStationIndex === 0 && pageNum === 1) { // 第一页第一条
      this.setState({
        showWarningTip: true,
        warningTipText: '这是第一个!',
      })
    } else if (selectedStationIndex === 0 && pageNum > 1) { // 其他页向前翻页
      getOtherPageStationDetail({
        ...queryListParams,
        pageNum: pageNum - 1,
        selectedStationIndex: pageSize - 1,
      })
    } else {
      getStationDetail({ // 正常请求上一条电站详情数据
        ...queryListParams,
        selectedStationIndex: selectedStationIndex - 1,
        stationCode: stationList[selectedStationIndex].stationCode,
      })
    }
  }

  nextStation = () => { // 下一个电站详情
    const { queryListParams, selectedStationIndex, pageNum, pageSize, getOtherPageStationDetail, totalNum, getStationDetail, stationList } = this.props;
    const maxPage = Math.ceil(totalNum / pageSize); // 最后一页页码
    const lastPageMaxIndex = totalNum - (maxPage - 1) * pageSize - 1;
    if (selectedStationIndex === lastPageMaxIndex && pageNum === maxPage) { // 最后一页最后一条
      this.setState({
        showWarningTip: true,
        warningTipText: '这是最后一个!',
      })
    } else if (selectedStationIndex === pageSize - 1 && pageNum < maxPage) { // 向后翻页
      getOtherPageStationDetail({
        ...queryListParams,
        pageNum: pageNum + 1,
        selectedStationIndex: 0,
      })
    } else {
      getStationDetail({ // 请求下一条电站详情数据
        ...queryListParams,
        selectedStationIndex: selectedStationIndex + 1,
        stationCode: stationList[selectedStationIndex].stationCode,
      })
    }
  }

  confirmWarningTip = () => { // 提示框确认
    this.setState({
      showWarningTip: false,
      warningTipText: '',
    })
  }

  backToList = () => { // 返回列表页
    // this.props.changeCleanoutRecordStore({
    //   showPage: 'list',
    //   selectedStationIndex: null,
    // });
    this.props.onShowSideChange({ showSidePage: 'detail' })
  }

  editDetail = () => { // 编辑页
    this.props.onShowSideChange({ showSidePage: 'edit' });
    this.props.changeCleanoutRecordStore({ showPage: 'edit' });
  }

 
  addRecord=()=>{
    this.setState({showAddRecordModal: true,})
    
  }
  addCleanoutRecord(record) {
    console.log(record);
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const { getFieldDecorator } = this.props.form;
    const{stations}=this.props;//此处应该是方阵的数据，下面的不可选是由方阵的数据决定的

    const rangeConfig = {
      // initialValue: [moment('2018-12-10'), moment('2018-12-25')],
      rules: [{ type: 'array', required: true, message: 'Please select time!' }],
    };
    const tmpDeviceTypes = [1,2,3,4,5,6].map((e,i)=>{
      return {
        title : e,
        key : i.toString(),
        value : e.toString(),
      }
    });
    const treeProps = {
      treeData: tmpDeviceTypes,
      treeCheckable: true,
      filterTreeNode: false,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: '请选择设备类型',
      style: {
        width: 198,
      },
      disabled: stations.size === 0,
    };
    return (
      <Modal
        title={'电站3-清洗记录'}
        visible={this.state.showAddRecordModal}
        onOk={this.confirmAddRecord}
        footer={null}
        onCancel={this.cancelAddRecord}
        mask={false}
        centered={true}
        closable={false}
        maskClosable={false}
      >
        <div className={styles.modalStyle}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
              label="清洗时间"
            >
              {getFieldDecorator('cleanDate', rangeConfig)(
                <RangePicker />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="清洗方阵"
            >
              {getFieldDecorator('matrix', {
                rules: [{ required: true, message: '请选择方阵'}],
              })(
                <TreeSelect {...treeProps} dropdownClassName={styles.treeDeviceTypes} />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="清洗备注"
            >
              {getFieldDecorator('cleanTip', { rules: [{ required: true, message: '只能输入数字', whitespace: true }, ],
              })(
                <InputLimit width={316} placeholder="请描述，不超过80个汉字" />
              )}
            </FormItem>
          </Form>
          <div className={styles.handle}>
            <Button onClick={this.cancelAddRecord} >取消</Button>
            <Button onClick={this.confirmAddRecord} className={styles.confirmExamine} >保存</Button>
          </div>


        </div>

      </Modal>
    )

  }
  cancelAddRecord=()=>{
    this.setState({ showAddRecordModal: false })
  }
  confirmAddRecord=()=>{
    this.setState({ showAddRecordModal: false })
    const { getFieldsValue } = this.props.form;
    let recordValue = getFieldsValue(['cleanDate','matrix','cleanTip']);
    console.log(recordValue);
    recordValue.estimateStartTime = moment(recordValue.cleanDate[0]).format('YYYY-MM-DD')
    recordValue.estimateEndTime = moment(recordValue.cleanDate[1]).format('YYYY-MM-DD')
    //发送添加清洗计划的函数
    //此处还要传planid
    this.props.getAddCleanRecord(recordValue)
  }

  render() {
    const { stationDetail } = this.props;
    const { showWarningTip, warningTipText } = this.state;

    const departmentList = stationDetail.departmentList || [];
    const record={name:'dali'}
  
    return (
      <div className={styles.CleanoutPlanRecord}>
        {showWarningTip && <WarningTip onOK={this.confirmWarningTip} value={warningTipText} />}
        <div className={styles.detailTop}>
          <span className={styles.topInfoShow}>
            2018/07/07-2018/07/09
            <span className={styles.departmentInfo} >
              清洗计划-清洗记录
            </span>
            (洱源-云南)
          </span>
          <span className={styles.handleArea} >
            <i className="iconfont icon-last" title="上一个" onClick={this.preStation} />
            <i className="iconfont icon-next" title="下一个" onClick={this.nextStation} />
            <Icon type="arrow-left" className={styles.backIcon} onClick={this.backToList} />
          </span>
        </div>
        <div className={styles.statisticData}>
          <div className={styles.statisticTarget}>
            <div className={styles.numberColor}>123.89(10%)</div>
            <div>累计清洗收益(万kWh)</div>
          </div>
          <div className={styles.statisticTarget}>
            <div className={styles.numberColor}>19</div>
            <div>清洗成本(万元)</div>
          </div>
          <div className={styles.statisticTarget}>
            <div className={styles.numberColor}>19.4</div>
            <div>清洗用时(天)</div></div>
          
        </div>
        <div className={styles.filterData}>
          <Button className={styles.plusButton} onClick={this.addRecord} icon="plus" >电站</Button>
           {this.addCleanoutRecord(record)}
          <Pagination />
        </div>
        <PlanRecordTable {...this.props} />
      </div>
    )
  }
}

export default Form.create()(CleanoutPlanRecord);


