import { GithubOutlined } from '@ant-design/icons'
const GitHub = () => {
    const jump = () => {
        window.open('https://github.com/Henri-lab')
    }
    return (
        <GithubOutlined
            title="Github"
            className="mx-[8px] flex cursor-pointer text-[20px]"
            onClick={jump}
        />
    )
}
export default GitHub
