import { ProductItem } from '../../components/ProductItem'
import { SearchInput } from '../../components/SearchInput'
import NoItemsIcon from '../../public/assets/noitems.svg'
import { useAuthContext } from '../../contexts/auth'
import { Sidebar } from '../../components/Sidebar'
import { useAppContext } from '../../contexts/app'
import styles from '../../styles/Home.module.css'
import { Banner } from '../../components/Banner'
import { Product } from '../../types/Product'
import { Tenant } from '../../types/Tenant'
import { useEffect, useState } from 'react'
import { useApi } from '../../libs/useApi'
import { GetServerSideProps } from 'next'
import { getCookie } from 'cookies-next'
import { User } from '../../types/user'
import Head from 'next/head'

const Home = (data: Props) => {
  const { tenant, setTenant } = useAppContext()
  const { setToken, setUser } = useAuthContext()

  useEffect(() => {
    setTenant(data.tenant)
    setToken(data.token)
    if(data.user) {
      setUser(data.user)
    }
  }, [])

  const [products, setProducts] = useState<Product[]>(data.products)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Search
  const [searchText, setSearchText] = useState('')
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const handleSearch = (searchValue: string) => {
    setSearchText(searchValue)
  }

  useEffect(() => {
    let newFilteredProducts: Product[] = []
    for(let product of data.products) {
      if(product.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
        newFilteredProducts.push(product)
      }
    }
    setFilteredProducts(newFilteredProducts)
  }, [searchText])

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

      {!searchText &&
        <>
          <Banner/>
          <div className={styles.grid}>
            {products.map((item, index) => (
              <ProductItem
                data={item}
                key={index}
              />
            ))}
          </div>
        </>
      }
      {searchText &&
        <>
          <div className={styles.searchText}>
            Procurando por: <strong>{searchText}</strong>
          </div>
          {filteredProducts.length > 0 &&
            <div className={styles.grid}>
              {filteredProducts.map((item, index) => (
                <ProductItem
                  data={item}
                  key={index}
                />
              ))}
            </div>
          }

          {filteredProducts.length === 0 &&
            <div className={styles.noProducts}>
                <NoItemsIcon color="#E0E0E0" />
              <div className={styles.noProductsText}>Ops! Não há itens com este nome</div>
            </div>
          }
        </>
      }

    </div>
  )
}

export default Home

type Props = {
  tenant: Tenant
  products: Product[]
  token: string
  user: User | null
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
  const token = getCookie('token', context) ?? ""
  const user = await api.authorizeToken(token as string)

  // Get Products

  const products = await api.getAllProducts()

  return {
    props: {
      tenant,
      products,
      user,
      token
    }
  }
}