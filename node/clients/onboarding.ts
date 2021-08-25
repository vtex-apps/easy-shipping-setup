import { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalAppClient } from "./ExternalAppClient";

export default class Onboarding extends ExternalAppClient {

  constructor(context: IOContext, options?: InstanceOptions) {
    super('vtex.onboarding-seller@0.x', context, options);
  }

  public async getOnboarding(): Promise<string> {
    return this.http.get(`/elefant/master/_v/onboarding-seller/seller`)
  }

  public async updateOnboarding(data: any): Promise<string> {
    return this.http.patch(`/elefant/master/_v/onboarding-seller/seller`, data)
  }
}