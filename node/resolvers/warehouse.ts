export const queries = {
  listAllWarehouses: (_: any, __: any, { clients: { warehouse } }: Context) => warehouse.listAllWarehouses()
}

export const mutations = {
  createWarehouse: async (_: any, __: any, { clients: { warehouse } }: Context) => {
    return warehouse.createWarehouse()
  }
}