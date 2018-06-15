import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
const { TextArea } = Input;
import styles from './style.scss';

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
    this.checkWord = this.checkWord.bind(this);
  }

  checkWord(e) {
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