import React from "react";
import PropTypes from "prop-types";
import styles from "./algorithmControl.scss";

const data = [
  {
    id: 1,
    name: "发电机转子不平衡检测与诊断",
    num: 7,
    date: "2019/04/01～2019/04-07",
    fan: ["w123", "w1456"]
  },
  {
    id: 2,
    name: "发电机转子不平衡检测与诊断",
    num: 7,
    date: "2019/04/01～2019/04-07",
    fan: ["w123", "w1456", "12333"]
  },
  {
    id: 3,
    name: "发电机转子不平衡检测与诊断",
    num: 7,
    date: "2019/04/01～2019/04-07",
    fan: ["w123", "w1456"]
  },
  {
    id: 4,
    name: "发电机转子不平衡检测与诊断",
    num: 7,
    date: "2019/04/01～2019/04-07",
    fan: ["w123", "w1456", "w145as", "w1asd", "w123", "w1456", "w145as", "w1asd"]
  },
  {
    id: 5,
    name: "发电机转子不平衡检测与诊断",
    num: 7,
    date: "2019/04/01～2019/04-07",
    fan: ["w123", "w1456"]
  },
];


export default class AlgorithmModal extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    onChangeFilter: PropTypes.func,
    getAlgoList: PropTypes.func,
    algoModelList: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { getAlgoList } = this.props;
    getAlgoList();
  }

  detailsFunc = () => {
    // 点击带着参数跳转到列表视图
    const { onChangeFilter } = this.props;
    onChangeFilter({
      viewType: "list"
    });
  };

  render() {
    const { algoModelList: {
      healthList,
      largeSizeList,
      natureList
    } } = this.props;
    const largeSizeItem = largeSizeList && largeSizeList.map(cur => {
      return (
        <div className={styles.algorithmItem} key={cur.algorithmId} onClick={() => {return this.detailsFunc()}}>
          <div>
            {cur.algorithmName}
          </div>
          <div>
            <span>运行风场</span>
            <span>{cur.stationCount}</span>
          </div>
        </div>
      );
    });
    const natureItem = natureList && natureList.map(cur => {
      return (
        <div className={styles.algorithmItem} key={cur.algorithmId} onClick={() => {return this.detailsFunc()}}>
          <div>
            {cur.algorithmName}
          </div>
          <div>
            <span>运行风场</span>
            <span>{cur.stationCount}</span>
          </div>
        </div>
      );
    });
    const healthItem = healthList && healthList.map(cur => {
      return (
        <div className={styles.algorithmItem} key={cur.algorithmId} onClick={() => {return this.detailsFunc()}}>
          <div>
            {cur.algorithmName}
          </div>
          <div>
            <span>运行风场</span>
            <span>{cur.stationCount}</span>
          </div>
        </div>
      );
    });
    return (
      <div className={styles.algorithmControl}>
        {(largeSizeItem.length !== 0) && (
          <div>
            <div className={styles.title}>
              大部件
            </div>
            <div className={styles.algorithmBox}>
              {largeSizeItem}
            </div>
          </div>
        )}
        {(natureItem.length !== 0) && (
          <div>
            <div className={styles.title}>
              性能预警
            </div>
            <div className={styles.algorithmBox}>
              {natureItem}
            </div>
          </div>
        )}
        {(healthItem.length !== 0) && (
          <div>
            <div className={styles.title}>
              设备健康
            </div>
            <div className={styles.algorithmBox}>
              {healthItem}
            </div>
          </div>
        )}
      </div>
    );
  }
}
