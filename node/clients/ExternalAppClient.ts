import { AuthType, InstanceOptions, IOClient, IOContext } from '@vtex/api'
​
const useHttps = !process.env.VTEX_IO
​
/**
 * Used to perform calls on private routes in another account
 * Custom implementation of the AppClient: https://github.com/vtex/node-vtex-api/blob/master/src/clients/apps/AppClient.ts
 */
export class ExternalAppClient extends IOClient {
  constructor(app: string, context: IOContext, options?: InstanceOptions) {
    const [appName, appVersion] = app.split('@')
    const [vendor, name] = appName.split('.') // vtex.messages
    const protocol = useHttps ? 'https' : 'http'
​
    let baseURL: string
    if (appVersion) {
      const [major] = appVersion.split('.')
      baseURL = formatPrivateRoute({ vendor, name, major, protocol })
    } else {
      throw new Error(`Using old routing for ${app}. Please change vendor.app to vendor.app@major in client ${(options && options.name) || ''}`)
    }
​
    super(
      context,
      {
        ...options,
        authType: AuthType.bearer,
        baseURL,
        name,
      }
    )
  }
}
​
interface PrivateRouteInfo {
  protocol?: 'http' | 'https'
  vendor: string,
  name: string,
  major: string | number,
}
​
export const formatPrivateRoute = ({ protocol = 'https', vendor, name, major }: PrivateRouteInfo) =>
  `${protocol}://app.io.vtex.com/${vendor}.${name}/v${major}`
​