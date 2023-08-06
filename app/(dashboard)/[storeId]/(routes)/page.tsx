import { getGraphRevenue } from "@/actions/get-graph-revenue";
import { getSalesCount } from "@/actions/get-sales-count";
import { getStockCount } from "@/actions/get-stock-count";
import { getTotalRevenue } from "@/actions/get-total-revenue";
import Overview from "@/components/overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardCard from "@/components/ui/dashboard-card";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { priceFormatter } from "@/lib/utils";
import { CreditCard, DollarSign, Package } from "lucide-react";
import React from "react";

interface Props {
  params: { storeId: string };
}

async function DashboardPage({ params }: Props) {
  const totalRevenue = await getTotalRevenue(params.storeId);
  const salesCount = await getSalesCount(params.storeId);
  const stockCount = await getStockCount(params.storeId);
  const graphRevenue = await getGraphRevenue(params.storeId);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title="Dashboard" description="Overview of your store" />
        <Separator />
        <div className="grid gap-4 grid-cols-3">
          <DashboardCard
            title="Total Revenue"
            content={priceFormatter.format(totalRevenue)}
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          />
          <DashboardCard
            title="Sales"
            content={salesCount.toString()}
            icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
          />
          <DashboardCard
            title="Products in stock"
            content={`+${stockCount}`}
            icon={<Package className="h-4 w-4 text-muted-foreground" />}
          />
        </div>
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={graphRevenue} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default DashboardPage;
