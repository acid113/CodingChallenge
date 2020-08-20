/* References:
 * https://medium.com/@qjli/how-to-mock-specific-module-function-in-jest-715e39a391f4
 * https://codewithhugo.com/express-request-response-mocking/
 */

import { IStore } from "./../models/store";
import { IOrder } from "../models/order";
import { ISalesOrder } from "../models/saleOrder";
import salesFunction from "../controllers/sale";

// jest.mock("../controllers/sale.ts");

// const mockRequest = (sessionData?: any) => {
const mockRequest = () => {
  return {};
};

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const stores: IStore[] = [
  {
    storeId: 1,
    marketplace: "Mock Amazon",
    country: "AUS",
    shopName: "Shoes Plus",
  },
  {
    storeId: 2,
    marketplace: "Mock Ebay",
    country: "GRB",
    shopName: "Snack Co.",
  },
];

const orders: IOrder[] = [
  {
    Id: 1,
    storeId: 1,
    orderId: "ORLIAPICLS",
    latest_ship_date: "01/08/2020",
    shipment_status: "Pending",
    destination: "VIC AU, 3769",
    items: 2,
    orderValue: 50.0,
  },
  {
    Id: 2,
    storeId: 2,
    orderId: "OR2E47PHFB",
    latest_ship_date: "21/07/2020",
    shipment_status: "Shipped",
    destination: "LA US, 90001",
    items: 1,
    orderValue: 24.99,
  },
];

// NOTE: only orders with "Pending" status are displayed
const finalSalesOrder: ISalesOrder[] = [
  {
    id: 1,
    country: "AUS",
    marketplace: "Mock Amazon",
    shopName: "Shoes Plus",
    orderId: "ORLIAPICLS",
    orderValue: 50,
    items: 2,
    destination: "VIC AU, 3769",
    latestShipDate: new Date("2020-08-31T16:00:00.000Z"),
    daysOverdue: 1,
    shipmentStatus: "Pending",
  },
];

test("getSales() returns order list", async () => {
  const req: any = mockRequest();
  const res = mockResponse();

  salesFunction.getOrderList = jest.fn().mockResolvedValue(orders);
  salesFunction.getStoreList = jest.fn().mockResolvedValue(stores);
  salesFunction.getDaysOverDue = jest.fn().mockReturnValue(1);
  salesFunction.parseDate = jest
    .fn()
    .mockReturnValue(new Date("2020-08-31T16:00:00.000Z"));

  await salesFunction.getSales(req, res);
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(finalSalesOrder);
});
