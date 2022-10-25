import styles from './styles.module.css'

type Props = {
  color: string
  label: string
  onClick: () => void
  fill?: boolean
  small?: boolean
}

export const Button = ({color, label, onClick, fill, small}: Props) => {
  return (
    <div 
      className={styles.container}
      onClick={onClick}
      style={{ 
        padding: small?  '19px' : '22px',
        border: small? `2px solid ${color}` : '1px solid #000',
        backgroundColor: fill? color : 'transparent',
        color: fill? '#fff' : color,
        borderColor: color,
      }}
    >
      {label}
    </div>
  )
}