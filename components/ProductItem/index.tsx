import Link from 'next/link'
import { useAppContext } from '../../contexts/app'
import { useFormatter } from '../../libs/useFormatter'
import { Product } from '../../types/Product'
import styles from './styles.module.css'

type Props = {
  data: Product
}

export const ProductItem = ({ data }: Props) => {
  const { tenant } = useAppContext()
  const formatter = useFormatter()

  return (
    <Link href={`/${tenant?.slug}/product/${data.id}`} >
      <a className={styles.container}>
        <div className={styles.bg} style={{backgroundColor: tenant?.secondaryColor}} ></div>
        <div className={styles.info}>
          <div className={styles.img} >
            <img src={data.image} />
          </div>
          <div className={styles.category}>{data.category}</div>
          <div className={styles.title}>{data.name}</div>
          <div className={styles.price} style={{color: tenant?.mainColor}}>{formatter.formatPrice(data.price)}</div>
        </div>
      </a>
    </Link>
  )
}