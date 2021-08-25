export const CREATE_PROMOTION_OBJECT = {
  idCalculatorConfiguration: "",
  skusGift: {
    quantitySelectable: 1
  },
  name: "Free delivery",
  beginDateUtc: "",
  endDateUtc: "",
  daysAgoOfPurchases: 0,
  isActive: true,
  isFeatured: false,
  offset: 3,
  newOffset: 3,
  cumulative: true,
  nominalShippingDiscountValue: 0,
  absoluteShippingDiscountValue: 0,
  nominalDiscountValue: 0,
  maximumUnitPriceDiscount: 0,
  percentualDiscountValue: 0,
  percentualShippingDiscountValue: 100,
  percentualTax: 0,
  shippingPercentualTax: 0,
  percentualDiscountValueList1: 0,
  percentualDiscountValueList2: 0,
  nominalRewardValue: 0,
  percentualRewardValue: 0,
  orderStatusRewardValue: "invoiced",
  maxNumberOfAffectedItems: 0,
  origin: "Marketplace",
  idSellerIsInclusive: true,
  categoriesAreInclusive: true,
  brandsAreInclusive: true,
  productsAreInclusive: true,
  minimumQuantityBuyTogether: 0,
  quantityToAffectBuyTogether: 0,
  enableBuyTogetherPerSku: false,
  totalValueFloor: 0,
  totalValueCeling: 0,
  totalValueMode: "IncludeMatchedItems",
  collectionsIsInclusive: true,
  totalValuePurchase: 0,
  isSlaSelected: false,
  isFirstBuy: false,
  firstBuyIsProfileOptimistic: true,
  compareListPriceAndPrice: false,
  isDifferentListPriceAndPrice: false,
  itemMaxPrice: 0,
  itemMinPrice: 0,
  isMinMaxInstallments: false,
  minInstallment: 0,
  maxInstallment: 0,
  maxUsage: 0,
  maxUsagePerClient: 0,
  multipleUsePerClient: false,
  type: "regular"
}

export const CREATE_DOCK_OBJECT = {
   pickupStoreInfo: {
     isPickupStore: false,
     storeId: null,
     friendlyName: null,
     address: null,
     additionalInfo: null,
     dockId: null,
     distance: null,
     businessHours: null,
     pickupHolidays: null,
     sellerId: null,
     isThirdPartyPickup: false
  },
   storeId: null,
   pickupInStoreInfo: {
     isActice: false,
     additionalInfo: null
  },
   deliveryFromStoreInfo: {
     isActice: false,
     deliveryRadius: 0.0,
     deliveryFee: 0.0,
     deliveryTime: "00:00:00",
     maximumWeight: 0.0
  },
   address: null,
   location: null,
   id: "1",
   name: "Standard",
   priority: 0,
   dockTimeFake: "1.00:00:00",
   timeFakeOverhead: "00:00:00",
   salesChannels: [
      "1"
  ],
   freightTableIds: [
      "1"
  ],
   wmsEndPoint: "",
   isActive: true
}

export const CREATE_WAREHOUSE_OBJECT = {
   id: "1",
   name: "Standard",
   warehouseDocks: [
      {
           dockId: "1",
           time: "1.00:00:00",
           cost: 0.0
      }
  ],
   pickupPointIds: [],
   priority: 0,
   isActive: true
}