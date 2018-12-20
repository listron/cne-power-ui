import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import styles from './defectHandleForm.scss';
import DefectReviewForm from './DefectReviewForm';
import DefectProcessForm from './DefectProcessForm';
import DefectCheckForm from './DefectCheckForm';

class DefectHandleForm extends Component {
  static propTypes = {
    onSubmit: PropTypes.func,
    status: PropTypes.string,
    commonList: PropTypes.array,
  }

  constructor(props) {
    super(props);
  }

  getDefaultTitle=(status)=>{ // 标题
    let result='';
    switch(status){
      case '1':result='审核';break;
      case '2':result='处理结果';break;
      case '3':result='消缺验收';break;
      default:result='';break;
    }
    return result;
  }
  
  render() {
    const rightHandler = localStorage.getItem('rightHandler');
    const reviewDefectRight = rightHandler && rightHandler.split(',').includes('workExamine_defect_review');
    const checkDefectRight = rightHandler && rightHandler.split(',').includes('workExamine_defect_check');
    const { status } = this.props;
    return (
      <div className={styles.handleForm}>
        <div className={styles.title}>
          <div className={styles.border}></div>
          <div className={styles.text}>{this.getDefaultTitle(status)}</div>
          <div className={styles.border}></div>
        </div>
        {status === '1' && reviewDefectRight && <DefectReviewForm  onSubmit={this.props.onSubmit} /> }
        {status === '2' &&  <DefectProcessForm commonList={this.props.commonList} onSubmit={this.props.onSubmit} />}
        {status === '3' && checkDefectRight &&  <DefectCheckForm  onSubmit={this.props.onSubmit} />}
      </div>
    );
  }  
}

export default DefectHandleForm;