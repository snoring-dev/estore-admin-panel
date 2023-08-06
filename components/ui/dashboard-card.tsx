import { ReactElement } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

interface Props {
  title: string;
  content: string;
  icon: ReactElement;
}

function DashboardCard({ title, content, icon }: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{content}</div>
      </CardContent>
    </Card>
  );
}

export default DashboardCard;
