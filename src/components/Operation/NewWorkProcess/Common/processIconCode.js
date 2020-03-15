/**
 * 工单工作流图标编码
 * 文档位置：亿方云 接口文档 4.0 框架文档 工单工作流图标编码
 *
 * 根据后端返回code编码，匹配图标
 * @param {number} code
 * @return string
 * */

export const processIconFunc = (code) => {
  const iconMap = {
    30001: '', // 新建 暂时没有定义图标
    30002: 'iconfont icon-liucheng1', // 待领取
    30003: 'iconfont icon-liucheng2', // 执行中
    30004: 'iconfont icon-liucheng3', // 待验收
    30005: 'iconfont icon-congra', // 已结单
    30006: 'iconfont icon-liucheng', // 新建工单
    30007: 'iconfont icon-liucheng1', // 领取工单
    30008: 'iconfont icon-liucheng2', // 添加执行人
    30009: 'iconfont icon-edit', // 编辑
    30010: 'iconfont icon-liucheng4', // 提交验收
    30011: 'iconfont icon-liucheng3', // 验收通过
    30012: 'iconfont icon-liuccheng', // 驳回
    30013: 'iconfont icon-lingqu', // 领取按钮
    30014: 'iconfont icon-checkup', // 提交验收按钮
    30015: 'iconfont icon-closeall', // 驳回按钮
    30016: 'iconfont icon-checkend', // 验收通过按钮
    30017: 'iconfont icon-addman', // 添加执行人按钮
    30018: 'iconfont icon-dshen', // 审核按钮 待审核状态
    30019: 'iconfont icon-btui', // 退回按钮 已退回状态
    30020: 'iconfont icon-tijiao', // 提交按钮
    30021: 'iconfont icon-newbuilt', // 添加按钮
    30022: 'iconfont icon-paifa1', // 派发
    30023: 'iconfont icon-tuihui', // 退回
    30024: 'iconfont icon-del', // 删除
    30025: 'iconfont icon-wrong', // 验收驳回按钮  关闭

  };
  return iconMap[code];
};


/**
 * 根据后端返回stateName 前端自己匹配一次 由于stateID 是不同的企业有不同的ID，但是stateName不会发生改变，可以根据此来映射
 * 后期可以自己增加
 * @param {string}  stateName
 * @return string
 *
 *
 * */

export const localStateName = (name) => {
  const stateName = {
    '待审核': 'review',
    '已退回': 'return',
    '待领取': 'receive',
    '执行中': 'execute',
    '待验收': 'accept',
    '已结单': 'complete',
  };
  if (name) {
    return stateName[name.trim()];
  }
  return '';

};
/**
 * 根据后端返回code编码，匹配图标颜色
 * @param {number} code
 * @return string
 *
 * 颜色就不定义了，可以用状态码去匹配class名
 * */
