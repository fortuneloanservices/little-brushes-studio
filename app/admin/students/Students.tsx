'use client';

import { useEffect, useState, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar } from '@/components/shared/Avatar';
import { toast } from 'sonner';

type Student = {
  id: string;
  name: string;
  email?: string;
  badgeId: string;
  class: string;
  feeStatus: 'Paid' | 'Pending' | 'Overdue';
  phone?: string;
  photo?: string;
  createdAt: string;
};

const CLASSES = ['Beginner', 'Intermediate', 'Advanced', 'Professional'];

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('All');
  const [filterFee, setFilterFee] = useState('All');

  // Fetch students from API
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filterClass !== 'All') params.append('class', filterClass);
        if (filterFee !== 'All') params.append('feeStatus', filterFee);

        const response = await fetch(`/api/students?${params.toString()}`);
        const data = await response.json();
        setStudents(data.students || []);
      } catch (error) {
        console.error('Error fetching students:', error);
        toast.error('Failed to load students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [filterClass, filterFee]);

  // Filter students based on search query
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = !searchQuery || 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.badgeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (student.email || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [students, searchQuery]);

  const tableRows = filteredStudents.map(student => ({
    id: student.id,
    name: student.name,
    email: student.email,
    badgeId: student.badgeId,
    class: student.class,
    feeStatus: student.feeStatus,
    photo: student.photo,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        subtitle={`${students.length} kids learning art with us`}
        action={
          <Button className="rounded-xl gradient-primary text-white border-0 shadow-pop">
            <Plus className="w-4 h-4 mr-1" />
            Add Student
          </Button>
        }
      />

      <div className="card-soft p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, badge or email..."
            className="pl-9 rounded-xl"
          />
        </div>
        <Select value={filterClass} onValueChange={setFilterClass}>
          <SelectTrigger className="rounded-xl sm:w-48">
            <SelectValue placeholder="Class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All classes</SelectItem>
            {CLASSES.map(c => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterFee} onValueChange={setFilterFee}>
          <SelectTrigger className="rounded-xl sm:w-40">
            <SelectValue placeholder="Fee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All fees</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="card-soft overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Loading students...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            {students.length === 0 
              ? 'No students yet. Create credentials to add students automatically.'
              : 'No matching students found.'
            }
          </div>
        ) : (
          <DataTable
            columns={[
              {
                key: 'name',
                header: 'Student',
                render: (row) => (
                  <div className="flex items-center gap-3">
                    <Avatar name={row.name} />
                    <div>
                      <div className="font-bold">{row.name}</div>
                      <div className="text-xs text-muted-foreground">{row.email || 'N/A'}</div>
                    </div>
                  </div>
                ),
              },
              {
                key: 'badgeId',
                header: 'Badge ID',
                render: (row) => (
                  <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                    {row.badgeId}
                  </span>
                ),
              },
              { key: 'class', header: 'Class' },
              {
                key: 'feeStatus',
                header: 'Fee Status',
                render: (row) => (
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      row.feeStatus === 'Paid'
                        ? 'bg-green-100 text-green-800'
                        : row.feeStatus === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {row.feeStatus}
                  </span>
                ),
              },
            ]}
            rows={tableRows}
            searchKeys={['name', 'email', 'badgeId', 'class']}
          />
        )}
      </div>
    </div>
  );
}
