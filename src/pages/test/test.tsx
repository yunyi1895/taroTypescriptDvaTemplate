import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro';
import { View ,Text, Button} from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './test.less';

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

interface Test {
  props: IProps;
}
@connect(({test}) => ({
  ...test,
}),(dispatch)=>({
  add(s:Number){
    dispatch({
      type:'test/add',
      payload:{
        data:s
      }
    })
  },
  jian(s:Number){
    dispatch({
      type:'test/jian',
      payload:{
        data:s
      }
    })
  },
  effectsDemo(){
    dispatch({
      type:'test/effectsDemo',
      payload:{
        data:9999
      }
    })
  }
}))
class Test extends Component {
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
  gotoPage(){
    Taro.navigateTo({
      url:'/pages/index/index'
    })
  }
  handleJian(){
    var s = 3;
    this.props.jian(s);
  }
  render() {
    const { count,effectsDemo } = this.props;
    const { bba} = this.state;
    return (
      <View className="test-page">
         <Button onClick={this.handeleAdd.bind(this)} className='btn-max-w' size='mini' type='primary'>+</Button>
         <Button onClick={this.handleJian.bind(this)} size='mini' type='warn'>-</Button>
         <Button onClick={effectsDemo.bind(this)} size='mini' type='warn'>effectsDemo</Button>
         <Button onClick={this.gotoPage.bind(this)} size='mini' >gotoPageIndex</Button>
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

export default Test as ComponentClass<PageOwnProps, PageState>

