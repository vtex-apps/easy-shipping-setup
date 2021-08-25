import { 
  InstanceOptions, 
  IOContext, 
  RequestConfig, 
  JanusClient
} from '@vtex/api'
import { pipe } from 'ramda'
import { statusToError } from '../utils'

const TWO_SECONDS = 2 * 1000

const withCookieAsHeader =
  (context: IOContext) =>
  (options: InstanceOptions): InstanceOptions => ({
    ...options,
    headers: {
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
      VtexIdclientAutcookie: context?.adminUserAuthToken ?? '',
      'X-Vtex-Use-Https': 'true',
      ...(options?.headers ?? {}),
    },
    timeout: TWO_SECONDS
  })

export default class ShippingRates extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, options && pipe(withCookieAsHeader(context))(options))
  }

  public async listShippingRate(carrierId: string, zipCode: string): Promise<string> {
    return this.get(this.routes.shippingRates(carrierId, zipCode))
  }

  public updateShippingRate = (carrierId: string, data: any): any => {
    this.post(this.routes.updateShippingRate(carrierId), data)
  }

  protected get = <T>(url: string, config?: RequestConfig) =>
    this.http.get<T>(url, config).catch(statusToError) as Promise<T>

  protected post = <T>(url: string, data?: any, config?: RequestConfig) =>
    this.http.post<T>(url, data, config).catch<any>(statusToError) as Promise<T>

  private get routes() {
    const basePVT = `/api/logistics`

    return {
      shippingRates: (carrierId: string, zipCode: string) => `${basePVT}/pvt/configuration/freights/${carrierId}/${zipCode}/values`,
      updateShippingRate: (carrierId: string) => `${basePVT}/pvt/configuration/freights/${carrierId}/values/update`
    }
  }
}