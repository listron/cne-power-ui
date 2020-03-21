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
    30003: 'iconfont icon-liucheng4', // 执行中
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
  };
  return iconMap[code];
};
/**
 * 根据后端返回code编码，匹配图标颜色
 * @param {number} code
 * @return string
 *
 * 颜色就不定义了，可以用状态码去匹配class名
 * */
