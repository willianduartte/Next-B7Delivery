import styles from '../../../styles/Product-id.module.css'
import { useApi } from '../../../libs/useApi'
import { GetServerSideProps } from 'next'
import { Tenant } from '../../../types/Tenant'
import { useAppContext } from '../../../contexts/AppContext'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import { Product } from '../../../types/Product'
import { Header } from '../../../components/Header'
import { Button } from '../../../components/Button'
import { useFormatter } from '../../../libs/useFormatter'
import { Quantity } from '../../../components/Quantity'

const Product = (data: Props) => {
  const { tenant, setTenant } = useAppContext()

  const [count, setCount] = useState(1)

  useEffect(() => {
    setTenant(data.tenant)
  }, [])

  const formatter = useFormatter()
  const handleAddToCart = () => {

  }

  const handleUpdateCount = (newCount: number) => {
    setCount(newCount)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{data.product.name} | {data.tenant.name}</title>
      </Head>

      <div className={styles.headerArea}>
        <Header
          color={data.tenant.mainColor}
          backHref={`/${data.tenant.slug}`}
          title='Produto'
          invert
        />
      </div>
      <div className={styles.headerBg} style={{ backgroundColor: data.tenant.mainColor}}></div>
      <div className={styles.productImage}>
        <img src={data.product.image} />
      </div>
      <div className={styles.infoArea}>
        <div className={styles.category}>{data.product.category}</div>
        <div className={styles.title} style={{borderBottomColor: data.tenant.mainColor}}>{data.product.name}</div>
        <div className={styles.line}></div>
        <div className={styles.description}>{data.product.description}</div>
        <div className={styles.qtText}>Quantidade</div>
        <div className={styles.area}>
          <div className={styles.areaLeft}>
            <Quantity 
              color={data.tenant.mainColor}
              count={count}
              onUpdateCount={handleUpdateCount}
              min={1}
              max={10}
            />
          </div>
          <div className={styles.areaRight} style={{color: data.tenant.mainColor}}>{formatter.formatPrice(data.product.price)}</div>
        </div>
        <div className={styles.buttonArea}>
          <Button
            color={data.tenant.mainColor}
            label='Adicionar à sacola'
            onClick={handleAddToCart}
            fill
          />
        </div>
      </div>
    </div>
  )
}

export default Product

type Props = {
  tenant: Tenant,
  product: Product
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { tenant: tenantSlug, id } = context.query
  const api = useApi(tenantSlug as string)

  const tenant = await api.getTenant()
  if(!tenant) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const product = await api.getProduct(id as string)

  return {
    props: {
      tenant,
      product
    }
  }
}