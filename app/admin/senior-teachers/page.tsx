"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { SeniorTeacherCard } from "@/components/senior-teachers/SeniorTeacherCard";
import { SeniorTeacherFilters } from "@/components/senior-teachers/SeniorTeacherFilters";
import { AddSeniorTeacherModal } from "@/components/senior-teachers/AddSeniorTeacherModal";
import { toast } from "sonner";

export interface SeniorTeacherItem {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  specialization: string;
  yearsOfExperience: number;
  role: string;
  qualification: string;
  address: string;
  joiningDate: string;
  salary: number;
  bio?: string;
  profileImage?: string;
  status: "Active" | "Inactive";
  assignedClasses: number;
  createdAt: string;
  updatedAt: string;
}

const DEFAULT_FILTERS = {
  query: "",
  specialization: "All",
  role: "All",
};

export default function SeniorTeachersPage() {
  const [teachers, setTeachers] = useState<SeniorTeacherItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(DEFAULT_FILTERS.query);
  const [specialization, setSpecialization] = useState(DEFAULT_FILTERS.specialization);
  const [role, setRole] = useState(DEFAULT_FILTERS.role);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    async function loadTeachers() {
      setLoading(true);
      try {
        const res = await fetch("/api/senior-teachers");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Unable to load senior teachers");
        setTeachers(data.teachers || []);
      } catch (error) {
        toast.error((error as Error).message || "Failed to load senior teachers");
      } finally {
        setLoading(false);
      }
    }
    loadTeachers();
  }, []);

  const filteredTeachers = useMemo(() => {
    return teachers.filter((teacher) => {
      const matchesQuery =
        !query ||
        teacher.fullName.toLowerCase().includes(query.toLowerCase()) ||
        teacher.email.toLowerCase().includes(query.toLowerCase()) ||
        teacher.specialization.toLowerCase().includes(query.toLowerCase());

      const matchesSpec = specialization === "All" || teacher.specialization === specialization;
      const matchesRole = role === "All" || teacher.role === role;
      return matchesQuery && matchesSpec && matchesRole;
    });
  }, [teachers, query, specialization, role]);

  const handleCreate = (teacher: SeniorTeacherItem) => {
    setTeachers(prev => [teacher, ...prev]);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Senior Teachers"
        subtitle="senior art instructors"
        action={
          <Button className="rounded-xl gradient-primary text-white border-0 shadow-pop" onClick={() => setDrawerOpen(true)}>
            <Plus className="w-4 h-4 mr-1" /> Add Senior Teacher
          </Button>
        }
      />

      <SeniorTeacherFilters
        query={query}
        onQueryChange={setQuery}
        specialization={specialization}
        onSpecializationChange={setSpecialization}
        role={role}
        onRoleChange={setRole}
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading && (
          <div className="card-soft p-10 text-center text-muted-foreground col-span-full">Loading senior teachers…</div>
        )}
        {!loading && filteredTeachers.length === 0 && (
          <div className="card-soft p-10 text-center text-muted-foreground col-span-full">No senior teachers match your filters</div>
        )}
        {!loading && filteredTeachers.map((teacher) => (
          <SeniorTeacherCard
            key={teacher.id}
            fullName={teacher.fullName}
            email={teacher.email}
            phone={teacher.phone}
            specialization={teacher.specialization}
            yearsOfExperience={teacher.yearsOfExperience}
            role={teacher.role}
            status={teacher.status}
            assignedClasses={teacher.assignedClasses}
            profileImage={teacher.profileImage}
          />
        ))}
      </div>

      <AddSeniorTeacherModal
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onCreated={handleCreate}
      />
    </div>
  );
}
