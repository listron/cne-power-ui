

import React, { Component } from 'react';
import { Button, Icon } from 'antd';
import PropTypes from 'prop-types';
import styles from './departmentSide.scss';
import WarningTip from '../../../Common/WarningTip';

class DepartmentDetail extends Component {
  static propTypes = {
    enterpriseId: PropTypes.string,
    departmentSource: PropTypes.number,
    departmentName: PropTypes.string, 
    parentDepartmentName: PropTypes.string, 
    stationName: PropTypes.string, 
    sort: PropTypes.string, 
    ascend: PropTypes.bool, 
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    totalNum: PropTypes.number,

    departmentData: PropTypes.array,
    getOtherPageDetail: PropTypes.func,
    getDepartmentDetail: PropTypes.func,
    changeDepartmentStore: PropTypes.func,
    onShowSideChange: PropTypes.func,
    departmentDetail: PropTypes.object,
  }

  constructor(props){
    super(props);
    this.state = {
      showWarningTip: false,
      warningTipText: '!',
    }
  }

  onShowSideChange = ({showSidePage}) => {
    this.props.onShowSideChange({showSidePage:'edit'});
    this.props.changeDepartmentStore({showPage: 'edit'});
  }
  
  setDepartmentUser = () => {
    console.log(this.props.departmentDetail);
  }

  setDepartmentStation = () => {
    console.log(this.props.departmentDetail);
  }

  confirmWarningTip = () => {
    this.setState({
      showWarningTip: false,
      warningTipText: ''
    })
  }

  preDepartment = () =>{
    const { getOtherPageDetail, getDepartmentDetail, departmentDetail, departmentData, enterpriseId, departmentSource, departmentName, parentDepartmentName, stationName, sort,  ascend, pageNum, pageSize } = this.props;
    let detailIndex = departmentData.findIndex(e=>e.departmentId===departmentDetail.departmentId);
    let params = { enterpriseId, departmentSource, departmentName, parentDepartmentName, stationName, sort, ascend, pageNum, pageSize }
    if(pageNum === 1 && detailIndex === 0){//第一条记录
      this.setState({
        showWarningTip: true,
        warningTipText: '这是第一个!',
      })
    }else if(pageNum > 1 && detailIndex === 0){
      params.pageNum = pageNum - 1
      getOtherPageDetail(params,{previous:true})
    }else if(detailIndex > 0 ){
      const {departmentId} = departmentData[detailIndex-1]
      getDepartmentDetail({ departmentId })
    }else{
      console.log("部门id信息有误，在tablelist中未获取")
    }
  }

  nextDepartment = () => {
    const { getOtherPageDetail, getDepartmentDetail, departmentDetail, departmentData, enterpriseId, departmentSource, departmentName, parentDepartmentName, stationName, sort,  ascend, pageNum, pageSize, totalNum } = this.props;
    let detailIndex = departmentData.findIndex(e=>e.departmentId===departmentDetail.departmentId);
    let params = { enterpriseId, departmentSource, departmentName, parentDepartmentName, stationName, sort, ascend, pageNum, pageSize }
    const maxPage = Math.ceil(totalNum/pageSize) 
    const lastPageMaxIndex = totalNum - (maxPage-1)*pageSize - 1;
    if(pageNum === maxPage && detailIndex === lastPageMaxIndex){//最后一条记录
      this.setState({
        showWarningTip: true,
        warningTipText: '这是最后一个!',
      })
    }else if(pageNum < maxPage && detailIndex === pageSize - 1){
      params.pageNum = pageNum + 1
      getOtherPageDetail(params,{previous:false})
    }else if( pageNum < maxPage ){
      const {departmentId} = departmentData[detailIndex + 1]
      getDepartmentDetail({ departmentId })
    }else{
      console.log("部门id信息有误，在tablelist中未获取")
    }
  }

  backToList = () => {
    this.props.changeDepartmentStore({showPage: 'list'});
  }

  render(){
    const { departmentDetail } = this.props;
    const { showWarningTip, warningTipText } = this.state;
    let userFullNames = (departmentDetail.userFullNameData && departmentDetail.userFullNameData.length > 0 )? departmentDetail.userFullNameData.map(e=>e.userFullName).join(','):' -- ';
    let stationNames = (departmentDetail.stationNameData && departmentDetail.stationNameData.length > 0 )? departmentDetail.stationNameData.map(e=>e.stationName).join(','):' -- ';
    return (
      <div className={styles.departmentDetail}>
        {showWarningTip && <WarningTip onOK={this.confirmWarningTip} value={warningTipText} />}
        <div className={styles.detailTop}>
          <Button className={styles.editButton} onClick={()=>this.onShowSideChange({showSidePage:'eidt'})}>编辑</Button>
          <span className={styles.handleArea} >
            <Icon type="arrow-up" className={styles.previous} title="上一个" onClick={this.preDepartment} />
            <Icon type="arrow-down" className={styles.next} title="下一个" onClick={this.nextDepartment} />
            <Icon type="arrow-left" className={styles.backIcon} onClick={this.backToList} />
          </span>
        </div>
        <div className={styles.departmentInfor} >
          <div>
            <span className={styles.title}>部门名称</span>
            <span className={styles.value}>{departmentDetail.departmentName}</span> 
          </div>
          <div>
            <span className={styles.title}>所属部门</span>
            <span className={styles.value}>{departmentDetail.parentDepartmentName}</span> 
          </div>
          <div>
            <span className={styles.title}>成员</span>
            <span className={styles.value}>{userFullNames}</span> 
            <Button className={styles.setting} onClick={this.setDepartmentUser}>设置</Button>
          </div>
          <div>
            <span className={styles.title}>负责电站</span>
            <span className={styles.value}>{stationNames}</span> 
            <Button className={styles.setting} onClick={this.setDepartmentStation} >设置</Button>
          </div>
          <div>
            <span className={styles.title}>负责电站</span>
            <span className={styles.value}>{departmentDetail.enterpriseProfile}</span> 
          </div>
          <div>
            <span className={styles.title}>创建者</span>
            <span className={styles.value}>{departmentDetail.createUser}</span> 
          </div>
          <div>
            <span className={styles.title}>创建时间</span>
            <span className={styles.value}>{departmentDetail.createTime}</span> 
          </div>
          <div>
            <span className={styles.title}>最后修改人</span>
            <span className={styles.value}>{departmentDetail.updateUser}</span> 
          </div>
          <div>
            <span className={styles.title}>最后修改时间</span>
            <span className={styles.value}>{departmentDetail.updateTime}</span> 
          </div>
        </div>
      </div>
    )
  }
}

export default DepartmentDetail ;
