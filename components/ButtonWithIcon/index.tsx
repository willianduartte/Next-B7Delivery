import { Icon } from '../Icon'
import styles from './styles.module.css'

type Props = {
  color: string
  leftIcon?: string
  rightIcon?: string
  value: string
  onClick?: () => void
  fill?: boolean
}

export const ButtonWithIcon = ({color, leftIcon,rightIcon, value, onClick, fill}: Props) => {
  return (
    <div 
      className={styles.container}
      onClick={onClick}
      style={{backgroundColor: fill ? color : '#F9F9FB' }}
    > 
      {leftIcon &&
        <div 
          className={styles.leftSide}
          style={{ backgroundColor: fill ? 'rgba(0, 0, 0, 0.05)' : '#fff' }}
        >
          <Icon
            color={fill? '#fff' : color}
            icon={leftIcon}
            height={24}
            width={24}
          />
        </div>
      }
      <div 
        className={styles.center}
        style={{color: fill ? '#fff' : '#1B1B1B'}}
      >{value}</div>
      {rightIcon &&
        <div className={styles.leftSide}>
          <Icon
            color={fill? '#fff' : color}
            icon={rightIcon}
            height={24}
            width={24}
          />
        </div>
      }
    </div>
  )
}