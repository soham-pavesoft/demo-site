import { MedusaContainer } from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createApiKeysWorkflow,
  createCollectionsWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createStoresWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function initial_data_seed({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(
    ModuleRegistrationName.FULFILLMENT
  );

  const countries = ["gb", "de", "dk", "se", "fr", "es", "it"];

  logger.info("Seeding store data...");
  const {
    result: [defaultSalesChannel],
  } = await createSalesChannelsWorkflow(container).run({
    input: {
      salesChannelsData: [
        {
          name: "Default Sales Channel",
          description: "Created by Medusa",
        },
      ],
    },
  });

  const {
    result: [publishableApiKey],
  } = await createApiKeysWorkflow(container).run({
    input: {
      api_keys: [
        {
          title: "Default Publishable API Key",
          type: "publishable",
          created_by: "",
        },
      ],
    },
  });

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel.id],
    },
  });

  const {
    result: [store],
  } = await createStoresWorkflow(container).run({
    input: {
      stores: [
        {
          name: "Default Store",
          supported_currencies: [
            {
              currency_code: "eur",
              is_default: true,
            },
            {
              currency_code: "usd",
              is_default: false,
            },
          ],
          default_sales_channel_id: defaultSalesChannel.id,
        },
      ],
    },
  });

  logger.info("Seeding region data...");
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "Europe",
          currency_code: "eur",
          countries,
          payment_providers: ["pp_system_default"],
        },
      ],
    },
  });
  const region = regionResult[0];
  logger.info("Finished seeding regions.");

  logger.info("Seeding tax regions...");
  await createTaxRegionsWorkflow(container).run({
    input: countries.map((country_code) => ({
      country_code,
      provider_id: "tp_system",
    })),
  });
  logger.info("Finished seeding tax regions.");

  logger.info("Seeding stock location data...");
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "European Warehouse",
          address: {
            city: "Copenhagen",
            country_code: "DK",
            address_1: "",
          },
        },
      ],
    },
  });
  const stockLocation = stockLocationResult[0];

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });

  logger.info("Seeding fulfillment data...");
  // This is created by a migration script in core.
  const { data: shippingProfileResult } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  });
  const shippingProfile = shippingProfileResult[0];

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "European Warehouse delivery",
    type: "shipping",
    service_zones: [
      {
        name: "Europe",
        geo_zones: [
          {
            country_code: "gb",
            type: "country",
          },
          {
            country_code: "de",
            type: "country",
          },
          {
            country_code: "dk",
            type: "country",
          },
          {
            country_code: "se",
            type: "country",
          },
          {
            country_code: "fr",
            type: "country",
          },
          {
            country_code: "es",
            type: "country",
          },
          {
            country_code: "it",
            type: "country",
          },
        ],
      },
    ],
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: fulfillmentSet.id,
    },
  });

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Standard Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "Ship in 2-3 days.",
          code: "standard",
        },
        prices: [
          {
            currency_code: "usd",
            amount: 10,
          },
          {
            currency_code: "eur",
            amount: 10,
          },
          {
            region_id: region.id,
            amount: 10,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
      {
        name: "Express Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express",
          description: "Ship in 24 hours.",
          code: "express",
        },
        prices: [
          {
            currency_code: "usd",
            amount: 10,
          },
          {
            currency_code: "eur",
            amount: 10,
          },
          {
            region_id: region.id,
            amount: 10,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
    ],
  });
  logger.info("Finished seeding fulfillment data.");

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel.id],
    },
  });
  logger.info("Finished seeding stock location data.");

  logger.info("Seeding product data...");

  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        {
          name: "Skin & Beauty",
          handle: "skin-beauty",
          is_active: true,
        },
        {
          name: "Vitality & Energy",
          handle: "vitality-energy",
          is_active: true,
        },
        {
          name: "Longevity & Wellness",
          handle: "longevity-wellness",
          is_active: true,
        },
      ],
    },
  });

  await createProductsWorkflow(container).run({
    input: {
      products: [
        // Skin & Beauty
        {
          title: "Hyaluronic Acid Serum",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Skin & Beauty")!.id,
          ],
          description: "Deep hydration serum for plump, glowing skin.",
          handle: "hyaluronic-acid-serum",
          weight: 100,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ title: "Size", values: ["30ml", "50ml"] }],
          variants: [
            {
              title: "30ml",
              sku: "HA-SERUM-30",
              options: { Size: "30ml" },
              prices: [
                { amount: 2999, currency_code: "eur" },
                { amount: 3499, currency_code: "usd" },
              ],
            },
            {
              title: "50ml",
              sku: "HA-SERUM-50",
              options: { Size: "50ml" },
              prices: [
                { amount: 4499, currency_code: "eur" },
                { amount: 4999, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Retinol Night Cream",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Skin & Beauty")!.id,
          ],
          description: "Advanced retinol for cell renewal and even skin tone.",
          handle: "retinol-night-cream",
          weight: 150,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ title: "Size", values: ["30ml", "50ml"] }],
          variants: [
            {
              title: "30ml",
              sku: "RETINOL-30",
              options: { Size: "30ml" },
              prices: [
                { amount: 3999, currency_code: "eur" },
                { amount: 4499, currency_code: "usd" },
              ],
            },
            {
              title: "50ml",
              sku: "RETINOL-50",
              options: { Size: "50ml" },
              prices: [
                { amount: 5999, currency_code: "eur" },
                { amount: 6499, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Collagen Peptides",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Skin & Beauty")!.id,
          ],
          description: "Marine collagen peptides for skin elasticity and joint health.",
          handle: "collagen-peptides",
          weight: 400,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ title: "Size", values: ["200g", "400g"] }],
          variants: [
            {
              title: "200g Powder",
              sku: "COLLAGEN-200",
              options: { Size: "200g" },
              prices: [
                { amount: 3499, currency_code: "eur" },
                { amount: 3999, currency_code: "usd" },
              ],
            },
            {
              title: "400g Powder",
              sku: "COLLAGEN-400",
              options: { Size: "400g" },
              prices: [
                { amount: 5999, currency_code: "eur" },
                { amount: 6499, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        // Vitality & Energy
        {
          title: "Vitamin D3 + K2",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Vitality & Energy")!.id,
          ],
          description: "High-potency vitamin D3 with K2 for bone health and immune support.",
          handle: "vitamin-d3-k2",
          weight: 80,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ title: "Size", values: ["30 caps", "60 caps"] }],
          variants: [
            {
              title: "30 Capsules",
              sku: "VITD3K2-30",
              options: { Size: "30 caps" },
              prices: [
                { amount: 2499, currency_code: "eur" },
                { amount: 2799, currency_code: "usd" },
              ],
            },
            {
              title: "60 Capsules",
              sku: "VITD3K2-60",
              options: { Size: "60 caps" },
              prices: [
                { amount: 3999, currency_code: "eur" },
                { amount: 4499, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "B-Complex Energy Formula",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Vitality & Energy")!.id,
          ],
          description: "Complete B-vitamin complex for sustained energy and mental clarity.",
          handle: "b-complex-energy",
          weight: 60,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ title: "Size", values: ["60 caps", "120 caps"] }],
          variants: [
            {
              title: "60 Capsules",
              sku: "BCOMPLEX-60",
              options: { Size: "60 caps" },
              prices: [
                { amount: 1899, currency_code: "eur" },
                { amount: 2199, currency_code: "usd" },
              ],
            },
            {
              title: "120 Capsules",
              sku: "BCOMPLEX-120",
              options: { Size: "120 caps" },
              prices: [
                { amount: 3299, currency_code: "eur" },
                { amount: 3699, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "CoQ10 Ubiquinol",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Vitality & Energy")!.id,
          ],
          description: "Premium CoQ10 for cellular energy production and heart health.",
          handle: "coq10-ubiquinol",
          weight: 70,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ title: "Size", values: ["30 softgels", "60 softgels"] }],
          variants: [
            {
              title: "30 Softgels",
              sku: "COQ10-30",
              options: { Size: "30 softgels" },
              prices: [
                { amount: 2799, currency_code: "eur" },
                { amount: 3199, currency_code: "usd" },
              ],
            },
            {
              title: "60 Softgels",
              sku: "COQ10-60",
              options: { Size: "60 softgels" },
              prices: [
                { amount: 4999, currency_code: "eur" },
                { amount: 5499, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        // Longevity & Wellness
        {
          title: "Omega-3 Fish Oil",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Longevity & Wellness")!.id,
          ],
          description: "Ultra-pure omega-3 for heart and brain health.",
          handle: "omega-3-fish-oil",
          weight: 200,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ title: "Size", values: ["60 softgels", "120 softgels"] }],
          variants: [
            {
              title: "60 Softgels",
              sku: "OMEGA3-60",
              options: { Size: "60 softgels" },
              prices: [
                { amount: 2299, currency_code: "eur" },
                { amount: 2599, currency_code: "usd" },
              ],
            },
            {
              title: "120 Softgels",
              sku: "OMEGA3-120",
              options: { Size: "120 softgels" },
              prices: [
                { amount: 3999, currency_code: "eur" },
                { amount: 4499, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Magnesium Glycinate",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Longevity & Wellness")!.id,
          ],
          description: "Highly bioavailable magnesium for sleep and muscle recovery.",
          handle: "magnesium-glycinate",
          weight: 120,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ title: "Size", values: ["60 caps", "120 caps"] }],
          variants: [
            {
              title: "60 Capsules",
              sku: "MAG-60",
              options: { Size: "60 caps" },
              prices: [
                { amount: 1999, currency_code: "eur" },
                { amount: 2299, currency_code: "usd" },
              ],
            },
            {
              title: "120 Capsules",
              sku: "MAG-120",
              options: { Size: "120 caps" },
              prices: [
                { amount: 3499, currency_code: "eur" },
                { amount: 3999, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "NMN Longevity Complex",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Longevity & Wellness")!.id,
          ],
          description: "Nicotinamide mononucleotide for cellular repair and healthy aging.",
          handle: "nmn-longevity-complex",
          weight: 60,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ title: "Size", values: ["30 caps", "60 caps"] }],
          variants: [
            {
              title: "30 Capsules",
              sku: "NMN-30",
              options: { Size: "30 caps" },
              prices: [
                { amount: 4999, currency_code: "eur" },
                { amount: 5499, currency_code: "usd" },
              ],
            },
            {
              title: "60 Capsules",
              sku: "NMN-60",
              options: { Size: "60 caps" },
              prices: [
                { amount: 8999, currency_code: "eur" },
                { amount: 9999, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
      ],
    },
  });
  logger.info("Finished seeding product data.");

  logger.info("Seeding inventory levels.");

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryItems.map((item) => ({
        location_id: stockLocation.id,
        stocked_quantity: 1000000,
        inventory_item_id: item.id,
      })),
    },
  });

  logger.info("Finished seeding inventory levels data.");
}
