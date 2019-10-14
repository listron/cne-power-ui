import React, { Component } from 'react';
import { Modal, Button, Select, Form, Icon } from 'antd';
import PropTypes from 'prop-types';
import styles from './examinerComp.scss';

const FormItem = Form.Item;
const { Option } = Select;

class EditModal extends Component {

  static propTypes = {
    settedDetail: PropTypes.array,
    editLoading: PropTypes.string,
    modalStationName: PropTypes.string,
    form: PropTypes.object,
    handleDistributionId: PropTypes.number,
    editModalShow: PropTypes.bool,
    settableNodes: PropTypes.array,
    settingList: PropTypes.array,
    userGather: PropTypes.object,
    changeStore: PropTypes.func,
    createSettedInfo: PropTypes.func,
    editSettedInfo: PropTypes.func,
  }

  componentDidMount(){
    const { settedDetail, form } = this.props;
    if (settedDetail) { // 编辑态
      const setValues = {};
      settedDetail.forEach(e => {
        const userIds = `${e.userIds || ''}`;
        setValues[e.nodeCode] = userIds.split(',').filter(e => !!e);
      });
      form.setFieldsValue({ ...setValues });
    }
  }

  componentDidUpdate(preProps){
    const { editLoading } = this.props;
    const preEditLoading = preProps.editLoading;
    if (editLoading === 'success' && preEditLoading === 'loading') { // 成功 => 关闭弹框
      this.cancelEdit();
    }
  }

  cancelEdit = () => this.props.changeStore({ // 返回页面，重置数据
    editModalShow: false,
    handleDistributionId: null,
    settedDetail: null,
  });

  saveEdit = () => { // 保存
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err){
        const { createSettedInfo, editSettedInfo, settedDetail, handleDistributionId, settingList } = this.props;
        const valueArr = Object.entries(values);
        const nodeDatas = valueArr.filter(e => !!e[1]).map(e => ({ // filter 保证e[1]存在
          nodeCode: e[0],
          dealUsers: e[1].join(','),
        }));
        const currentInfo = settingList.find(e => e.distributionId === handleDistributionId) || {};
        settedDetail ? editSettedInfo({ // 编辑
          distributionId: handleDistributionId,
          nodeDatas,
        }) : createSettedInfo({ // 新增
          stationCode: currentInfo.stationCode,
          nodeDatas,
        });
      }
    });
  }

  removeSelect = (nodeCode) => {
    this.props.form.setFieldsValue({ [nodeCode]: [] });
  }

  render(){
    const { editModalShow, settableNodes, form, userGather, editLoading, modalStationName } = this.props;
    const { getFieldDecorator } = form;
    // const currentInfo = settingList.find(e => e.distributionId === handleDistributionId) || {};
    return (
      <Modal
        visible={editModalShow}
        title={`${modalStationName || ''}电站——审核人设置`}
        onCancel={this.cancelEdit}
        footer={null}
      >
        <div className={styles.editModal}>
          <Form className={styles.formPart}>
            {settableNodes.map(eachNode => {
              const { nodeCode, nodeName, isRequire } = eachNode;
              const codeUserData = userGather[nodeCode] || [];
              const nodeValues = form.getFieldValue(nodeCode) || [];
              return (
                <FormItem label={`${nodeName}`} key={nodeCode}>
                  {getFieldDecorator(`${nodeCode}`, {
                    rules: [{ required: !isRequire, message: '请选择' }],
                  })(
                    <Select
                      placeholder="请选择"
                      style={{width: 200}}
                      maxTagCount={nodeValues.length > 1 ? 0 : 1}
                      mode="multiple"
                      filterOption={(input, option) => {
                        return option.props.children.toLowerCase().includes(input.toLowerCase());
                      }}
                      maxTagPlaceholder={<div>
                        <span>已选{nodeValues.length}/{codeUserData.length}</span>
                        <Icon type="close" onClick={() => this.removeSelect(nodeCode)} />
                      </div>}
                    >
                      {codeUserData.map(user => (
                        <Option key={`${user.userId}`} value={`${user.userId}`}>{user.username}</Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              );
            })}
          </Form>
          <div className={styles.editHandle}>
            <span className={styles.holder} />
            <Button type="primary" onClick={this.cancelEdit} className={styles.cancelButton}>取消</Button>
            <Button type="primary" onClick={this.saveEdit} loading={editLoading === 'loading'}>保存</Button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default Form.create()(EditModal);
