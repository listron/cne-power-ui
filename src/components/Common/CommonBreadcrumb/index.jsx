
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './style.scss';


/*
  页面内通用面包屑导航 常用于页面顶部标识用户所处路径及快速返回。
  注: 
  1. 要求必填参数 breadData = object[]; 用于标识面包屑是否可以点击跳转，及对应的中文展示名字，格式如下：
    [
      {
        link: true,
        name: '武威',
        path: '/monitor/380'
      },{
        name: '逆变器',
        path: '/monitor/380'
      }
    ]
  2. 选填参数 icon: string ; 面包屑路径对应图标。
*/

function CommonBreadcrumb({breadData, iconName}){
  if(!breadData || !(breadData.length > 0)  ){
    return <div></div>
  }
  return (
    <div className={styles.breadcrumb}>
      {iconName && <span className={styles.breadIcon}><span className={iconName}></span></span>}
      {breadData.map((e,i)=>{
        const lastData = i === breadData.length - 1;
        if(e.link){
          return (<span className={styles.eachPath} key={e.path}>
            <Link to={e.path}>{e.name}</Link>
            <span>{lastData? '' : '/'}</span>
          </span>)
        }else{
          return (<span className={styles.eachPath} key={e.name}>
            <span>{e.name}</span><span>{lastData ? '' : '/'}</span>
          </span>)
        }
      })}
    </div>
  )
}

export default CommonBreadcrumb;