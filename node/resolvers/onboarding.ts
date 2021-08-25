export const mutations = {
  updateOnboarding: async (_: any, { freeDeliveryThreshold, shippingCharge }: any, { clients: { onboarding } }: Context) => {
    const result: any = await onboarding.getOnboarding()

    let data: any = {}
    data.connectedSellerObject = result.connectedSellerObject
    data.connectedSellerObject.shippingCharge = shippingCharge
    data.connectedSellerObject.freeDeliveryThreshold = freeDeliveryThreshold

    return await onboarding.updateOnboarding(data)
  }
}