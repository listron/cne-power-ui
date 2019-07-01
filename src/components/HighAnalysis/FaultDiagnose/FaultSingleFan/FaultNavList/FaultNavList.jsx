import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import moment from 'moment';

import styles from './faultNavList.scss';


export default class FaultNavList extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    showFlag: PropTypes.bool,
    onChangeFilter: PropTypes.func,
    stationCode: PropTypes.string,
    match: PropTypes.object,
    faultInfo: PropTypes.object,
    getTenMinutesBefore: PropTypes.func,
    getTenMinutesAfter: PropTypes.func,
    getTenMinutesDiff: PropTypes.func,
    getStandAloneList: PropTypes.func,
    getSimilarityList: PropTypes.func,
    getAllFanResultList: PropTypes.func,
    preDate: PropTypes.array,
    afterDate: PropTypes.array,
    diffDate: PropTypes.array,
    faultDate: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      openFlag: true, // 控制打开关闭
      fansFlag: 0, // 选中风机
    };
  }

  componentDidMount() {
    const {
      navList: { clientHeight },
      props: {
        onChangeFilter,
      }
    } = this;
    onChangeFilter({
      showFlag: clientHeight > 32
    });
  }

  componentDidUpdate() {
    const { navList: { clientHeight }, props: {onChangeFilter} } = this;
    onChangeFilter({
      showFlag: clientHeight > 32
    });
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

  handlerFansClick = (data, index, warnId) => {
    const {
      onChangeFilter,
      faultInfo: {
        endTime
      },
    } = this.props;
    const { date } = data;
    // 故障日期时间
    const dateArr = date && date.split(",");
    // 判断如果date有数据
    const timeValue = date && date ? dateArr[dateArr.length - 1] : endTime;
    // 目前先不用掉接口
    this.setState({
      fansFlag: index
    }, () => {
      // 改变设备选中
      onChangeFilter({
        warnId,
        faultDate: timeValue, // 故障详情页选择日期
        preDate: [// 前驱温度时间选择
          moment(timeValue, "YYYY/MM/DD").subtract(1,'months'),
          moment(timeValue, "YYYY/MM/DD")
        ],
        afterDate: [// 后驱温度时间选择
          moment(timeValue, "YYYY/MM/DD").subtract(1,'months'),
          moment(timeValue, "YYYY/MM/DD")
        ],
        diffDate: [// 后驱温度时间选择
          moment(timeValue, "YYYY/MM/DD").subtract(1,'months'),
          moment(timeValue, "YYYY/MM/DD")
        ],
      });
    })
  };


  render() {
    const { openFlag, fansFlag } = this.state;
    const {
      showFlag,
      faultInfo: {
        algModeDatas
      }
    } = this.props;
    const deviceFullName = localStorage.getItem("deviceFullName");
    const item = algModeDatas && algModeDatas.map((cur, index) => {
      return (
        <div
          key={`${cur.algorithmName}${index}`}
          style={deviceFullName === cur.algorithmName ? {backgroundColor: "#ffffff"} :
            {backgroundColor: (!deviceFullName && index === fansFlag) ?  "#ffffff" : "#199475"}}
          className={Number(cur.type) === 1 ? styles.redWarn : styles.blueWarn}
          onClick={() => {return this.handlerFansClick(cur, index, Number(cur.type))}}
        >
          {cur.algorithmName}
        </div>
      );
    });
    return (
      <div className={styles.faultNavList} ref={ref => {this.navBox = ref}}>
        <div className={styles.navListRight} ref={ ref => {this.navList = ref} }>
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
