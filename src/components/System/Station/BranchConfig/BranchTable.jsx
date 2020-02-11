import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import { Select, Button, Input, Switch } from 'antd';


class BranchTable extends React.Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      focus: false,
    };
  }
  componentDidMount() {
    console.log('this.refs', this.refs);
    // var textBox = document.createElement('INPUT');
    // console.log('textBox: ', textBox);
    // const value = this.myref.innerHTML;
    // console.log('value: ', value);
    // textBox.value = value;
    // textBox.appendChild(this.myref);
  }
  componentDidUpdate() {
    this.refs.input && this.refs.input.focus();
  }
  queryCheckData = () => {

  }
  changeSwitch = () => {

  }
  saveCheckValue = () => {

  }
  cancleCheckValue = () => {

  }
  editNum = (e) => {
    console.log('e.target: ', e.target);
    console.log('e.target.value: ', e.target.value);
    console.log('e.target.innerHtml: ', e.target.textContent);
    const value = e.target.textContent ? e.target.textContent : e.target.value;
    this.setState({
      focus: value,
    });
    // this.refs.input.focus();
  }
  inputBlur = (value) => {
    console.log('value: ', value);
    // this.setState({
    //   focus: 4,
    // });

  }
  render() {
    const { loadding } = this.props;
    const { focus } = this.state;
    console.log('focus: ', focus);
    const a = Array.from({ length: 40 }, (e, i) => i + 1);
    return (
      <div className={styles.tablebox}>
        <div className={styles.checkstyle}>
          <div className={styles.leftInfo}>
            <Button type="primary"
              icon="poweroff"
              loading={loadding}
              disabled={true}
              onClick={this.queryCheckData}>
              {/* <i className="iconfont icon-save" /> */}
              支路检测
            </Button>
            <Button type="primary"
              icon="save"
              className={styles.btnStyle}
              loading={loadding}
              onClick={this.saveCheckValue}>
              {/* <i className="iconfont icon-addto" /> */}
              保存检测结果
            </Button>
            <Button type="primary"
              loading={loadding}
              className={styles.btnStyle}
              onClick={this.cancleCheckValue}>
              取消
            </Button>
            <span className={styles.fontcolor}>
              检测结果日期
              <span className={styles.dateMargin}>:</span>
              <span>2019-12-18</span>
            </span>
            <Switch onChange={this.changeSwitch} />
            <span>只看变更</span>

          </div>
          <div className={styles.rightInfo}>
            <div className={styles.icon}></div>
            <span className={styles.iconmargin}>未接入</span>
            <div className={styles.icon2}></div>
            <span className={styles.iconmargin}>接入支路数</span>
            <div className={styles.icon3}></div>
            <span className={styles.iconmargin}>有变更(单击可修改配置)</span>
            合计:10
         </div>

        </div>
        <div className={styles.tableContainer}>
          <div className={styles.tableTitle}>
            <div className={styles.name}>设备名称</div>
            <div className={styles.number}>支路条数</div>
            {Array.from({ length: 20 }, (item, index) => (
              <div className={styles.titleStyle} key={index + 1}>I{index + 1}</div>
            ))}
          </div>
          <div className={styles.tablePart}>
            {a.map((item, index) => (
              <div className={index % 2 === 0 ? styles.tabletd : styles.tableEventd} key={index}>
                <div className={styles.name}>NB00{index + 1}</div>
                <div ref={item} onClick={(e) => { this.editNum(e); }} key={item} value={item} className={styles.number}>{+focus === index + 1 ? <Input ref="input" onBlur={this.inputBlur} defaultValue={item} /> : index + 1}</div>
                {
                  Array.from({ length: 20 }, (item, index) => (
                    <div className={styles.titleStyle} key={index + 1}>
                      <div
                        // EditType="DropDownList"
                        // onClick={this.editNum}
                        className={index % 3 === 0 ? styles.nolink : index % 3 === 1 ? styles.link : styles.change}>{index + 1}
                        <div></div>
                      </div>
                    </div>
                  ))
                }
              </div>
            ))}
            <div className={styles.tabletd}></div>
          </div>
        </div>
      </div >
    );
  }
}
export default (BranchTable);
