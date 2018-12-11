import React from 'react';
import styles from './deviceMonitor.scss';

export const YcPoints = ({ ycData = [] }) => {
  return (
    <section>
      <h3>YC/遥测量</h3>
      <div>
        <div>
          <span>名称</span>
          <span>测量值</span>
          <span>单位</span>
        </div>
        {ycData.map(e => (
          <div>
            <span></span>
            <span></span>
            <span></span>
          </div>
        ))}
      </div>
    </section>
  )
}

export const YxPoints = ({ yxData = [] }) => {
  return (
    <section>
      <h3>YX</h3>
      <div>
        {yxData.map(e => (
          <span>
            <span>原</span>
            <span>数据</span>
          </span>
        ))}
      </div>
    </section>
  )
}

export const YmPoints = ({ ymData = [] }) => {
  return (
    <section>
      <h3>YM</h3>
      <div>
        {ymData.map(e => (
          <span>
            <span>原</span>
            <span>数据</span>
          </span>
        ))}
      </div>
    </section>
  )
}