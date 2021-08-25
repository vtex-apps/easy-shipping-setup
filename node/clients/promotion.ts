import {
  InstanceOptions,
  IOContext,
  JanusClient,
  RequestConfig
} from '@vtex/api'
import { pipe } from 'ramda'
import { statusToError } from '../utils'
import { CREATE_PROMOTION_OBJECT } from '../utils/constants'

const TWO_SECONDS = 2 * 1000

const withCookieAsHeader =
  (context: IOContext) =>
    (options: InstanceOptions): InstanceOptions => ({
      ...options,
      headers: {
        Accept: 'application/vnd.vtex.pricing.v3+json',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
        'X-Vtex-Use-Https': 'true',
        VtexIdclientAutCookie: context.adminUserAuthToken ?? '',
        ...(options?.headers ?? {}),
      },
      timeout: TWO_SECONDS
    })

export default class Promotions extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, options && pipe(withCookieAsHeader(context))(options))
  }

  public async listPromotionById(promotionId: string): Promise<string> {
    return this.get(this.routes.promotionById(promotionId))
  }

  public async listAllPromotions(): Promise<string> {
    return this.get(this.routes.allPromotions)
  }

  public createOrUpdatePromotion = (
    newTotalValueFloor: number,
    promotionId: string,
    beginDateUtc: string,
    endDateUtc: string,
    isActive: boolean
  ): Promise<string> => {
    const defaultPromotion = CREATE_PROMOTION_OBJECT
    defaultPromotion.totalValueFloor = newTotalValueFloor
    defaultPromotion.idCalculatorConfiguration = promotionId
    defaultPromotion.beginDateUtc = beginDateUtc
    defaultPromotion.endDateUtc = endDateUtc
    defaultPromotion.isActive = isActive

    if (!promotionId.length) {
      var date = new Date()
      defaultPromotion.beginDateUtc = date.toISOString()

      date.setFullYear(date.getFullYear() + 3)
      defaultPromotion.endDateUtc = date.toISOString()
    }

    return this.post(this.routes.createOrUpdatePromotion, defaultPromotion)
  }

  protected get = <T>(url: string, config?: RequestConfig) =>
    this.http.get<T>(url, config).catch(statusToError) as Promise<T>

  protected post = <T>(url: string, data?: any, config?: RequestConfig) =>
    this.http.post<T>(url, data, config).catch<any>(statusToError)

  private get routes() {
    const basePVT = '/api/rnb'

    return {
      promotionById: (promotionId: string) => `${basePVT}/pvt/calculatorconfiguration/${promotionId}`,
      allPromotions: `${basePVT}/pvt/benefits/calculatorconfiguration`,
      createOrUpdatePromotion: `${basePVT}/pvt/calculatorconfiguration`
    }
  }
}