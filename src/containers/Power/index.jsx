import React, { Component } from 'react';
import ImgUploader from '../../components/Common/Uploader/ImgUploader';
import StationSelect from '../../components/Common/StationSelect';

import Sider from '../../components/Power/Sider';

import { Button } from 'antd';
import styles from './style.scss';
import pathConfig from '../../constants/path'

class Power extends Component {
  constructor(props,context) {
    super(props);
    this.state = {
        fileList: [],
        stationArray: [
            {
                provinceCode:11 ,           
                provinceName:"辽宁",        
                stationCode:35,           
                stationId:"07392334-41ee-46f3-9385-e0617bd79433" ,      
                stationName:"阜西古力本皋",  
                stationType:10 ,             
            },{
                provinceCode:11 ,           
                provinceName:"辽宁",        
                stationCode:36,           
                stationId:"07362334-41ee-46f3-9385-e0617bd79433" ,      
                stationName:"花灯一期",  
                stationType:10 ,             
            },{
                provinceCode:11 ,           
                provinceName:"辽宁",        
                stationCode:37,           
                stationId:"073923341-41ee-46f3-9385-e0617bd79433" ,      
                stationName:"花灯二期",  
                stationType:10 ,             
            },{
                provinceCode:11 ,           
                provinceName:"辽宁",        
                stationCode:38,           
                stationId:"073923342-41ee-46f3-9385-e0617bd79433" ,      
                stationName:"花灯三期",  
                stationType:10 ,             
            },{
                provinceCode:12 ,           
                provinceName:"吉林",        
                stationCode:39,           
                stationId:"073923342-41ee-46f3-9385-e0617bd794331" ,      
                stationName:"天长三期",  
                stationType:10 ,             
            },{
                provinceCode:8 ,           
                provinceName:"湖南",        
                stationCode:120,           
                stationId:"0739233421122-41ee-46f3-9385-e0617bd79433121" ,      
                stationName:"永仁",  
                stationType:20 ,             
            },{
                provinceCode:8,           
                provinceName:"湖南",        
                stationCode:121,           
                stationId:"073923342-1212141ee-46f3-9385-e0617bd79433" ,      
                stationName:"吉首",  
                stationType:20 ,             
            },{
                provinceCode:8,           
                provinceName:"湖南",        
                stationCode:122,           
                stationId:"073923342-41ee-46f3-9385-21s" ,      
                stationName:"长沙",  
                stationType:20 ,             
            },{
                provinceCode:1 ,           
                provinceName:"北京",        
                stationCode:130,           
                stationId:"073923342-421s1ee-46f3-9385-e0617bd79433121" ,      
                stationName:"海淀光伏",  
                stationType:20 ,             
            }
        ]
    };
  }

  uploadImg = (fileList) =>{
    this.setState({fileList})
  }
  stationSelected = (stations) => {
      console.log(stations)
  }

  render() {   
    return (
        <div className={styles.power} >
          <Sider />
          <div className={styles.powerRight}>
            {/* <Menu mode="horizontal">
              <SubMenu title={<span><Icon type="user" />{this.state.username}</span>}>
                <Menu.Item key="setting:1">退出</Menu.Item>
              </SubMenu>
            </Menu> */}
            <div className={styles.content}>
                this is page of power! 
                DO NOT CALL ME ROUTER! WILL TAKES ERROR WHEN BUILD!!!
                <Button type="primary">按钮antd测试</Button>
            </div>
            <div>
                <ImgUploader 
                    value={this.state.fileList} 
                    uploadPath={`${pathConfig.basePaths.APIBasePath}${pathConfig.commonPaths.imgUploads}`} 
                    onChange={this.uploadImg} 
                    editable={true}
                />
            </div>
            <div>
                <StationSelect value={this.state.stationArray} multiple={true} onChange={this.stationSelected} style={{width:'500px'}} />
            </div>
          </div>
        </div>
    );
  }
}

/* const UserSubLayout = (props) => {
    return (
        <div className="user-sub-layout">
            <h1 style={{marginBottom: '10px'}}>请参考博文： <a href="http://www.jianshu.com/p/bf6b45ce5bcc">React Router 4：痛过之后的豁然开朗</a></h1>
            <aside>
                <UserNav />
            </aside>
            <div className="primary-content">
                <Switch>
                    <Route path={props.match.path} exact component={BrowseUserTable} />
                    <Route path={`${props.match.url}/:userId`} component={UserProfilePage} />
                </Switch>
            </div>
        </div>
    )
}


const UserComments = ({ match }) => {
    return <div>UserId: {match.params.userId}</div>
}

const UserSettings = ({ match }) => {
    return <div>UserId: {match.params.userId}</div>
}

const UserProfilePage = ({ match }) => {
    return (
        <div>
            User Profile:
      <Route path={`${match.url}/comments`} component={UserComments} />
            <Route path={`${match.path}/settings`} component={UserSettings} />
        </div>
    )
}


const UserNav = () => (
    <div>User Nav</div>
)

const BrowseUserTable = ({ match }) => {
    return (
        <ul>
            <li><Link to={`${match.path}/comments`}>comments</Link></li>
            <li><Link to={`${match.path}/settings`}>settings</Link></li>
        </ul>
    )
}

const UserProfile = ({ userId }) => <div>User: {userId}</div>; */

export default Power;