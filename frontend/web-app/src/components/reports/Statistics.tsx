import React from 'react';
import { BarChart3, TrendingUp, Users, Clock } from 'lucide-react';

interface StatisticsProps {
  totalStudents: number;
  activeStudents: number;
  todayConsumptions: number;
  weekConsumptions: number;
}

export const Statistics: React.FC<StatisticsProps> = ({
  totalStudents,
  activeStudents,
  todayConsumptions,
  weekConsumptions
}) => {
  const stats = [
    {
      title: 'Total Estudiantes',
      value: totalStudents,
      icon: Users,
      color: 'bg-blue-500',
      change: '+5%'
    },
    {
      title: 'Estudiantes Activos',
      value: activeStudents,
      icon: Users,
      color: 'bg-green-500',
      change: '+2%'
    },
    {
      title: 'Consumos Hoy',
      value: todayConsumptions,
      icon: Clock,
      color: 'bg-orange-500',
      change: '+15%'
    },
    {
      title: 'Consumos Semanales',
      value: weekConsumptions,
      icon: BarChart3,
      color: 'bg-purple-500',
      change: '+8%'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change}
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <IconComponent className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};