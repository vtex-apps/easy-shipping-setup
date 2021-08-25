import { 
  InstanceOptions, 
  IOContext, 
  JanusClient, 
  RequestConfig 
} from '@vtex/api'
import { pipe } from 'ramda'
import { statusToError } from '../utils'
import { CREATE_DOCK_OBJECT } from '../utils/constants'

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

export default class Docks extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, options && pipe(withCookieAsHeader(context))(options))
  }

  public async listAllDocks(): Promise<string> {
    return this.get(this.routes.docks)
  }

  public createDock = (): Promise<string> => {
    const defaultDock = CREATE_DOCK_OBJECT
    return this.post(this.routes.createDock, defaultDock)
  }

  public activateDock = (dockId: string): Promise<string> => {
    return this.post(this.routes.activateDock(dockId))
  }

  protected get = <T>(url: string, config?: RequestConfig) =>
    this.http.get<T>(url, config).catch(statusToError) as Promise<T>

  protected post = <T>(url: string, data?: any, config?: RequestConfig) =>
    this.http.post<T>(url, data, config).catch<any>(statusToError)

  private get routes() {
    const basePVT = '/api/logistics'

    return {
      docks: `${basePVT}/pvt/configuration/docks`,
      createDock: `${basePVT}/pvt/configuration/docks`,
      activateDock: (dockId: string) => `${basePVT}/pvt/configuration/docks/${dockId}/activation`
    }
  }
}