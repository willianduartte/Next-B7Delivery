import { useAuthContext } from '../../contexts/auth'
import { Tenant } from '../../types/Tenant'
import { Button } from '../Button'
import styles from './styles.module.css'
import Close from './close.svg'
import { MenuItem } from '../SidebarMenuItem'
import { useRouter } from 'next/router'

type Props = {
  tenant: Tenant
  open: boolean
  onClose: () => void
}

export const Sidebar = ({ tenant, open, onClose }: Props ) => {
  const { user, setToken } = useAuthContext()

  const router = useRouter()

  return (
    <div 
      className={styles.container}
      style={{ width: open ? '100vw' : '0' }}
    >
      <div className={styles.area}>
        <div className={styles.header}>
          <div 
           className={styles.loginArea}
           style={{ borderBottomColor: tenant.mainColor }}
          >
            {user &&
              <div className={styles.userInfo}>
                <strong>{user.name}</strong>
                Ultimo pedido há X semanas
              </div>
            }
            {!user &&
              <Button
                color={tenant.mainColor}
                label='Fazer Login'
                onClick={() => router.push(`/${tenant.slug}/login`)}
                fill
              />
            }
          </div>
          <div 
            className={styles.closeBtn}
            onClick={onClose}
          >
            <Close
              color={tenant.mainColor}
            />
          </div>
        </div>
        <div className={styles.line}></div>
        <div className={styles.menu}>
          <MenuItem
            icon='menu'
            label='Cardápio'
            color={'#6a7d8b'}
            onClick={onClose}
          />
          <MenuItem
            icon='cart'
            label='Sacola'
            color={'#6a7d8b'}
            onClick={() => router.push(`/${tenant.slug}/cart`)}
          />
          <MenuItem
            icon='fav'
            label='Favoritos'
            color={'#6a7d8b'}
            onClick={() => null}
            disable
          />
          <MenuItem
            icon='order'
            label='Meus Pedidos'
            color={'#6a7d8b'}
            onClick={() => router.push(`/${tenant.slug}/orders`)}
          />
          <MenuItem
            icon='config'
            label='Configurações'
            color={'#6a7d8b'}
            onClick={() => null}
            disable
          />
        </div>
        <div className={styles.menuButton}>
          {user &&
            <MenuItem
              icon='logout'
              label='Sair'
              color={'#6a7d8b'}
              onClick={() => {
                setToken('')
                onClose()
              }}
            />
          }
        </div>
      </div>
    </div>
  )
}