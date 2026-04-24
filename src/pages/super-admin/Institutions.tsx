import { Plus, MoreVertical } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatusPill } from "@/components/shared/StatusPill";
import { Button } from "@/components/ui/button";
import { institutions } from "@/data/mockData";

export default function Institutions() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Institutions"
        subtitle="Manage all enrolled institutes"
        action={<Button className="rounded-xl gradient-primary text-white border-0 shadow-pop"><Plus className="w-4 h-4 mr-1" />Add Institute</Button>}
      />
      <DataTable
        columns={[
          { key: "id", header: "ID" },
          { key: "name", header: "Name" },
          { key: "city", header: "City" },
          { key: "plan", header: "Plan" },
          { key: "students", header: "Students" },
          { key: "status", header: "Status", render: r => <StatusPill status={r.status} /> },
          { key: "x", header: "", render: () => <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button> },
        ]}
        rows={institutions}
        searchKeys={["name", "city", "plan"]}
      />
    </div>
  );
}
