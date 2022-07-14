import { ColumnProps, ImageProps, UserProps } from './store'

export function getAssetsImages(name: string) {
  return new URL(`/src/assets/${name}`, import.meta.url).href;
}

export function generateFitUrl(data: ImageProps, width: number, height: number, format = ['m_pad']) {
  if (data && data.url) {
    const formatStr = format.reduce((prev, current) => {
      return current + ',' + prev
    }, '')
    data.fitUrl = data.url + `?x-oss-process=image/resize,${formatStr}h_${height},w_${width}`
  }
}

export function addColumnAvatar(data: ColumnProps | UserProps, width: number, height: number) {
  if (data.avatar) {
    generateFitUrl(data.avatar, width, height)
  } else {
    const parseCol = data as ColumnProps
    data.avatar = {
      // fitUrl: require(parseCol.title ? '@/assets/column.jpg' : '@/assets/avatar.jpg')
      fitUrl: getAssetsImages(parseCol.title ? 'column.jpg' : 'avatar.jpg')
    }
  }
}

interface CheckCondition {
  format?: string[];
  size?: number;
}
type ErrorType = 'size' | 'format' | null
export function beforeUploadCheck(file: File, condition: CheckCondition) {
  const { format, size } = condition
  const isValidFormat = format ? format.includes(file.type) : true
  const isValidSize = size ? (file.size / 1024 / 1024 < size) : true
  let error: ErrorType = null
  if (!isValidFormat) {
    error = 'format'
  }
  if (!isValidSize) {
    error = 'size'
  }
  return {
    passed: isValidFormat && isValidSize,
    error
  }
}

interface TestProps {
  _id: string;
  name: string;
}
const testData: TestProps[] = [{ _id: '1', name: 'a' }, { _id: '2', name: 'b' }]

export const arrToObj = <T extends {_id?: string}>(arr:Array<T>) => {  // extends约束泛型，不然if (current._id)报错
  return arr.reduce((prev,current) => {
    if (current._id) {
      prev[current._id] = current
    }
    return prev
  },{} as {[key: string]:T}) // as类型断言，不然prev[current._id]报错
}

const testData2: { [key: string]: TestProps } = {
  1: { _id: '1', name: 'a' },
  2: { _id: '2', name: 'b' }
}

export const objToArr = <T>(obj: { [key: string]: T }) => {
  return Object.keys(obj).map(key => obj[key])
}
