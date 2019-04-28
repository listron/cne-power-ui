import React from "react";
import PropTypes from "prop-types";
import styles from "./listView.scss";
import {Button, Icon} from "antd";
import DateFilter from '../../Filter/Date/DateFilter';
import StationFilter from '../../Filter/Station/StationFilter';
import ModalFilter from '../../Filter/Modal/ModalFilter';
import FilteredItems from '../../Filter/FilterItems/FilteredItems';
import CommonPagination from "../../../../Common/CommonPagination";
import ListViewTable from "./ListViewTable/ListViewTable";

const ButtonGroup = Button.Group;

export default class ListView extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    onAddControlFunc: PropTypes.func,
    getAlgoOptionList: PropTypes.func,
    getListView: PropTypes.func,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    algoListView: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.state = {
      showFilter: '', // 筛选条件判断
    };
  }
  componentDidMount() {
    const { getListView } = this.props;
    const params = {
      stationCode:null,
      algorithmIds:[1,2],
      startTime:"",
      endTime:"",
      status:null,
      pageSize:null,
      pageNum:null,
      sortField:"",
      sortMethod:""
    };
    getListView(params);
  }

  onAddControl = () => {
    const { onAddControlFunc } = this.props;
    onAddControlFunc(false);
  };

  onFilterShowChange = (filterText) => {
    const { showFilter } = this.state;
    if(showFilter === filterText){
      this.setState({
        showFilter: ''
      })
    }else{
      this.setState({
        showFilter: filterText
      })
    }
  };

  render() {
    const { showFilter } = this.state;
    const { pageSize, pageNum, algoListView } = this.props;
    return (
      <div className={styles.listView}>
        <div className={styles.listViewSelect}>
          <div className={styles.topSearch}>
            <span className={styles.text}>筛选条件</span>
            <Button onClick={()=>this.onFilterShowChange('modal')}>
              算法模型<Icon type={showFilter ==='modal' ? "up" : "down"} />
            </Button>
            <Button onClick={()=>this.onFilterShowChange('stationName')}>
              电站名称<Icon type={showFilter ==='stationName' ? "up" : "down"} />
            </Button>
            <Button onClick={()=>this.onFilterShowChange('time')}>
              检测日期<Icon type={showFilter ==='time' ? "up" : "down"} />
            </Button>
          </div>
          <div className={styles.statusGroup}>
            <div className={styles.text}><span>状</span><span>态</span></div>
            <ButtonGroup>
              <Button>全部</Button>
              <Button>待执行</Button>
              <Button>执行中</Button>
              <Button>已完成</Button>
              <Button>执行失败</Button>
            </ButtonGroup>
          </div>
        </div>
        <div className={styles.filterBox}>
          {showFilter==='modal' && <ModalFilter {...this.props} />}
          {showFilter==='stationName' && <StationFilter {...this.props} />}
          {showFilter==='time' && <DateFilter {...this.props} />}
        </div>
        <div className={styles.filterWrap}>
          <FilteredItems {...this.props} />
        </div>
        <div className={styles.addAndPage}>
          <div>
            <Button className={styles.addControl} onClick={this.onAddControl}>
              <Icon type="plus" />
              <span className={styles.text}>添加</span>
            </Button>
          </div>
          <div>
            <CommonPagination pageSize={pageSize} currentPage={pageNum} total={algoListView.length} onPaginationChange={this.onPaginationChange} />
          </div>
        </div>
        <ListViewTable {...this.props} />
      </div>
    );
  }
}
