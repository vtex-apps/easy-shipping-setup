import { IOClients } from '@vtex/api'

import ShippingPolicies from './shipping'
import Warehouses from './warehouse'
import Docks from './dock'
import ShippingRates from './freight'
import Promotions from './promotion'
import Onboarding from './onboarding'

export class Clients extends IOClients {
  
  public get shippingPolicy() {
    return this.getOrSet('shippingPolicy', ShippingPolicies)
  }
  
  public get warehouse() {
    return this.getOrSet('warehouse', Warehouses)
  }

  public get dock() {
    return this.getOrSet('dock', Docks)
  }

  public get shippingRate() {
    return this.getOrSet('shippingRate', ShippingRates)
  }

  public get promotion() {
    return this.getOrSet('promotion', Promotions)
  }

  public get onboarding() {
    return this.getOrSet('onboarding', Onboarding)
  }
}