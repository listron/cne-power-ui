import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
const { TextArea } = Input;
import styles from './style.scss';

/*
  inputArea组件：
  说明：
    1.要求组件必须传输属性：value
    2.选填属性：输入框容纳最大字数(size默认为:80),输入框宽度(width默认为:440),输入框高度(height默认为:90)
    3.输出：this.props.onChange(textValue)输入框里的值
    4 是否可以选择 disabled 
 */

class InputLimit extends Component {
  static propTypes = {
    placeholder: PropTypes.string,
    value: PropTypes.string,
    size: PropTypes.number,
    onChange: PropTypes.func,
    width: PropTypes.number,
    height: PropTypes.number,
    style: PropTypes.object,
    numberIsShow: PropTypes.bool,
    disabled: PropTypes.bool,
  }

  static defaultProps = {
    size: 80,
    width: 440,
    height: 90,
    numberIsShow: true,
  }

  constructor(props) {
    super(props);
    this.state = {
      current: 0,
    };
  }

  componentDidMount() {
    if (this.props.value) {
      this.setState({
        current: this.props.value.length,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value && nextProps.value !== this.props.value && nextProps.value.length <= this.props.size) {
      this.setState({
        current: nextProps.value.length,
      });
    }
  }

  checkWord = (e) => {
    const textValue = e.target.value;
    this.setState({
      current: textValue.length,
    });
    this.props.onChange(textValue);
  }

  render() {
    const { numberIsShow, disabled } = this.props;
    return (
      <div className={styles.inputLimit} style={this.props.style}>
        <div className={styles.inputCount}>{numberIsShow && <span>{this.state.current}/{this.props.size}字</span>}</div>
        <TextArea
          value={this.props.value}
          placeholder={this.props.placeholder}
          onChange={this.checkWord}
          maxLength={this.props.size}
          disabled={disabled}
          style={{ height: this.props.height, width: this.props.width }} />
      </div>
    );
  }
}

export default InputLimit;
