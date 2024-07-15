// redux和pinia逻辑相反：在 Redux 中，你先定义 reducer 和 action creators，然后将它们与 store 关联。

import { applyMiddleware, combineReducers, legacy_createStore as createStore } from 'redux'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import reduxThunk from 'redux-thunk'

import menu from './modules/menu/reducer'
import theme from './modules/theme/reducer'
import user from './modules/user/reducer'
import background from './modules/background/reducer'
import { PERSIT_CONFIG_henriFox } from './constant'

// Reducer function resolution
const reducer = combineReducers({
    menu,
    user,
    theme,
    background
})

// persitConfig configuration information
const persitConfig = {
    key: PERSIT_CONFIG_henriFox,
    storage: storage
}

// create configuration persist information
const persist_reducers = persistReducer(persitConfig, reducer) //得到 根归约器 baseReducer

// Solve the problem that the same function supports multiple dispatches and asynchronous actions in React development
let store = createStore(persist_reducers, applyMiddleware(reduxThunk))

const persistor = persistStore(store)

const clearPersistor = () => {
    localStorage.removeItem(`persist:${PERSIT_CONFIG_henriFox}`)
}
export { clearPersistor, persistor, store }
