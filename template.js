/**
 * pages模版快速生成脚本,执行命令 npm run tep `文件名`
 */

const fs = require('fs');

const dirName = process.argv[2];

if (!dirName) {
  console.log('文件夹名称不能为空！');
  console.log('示例：npm run tep test');
  process.exit(0);
}

// 页面模版
const indexTep = `import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro';
import { View ,Text, Button} from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './${dirName}.less';

// #region 书写注意
//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion

type PageStateProps = {
  count: Number,
  dispatch:Function
}

type PageDispatchProps = {
  add: (s:Number) => void,
  jian:(s:Number) => void,
  effectsDemo:() => any,
}

type PageOwnProps = {}

type PageState = {
  bba:String
}
type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface ${titleCase(dirName)} {
  props: IProps;
}
@connect(({${dirName}}) => ({
  ...${dirName},
}),(dispatch)=>({
  add(s:Number){
    dispatch({
      type:'${dirName}/add',
      payload:{
        data:s
      }
    })
  },
  jian(s:Number){
    dispatch({
      type:'${dirName}/jian',
      payload:{
        data:s
      }
    })
  },
  effectsDemo(){
    dispatch({
      type:'${dirName}/effectsDemo',
      payload:{
        data:9999
      }
    })
  }
}))
class ${titleCase(dirName)} extends Component {
   /**
 * 指定config的类型声明为: Taro.Config
 *
 * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
 * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
 * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
 */
  
  config = {
    navigationBarTitleText: 'index',
  };
  state={
    bba:'9'
  }
  constructor(props) {
    super(props);
  }
  
  componentDidMount = () => {

  };
  handeleAdd(){
    var s = 3;
    this.props.add(s);
  }
  handleJian(){
    var s = 3;
    this.props.jian(s);
  }
  render() {
    const { count,effectsDemo } = this.props;
    const { bba} = this.state;
    return (
      <View className="${dirName}-page">
         <Button onClick={this.handeleAdd.bind(this)} className='btn-max-w' size='mini' type='primary'>+</Button>
         <Button onClick={this.handleJian.bind(this)} size='mini' type='warn'>-</Button>
         <Button onClick={effectsDemo.bind(this)} size='mini' type='warn'>effectsDemo</Button>
        <Text>{count}</Text>
        <Text>{bba}</Text>
      </View>
    )
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default ${titleCase(dirName)} as ComponentClass<PageOwnProps, PageState>

`;

// less文件模版
const lessTep = `
.${dirName}-page {
  height:100%;
  width:100%
}
`;

// model文件模版
const modelTep = `import * as indexApi from './service';

export default {
  namespace: '${dirName}',
  state: {
    count:0
  },

  effects: {
    * effectsDemo(_, { call, put }) {
      console.log(_);
      const { status, data } = yield call(indexApi.demo, {});
      if (status === 'ok') {
        yield put({ type: 'save',
          payload: {
            topData: data,
          } });
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    add(state, { payload }){
      return {...state,count:payload.data+state.count}
    },
    jian(state,{payload}){
       return {...state,count:state.count-payload.data}
    }
  },

};
`;


// service页面模版
const serviceTep = `import Request from '../../utils/request';

export const demo = data => Request({
  url: '路径',
  method: 'POST',
  data,
});
`;



fs.mkdirSync(`./src/pages/${dirName}`); // mkdir $1
process.chdir(`./src/pages/${dirName}`); // cd $1

fs.writeFileSync(`${dirName}.tsx`, indexTep);
fs.writeFileSync(`${dirName}.less`, lessTep);
fs.writeFileSync('model.ts', modelTep);
fs.writeFileSync('service.ts', serviceTep);

console.log(`模版${dirName}已创建,请手动增加models和添加页面模板`);

function titleCase(str) {
  const array = str.toLowerCase().split(' ');
  for (let i = 0; i < array.length; i++) {
    array[i] = array[i][0].toUpperCase() + array[i].substring(1, array[i].length);
  }
  const string = array.join(' ');
  return string;
}

process.exit(0);
