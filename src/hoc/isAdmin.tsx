"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";

function isAdmin(ChildComponent: any) {
  return (props: any) => {
    const { data, status } = useSession();

    if (status === "loading") {
      return <div>...Loading</div>;
    }
    if (!data) {
      return redirect("/pages");
    }
    if (data?.user?.userType !== "admin") {
      return redirect("/pages");
    } else {
      return <ChildComponent {...props} />;
    }
  };
}

export default isAdmin;
