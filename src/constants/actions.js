/*
1. 此文件为所有页面reducer, saga 文件action配置的字段入口，请确保actions内属性无重复！！
2. 所有saga, reducer方法的action-dispatch强制要求携带actions中注册的特殊字符串前缀，保证action唯一且减少action常量维护
3. actions解析至dispatch后，在各页面私有saga中，由action中属性与各私有saga中自写函数名构成唯一触发dispatch字符串，saga中保存一部分
4. 请开发者务必保证actions对象的value各不相同！否则很可能会导致全局函数出现意外错误而导致网页崩溃！
*/ 
const actionTypeArr = [];
const actions = {};
actionTypeArr.forEach(e=>actions[Symbol(e)] = e);

console.error(`constans/actions文件中，出现重复字符，改操作会导致重复字符覆盖上一个字符，并更改其他页面的dispatch行为！请立刻更改！!`)