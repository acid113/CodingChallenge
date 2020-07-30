import path from "path";
import fs from "fs";

import { Request, Response } from "express";
import csv from "csv-parser";
import moment from "moment";

import { IStore } from "../models/store";
import { IOrder } from "./../models/order";
import { ISalesOrder } from "../models/saleOrder";

const LOCAL = "en-GB";
moment.locale(LOCAL);

const getSales = (req: Request, res: Response) => {
  // console.log("getting sales orders");
  let salesOrder: ISalesOrder[] = [];

  parseSalesOrderList().then((response) => {
    salesOrder = response;
    // console.log("sales order: ", salesOrder.length);
    return res.status(200).json(salesOrder);
  });
};

const getStoreList = (): Promise<IStore[]> => {
  const stores: IStore[] = [];
  const filePath = path.join(__dirname, "../../data/stores.csv");
  // console.log("stores path: ", storesPath);

  const csvPromise = new Promise<IStore[]>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data: IStore) => {
        stores.push(data);
      })
      .on("end", () => {
        // console.log("Store csv file read complete: ", stores.length);
        resolve(stores);
      });
  });

  return csvPromise;
};

const getOrderList = (): Promise<IOrder[]> => {
  const orders: IOrder[] = [];
  const filePath = path.join(__dirname, "../../data/orders.csv");
  // console.log("order path: ", orderPath);

  const csvPromise = new Promise<IOrder[]>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data: IOrder) => {
        orders.push(data);
      })
      .on("end", () => {
        // console.log("Order csv file read complete: ", orders.length);
        resolve(orders);
      });
  });

  return csvPromise;
};

const parseDate = (date: string, locale: string, format: string): Date => {
  moment.locale(locale);

  const parsedDate = moment(date, format);
  const month = parseInt(parsedDate.format("M"));
  const day = parseInt(parsedDate.format("DD"));
  const year = parseInt(parsedDate.format("YYYY"));

  // JS month starts at 0
  const finalDate = new Date(year, month - 1, day);
  return finalDate;
};

const getDaysOverDue = (dateToCompare: Date, format?: string) => {
  const currentDate = new Date();

  if (currentDate > dateToCompare) {
    const timeDiff = currentDate.getTime() - dateToCompare.getTime();
    const dayDiff = timeDiff / (1000 * 3600 * 24);
    return parseInt(dayDiff + "");
  }

  return 0;
};

const parseSalesOrderList = async (): Promise<ISalesOrder[]> => {
  // const LOCAL = "en-GB";
  const DATE_FORMAT = "DD/MM/YYYY";
  const PENDING = "Pending";

  const salesOrder: ISalesOrder[] = [];
  const stores = await getStoreList();
  const orders = await getOrderList();

  // moment.locale(LOCAL);

  orders.map((order) => {
    const store = stores.find((data) => {
      return data.storeId === order.storeId;
    });

    if (store) {
      const parsedShipDate = parseDate(
        order.latest_ship_date,
        LOCAL,
        DATE_FORMAT
      );

      const daysOverdue = getDaysOverDue(parsedShipDate);

      if (order.shipment_status === PENDING && daysOverdue > 0) {
        const saleOrder: ISalesOrder = {
          id: order.Id,
          country: store.country,
          marketplace: store.marketplace,
          shopName: store.shopName,
          orderId: order.orderId,
          orderValue: order.orderValue,
          items: order.items,
          destination: order.destination,
          latestShipDate: parsedShipDate,
          daysOverdue: daysOverdue,
          shipmentStatus: order.shipment_status,
        };

        salesOrder.push(saleOrder);
      }
    }
  });

  return await salesOrder;
};

export { getSales };
