export const useFormatter = () => ({
  formatPrice: (price: number) => {
    return price.toLocaleString('pt-br', {
      maximumFractionDigits: 2,
      style: 'currency',
      currency: 'BRL'
    })
  },
  formatQuantity: (qt: number, minDigits: number) => {
    if (qt.toLocaleString().length >= minDigits) return qt
    const remain = minDigits - qt.toString().length
    return `${'0'.repeat(remain)}${qt}`
  }
})
