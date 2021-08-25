import { 
  InstanceOptions, 
  IOContext, 
  JanusClient, 
  RequestConfig 
} from '@vtex/api'
import { pipe } from 'ramda'
import { statusToError } from '../utils'
import { CREATE_WAREHOUSE_OBJECT } from '../utils/constants'

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

export default class Warehouses extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, options && pipe(withCookieAsHeader(context))(options))
  }

  public async listAllWarehouses(): Promise<string> {
    return this.get(this.routes.warehouses)
  }

  public createWarehouse = (): Promise<string> => {
    const defaultWarehouse = CREATE_WAREHOUSE_OBJECT
    return this.post(this.routes.createWarehouse, defaultWarehouse)
  }

  protected get = <T>(url: string, config?: RequestConfig) =>
    this.http.get<T>(url, config).catch(statusToError) as Promise<T>

  protected post = <T>(url: string, data?: any, config?: RequestConfig) =>
    this.http.post<T>(url, data, config).catch<any>(statusToError)

  private get routes() {
    const basePVT = '/api/logistics'

    return {
      warehouses: `${basePVT}/pvt/configuration/warehouses`,
      createWarehouse: `${basePVT}/pvt/configuration/warehouses` 
    }
  }
}