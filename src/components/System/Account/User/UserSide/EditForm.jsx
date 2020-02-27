




import React, { Component } from 'react';
import { Button, Input, Form, Select } from 'antd'; 
import PropTypes from 'prop-types';
import styles from './userSide.scss';
const FormItem = Form.Item;
const Option= Select.Option;
class EditForm extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    form: PropTypes.object,
    userDetail: PropTypes.object,
    editUserInfo: PropTypes.func,
    userLogo: PropTypes.string,
    enterpriseId: PropTypes.string,
    roleAllList: PropTypes.object,
    specialRoleList: PropTypes.object,
    changeUserStore: PropTypes.func,
  }

  constructor(props){
    super(props);
  }

  saveUser = () =>{
    const { userDetail } = this.props;
    this.props.form.validateFieldsAndScroll((error,values)=>{
      if(!error){
        this.props.editUserInfo({
          email: values.email,
          phoneNum: values.phoneNum,
          roleId: values.roleId.join(','),
          specialRoleId: values.specialRoleId.join(','),
          userFullName: values.userFullName,
          username: values.username,
          userLogo: this.props.userLogo,
          userId: userDetail.get('userId'),
        })
        this.props.changeUserStore({
          showPage: 'list',
        });
      }
    })
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const { userDetail, loading, roleAllList, specialRoleList } = this.props;

    const tmpDetail = userDetail && userDetail.toJS();

    const newRoleAllList = roleAllList.toJS();
    let defaultRoleNames = tmpDetail.roleName && tmpDetail.roleName.split(',');
    const roleIdArray = defaultRoleNames && defaultRoleNames.map(e=>{
      const roleInfo = newRoleAllList.find(item=>(item.roleDesc===e));
      const roleId = roleInfo && roleInfo.roleId;
      return roleInfo ? roleId : roleInfo;
    })
    
    const newSpecialRoleList = specialRoleList.toJS();
    let spcialRoleNames = tmpDetail.spcialRoleName && tmpDetail.spcialRoleName.split(',');
    const spcialRoleIds = spcialRoleNames && spcialRoleNames.map(e=>{
      const roleInfo = newSpecialRoleList.find(item=>(item.roleDesc===e));
      const roleId = roleInfo && roleInfo.roleId;
      return roleInfo ? roleId : roleInfo;
    })

    return (
      <Form className={styles.editPart}>
        <FormItem label="用户名" >
          {getFieldDecorator('username',{
            initialValue: userDetail && userDetail.get('username'),
            rules: [
            {pattern: /^[A-Za-z0-9~!@#$%^&*()-_+.\u4e00-\u9fa5]{3,25}$/gi, message: '请输入字符长度为3-25的用户名',required: true,},
            ]
          })(
            <Input placeholder="请输入用户名" disabled />
          )}
          <span className={styles.instructionText}>(3-25位中文,英文,数字,特殊字符都可)</span>
        </FormItem>
        <FormItem label="真实姓名" >
          {getFieldDecorator('userFullName',{
            // rules: [{
            //   message: '请输入10字以内的真实姓名',
            //   max: 10,
            // }],
            rules: [
              { required: true, message: '请输入用户名' },
              { validator: (rule, value, callback) => {
                const exactStr = value.trim();
                const patternRule = /^[A-Za-z \u4e00-\u9fa5]{0,30}$/;
                // if (!patternRule.test(exactStr)) {
                if(exactStr.length>=30){
                  callback('请输入小于30字符的真实姓名');
                }
                callback();
              }}
            ],
            initialValue: userDetail && (userDetail.get('userFullName') || '')
          })(
            <Input placeholder="请输入真实姓名" />
          )}
          <span className={styles.instructionText}>(30字以内)</span>
        </FormItem>
        <FormItem label="电话" >
          {getFieldDecorator('phoneNum',{
            initialValue: userDetail && userDetail.get('phoneNum'),
            rules: [{
              message: '请输入正确的手机号',
              pattern: /^1|9\d{10}$/,
              required: true,
            }]
          })(
            <Input placeholder="请输入电话号码" disabled />
          )}
          <span className={styles.instructionText}>(11位手机号码)</span>
        </FormItem>
        <FormItem label="邮箱" >
          {getFieldDecorator('email',{rules:[{
              message: '请输入正确格式的邮箱',
              pattern: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
            }],
            initialValue: userDetail && (userDetail.get('email') || '')
          })(
            <Input placeholder="请输入邮箱" />
          )}
          <span className={styles.instructionText}>(可用邮箱找回密码)</span>
        </FormItem>
        {/* <FormItem label="账户微信" >
          {getFieldDecorator('webChat',{
            initialValue: userDetail && userDetail.get('webChat')
          })(
            <span>{userDetail.webChat}</span>
          )}
        </FormItem> */}
        <FormItem label="角色" >
          {getFieldDecorator('roleId',{
            initialValue: roleIdArray && roleIdArray.filter(e=>!!e)|| [],
          })(
            <Select
              mode="multiple"
              placeholder="请选择用户角色"
              showArrow={true}
              onChange={this.onSelectRoles}
              className={styles.selectRoles}
            >
              {roleAllList && roleAllList.toJS().map((item,index)=>(
                <Option key={item.roleId} value={item.roleId}  >{item.roleDesc}</Option>
              ))}
            </Select>
          )}
          <span className={styles.instructionText}>(没有设置角色的用户无法正常使用系统)</span>
        </FormItem>
        {/* <FormItem label="特殊权限" >
          {getFieldDecorator('specialRoleId', {
            initialValue: spcialRoleIds && spcialRoleIds.filter(e=>!!e) || [],
          })(
            <Select
              mode="multiple"
              placeholder="请选择特殊权限"
              showArrow={true}
              onChange={this.specialRoleId}
              className={styles.specialRoleId}
            >
              {specialRoleList && specialRoleList.toJS().map((item,index)=>(
                <Option key={item.roleId} value={item.roleId} >{item.roleDesc}</Option>
              ))}
            </Select>
          )}
        </FormItem> */}
        <FormItem label="所在企业" >
          {getFieldDecorator('enterpriseName', {
            initialValue: userDetail.get('enterpriseData') && 
            userDetail.get('enterpriseData').toJS().map(item=>{
              return (<div className={styles.departmentDetail} key={item.enterpriseId} >
                {item.enterpriseName}
                </div>
              )
            }),
          })(
            <div>{userDetail.get('enterpriseData') && 
            userDetail.get('enterpriseData').toJS().map(item=>{
              return (<div className={styles.departmentDetail} key={item.enterpriseId} >
                {item.enterpriseName}
                </div>
              )
            })}</div>
          )}
        </FormItem>
        <FormItem label="所在部门" >
          {getFieldDecorator('departmentName', {
            initialValue: userDetail.get('enterpriseData') && 
            userDetail.get('enterpriseData').toJS().map(item=>{
              return (<div className={styles.departmentDetail} key={item.enterpriseId} >
                {item.departmentData && item.departmentData.map(item2=>{
                  return (<div key={item2.departmentId} >
                    {item2.departmentName}
                  </div>)
                })}
              </div>)
            }),
          })(
            <div>{userDetail.get('enterpriseData') && 
              userDetail.get('enterpriseData').toJS().map(item=>{
                return (<div className={styles.departmentDetail} key={item.enterpriseId} >
                  {item.departmentData && item.departmentData.map(item2=>{
                    return (<div key={item2.departmentId} >
                      {item2.departmentName}
                    </div>)
                  })}
                </div>)
              })
            }</div>
          )}
        </FormItem>
        <FormItem label="负责电站" >
          {getFieldDecorator('stationName', {
            initialValue: userDetail.get('enterpriseData') && 
            userDetail.get('enterpriseData').toJS().map(item=>{
              return (<div className={styles.departmentDetail} key={item.enterpriseId} >
                <div className={styles.enterpriseDetail}>
                {item.departmentData && item.departmentData.map(item2=>{
                  return (<div key={item2.departmentId} >{item2.stationData &&
                    item2.stationData.map(item3=>{
                      return (<span key={item3.stationId} >{item3.stationName}</span>);
                    })}
                  </div>)
                })}
                </div>
              </div>)
            }),
          })(
            <div>{userDetail.get('enterpriseData') && 
              userDetail.get('enterpriseData').toJS().map(item=>{
                return (<div className={styles.departmentDetail} key={item.enterpriseId} >
                  <div className={styles.enterpriseDetail}>
                  {item.departmentData && item.departmentData.map(item2=>{
                    return (<div key={item2.departmentId} >{item2.stationData &&
                      item2.stationData.map(item3=>{
                        return (<span key={item3.stationId} >{item3.stationName}</span>);
                      })}
                    </div>)
                  })}
                  </div>
                </div>)
              })
            }</div>
          )}
        </FormItem>
        <Button onClick={this.saveUser} loading={loading} className={styles.saveUser} >保存</Button>
      </Form>
    )
  }
}

export default Form.create()(EditForm);
