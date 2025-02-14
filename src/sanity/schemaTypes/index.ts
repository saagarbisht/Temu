import { type SchemaTypeDefinition } from 'sanity'
import { productCategory } from './schemas/product-category'
import { product } from './schemas/product'
import { promotionCampaign } from './schemas/promotion-campaign'
import { promotionCode } from './schemas/promotion-codes'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    productCategory,
    product,
    promotionCampaign,
    promotionCode,
  ],
}
