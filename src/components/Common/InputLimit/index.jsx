import React,{ Component } from '../../../../node_modules/_@types_react@16.4.7@@types/react';
import PropTypes from 'C:/Users/admin/AppData/Local/Microsoft/TypeScript/2.9/node_modules/@types/prop-types';
import { Input } from '../../../../node_modules/_antd@3.8.0@antd';
const { TextArea } = Input;
import styles from './style.scss';

/*
  时间线组件：
  说明：
    1.要求组件必须传输属性：value
    2.选填属性：输入框容纳最大字数(size默认为:80),输入框宽度(width默认为:440),输入框高度(height默认为:90)
    3.输出：this.props.handleInput(textValue)输入框里的值
 */

class InputLimit extends Component {
  static propTypes = {
    placeHolder: PropTypes.string,
    value: PropTypes.string,
    size: PropTypes.number,
    onChange: PropTypes.func,
    width: PropTypes.number,
    height: PropTypes.number,
  }

  static defaultProps = {
    size: 80,
    width: 440,
    height: 90
  }

  constructor(props) {
    super(props);
    this.state = {
      current: 0
    }
  }

  checkWord = (e) => {
    const textValue = e.target.value;
    this.setState({
      current: textValue.length,
    })
    this.props.onChange(textValue);
  }

  render() {

    return ( 
      <div className={styles.inputLimit}>
        <div className={styles.inputCount}>({this.state.current}/{this.props.size})</div>
        <TextArea 
          value={this.props.value}
          placeholder={this.props.placeHolder}
          onChange={this.checkWord} 
          maxLength={this.props.size} 
          style={{height: this.props.height, width: this.props.width}} />
      </div>
    );
  }
}

export default InputLimit;