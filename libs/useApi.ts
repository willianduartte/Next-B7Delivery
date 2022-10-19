import { Product } from '../types/Product'
import { Tenant } from '../types/Tenant'

const oneProduct: Product = {
  id: 1,
  image: '/tmp/Burger.png',
  category: 'Tradicional',
  price: 25.5,
  name: 'Texas Burger',
  description:
    '2 Blends de carne de 150g, Queijo Cheddar, Bacon Caramelizado, Salada, Molho da casa, Pão brioche artesanal,'
}

export const useApi = (tenantSlug: string) => ({
  getTenant: async (): Promise<boolean | Tenant> => {
    switch (tenantSlug) {
      case 'b7burger':
        return {
          slug: 'b7burger',
          name: 'B7Burger',
          mainColor: '#FB9400',
          secondaryColor: '#FFF9F2'
        }
        break
      case 'b7pizza':
        return {
          slug: 'b7pizza',
          name: 'B7Pizza',
          mainColor: '#6AB70A',
          secondaryColor: '#E0E0E0'
        }
        break
      default:
        return false
    }
  },
  getAllProducts: async () => {
    let products = []
    for (let q = 0; q < 10; q++) {
      products.push(oneProduct)
    }
    return products
  },
  getProduct: async (id: string) => {
    return oneProduct
  }
})
