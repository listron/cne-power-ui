




import React, { Component } from 'react';
import { Button, Input, Form } from 'antd';
import PropTypes from 'prop-types';
import styles from './departmentSide.scss';
const FormItem = Form.Item;

class EditForm extends Component {
  static propTypes = {
    buttonLoading: PropTypes.bool,
    enterpriseId: PropTypes.string,
    form: PropTypes.object,
    editDepartmentInfor: PropTypes.func,
    departmentDetail: PropTypes.object
  }

  constructor(props){
    super(props);
  }

  addDepartment = () =>{
    const { editDepartmentInfor, departmentDetail,enterpriseId } = this.props;
    this.props.form.validateFieldsAndScroll((error,values)=>{
      if(!error){
        editDepartmentInfor({
          departmentId: departmentDetail.departmentId,
          departmentName: values.departmentName,
          enterpriseId,
        })
      }
    })
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const { buttonLoading, departmentDetail } = this.props;
    return (
      <Form className={styles.editPart}>
        <FormItem label="部门名称" >
          {getFieldDecorator('departmentName',{
            rules: [{ required : true, max: 29, message:'30字以内!' }],
            initialValue: departmentDetail.departmentName || '',
          })(
            <Input />
          )}
          <span className={styles.instructionText}>(30字以内)</span>
        </FormItem>
        <FormItem label="所属部门" >
          {getFieldDecorator('parentDepartmentName',{
            initialValue: departmentDetail.parentDepartmentName || '无',
          })(
            <Input disabled={true} />
          )}
          <span className={styles.instructionText}>(不可修改)</span>
        </FormItem>
        <Button onClick={this.addDepartment} loading={buttonLoading} className={styles.editSave} >保存</Button>
      </Form>
    )
  }
}

export default Form.create()(EditForm);
