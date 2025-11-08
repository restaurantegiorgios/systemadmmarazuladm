import React from 'react';
import { Employee } from '@/contexts/EmployeeProvider';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, UserX, Briefcase, User } from 'lucide-react';

interface DashboardStatsProps {
  employees: Employee[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ employees }) => {
  const { t } = useLanguage();

  // Calculate statistics
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status === 'active').length;
  const inactiveEmployees = totalEmployees - activeEmployees;
  const maleEmployees = employees.filter(emp => emp.gender === 'male').length;
  const femaleEmployees = employees.filter(emp => emp.gender === 'female').length;
  const uniquePositions = new Set(employees.map(emp => emp.position)).size;

  const stats = [
    {
      title: t('dashboard.totalEmployees'),
      value: totalEmployees,
      icon: Users,
      color: 'text-primary',
    },
    {
      title: t('dashboard.active'),
      value: activeEmployees,
      icon: UserCheck,
      color: 'text-green-600',
    },
    {
      title: t('dashboard.inactive'),
      value: inactiveEmployees,
      icon: UserX,
      color: 'text-destructive',
    },
    {
      title: t('dashboard.totalMen'),
      value: maleEmployees,
      icon: User,
      color: 'text-blue-500',
    },
    {
      title: t('dashboard.totalWomen'),
      value: femaleEmployees,
      icon: User,
      color: 'text-pink-500',
    },
    {
      title: t('dashboard.uniquePositions'),
      value: uniquePositions,
      icon: Briefcase,
      color: 'text-accent',
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;