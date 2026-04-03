import { useState } from 'react';

export const useTaskFilters = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [reportType, setReportType] = useState<'all' | 'today' | 'week' | 'custom'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const clearFilters = () => {
    setReportType('all');
    setSearch('');
    setStatusFilter('');
    setStartDate('');
    setEndDate('');
  };

  return {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    reportType,
    setReportType,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    clearFilters,
  };
};