

export const getRoots = (data) => { // 遍历解析根数据为一维数组 => 广度优先遍历-不递归了，嘎嘎。
  const resultList = [];
  let restList = [...data]; // 需要继续遍历的数据
  while(restList.length > 0){
    const tmp = restList.filter(e => {
      const { children } = e || {};
      const hasChildren = children && children.length > 0;
      if (!hasChildren) {
        resultList.push(e); // 保存记录结果
      }
      return hasChildren;
    });
    restList = tmp.reduce((pre, cur) => { // 未遍历项归并后进行下一次遍历
      const curList = cur.children || [];
      return pre.concat(curList);
    }, []);
  }
  return resultList;
};

export const getValueSet = (data = [], key) => { // 取出对象数组中指定属性的集合。
  const values = data.map(e => e[key]);
  return new Set(values);
};

export const isSetDiff = (setA, setB) => { // 比价两个set值
  if(setA.size !== setB.size) {
    return true;
  }
  return Array.from(setA).find(value => !setB.has(value));
};
