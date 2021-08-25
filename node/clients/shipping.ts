import {
  InstanceOptions,
  IOContext,
  JanusClient,
  RequestConfig
} from '@vtex/api'
import { pipe } from 'ramda'
import { statusToError } from '../utils'

const TWO_SECONDS = 2 * 1000

const withCookieAsHeader =
  (context: IOContext) =>
    (options: InstanceOptions): InstanceOptions => ({
      ...options,
      headers: {
        VtexIdclientAutCookie: context.adminUserAuthToken ?? '',
        ...(options?.headers ?? {}),
      },
      timeout: TWO_SECONDS
    })

export default class ShippingPolicies extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, options && pipe(withCookieAsHeader(context))(options))
  }

  public async listAllShippingPolicies(): Promise<string> {
    return this.get(this.routes.shippingPolicies)
  }

  public updateShippingPolicy = (policyId: string, data: any): any => {
    this.put(this.routes.updateShippingPolicy(policyId), data)
  }

  protected get = <T>(url: string, config?: RequestConfig) =>
    this.http.get<T>(url, config).catch(statusToError) as Promise<T>

  protected post = <T>(url: string, data?: any, config?: RequestConfig) =>
    this.http.post<T>(url, data, config).catch<any>(statusToError)

  protected put = <T>(url: string, data?: any, config?: RequestConfig) =>
    this.http.put<T>(url, data, config).catch<any>(statusToError)


  private get routes() {
    const basePVT = '/api/logistics'

    return {
      shippingPolicies: `${basePVT}/pvt/shipping-policies?page=1&perPage=100`,
      updateShippingPolicy: (policyId: string) => `${basePVT}/pvt/shipping-policies/${policyId}`
    }
  }
}