export const queries = {
  listPromotionById: (_: any, { promotionId }: any, { clients: { promotion } }: Context) => promotion.listPromotionById(promotionId),
  listAllPromotions: (_: any, __: any, { clients: { promotion } }: Context) => promotion.listAllPromotions()
}

export const mutations = {
  createOrUpdatePromotion: async (_: any, args: any, { clients: { promotion } }: Context) => {
    return promotion.createOrUpdatePromotion(
      args.newTotalValueFloor,
      args.promotionId,
      args.beginDateUtc,
      args.endDateUtc,
      args.isActive
    )
  }
}