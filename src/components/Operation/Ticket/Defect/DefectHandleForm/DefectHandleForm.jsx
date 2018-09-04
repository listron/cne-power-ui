import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import styles from './defectHandleForm.scss';
import {Tag} from 'antd';
import DefectReviewForm from './DefectReviewForm';
import DefectProcessForm from './DefectProcessForm';
import DefectCheckForm from './DefectCheckForm';

class DefectHandleForm extends Component {
  static propTypes = {
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    status: PropTypes.string,
    commonList: PropTypes.object,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
  }

  renderReviewForm() {
    return (     
      <DefectReviewForm 
        onSubmit={this.props.onSubmit}
        onCancel={this.props.onCancel} />
    );
  }

  renderProcessForm() {
    return (     
      <DefectProcessForm
        commonList={this.props.commonList} 
        onSubmit={this.props.onSubmit}
        onCancel={this.props.onCancel} />
    );
  }

  renderCheckForm() {
    return (     
      <DefectCheckForm 
        onSubmit={this.props.onSubmit}
        onCancel={this.props.onCancel} />
    );
  }
  
  render() {
    const rightHandler = localStorage.getItem('rightHandler');
    const reviewDefectRight = rightHandler && rightHandler.includes('workExamine_defect_review');
    const checkDefectRight = rightHandler && rightHandler.includes('workExamine_defect_check');
    const { status } = this.props;
    let titleName = '';
    if(status === '1' && reviewDefectRight){
      titleName = '审核'
    }else if(status === '2'){
      titleName = '处理结果'
    }else if(status === '3' && checkDefectRight){
      titleName = '消缺验收'
    }
    return (
      <div className={styles.handleForm}>
        <div className={styles.title}>
          <Tag>{titleName}</Tag>
        </div>
        {(status === '1' && reviewDefectRight) ? this.renderReviewForm() : null}
        {status === '2' ? this.renderProcessForm() : null}
        {(status === '3' && checkDefectRight) ? this.renderCheckForm() : null}
      </div>
    );
  }  
}

export default DefectHandleForm;