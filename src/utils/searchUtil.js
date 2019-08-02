import { stringify, parse } from 'qs';

class SearchUtil {
  constructor(search = ''){
    const searchStr = (search && search.indexOf('?') === 0) ? search.substring(1) : search; // 头部 ? 均抛弃。
    this.search = searchStr.toString();
  }

  init = (search) => new SearchUtil(search);

  parse = () => parse(this.search); // 输出函数 => 当前实例的对象格式

  stringify = () => this.search; // 输出函数 => 当前实例的字符串格式

  getValue = (key) => { // 输出参数, 获取当前search中某key对应的value
    const infos = parse(this.search) || {};
    return infos[key];
  }

  has = (key) => !!parse(this.search)[key] // 判断search信息中是否有相关关键字

  add = (addInfo = {}) => { // 在search中添加一条/多条信息:{group: {....}}, 若内容已存在则替换。
    const searchParse = parse(this.search);
    const newSearch = stringify({
      ...searchParse,
      ...addInfo,
    });
    return this.init(newSearch);
  }

  replace = this.add;

  delete = (removeArr) => {// search路径中移除某一条/多条信息, arr为要移除的信息关键字(['group', 'area'])
    const searchParse = parse(this.search);
    removeArr.forEach(e => {
      delete searchParse[e];
    });
    const newSearch = stringify(searchParse);
    return this.init(newSearch);
  }
}

const searchUtil = (search) => new SearchUtil(search);

export default searchUtil;
