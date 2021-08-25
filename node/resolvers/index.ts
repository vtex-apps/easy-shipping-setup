import { 
  queries as shippingQueries,
  mutations as shippingMutations
} from './shipping'
import { 
  queries as warehouseQueries,
  mutations as warehouseMutations
 } from './warehouse'
import { 
  queries as dockQueries,
  mutations as dockMutations
} from './dock'
import { 
  queries as freightQueries,
  mutations as freightMutations
} from './freight'
import { 
  queries as promotionQueries,
  mutations as promotionMutations
} from './promotion'
import {
  mutations as onboardingMutations
} from './onboarding'

export const resolvers = {
  Query: {
    ...shippingQueries,
    ...warehouseQueries,
    ...dockQueries,
    ...freightQueries,
    ...promotionQueries
  },
  Mutation: {
    ...shippingMutations,
    ...freightMutations,
    ...promotionMutations,
    ...warehouseMutations,
    ...dockMutations,
    ...onboardingMutations
  }
}