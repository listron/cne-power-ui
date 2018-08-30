import React, { Component } from 'react';
import { Button, Input, Form } from 'antd';
import PropTypes from 'prop-types';
import styles from './role.scss';
import RoleTree from './RoleTree';
const FormItem = Form.Item;


class RoleEditForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    error: PropTypes.object,
    showPage: PropTypes.string,
    enterpriseId: PropTypes.string,
    selectedRole: PropTypes.array,
    menuData: PropTypes.array,
    onCreateRole: PropTypes.func,
    onEditRole: PropTypes.func,
    changeRoleStore: PropTypes.func,
    isFetching: PropTypes.bool,
    continueAdd: PropTypes.bool,
  }

  constructor(props){
    super(props);
    this.state = {
      halfCheckedKeys: []
    };
  }

  onChangeHalf = (halfCheckedKeys) => {
    this.setState({halfCheckedKeys});
  }

  onSaveRole = () => {
    const { enterpriseId, selectedRole } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(!err) {
        setTimeout(() => {
          if(this.props.error.get('message') === '') {
            this.props.form.setFields({
              roleDesc: {
                value: values.roleDesc,
                errors: [new Error('角色名称重复')],
              },
            });
          }
        }, 500);
        if(this.props.showPage === 'create') {
          this.props.onCreateRole({
            roleDesc: values.roleDesc,
            rightId: values.rightId.split(',').concat(this.state.halfCheckedKeys).join(','),
            enterpriseId,
            continueAdd: false,
          });
        } else {
          this.props.onEditRole({
            roleDesc: values.roleDesc,
            rightId: values.rightId.split(',').concat(this.state.halfCheckedKeys).join(','),
            roleId: selectedRole[0].roleId,
            enterpriseId
          })
        }
      }
    });
  }

  onSaveRoleAndAdd = () => {
    const { enterpriseId, error } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(!err) {
        this.props.onCreateRole({
          roleDesc: values.roleDesc,
          rightId: values.rightId.split(',').concat(this.state.halfCheckedKeys).join(','),
          enterpriseId,
          continueAdd: true,
        });
        if(error.size === 0) {
          this.props.form.resetFields(); 
        }  
      }
    });
  }

  getIds(data) {
    let ids = [];
    this.generateIds(data, ids);
    return ids.join(',');
  }

  generateIds(data, ids) {
    for(var i = 0; i < data.length; i++) {
      if(data[i].childRightData instanceof Array) {
        this.generateIds(data[i].childRightData, ids);
      } else {
        ids.push(data[i].rightId);
      }
    }
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const { showPage, isFetching, continueAdd } = this.props;
    const isCreate = showPage === 'create';
    const selectedRole = isCreate? null: this.props.selectedRole[0];
    return (     
      <Form onSubmit={this.onSubmit} className={styles.roleEditForm}>
        <FormItem label="角色名称">
          {getFieldDecorator('roleDesc', {
            rules: [{ 
              required: isCreate,
              message: '请输入角色名称' 
            }],
            initialValue: isCreate || !selectedRole ? '' : selectedRole.roleDesc
          })(
            <Input placeholder="请输入..." />
          )}
          <span className={styles.instructionText}>(10字以内)</span>
        </FormItem>
        <FormItem
          className={styles.dealProposal} 
          label="功能设置">
          {getFieldDecorator('rightId', {
            rules: [{ 
              required: true,
              message: '请勾选功能'
            }],
            initialValue: isCreate || !selectedRole ? '' : this.getIds(selectedRole.rightData)
          })(
            <RoleTree treeData={this.props.menuData} onChangeHalf={this.onChangeHalf} />
          )}
        </FormItem>
        <div className={styles.buttonGroup}>
          <Button className={styles.save} onClick={this.onSaveRole} loading={!continueAdd&&isFetching}>保存</Button>
          {isCreate&&<Button onClick={this.onSaveRoleAndAdd} loading={continueAdd&&isFetching}>保存并继续添加</Button>}
        </div>
        <div style={{marginLeft:410}} className={styles.instructionText}>选择“保存”按钮后将跳转到对应的列表页；选择“保存并继续添加”按钮将会停留在添加页面</div>
      </Form>
    );
  }
}

export default Form.create()(RoleEditForm);
