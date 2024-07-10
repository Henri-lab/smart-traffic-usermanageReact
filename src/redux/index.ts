// --Redux 是一个独立于任何特定视图库的状态管理库，它可以与 React（以及其他库）集成使用。
// 在 React 应用中，Redux 通常与 react-redux 库一起使用，这样可以更方便地管理状态和组件的交互。

// --Redux 的 action 创建函数是用来创建并返回一个描述性的 action 对象的函数。
// 这些 action 对象描述了某种状态变化的意图，例如添加待办事项、获取用户信息等。
// 在 Redux 中，action 创建函数通常用于异步操作、用户交互或其他需要改变应用状态的场景。

// --在 React 应用中，通过 react-redux 提供的 useDispatch 钩子
// （或者在类组件中使用 connect 函数连接后，通过 props.dispatch）可以获取 dispatch 方法。
// dispatch 方法是 Redux store 的一个方法，它用于派发（即发送）action 到 Redux store。
// 通过 dispatch，Redux 可以根据 action 的类型和 payload 来更新状态。

// --在 React 组件中，通过 dispatch 方法可以调用 Redux 中定义的 action 创建函数，
// 以此来触发状态的改变。这种方式可以保持组件的纯粹性，
// 因为组件🚨本身不直接操作状态，而是通过派发 action 来👽描述状态👽的变化。

// --Redux 的设计理念是通过严格的单向数据流来管理应用的状态变化，
// 使用 dispatch 方法可以确保所有状态变更都经过统一的流程，易于调试和理解。

// 钩子 API（Hooks API）是 React 16.8 🚦引入的一套全新的 API，
// 它允许你在函数组件中使用 React 的状态（state）、生命周期方法、以及其他的 React 特性，而无需编写类组件。
// Hooks API 提供了一种更简洁、灵活和易于理解的方式来编写和管理 React 组件的状态和逻辑。







import { applyMiddleware, combineReducers, legacy_createStore as createStore } from 'redux'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import reduxThunk from 'redux-thunk'

import menu from './modules/menu/reducer'
import theme from './modules/theme/reducer'
import user from './modules/user/reducer'
import { PERSIT_CONFIG_MU } from './constant'

// Reducer function resolution
const reducer = combineReducers({
    menu,
    user,
    theme
})

// persitConfig configuration information
const persitConfig = {
    key: PERSIT_CONFIG_MU,
    storage: storage
}

// create configuration persist information
const persist_reducers = persistReducer(persitConfig, reducer) //得到 根归约器 baseReducer

// Solve the problem that the same function supports multiple dispatches and asynchronous actions in React development
let store = createStore(persist_reducers, applyMiddleware(reduxThunk))
// Reducer  归约器🔥：所有状态更新都是通过归约器完成🩸
// --指定了如何响应动作并更新 state 的纯函数⚪。
// --接收先前的 state 和 action 作为参数，并返回新的 state。🎆
// --多个 reducer 可以通过 combineReducers 合并成一个根 reducer🌞--(树状结构)。
// ===========根归约器🌞===========
// 当应用程序接收到 action 时，根归约器🌞会将 action 分发🗽给各个子归约器⭐来处理。每个子归约器⭐只负责处理自己关心的 action 类型，然后返回更新后的状态。
// Redux store 使用根归约器🌞来管理整个🌌应用的状态



// applyMiddleware(reduxThunk)  中间件🏆
// --提供了一个扩展 Redux 功能的机制，可以在 dispatch action 和 reducer 处理 action 的中间执行自定义代码。
// --最常用的中间件是 redux-thunk🪐，用于处理异步 action。使得 action 可以返回一个函数而不仅仅是一个普通的 action 对象。
const persistor = persistStore(store)

const clearPersistor = () => {
    localStorage.removeItem(`persist:${PERSIT_CONFIG_MU}`)
}
export { clearPersistor, persistor, store }

// 功能和用途
// 自动持久化：persistStore 函数会订阅 Redux store 的变化，并在 store 的状态发生改变时，将变化后的状态自动持久化到指定的存储引擎中（如 localStorage）。
// 恢复状态：在应用初始化时，通过 persistStore 函数可以初始化 Redux store，并尝试从存储中加载之前保存的状态，使应用能够恢复到上一次的状态。
// 注意事项
// 性能影响：持久化操作可能会对性能产生一定影响，特别是在处理大量数据时。建议根据实际应用场景进行性能优化和测试。
// 配置选项：可以通过 persistConfig 对象来配置持久化行为，例如选择存储引擎、指定黑名单或白名单等。
// 通过使用 persistStore(store) 函数，可以方便地实现 Redux 状态的持久化，从而增强应用的用户体验和状态管理的健壮性

// Redux 的 Action 是一个简单的对象🚘，用于描述应用中发生的事件或动作，并传递相关的数据🚓给 reducer 进行状态更新
// 示例
// Action creator 函数，用于创建一个添加待办事项的 Action
// export function addTodo(id, text) {
//   return {
//     type: 'ADD_TODO',🏳‍🌈操作类型 普通的字符串 -- 👁‍🗨作为类型常量，它们通常被放置在一个单独的文件中，用于集中管理所有的 action 类型
//     payload: { 🌈携带数据
//       id,
//       text
//     }
//   };
// }

// ##组件##
// import { useDispatch } from 'react-redux';🚀
// import { addTodo } from './actions';

// function TodoForm() {
//   const dispatch = useDispatch();

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     dispatch(addTodo(1, 'Buy groceries'));🚀
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <button type="submit">Add Todo</button>
//     </form>
//   );
// }




// 纯函数⚪
// 在编程中，“纯函数”的“纯”指的是函数的行为符合数学上的纯函数定义，具有以下两个主要特征：

// 无副作用（Side Effects Free）：🌐
// --纯函数在执行过程中不会对除函数返回值以外的任何程序状态进行更改，例如修改全局变量、修改传入的参数等。它不会产生对外部环境有可观察影响的行为。

// 确定性（Deterministic）：
// --对于相同的输入，纯函数总是返回相同的输出，不受程序执行时的任何上下文或外部状态影响。这使得函数的执行结果完全可预测和可信赖。
// --为什么重视纯函数的特性？
// --易于理解和测试：由于纯函数不依赖于外部状态，它们更易于理解和测试。输入输出关系清晰，不需要在测试过程中考虑复杂的上下文环境。

// 并发安全性：在并发环境中，纯函数不会由于竞态条件或状态变化而产生不一致的结果，从而提高了程序的并发安全性。

// 可缓存性：纯函数的结果可以缓存，因为对于相同的输入，函数总是返回相同的输出。这在性能优化和函数式编程中非常有用。


