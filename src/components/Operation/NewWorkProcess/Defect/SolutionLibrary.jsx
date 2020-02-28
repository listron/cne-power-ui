import React from 'react';
import PropTypes from 'prop-types';
import styles from './defect.scss';
import { Modal, Button, Icon } from 'antd';


class SolutionLibrary extends React.PureComponent {
  static propTypes = {
    likeKnowledgebase: PropTypes.func,
    knowledgebaseList: PropTypes.array,
    defectDetail: PropTypes.object,
    getKnowledgebase: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      dealVisible: false,
    };
  }

  showModal = () => {
    this.setState({ dealVisible: true });
  }

  modalCancle = () => {
    this.setState({ dealVisible: false });
  }

  knowledegeBask = (knowledgeBaseId) => {
    const { defectDetail } = this.props;
    const { defectTypeCode, deviceTypeCode, stationType } = defectDetail;
    this.props.likeKnowledgebase({ knowledgeBaseId });
    this.props.getKnowledgebase({ deviceTypeCodes: [deviceTypeCode], faultTypeIds: [defectTypeCode], type: +stationType });
  }

  knowledgebaseInfo = [
    { name: '故障描述', value: 'faultDescription', default: '无' },
    { name: '故障原因', value: 'checkItems', default: '无' },
    { name: '处理方法', value: 'processingMethod', default: '无' },
    { name: '所需工具', value: 'remark', default: '无' },
    { name: '点赞数', value: 'likeCount', default: 0 },
  ]


  render() {
    const { knowledgebaseList } = this.props;
    return (
      <div className={styles.solutionWrap}>
        {knowledgebaseList.length > 0 && <Button type="default" onClick={this.showModal} className={styles.dealMethod}>查看解决方案</Button>}
        <div ref="dealMethod" className={styles.dealModal} />
        <Modal
          title="解决方案查看"
          visible={this.state.dealVisible}
          onCancel={this.modalCancle}
          getContainer={() => this.refs.dealMethod}
          footer={null}
          mask={false}
          centered={true}
          wrapClassName={styles.deatilLike}
          width={800}
        >
          <div className={styles.modalbody}>
            {knowledgebaseList.map((list, index) => {
              return (
                <div key={index} className={styles.dealBox}>
                  {this.knowledgebaseInfo.map(e => {
                    return (<div className={styles.column}>
                      <div className={styles.text}>{e.name}</div>  <div> {list[e.value] || e.default}</div>
                    </div>);
                  })}
                  {list.liked &&
                    <div className={styles.disabled} > 已点赞  </div> ||
                    <div className={styles.like} onClick={() => { this.knowledegeBask(list.knowledgeBaseId); }}>点赞 <Icon type="like" /></div>
                  }
                </div>
              );
            })}
          </div>
        </Modal>
      </div>

    );
  }
}

export default SolutionLibrary;
