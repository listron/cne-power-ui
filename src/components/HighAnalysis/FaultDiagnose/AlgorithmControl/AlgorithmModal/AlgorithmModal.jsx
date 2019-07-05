import React from 'react';
import PropTypes from 'prop-types';
import styles from './algorithmControl.scss';

export default class AlgorithmModal extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    changeAlgorithmControlStore: PropTypes.func,
    getAlgoList: PropTypes.func,
    algoModelList: PropTypes.object,
    algoOptionList: PropTypes.array,
    getListView: PropTypes.func,
    getTaskStatusStat: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { getAlgoList } = this.props;
    getAlgoList();
  }

  detailsFunc = (algorithmId) => {
    // 参数跳转到列表视图
    const {
      changeAlgorithmControlStore,
      algoOptionList,
      getTaskStatusStat,
    } = this.props;
    const newSameArr = []; // 相同数据
    // 取到相同的数据
    for (let i = 0; i < algoOptionList.length; i++) {
      if (`${algoOptionList[i].algorithmId}` === `${algorithmId}`) {
        newSameArr.push(algoOptionList[i]);
      }
    }
    changeAlgorithmControlStore({
      viewType: 'list',
    });
    const { getListView } = this.props;
    const listParams = {
      stationCode: null,
      algorithmModalId: [`${algorithmId}`],
      startTime: '',
      endTime: '',
      status: null,
      pageSize: null,
      pageNum: null,
      sortField: '',
      sortMethod: '',
      algorithmModalName: newSameArr,
    };
    const statusParams = {
      stationCodes: null,
      algorithmIds: [`${algorithmId}`],
      startTime: '',
      endTime: '',
    };
    // 列表
    getListView(listParams);
    // 状态统计
    getTaskStatusStat(statusParams);
  };

  render() {
    const { algoModelList: {
      healthList,
      largeSizeList,
      natureList,
    } } = this.props;
    const largeSizeItem = largeSizeList && largeSizeList.map(cur => {
      return (
        <div className={styles.algorithmItem} key={cur.algorithmId} onClick={() => {return this.detailsFunc(cur.algorithmId);}}>
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
        <div className={styles.algorithmItem} key={cur.algorithmId} onClick={() => {return this.detailsFunc(cur.algorithmId);}}>
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
        <div className={styles.algorithmItem} key={cur.algorithmId} onClick={() => {return this.detailsFunc(cur.algorithmId);}}>
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
