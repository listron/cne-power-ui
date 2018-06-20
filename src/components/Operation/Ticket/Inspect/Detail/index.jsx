import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BasicInfo from '../BasicInfo';
import TimeLines from '../../../../Common/TimeLines';
import styles from './style.scss';
import { Icon } from 'antd';

class Detail extends Component {
  static propTypes={
    inspectDetail: PropTypes.object,
    processData: PropTypes.object,
    onPrev: PropTypes.func,
    onNext: PropTypes.func,
    onCloseDetail: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state={

    }
  }

  renderForm(){
    
  }

  render(){
    let inspectDetail = this.props.inspectDetail;
    // console.log(inspectDetail);
    // console.log("------------");
    let progressData = inspectDetail.get('processData');
    // console.log(progressData);
    // console.log("1000000000000");
    return (
      <div>
        <div>
          <Icon type="up" onClick={this.props.onPrev} />
          <Icon type="down" onClick={this.props.onNext} />
          <Icon type="close" onClick={this.props.onCloseDetail} />
        </div>
        <div>
          <div>
            <BasicInfo basicInfo={inspectDetail} />
          </div>
          <div>
            <div>
              <TimeLines processData={progressData} />
            </div>
            <div>
              {this.renderForm()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Detail;
