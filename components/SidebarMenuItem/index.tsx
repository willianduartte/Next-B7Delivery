import styles from './style.module.css'
import CartIcon from './cart.svg'
import ConfigIcon from './config.svg'
import FavIcon from './fav.svg'
import LogoutIcon from './logout.svg'
import MenuIcon from './menu.svg'
import OrderIcon from './order.svg'

type Props = {
  icon: 'menu' | 'cart' | 'fav' | 'order' | 'config' | 'logout'
  label: string
  color: string
  onClick: () => void
  disable?: boolean
}

export const MenuItem = ({icon, label, color, onClick, disable}: Props) => {
  return (
    <div className={styles.container} onClick={onClick}>
      {icon === 'menu' && <MenuIcon color={color}/>}
      {icon === 'cart' && <CartIcon color={color}/>}
      {icon === 'fav' && <FavIcon color={color}/>}
      {icon === 'order' && <OrderIcon color={color}/>}
      {icon === 'config' && <ConfigIcon color={color}/>}
      {icon === 'logout' && <LogoutIcon color={color}/>}
      <span className={disable ? styles.disable : ''} >{label}</span>
    </div>
  )
}