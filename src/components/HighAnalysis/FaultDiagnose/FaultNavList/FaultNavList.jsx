import React from "react";
import PropTypes from "prop-types";
import { Icon } from "antd";
import styles from "./faultNavList.scss";

export default class FaultNavList extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    data: PropTypes.array
  };

  constructor(props) {
    super(props);
    this.state = {
      openFlag: true, // 控制打开关闭
      showFlag: true // 控制展开关闭按钮
    };
  }

  componentDidMount() {
  }

  openFunc = () => {
    const { openFlag } = this.state;
    const { navBox } = this;
    this.setState({
      openFlag: !openFlag
    }, () => {
      if (openFlag) {
        // 改变box
        navBox.style.height = "auto";
        navBox.style.paddingBottom = "8px";
      }
      if (!openFlag) {
        // 改变box
        navBox.style.height = "32px";
        navBox.style.paddingBottom = "0";
      }
    });
  };


  render() {
    const { openFlag, showFlag } = this.state;
    const { data } = this.props;
    const item = data && data.map(cur => {
      return (
        <div key={cur.id}>
          {cur.name}
        </div>
      );
    });
    return (
      <div className={styles.faultNavList} ref={ref => {this.navBox = ref}}>
        <div className={styles.navListRight} ref={ref => {this.navList = ref}}>
          {item}
        </div>
        {(showFlag) && (
          <div className={styles.navListLeft}>
            <div onClick={this.openFunc}>
              <span>{openFlag ? "展开" : "关闭"}</span><Icon type={openFlag ? "caret-down" : "caret-up"} />
            </div>
          </div>
        )}
      </div>
    );
  }
}
