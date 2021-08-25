export const queries = {
  listAllShippingPolicies: (_: any, __: any, { clients: { shippingPolicy } }: Context) => shippingPolicy.listAllShippingPolicies()
}

export const mutations = {
  updateShippingPolicy: async (_: any, args: any, { clients: { shippingPolicy } }: Context) => {
    const data = {
      name: args.input.name,
      shippingMethod: args.input.shippingMethod,
      weekendAndHolidays: {
        saturday: args.input.isSaturdayActive,
        sunday: args.input.isSundayActive,
        holiday: args.input.isHolidayActive
      },
      maxDimension: {
        largestMeasure: args.input.largestMeasure,
        maxMeasureSum: args.input.maxMeasureSum
      },
      isActive: args.input.isActive
    }

    return shippingPolicy.updateShippingPolicy(args.input.id, data)
  }
}