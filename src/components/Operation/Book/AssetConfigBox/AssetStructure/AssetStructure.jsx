import React from "react";
import PropTypes from "prop-types";
import styles from "./assetStructure.scss";
import { Radio, Button, Table } from 'antd';
import AddNodeFrom  from "./AddNodeFrom";

class AssetStructure extends React.Component {
  static propTypes = {

    changeAssetConfigStore: PropTypes.func,
    assetType: PropTypes.string,
    stationTypeCount: PropTypes.string,

  }
  constructor(props, context) {
    super(props, context)
    this.state = {
      addNode: false,
    }
  }
  queryType = (active) => {
    const { changeAssetConfigStore, } = this.props;
    changeAssetConfigStore({ assetType: active, });
  }
  addDevice = () => {
    this.setState({
      addNode: true
    })
  }
  closeFrom=()=>{
    this.setState({
      addNode: false
    })
  }
  render() {
    const { assetType, stationTypeCount } = this.props;
    const { addNode } = this.state;
    const columns = [
      {
        title: '编码',
        dataIndex: '1',
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '节点名称',
        dataIndex: '2',
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '节点类型',
        dataIndex: '3',
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '计量单位',
        dataIndex: '4',
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '创建时间',
        dataIndex: '5',
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '操作人',
        dataIndex: '6',
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '操作',
        dataIndex: '7',
        render: (text) => <span title={text}>{text}</span>
      },

    ];
    return (
      <div className={styles.box}>
        <div className={styles.titleType} >
          <div className={assetType === 'pv' ? styles.selectPv : styles.pv} onClick={() => { this.queryType('pv') }} >{(stationTypeCount === 'pv' || stationTypeCount === 'multiple') ? '光伏' : ''}</div>
          <div className={assetType === 'wind' ? styles.selectWind : styles.wind} onClick={() => { this.queryType('wind') }}>{(stationTypeCount === 'wind' || stationTypeCount === 'multiple') ? '风电' : ''}</div>
        </div>
        <div className={styles.container}>
          <div className={styles.leftTree}>
            生产资产
        </div>
          <div className={styles.rightNode}>
            <Button onClick={this.addDevice} className={addNode ? styles.disabledStyle : styles.plusButton} icon="plus" disabled={addNode} >添加子节点</Button>
            {
              addNode && <AddNodeFrom closeFrom={this.closeFrom} />
            }
            {
              <Table
                loading={false}
                dataSource={[]}
                columns={columns}
                pagination={false}
                locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
              />
            }

          </div>
        </div>

      </div>
    )
  }
}
export default (AssetStructure)
