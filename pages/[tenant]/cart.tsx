import { InputField } from '../../components/InputField'
import { useFormatter } from '../../libs/useFormatter'
import { useAuthContext } from '../../contexts/auth'
import { useAppContext } from '../../contexts/app'
import styles from '../../styles/Cart.module.css'
import { Button } from '../../components/Button'
import { Header } from '../../components/Header'
import { Tenant } from '../../types/Tenant'
import { useEffect, useState } from 'react'
import { useApi } from '../../libs/useApi'
import { GetServerSideProps } from 'next'
import { getCookie, setCookie } from 'cookies-next'
import { User } from '../../types/user'
import Head from 'next/head'
import { CartItem } from '../../types/CartItem'
import { useRouter } from 'next/router'
import { CartProductItem } from '../../components/CartProductItem'
import { CartCookie } from '../../types/CartCookie'

const Cart = (data: Props) => {
  const { tenant, setTenant } = useAppContext()
  const { setToken, setUser } = useAuthContext()
  const formatter = useFormatter()
  const router = useRouter()

  // Product Control
  const [cart, setCart] = useState<CartItem[]>(data.cart)
  const handleCartChange = (newCount: number, id: number) => {
    const tmpCart: CartItem[] = [...cart]
    const cartIndex = tmpCart.findIndex(item => item.product.id === id)
    if(newCount > 0) {
      tmpCart[cartIndex].qt = newCount
    } else {
      delete tmpCart[cartIndex]
    }
    let newCart: CartItem[] = tmpCart.filter(item => item)
    setCart(newCart)

    // update cookie

    let cartCookie: CartCookie[] = []
    for(let i in newCart) {
      cartCookie.push({
        id: newCart[i].product.id,
        qt: newCart[i].qt
      })
    }
    setCookie('cart', JSON.stringify(cartCookie))
  }

  // Shipping
  const [shippingInput, setShippingInput] = useState('')
  const [shippingAddress, setShippingAddress] = useState('')
  const [shippingPrice, setShippingPrice] = useState(0)
  const [shippingTime, setShippingTime] = useState(0)
  const handleShippingCalc = () => {
    setShippingAddress('Rua das Flores - Jardins da Serra - Campina Pequena')
    setShippingPrice(9.50)
    setShippingTime(20)
  }
  
  // Resume
  const [subtotal, setSubtotal] = useState(0)
  useEffect(() => {
    let sub = 0
    for(let i in cart) {
      sub += cart[i].product.price * cart[i].qt
    }
    setSubtotal(sub)
  }, [cart])
  const handleFinish = () => {
    router.push(`/${data.tenant.slug}/checkout`)
  }

  useEffect(() => {
    setTenant(data.tenant)
    setToken(data.token)
    if(data.user) {
      setUser(data.user)
    }
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>{data.tenant.name} | Sacola</title>
      </Head>
      <Header
        title='Sacola'
        backHref={`/${data.tenant.slug}`}
        color={data.tenant.mainColor}
      />
      <div className={styles.productsQt}>{cart.length} {cart.length === 1 ? 'item' : 'itens'}</div>

      <div className={styles.productsList}>
        {cart.map((cartItem, index) => (
          <CartProductItem
            key={index}
            color={data.tenant.mainColor}
            quantity={cartItem.qt}
            product={cartItem.product}
            onChange={handleCartChange}
          />
        ))}
      </div>

      <div className={styles.shippingArea}>
        <div className={styles.shippingTitle}>Calcular frete e prazo</div>
        <div className={styles.shippingForm}>
          <InputField
            placeholder='Cep Ex: 12345-123'
            color={data.tenant.mainColor}
            value={shippingInput}
            onChange={newValue => setShippingInput(newValue)}
          />
          <Button
            label='OK'
            color={data.tenant.mainColor}
            onClick={handleShippingCalc}
            small
          />
        </div>
        {shippingTime > 0 &&
          <div className={styles.shippingInfo}>
            <div className={styles.shippingAddress}>{shippingAddress}</div>
            <div className={styles.shippingTime}>
              <div className={styles.shippingTimeText}>Receba em até {shippingTime} minutos</div>
            <div 
              className={styles.shippingTimePrice}
              style={{ color: data.tenant.mainColor }}
            >{formatter.formatPrice(shippingPrice)}</div>
            </div>
          </div>
        }
      </div>

      <div className={styles.resumeArea}>
        <div className={styles.resumeItem}>
          <div className={styles.resumeItemLeft}>Subtotal</div>
          <div className={styles.resumeItemRight}>{formatter.formatPrice(subtotal)}</div>
        </div>
        <div className={styles.resumeItem}>
          <div className={styles.resumeItemLeft}>Frete</div>
          <div className={styles.resumeItemRight}>{shippingPrice > 0 ? formatter.formatPrice(shippingPrice) : '--'}</div>
        </div>
        <div className={styles.resumeLine}></div>
        <div className={styles.resumeItem}>
          <div className={styles.resumeItemLeft}>Total</div>
          <div 
            className={styles.resumeItemRightBig}
            style={{color: data.tenant.mainColor}}
          >{formatter.formatPrice(shippingPrice + subtotal)}</div>
        </div>
        <div className={styles.resumeButton}>
          <Button
            color={data.tenant.mainColor}
            label='Continuar'
            onClick={handleFinish}
            fill
          />
        </div>
      </div>
    </div>
  )
}

export default Cart

type Props = {
  tenant: Tenant
  token: string
  user: User | null
  cart: CartItem[]
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { tenant: tenantSlug } = context.query
  const api = useApi(tenantSlug as string)

  // Get Tenant
  const tenant = await api.getTenant()
  if(!tenant) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  // Get Logged User
  const token = getCookie('token', context)
  const user = await api.authorizeToken(token as string)

  // Get Cart Products
  const cartCookie = getCookie('cart', context)
  const cart = await api.getCartProducts(cartCookie as string)

  return {
    props: {
      tenant,
      user,
      token,
      cart
    }
  }
}