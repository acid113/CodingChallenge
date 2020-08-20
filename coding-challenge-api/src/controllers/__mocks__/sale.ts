import { Request, Response } from "express";
// import moment from "moment";

import { IStore } from "../../models/store";
import { IOrder } from "../../models/order";

// const LOCAL = "en-GB";
// moment.locale(LOCAL);

export const getSales = (req: Request, res: Response): Response => {
  console.log("mocked -> getSale()");
  return res.status(200).json({
    // return res.json({
    firstName: "Jane",
    lastName: "Doe",
    email: "janedoe@email.com",
    id: 1,
  });
};

export const getStoreList = (): Promise<IStore[]> => {
  console.log("calling mocked getStoreList()");

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

  return Promise.resolve(stores);
};

export const getOrderList = (): Promise<IOrder[]> => {
  console.log("calling mocked getOrderList()");

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

  return Promise.resolve(orders);
};

export const parseDate = (
  date: string,
  locale: string,
  format: string
): Date => {
  console.log("calling mocked parseDate()");
  return new Date("2020-08-31T16:00:00.000Z");
};
