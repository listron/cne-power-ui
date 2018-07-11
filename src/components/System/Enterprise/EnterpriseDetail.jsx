

import React, { Component } from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import styles from './enterprise.scss';


class EnterpriseDetail extends Component {
  static propTypes = {
    changeEnterpriseAttr: PropTypes.func,
    getEnterpriseDetail: PropTypes.func,
    enterpriseDetail: PropTypes.object,
  }

  constructor(props){
    super(props);
  }
  componentDidMount(){
    this.props.getEnterpriseDetail()
  }

  render(){
    const { changeEnterpriseAttr } = this.props;
    console.log(this.props.enterpriseDetail)
    return (
      <div className={styles.enterpriseDetail}>
        <div>
          <Button onClick={()=>changeEnterpriseAttr({showPage:'edit'})}>编辑</Button>
        </div>
        <div>
          <span>stationName : 北京慈寿寺世纪光伏</span>
        </div>
        <div>
          <div>
            <img width={'180px'} height={'180px'} src={'//www.baidu.com/img/bd_logo1.png?where=super'} />
          </div>
          <div>
            <div>
              <Button type="primary">查看部门</Button>
              <Button type="primary">查看成员</Button>
              <Button type="primary">查看角色</Button>
            </div>
            <div>
              <span>电话</span>
              <span>1221211212</span> 
            </div>
            <div>
              <span>网址</span>
              <span>www.baidu.com</span> 
            </div><div>
              <span>地址</span>
              <span>北京市天安门广场2元一个不能再低</span> 
            </div><div>
              <span>简介</span>
              <span>本组织不平凡有大力量！powerful！</span> 
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default EnterpriseDetail;
