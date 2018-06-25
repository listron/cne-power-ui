import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import styles from './defectHandleForm.scss';
import {Tag} from 'antd';
import ReviewForm from './ReviewForm';
import ProcessForm from './ProcessForm';
import CheckForm from './CheckForm';

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

  getTitle() {
    switch(this.props.status) {
      case '1': 
        return '审核';
      case '2':
        return '处理结果';
      case '3':
        return '消缺验收';
    }
  }

  renderReviewForm() {
    return (     
      <ReviewForm 
        onSubmit={this.props.onSubmit}
        onCancel={this.props.onCancel} />
    );
  }

  renderProcessForm() {
    return (     
      <ProcessForm
        commonList={this.props.commonList} 
        onSubmit={this.props.onSubmit}
        onCancel={this.props.onCancel} />
    );
  }

  renderCheckForm() {
    return (     
      <CheckForm 
        onSubmit={this.props.onSubmit}
        onCancel={this.props.onCancel} />
    );
  }
  
  render() {   
    return (
      <div className={styles.handleForm}>
        <div className={styles.title}>
          <Tag>{this.getTitle()}</Tag>
        </div>
        {this.props.status === '1' ? this.renderReviewForm() : null}
        {this.props.status === '2' ? this.renderProcessForm() : null}
        {this.props.status === '3' ? this.renderCheckForm() : null}
      </div>
    );
  }  
}

export default DefectHandleForm;