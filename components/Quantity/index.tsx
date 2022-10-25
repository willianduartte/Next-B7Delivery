import { useEffect, useState } from 'react'
import { useFormatter } from '../../libs/useFormatter'
import styles from './styles.module.css'

type Props = {
  color: string
  count: number
  onUpdateCount: (newCount: number) => void
  min?: number
  max?: number
  small?: boolean
}

export const Quantity = ({color, count, onUpdateCount, min, max, small}:Props) => {
  const [canRemove, setCanRemove] = useState(false)
  const [canAdd, setCanAdd] = useState(false)

  const formatter = useFormatter()

  useEffect(() => {
    setCanRemove((!min || (min && count > min)) ? true : false)
    setCanAdd((!max || (max && count < max)) ? true : false)
  }, [count, min, max])

  const handleRemove = () => {
    if(canRemove) {
      onUpdateCount(count - 1)
    }
  }
  
  const handleAdd = () => {
    if(canAdd) {
      onUpdateCount(count + 1)
    }
  }

  return (
    <div className={styles.container}>
      <div 
        className={styles.button} 
        onClick={handleRemove}
        style={{
          backgroundColor: canRemove ? color : '#F2F4F5', 
          color: canRemove ? '#fff' : '#96A3AB',
          width: small? 36 : 48,
          height: small? 36 : 48,
        }}
      >-</div>
      <div 
        className={styles.count}
        style={{
          width: small? 36 : 48,
          height: small? 36 : 48,
          fontSize: small ? 16 : 18
        }}
      >{formatter.formatQuantity(count, 2)}</div>
      <div 
        className={styles.button} 
        onClick={handleAdd}
        style={{
          backgroundColor: canAdd ? color : '#F2F4F5', 
          color: canAdd ? '#fff' : '#96A3AB',
          width: small? 36 : 48,
          height: small? 36 : 48,
        }}
      >+</div>
    </div>
  )
}