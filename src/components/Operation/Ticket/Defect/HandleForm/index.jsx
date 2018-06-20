import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import styles from './style.scss';
import {Radio} from 'antd';
import ReviewForm from './ReviewForm';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class HandleForm extends Component {
  static propTypes = {
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    status: PropTypes.string,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
      tag: props.status === "1" ? "send" : props.status === "2" ? "solve" : "ok"
    };
    this.onChangeTag = this.onChangeTag.bind(this);
  }

  onChangeTag(e) {
    this.setState({
      tag: e.target.value
    });
  }

  renderReviewForm() {
    return (
      <div className={styles.review}>
        <RadioGroup onChange={this.onChangeTag} value={this.state.tag}>
          <RadioButton value="send">下发</RadioButton>
          <RadioButton value="close">关闭</RadioButton>
          <RadioButton value="reject">驳回</RadioButton>
        </RadioGroup>
        <ReviewForm 
          type={this.state.tag} 
          onSubmit={this.props.onSubmit}
          onCancel={this.props.onCancel} />
      </div>
    );
  }
  
  render() {   
     return (
       <div className={styles.handleForm}>
         {this.props.status === "1" ? this.renderReviewForm() : null}
       </div>
     );
  }  
}

export default HandleForm;