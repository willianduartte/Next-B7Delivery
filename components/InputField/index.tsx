import styles from './styles.module.css'
import EyeOn from './EyeOn.svg'
import EyeOff from './EyeOff.svg'
import { useState } from 'react'

type Props = {
  color: string
  placeholder: string
  value: string
  onChange: (newValue: string) => void
  password?: boolean
}

export const InputField = ({color, placeholder, value, onChange, password}: Props) => {
  const [showPassword, setShowPassword] = useState(false)
  const [focused, setFocused] = useState(false)

  return (
    <div 
      style={{ 
        borderColor: focused? color : '#f9f9fb', 
        backgroundColor: focused? '#fff' : '#f9f9fb' 
      }} 
      className={styles.container}
    >
      <input
        type={password && !showPassword? 'password' : 'text'}
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {password &&
        <div 
          className={styles.showPassword}
          onClick={()=>setShowPassword(!showPassword)}
        >
          {showPassword && <EyeOff />}
          {!showPassword && <EyeOn />}
        </div>
      }
    </div>
  )
}