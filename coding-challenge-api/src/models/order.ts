//Id,storeId,orderId,latest_ship_date,shipment_status,destination,items,orderValue
//1,1,ORLIAPICLS,10/09/2020,Pending,"VIC AU, 3769",2,50.0
export interface IOrder {
  Id: number;
  storeId: number;
  orderId: string;
  latest_ship_date: string;
  shipment_status: string;
  destination: string;
  items: number;
  orderValue: number;
}
