import LoginForm from './components/LoginForm'
import Theme from './components/Theme'
// import ParticleBackground from './components/ParticleBackground'

import './index.less'

import logo from '/@/assets/svg/logo.svg'
export default function Login() {
    return (
        <>
            <Theme />
            <div className="login-bg"></div>
            <div className="login-container w-full h-full px-32 py-20 ">
                <div className="login-inner login-title  items-center animate-wiggle hidden lg:block lg:flex app-title-bg">
                    <img src={logo} alt="logo" className="logo-img" />
                    <div>
                        <p className="text-[32px] font-black pt-[10px]">@henriFox</p>
                        <p className="!text-[16px] font-black ">用户管理系统模板</p>
                    </div>
                </div>
                <div className="login-inner login-box flex">
                    <div className="login-left flex-1"></div>
                    <div className="login-form flex flex-1 items-center justify-center animate-wiggle">
                        <div className="login-form-content">
                            <div className="login-logo flex items-center justify-between">
                                <img src={logo} alt="logo" className="logo-img" />
                                <div>
                                    <p className="login-form-title">@henriFox</p>
                                </div>
                            </div>
                            <LoginForm />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
