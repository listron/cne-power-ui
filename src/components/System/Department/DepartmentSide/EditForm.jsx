




import React, { Component } from 'react';
import { Button, Input, Form } from 'antd';
import PropTypes from 'prop-types';
import styles from './departmentSide.scss';
const FormItem = Form.Item;

class EditForm extends Component {
  static propTypes = {
    buttonLoading: PropTypes.bool,
    form: PropTypes.object,
    editDepartmentInfor: PropTypes.func,
    departmentDetail: PropTypes.object
  }

  constructor(props){
    super(props);
  }

  addDepartment = () =>{
    const { editDepartmentInfor } = this.props;
    this.props.form.validateFieldsAndScroll((error,values)=>{
      if(!error){
        editDepartmentInfor(values)
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
            rules: [{ required : true }],
            initialValue: departmentDetail.departmentName || '',
          })(
            <Input />
          )}
        </FormItem>
        <FormItem label="所属部门" >
          {getFieldDecorator('departmentId',{
            initialValue: departmentDetail.parentDepartmentName || '无',
          })(
            <Input disabled={true} />
          )}
          <span className={styles.instructionText}>(不可修改)</span>
        </FormItem>
        <Button onClick={this.addDepartment} loading={buttonLoading} >保存</Button>
      </Form>
    )
  }
}

export default Form.create()(EditForm);
