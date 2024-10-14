import React from "react";
import OrderList from "~/components/Order/OrderList";

const OrderListPage = () => {
  return (
    <div className="flex w-full flex-col items-center">
      <OrderList />
    </div>
  );
};

export default OrderListPage;
