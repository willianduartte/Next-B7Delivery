import { ProductItem } from '../../components/ProductItem'
import { SearchInput } from '../../components/SearchInput'
import { useAppContext } from '../../contexts/app'
import styles from '../../styles/Home.module.css'
import { Banner } from '../../components/Banner'
import { Product } from '../../types/Product'
import { Tenant } from '../../types/Tenant'
import { useEffect, useState } from 'react'
import { useApi } from '../../libs/useApi'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { Sidebar } from '../../components/Sidebar'

const Home = (data: Props) => {
  const { tenant, setTenant } = useAppContext()

  useEffect(() => {
    setTenant(data.tenant)
  }, [])

  const [products, setProducts] = useState<Product[]>(data.products)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const handleSearch = (searchValue: string) => {
    console.log(searchValue)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{data.tenant.name}</title>
      </Head>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerTopLeft}>
            <div className={styles.headerTitle}>Seja Bem-Vindo 👋</div>
            <div className={styles.headerSubtitle}>O que deseja pra hoje?</div>
          </div>
          <div className={styles.headerTopRight}>
            <div 
              className={styles.menuButton}
              onClick={() => setSidebarOpen(true)}
            >
              <div className={styles.menuButtonLine} style={{backgroundColor: tenant?.mainColor}} ></div>
              <div className={styles.menuButtonLine} style={{backgroundColor: tenant?.mainColor}} ></div>
              <div className={styles.menuButtonLine} style={{backgroundColor: tenant?.mainColor}} ></div>
            </div>
            <Sidebar 
              tenant={data.tenant}
              open={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>
        <div className={styles.headerBottom}>
            <SearchInput
              onSearch={handleSearch}
            />
        </div>
      </header>

      <Banner/>

      <div className={styles.grid}>
        {products.map((item, index) => (
          <ProductItem
            data={item}
            key={index}
          />
        ))}
      </div>
    </div>
  )
}

export default Home

type Props = {
  tenant: Tenant,
  products: Product[]
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { tenant: tenantSlug } = context.query
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

  const products = await api.getAllProducts()

  return {
    props: {
      tenant,
      products
    }
  }
}