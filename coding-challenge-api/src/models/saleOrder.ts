export interface ISalesOrder {
  id: number;
  country: string;
  marketplace: string;
  shopName: string;

  orderId: string;
  orderValue: number;
  items: number;
  destination: string;
  // latestShipDate: string;
  latestShipDate: Date;
  daysOverdue: number;
  shipmentStatus: string;
}
