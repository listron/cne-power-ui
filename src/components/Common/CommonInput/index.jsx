import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import InputLimit  from '../InputLimit';
import { Button } from 'antd';
import styles from './style.scss';

/*
  带提示文字的输入组件：
  说明：
    1.要求组件必须传输属性：value
    2.选填属性：输入框容纳最大字数(size默认为:80),输入框宽度(width默认为:440),输入框高度(height默认为:90)
    3.输出：this.props.onChange(textValue)输入框里的值
 */

class CommonInput extends Component {
  static propTypes = {
    commonList: PropTypes.object,
    placeholder: PropTypes.string,
    size: PropTypes.number,
    value: PropTypes.string,
    onChange: PropTypes.func,
    width: PropTypes.number,
    height: PropTypes.number,
    style: PropTypes.object,
  }

  static defaultProps = {
    size: 80,
    width: 440,
    height: 90
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  onClickCommon(text) {
    let value = this.props.value + text;
    if(value && value.length > this.props.size){
      return;
    }else{
      this.props.onChange(value);
    }
    
  }

  renderCommonList() {
    return this.props.commonList.map((item, index) => {
      return (
        <Button 
          key={'common'+index}
          ghost={true} 
          type="primary"
          onClick={()=>this.onClickCommon(item.get('languageInfo'))}>{item.get('languageInfo')}</Button>
      );
    });
  }

  render() {
    return ( 
      <div className={styles.commonInput}>
        <InputLimit {...this.props} />
        <div className={styles.commonList}>
          {this.renderCommonList()}
        </div>
      </div>
    );
  }
}

export default CommonInput;