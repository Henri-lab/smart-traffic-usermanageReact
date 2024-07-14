import { Query } from './Query'
const position = [1, 2]
const service='ss'
const success = (res) => {
    console.log(res)
}
const para = {
    position,
    service,
    success
}
Query.queryByPntGeom()