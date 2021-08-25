export const queries = {
  listAllDocks: (_: any, __: any, { clients: { dock } }: Context) => dock.listAllDocks()
}

export const mutations = {
  createDock: async (_: any, __: any, { clients: { dock } }: Context) => {
    return dock.createDock()
  }
}