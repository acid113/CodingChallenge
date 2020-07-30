import React, { useState, useEffect } from "react";
import Flag from "react-world-flags";

import { getComparator, stableSort } from "../helper/utility";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

interface ISalesOrder {
  id: string;
  country: string;
  marketplace: string;
  shopName: string;
  orderId: string;
  orderValue: number;
  items: number;
  destination: string;
  latestShipDate: Date;
  daysOverdue: number;
  shipmentStatus: string;
}

interface ISalesGridProps {
  classes: ReturnType<typeof useStyles>;
  order: Order;
  orderBy: string;
  onSortField: (
    event: React.MouseEvent<unknown>,
    property: keyof ISalesOrder
  ) => void;
}

interface HeadCell {
  id: keyof ISalesOrder;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  {
    id: "marketplace",
    numeric: false,
    label: "MARKETPLACE",
  },
  { id: "shopName", numeric: false, label: "STORE" },
  { id: "orderId", numeric: false, label: "ORDER ID" },
  {
    id: "orderValue",
    numeric: true,
    label: "ORDER VALUE",
  },
  { id: "items", numeric: true, label: "ITEMS" },
  {
    id: "destination",
    numeric: false,
    label: "DESTINATION",
  },
  {
    id: "daysOverdue",
    numeric: true,
    label: "DAYS OVERDUE",
  },
];

type Order = "asc" | "desc";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    paper: {
      width: "100%",
      marginTop: theme.spacing(10),
    },
    title: {
      height: "3em",
      paddingLeft: "0.75em",
      display: "flex",
      alignItems: "center",
      color: "black",
      fontWeight: "bold",
    },
    table: {
      minWidth: 750,
    },
    headCell: {
      backgroundColor: "#e3f2fd",
    },
    sortIcon: {
      border: 0,
      clip: "rect(0 0 0 0)",
      height: 1,
      margin: -1,
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      top: 20,
      width: 1,
    },
  })
);

const TableTitle = () => {
  const classes = useStyles();

  return (
    <Typography
      className={classes.title}
      variant="h6"
      id="tableTitle"
      component="div"
    >
      Overdue Orders
    </Typography>
  );
};

const CustomTableHead = (props: ISalesGridProps) => {
  const { classes, order, orderBy, onSortField } = props;

  const createSortHandler = (property: keyof ISalesOrder) => (
    event: React.MouseEvent<unknown>
  ) => {
    onSortField(event, property);
  };

  return (
    <TableHead>
      <TableRow className={classes.headCell}>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            style={{ width: "14%" }}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.sortIcon}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

const Dashboard = () => {
  const classes = useStyles();
  const [salesOrderList, setSalesOrderList] = useState<ISalesOrder[]>([]);

  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<keyof ISalesOrder>("daysOverdue");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const sortField = (
    event: React.MouseEvent<unknown>,
    property: keyof ISalesOrder
  ) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);
  };

  const changePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const changeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/sales")
      .then((results) => results.json())
      .then((data: ISalesOrder[]) => {
        // console.log(data);
        const list: ISalesOrder[] = [];

        data.map((item) => {
          const listItem: ISalesOrder = {
            id: item.id,
            country: item.country,
            marketplace: item.marketplace,
            shopName: item.shopName,
            orderId: item.orderId,
            orderValue: parseFloat(item.orderValue + ""),
            items: parseInt(item.items + ""),
            destination: item.destination,
            latestShipDate: item.latestShipDate,
            daysOverdue: item.daysOverdue,
            shipmentStatus: item.shipmentStatus,
          };

          list.push(listItem);
        });
        setSalesOrderList(list);
      });
  }, []);

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, salesOrderList.length - page * rowsPerPage);

  return (
    <>
      <Container maxWidth="lg">
        <div className={classes.root}>
          <Paper className={classes.paper}>
            <TableTitle />
            <TableContainer>
              <Table
                className={classes.table}
                aria-labelledby="tableTitle"
                size="medium"
                aria-label="table title"
              >
                <CustomTableHead
                  classes={classes}
                  order={order}
                  orderBy={orderBy}
                  onSortField={sortField}
                />
                <TableBody>
                  {stableSort(salesOrderList, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      return (
                        <TableRow hover tabIndex={-1} key={row.orderId}>
                          <TableCell
                            align="left"
                            // style={{ width: "15%", paddingLeft: "25px" }}
                          >
                            <Flag code={row.country} height="10" />{" "}
                            {row.marketplace}
                          </TableCell>
                          <TableCell
                            // style={{ width: "15%" }}
                            align="left"
                          >
                            {row.shopName}
                          </TableCell>
                          <TableCell
                            // style={{ width: "15%" }}
                            align="left"
                          >
                            {row.orderId}
                          </TableCell>
                          <TableCell
                            // style={{ width: "15%" }}
                            align="right"
                          >
                            ${row.orderValue}
                          </TableCell>
                          <TableCell
                            // style={{ width: "10%" }}
                            align="right"
                          >
                            {row.items}
                          </TableCell>
                          <TableCell
                            // style={{ width: "15%" }}
                            align="left"
                          >
                            {row.destination}
                          </TableCell>
                          <TableCell
                            style={{
                              // width: "15%",
                              color: "red",
                              fontWeight: "bold",
                            }}
                            align="center"
                          >
                            {row.daysOverdue}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 50 * emptyRows }}>
                      <TableCell colSpan={7} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5]}
              labelRowsPerPage="Rows per page"
              component="div"
              count={salesOrderList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={changePage}
              onChangeRowsPerPage={changeRowsPerPage}
            />
          </Paper>
        </div>
      </Container>
    </>
  );
};

export default Dashboard;
