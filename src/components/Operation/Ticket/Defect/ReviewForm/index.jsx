import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import styles from './style.scss';
import {Radio} from 'antd';
import SubmitForm from './SubmitForm';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class ReviewForm extends Component {
  static propTypes = {
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
      tag: "send"
    };
    this.onChangeTag = this.onChangeTag.bind(this);
  }

  onChangeTag(e) {
    this.setState({
      tag: e.target.value
    });
  }
  
  render() {   
    return (
      <div className={styles.review}>
        <RadioGroup onChange={this.onChangeTag} defaultValue="send" value={this.state.tag}>
          <RadioButton value="send">下发</RadioButton>
          <RadioButton value="close">关闭</RadioButton>
          <RadioButton value="reject">驳回</RadioButton>
        </RadioGroup>
        <SubmitForm 
          type={this.state.tag} 
          onSubmit={this.props.onSubmit}
          onCancel={this.props.onCancel} />
      </div>
    );
  }  
}

export default ReviewForm;