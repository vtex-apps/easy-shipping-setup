import React, { FC, useEffect, useState } from 'react'
import { useQuery, useLazyQuery, useMutation } from 'react-apollo'
import { useIntl } from 'react-intl'

import GET_SHIPPING_POLICIES from './graphql/shipping.graphql'
import GET_WAREHOUSES from './graphql/warehouse.graphql'
import GET_DOCKS from './graphql/dock.graphql'
import GET_SHIPPING_RATES from './graphql/freight.graphql'
import GET_PROMOTIONS from './graphql/allPromotions.graphql'
import GET_PROMOTION_BY_ID from './graphql/promotion.graphql'
import UPDATE_SHIPPING_RATE from './graphql/updateShippingRate.graphql'
import UPDATE_SHIPPING_POLICY from './graphql/updateShippingPolicy.graphql'
import CREATE_OR_UPDATE_PROMOTION from './graphql/createOrUpdatePromotion.graphql'
import CREATE_DOCK from './graphql/createDock.graphql'
import CREATE_WAREHOUSE from './graphql/createWarehouse.graphql'
import UPDATE_ONBOARDING from './graphql/updateOnboarding.graphql'

import { 
  Layout, 
  PageBlock, 
  PageHeader,
  ToastProvider,
  ToastConsumer,
  Input,
  Divider,
  Toggle,
  Button,
  Spinner
} from 'vtex.styleguide'

interface ShippingRateInput {
  carrierId: string
  searchZipCode: string
  input: [ShippingRateInputData]
}

interface ShippingRateInputData {
  zipCodeStart: string
  zipCodeEnd: string
  weightStart: number
  weightEnd: number
  absoluteMoneyCost: string
  pricePercent: number
  pricePercentByWeight: number
  maxVolume: number
  timeCost: string
  timeCostToDisplay: string
  country: string
  operationType: number
  polygon: string
  minimumValueInsurance: number
}

interface ShippingPolicyInput {
  id: String
  name: String
  shippingMethod: String
  isSaturdayActive: Boolean
  isSundayActive: Boolean
  isHolidayActive: Boolean
  largestMeasure: Number
  maxMeasureSum: Number
  isActive: Boolean
}

const DeliverySettings: FC = () => {

  const intl = useIntl()

  const [idCalculatorConfiguration, setIdCalculatorConfiguration] = useState("")
  const [shippingRate, setShippingRate] = useState<ShippingRateInput>({
    carrierId: "1",
    searchZipCode: "0",
    input: [{} as ShippingRateInputData]
  })

  const [shippingPolicy, setShippingPolicy] = useState<ShippingPolicyInput>({} as ShippingPolicyInput)
  const [promotion, setPromotion] = useState({} as any)
  const [isActive, setIsActive] = useState(false)
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const [updateShippingRate] = useMutation(UPDATE_SHIPPING_RATE, {
    refetchQueries: [
      { query: GET_SHIPPING_RATES, variables: {carrierId: shippingRate.carrierId, zipCode: "0"} }
    ]
  })

  const [createDock] = useMutation(CREATE_DOCK, {
    refetchQueries: [
      { query: GET_DOCKS }
    ]
  })
  
  const [createWarehouse] = useMutation(CREATE_WAREHOUSE, {
    refetchQueries: [
      { query: GET_WAREHOUSES }
    ]
  })

  const [updateShippingPolicy] = useMutation(UPDATE_SHIPPING_POLICY, {
    refetchQueries: [
      { query: GET_SHIPPING_POLICIES }
    ]
  })

  const [createOrUpdatePromotion] = useMutation(CREATE_OR_UPDATE_PROMOTION, {
    refetchQueries: [
      { query: GET_PROMOTIONS } 
    ]
  })

  const [updateOnboarding] = useMutation(UPDATE_ONBOARDING)

  const { data: warehouseData, loading: warehouseLoading} = useQuery(GET_WAREHOUSES, { ssr: false })
  const { data: dockData, loading: dockLoading} = useQuery(GET_DOCKS, { ssr: false })
  const { data: shippingPolicyData, error, loading: shippingPolicyLoading } = useQuery(GET_SHIPPING_POLICIES, { ssr: false })
  const { data: allPromotionsData, loading: allPromotionsLoading } = useQuery(GET_PROMOTIONS, { ssr: false })

  const [getShippingRates, { data: shippingRateData, loading: shippingRateLoading }] = useLazyQuery(GET_SHIPPING_RATES)
  const [getPromotionData, { data: promotionData, loading: promotionLoading }] = useLazyQuery(GET_PROMOTION_BY_ID)

  useEffect(() => {
    if (!dockLoading && dockData.listAllDocks.length === 0) {
      createDock().then((result) => {
        if (result.data?.createDock === true) {
          if (!warehouseLoading && warehouseData?.listAllWarehouses?.length === 0) createWarehouse()
        }
      })
    }
   
  }, [warehouseData, dockData])

  useEffect(() => {
    if (
      !shippingRateLoading && 
      !allPromotionsLoading && 
      !shippingRateLoading && 
      !promotionLoading && 
      !dockLoading && 
      !warehouseLoading
    ) setIsLoading(false)
  }, [shippingPolicyLoading, allPromotionsLoading, shippingRateLoading, promotionLoading, warehouseLoading, dockLoading])

  let filteredPromotion: any = []
  useEffect(() => {
    if (allPromotionsData?.listAllPromotions?.items?.length) {
      filteredPromotion = allPromotionsData.listAllPromotions.items.filter((item: any) => item.name === "Free delivery")
      setIdCalculatorConfiguration(filteredPromotion[0].idCalculatorConfiguration)
    }
  }, [allPromotionsData])

  useEffect(() => {
    if (idCalculatorConfiguration.length === 0) return

    getPromotionData({
      variables: {
        promotionId: idCalculatorConfiguration
      }
    })
  }, [idCalculatorConfiguration])

  useEffect(() => {
    if (!shippingPolicyData?.listAllShippingPolicies?.items.length || error) return

    let policy = shippingPolicyData.listAllShippingPolicies.items[0]

    setShippingPolicy({
      id: policy.id,
      name: policy.name !== 'Standard' ? 'Standard' : policy.name,
      shippingMethod: policy.shippingMethod !== 'Standard' ? 'Standard' : policy.shippingMethod,
      isSaturdayActive: policy.weekendAndHolidays.saturday,
      isSundayActive: policy.weekendAndHolidays.sunday,
      isHolidayActive: policy.weekendAndHolidays.holiday,
      largestMeasure: policy.maxDimension.largestMeasure,
      maxMeasureSum: policy.maxDimension.maxMeasureSum,
      isActive: policy.isActive
    })

    getShippingRates({
      variables: {
        carrierId: policy.id,
        zipCode: "0"
      }
    })
  }, [shippingPolicyData])

  useEffect(() => {
    if (!shippingRateData) return

    setShippingRate({
      carrierId: shippingPolicyData.listAllShippingPolicies.items[0].id,
      searchZipCode: "0",
      input: shippingRateData.listShippingRate.map((rate: ShippingRateInputData) => ({
        zipCodeStart: rate.zipCodeStart,
        zipCodeEnd: rate.zipCodeEnd,
        weightStart: rate.weightStart,
        weightEnd: rate.weightEnd,
        absoluteMoneyCost: rate.absoluteMoneyCost,
        pricePercent: rate.pricePercent,
        pricePercentByWeight: rate.pricePercentByWeight,
        maxVolume: rate.maxVolume,
        timeCost: rate.timeCost,
        timeCostToDisplay: rate.timeCost.split(".")[0],
        country: rate.country,
        operationType: 2,
        polygon: rate.polygon,
        minimumValueInsurance: rate.minimumValueInsurance
      }))
    })
  }, [shippingRateData])

  useEffect(() => {
    if (!promotionData) return

    setPromotion(promotionData)
    setIsActive(promotionData.listPromotionById.isActive)
    setFreeDeliveryThreshold(promotionData.listPromotionById.totalValueFloor)

  }, [promotionData])

  const handleChangeRate = (e: any) => {
    shippingRate.input[0].absoluteMoneyCost = e.target.value
    setShippingRate({
      ...shippingRate,
      input: shippingRate.input
    })
  }

  const handleChangeDelivery = (e: any) => {
    shippingRate.input[0].timeCost = e.target.value.length <= 4 ? e.target.value + ".00:00:00" : e.target.value
    shippingRate.input[0].timeCostToDisplay = e.target.value
    setShippingRate({
      ...shippingRate,
      input: shippingRate.input
    })
  }

  const handlePromotionChange = (e: any) => {
    const threshold = Number(e.target.value)
    setFreeDeliveryThreshold(threshold)
  }

  const handleToggleChange = () => {
    setIsActive(!isActive)
  }

  const handleSubmit = async (showToast: any) => {

    if (freeDeliveryThreshold !== 0) {
      handlePromotionSubmit()
    }

    await updateShippingRate({variables: {
      ...shippingRate
    }})

    await updateOnboarding({
      variables: {
        shippingCharge: parseFloat(shippingRate.input[0].absoluteMoneyCost),
        freeDeliveryThreshold: freeDeliveryThreshold !== 0 && isActive ? freeDeliveryThreshold.toString() : ""
      }
    })

    await updateShippingPolicy({variables: {
      ...shippingPolicy
    }}).catch(err => {
      console.error(err)
      showToast({
        message: intl.formatMessage({
          id: 'admin/shipping-policy.toast.failure',
        }),
        duration: 5000,
      })
    })
    .then(() => {
      showToast({
        message: intl.formatMessage({
          id: 'admin/shipping-policy.toast.success',
        }),
        duration: 5000,
      })
    })
  }

  const handlePromotionSubmit = () => {
    createOrUpdatePromotion({
      variables: {
        newTotalValueFloor: freeDeliveryThreshold,
        promotionId: idCalculatorConfiguration,
        beginDateUtc: promotion?.listPromotionById?.beginDateUtc,
        endDateUtc: promotion?.listPromotionById?.endDateUtc,
        isActive: isActive
      }
    })
  }

  return (
    <ToastProvider>
      <Layout
        pageHeader={
          <PageHeader title={intl.formatMessage({id: 'admin/delivery-settings.navigation.label'})} />
        }>
        <PageBlock variation="full">
          {isLoading 
          ? <div style={{height: "500px", display: "flex", justifyContent: "center", alignItems: "center"}}><Spinner /></div> 
          : <div>
              <div className={`flex justify-between`}>
                {Object.keys(shippingRate.input[0]).length !== 0 && 
                  <div className={`w-20`}>
                    <div className={`mb4`}>
                      <Input 
                        value={shippingRate.input[0].absoluteMoneyCost}
                        onChange={(e: any) => handleChangeRate(e)}
                        label={intl.formatMessage({ id: 'admin/shipping-rate.delivery-cost' })}
                      />
                    </div>
                    <div className={`mb4`}>
                      <Input 
                        value={shippingRate.input[0].timeCostToDisplay}
                        onChange={(e: any) => handleChangeDelivery(e)}
                        label={intl.formatMessage({ id: 'admin/shipping-rate.delivery-time' })}
                      />
                    </div>
                  </div>
                }

                  <div style={{borderRadius: "8px", backgroundColor: "#f3f4f6"}} className={`w-40`}>
                    <div style={{lineHeight: 2}} className={`pa7`}>
                      <div>{intl.formatMessage({ id: 'admin/shipping-policy.name' })} <strong>{shippingPolicy.name}</strong></div>
                      <div>{intl.formatMessage({ id: 'admin/dock.name' })} <strong>{dockData.listAllDocks.length !== 0 ? dockData.listAllDocks[0].name : ""}</strong></div>
                      <div>{intl.formatMessage({ id: 'admin/warehouse.name' })} <strong>{warehouseData.listAllWarehouses.length !== 0 ? warehouseData.listAllWarehouses[0].name : ""}</strong></div>
                    </div>
                  </div>
              </div>
              <div className="mv6">
                <Divider orientation="horizontal" />
              </div>
              {Object.keys(shippingPolicy).length !== 0 && 
                <div>
                  <div style={{fontWeight: "bold"}} className={`flex mb6`}>
                    {intl.formatMessage({id: 'admin/shipping-policy.title'})}
                  </div>
                  <div className={`flex mb4`}>
                    <Toggle 
                      label={intl.formatMessage({id: 'admin/shipping-policy.label.holiday'})}
                      checked={shippingPolicy.isHolidayActive}
                      onChange={() => {
                        setShippingPolicy({
                          ...shippingPolicy,
                          isHolidayActive: !shippingPolicy.isHolidayActive
                        })
                      }}
                    />
                  </div>
                  <div className={`flex mb4`}>
                    <Toggle 
                      label={intl.formatMessage({id: 'admin/shipping-policy.label.saturday'})}
                      checked={shippingPolicy.isSaturdayActive}
                      onChange={() => {
                        setShippingPolicy({
                          ...shippingPolicy,
                          isSaturdayActive: !shippingPolicy.isSaturdayActive
                        })
                      }}
                    />
                  </div>
                  <div className={`flex mb4`}>
                    <Toggle 
                      label={intl.formatMessage({id: 'admin/shipping-policy.label.sunday'})}
                      checked={shippingPolicy.isSundayActive}
                      onChange={() => {
                        setShippingPolicy({
                          ...shippingPolicy,
                          isSundayActive: !shippingPolicy.isSundayActive
                        })
                      }}
                    />
                  </div>
                </div>
              }
              <div className="mv6">
                <Divider orientation="horizontal" />
              </div>
              <div className={`flex mb6`}>
                <Toggle 
                  label={intl.formatMessage({id: 'admin/promotion.label.isActive'})}
                  checked={isActive}
                  onChange={() => handleToggleChange()}
                />
              </div>
              {isActive && <div className={`w-40`}>
                <Input 
                  value={freeDeliveryThreshold}
                  label={intl.formatMessage({id: 'admin/promotion.label.free-delivery-threshold'})}
                  onChange={(e: any) => handlePromotionChange(e)}
                />
              </div>}
              <ToastConsumer>
                {({ showToast }: { showToast: any }) => (
                <div className={`pt6`}>
                  <Button
                    variation={"primary"}
                    onClick={() => handleSubmit(showToast)}
                  > 
                    {intl.formatMessage({id: 'admin/shipping-policy.button.update'})}
                  </Button>
                </div>
                )}
              </ToastConsumer>
            </div>
          }
        </PageBlock>
      </Layout>
    </ToastProvider>
  )
}

export default DeliverySettings