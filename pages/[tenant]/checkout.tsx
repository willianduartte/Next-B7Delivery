import { CartProductItem } from '../../components/CartProductItem'
import { InputField } from '../../components/InputField'
import { useFormatter } from '../../libs/useFormatter'
import styles from '../../styles/Checkout.module.css'
import { useAuthContext } from '../../contexts/auth'
import { getCookie, setCookie } from 'cookies-next'
import { CartCookie } from '../../types/CartCookie'
import { useAppContext } from '../../contexts/app'
import { Button } from '../../components/Button'
import { Header } from '../../components/Header'
import { CartItem } from '../../types/CartItem'
import { Tenant } from '../../types/Tenant'
import { useEffect, useState } from 'react'
import { useApi } from '../../libs/useApi'
import { GetServerSideProps } from 'next'
import { User } from '../../types/user'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { ButtonWithIcon } from '../../components/ButtonWithIcon'
import { Address } from '../../types/Address'

const Checkout = (data: Props) => {
  const { tenant, setTenant } = useAppContext()
  const { setToken, setUser } = useAuthContext()
  const formatter = useFormatter()
  const router = useRouter()

  // Product Control
  const [cart, setCart] = useState<CartItem[]>(data.cart)

  // Shipping
  const [shippingPrice, setShippingPrice] = useState(0)
  const [shippingAddress, setShippingAddress] = useState<Address>()
  const handleChangeAddress = () => {
    router.push(`/${data.tenant.slug}/myaddresses`)
    /*
    setShippingAddress({
      id: 1,
      state: 'SP',
      number: '424',
      city: 'Jandira',
      cep: '06622-590',
      complement: 'Casa',
      street: 'Rua Cerqueira César',
      neighborhood: 'Parque Iglesias',
    })
    setShippingPrice(12.5)
    */
  }

  // Payments
  const [paymentType, setPaymentType] = useState<'money' | 'card'>('money')
  const [paymentChange, setPaymentChange] = useState(0)

  // Cupom
  const [cupom, setCupom] = useState('')
  const [cupomDiscount, setCupomDiscount] = useState(0)
  const [cupomInput, setCupomInput] = useState('')
  const handleSetCupom = () => {
    if(cupomInput) {
      setCupom(cupomInput)
      setCupomDiscount(15)
    }
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
        <title>{data.tenant.name} | Checkout</title>
      </Head>
      <Header
        title='Checkout'
        backHref={`/${data.tenant.slug}`}
        color={data.tenant.mainColor}
      />

      <div className={styles.infoGroup}>
        <div className={styles.infoArea}>
          <div className={styles.infoTitle}>Endereço</div>
          <div className={styles.infoBody}>
            <ButtonWithIcon
              color={data.tenant.mainColor}
              leftIcon={'location'}
              rightIcon={'rightArrow'}
              value={shippingAddress ? `${shippingAddress.street} - ${shippingAddress.number} - ${shippingAddress.city}` : 'Escolha um endereço'}
              onClick={handleChangeAddress}
            />
          </div>
        </div>

        <div className={styles.infoArea}>
          <div className={styles.infoTitle}>Tipo de Pagamento</div>
          <div className={styles.infoBody}>
            <div className={styles.paymentTypes}>
              <div className={styles.paymentBtn}>
                <ButtonWithIcon
                  color={data.tenant.mainColor}
                  leftIcon={'money'}
                  value={'Dinheiro'}
                  onClick={() => setPaymentType('money')}
                  fill={paymentType === 'money'}
                />
              </div>
              <div className={styles.paymentBtn}>
                <ButtonWithIcon
                  color={data.tenant.mainColor}
                  leftIcon={'card'}
                  value={'Cartão'}
                  onClick={() => setPaymentType('card')}
                  fill={paymentType === 'card'}
                />
              </div>
            </div>
          </div>
        </div>

        {paymentType === 'money' &&
          <div className={styles.infoArea}>
            <div className={styles.infoTitle}>Troco</div>
            <div className={styles.infoBody}>
              <InputField
                color={data.tenant.mainColor}
                value={paymentChange ? paymentChange.toString() : ''}
                onChange={newValue => {setPaymentChange(parseInt(newValue))}}
                placeholder='Quanto você tem em dinheiro?'
              />
            </div>
          </div>
        }

        <div className={styles.infoArea}>
          <div className={styles.infoTitle}>Cupom de desconto</div>
          <div className={styles.infoBody}>
            {cupom &&
              <ButtonWithIcon
                color={data.tenant.mainColor}
                leftIcon={'cupom'}
                rightIcon={'checked'}
                value={cupom.toUpperCase()}
              />
            }
            {!cupom &&
              <div className={styles.cupomInput}>
                <InputField
                  color={data.tenant.mainColor}
                  placeholder="Tem um cupom?"
                  value={cupomInput}
                  onChange={newValue => setCupomInput(newValue)}
                />
                <Button
                  color={data.tenant.mainColor}
                  label='OK'
                  onClick={handleSetCupom}
                  small
                  fill
                />
              </div>
            }
          </div>
        </div>
      </div>

      <div className={styles.productsQt}>{cart.length} {cart.length === 1 ? 'item' : 'itens'}</div>

      <div className={styles.productsList}>
        {cart.map((cartItem, index) => (
          <CartProductItem
            key={index}
            color={data.tenant.mainColor}
            quantity={cartItem.qt}
            product={cartItem.product}
            onChange={() => {}}
            noEdit
          />
        ))}
      </div>

      <div className={styles.resumeArea}>
        <div className={styles.resumeItem}>
          <div className={styles.resumeItemLeft}>Subtotal</div>
          <div className={styles.resumeItemRight}>{formatter.formatPrice(subtotal)}</div>
        </div>
        {cupomDiscount > 0 &&
          <div className={styles.resumeItem}>
            <div className={styles.resumeItemLeft}>Desconto</div>
            <div className={styles.resumeItemRight}>- {formatter.formatPrice(cupomDiscount)}</div>
          </div>
        }
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
          >{formatter.formatPrice(subtotal - cupomDiscount + shippingPrice)}</div>
        </div>
        <div className={styles.resumeButton}>
          <Button
            color={data.tenant.mainColor}
            label='Finalizar Pedido'
            onClick={handleFinish}
            disable={!shippingAddress}
            fill
          />
        </div>
      </div>
    </div>
  )
}

export default Checkout

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