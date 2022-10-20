import styles from '../../styles/ForgetSuccess.module.css'
import { useApi } from '../../libs/useApi'
import { GetServerSideProps } from 'next'
import { Tenant } from '../../types/Tenant'
import { useAppContext } from '../../contexts/app'
import { useEffect } from 'react'
import Head from 'next/head'
import { Header } from '../../components/Header'
import { Button } from '../../components/Button'
import { useRouter } from 'next/router'
import { Icon } from '../../components/Icon'

const ForgetSuccess = (data: Props) => {
  const { tenant, setTenant } = useAppContext()

  useEffect(() => {
    setTenant(data.tenant)
  }, [])

  const router = useRouter()

  const handleSubmit = () => {
    router.push(`/${data.tenant.slug}/login`)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Esqueci a Senha | {data.tenant.name}</title>
      </Head>

      <Header
        color={data.tenant.mainColor}
        backHref={`/${data.tenant.slug}/forget`}
      />

      <div className={styles.iconArea}>
        <Icon icon='mailSent' color={data.tenant.mainColor} height={99} width={81}/>
      </div>

      <div className={styles.title}>Verifique seu e-mail</div>

      <div 
        className={styles.subtitle}
      >Enviamos as instruções para recuperação de senha para o seu e-mail.</div>

      <div className={styles.formArea}>
        <div className={styles.inputArea}>
          <Button
            color={data.tenant.mainColor}
            label="Fazer Login"
            onClick={handleSubmit}
            fill
          />
        </div>
      </div>
    </div>
  )
}

export default ForgetSuccess

type Props = {
  tenant: Tenant
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

  return {
    props: {
      tenant
    }
  }
}