import { CartItem } from '../types/CartItem'
import { Product } from '../types/Product'
import { Tenant } from '../types/Tenant'
import { User } from '../types/user'

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
      products.push({
        ...oneProduct,
        id: q + 1
      })
    }
    return products
  },
  getProduct: async (id: number) => {
    return { ...oneProduct, id }
  },
  authorizeToken: async (token: string): Promise<User | false> => {
    if (!token) return false
    return {
      name: 'Willian',
      email: 'willianduartedesouza04@gmail.com'
    }
  },
  getCartProducts: async (cartCookie: string) => {
    let cart: CartItem[] = []
    if (!cartCookie) return cart

    const cartJson = JSON.parse(cartCookie)
    for (let i in cartJson) {
      if (cartJson[i].id && cartJson[i].qt) {
        const product = {
          ...oneProduct,
          id: cartJson[i].id
        }
        cart.push({
          qt: cartJson[i].qt,
          product
        })
      }
    }

    return cart
  }
})
