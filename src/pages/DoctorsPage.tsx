import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout';
import { Button, Input } from '@/components/ui';
import { DoctorCard } from '@/components/doctors/DoctorCard';
import { fetchDoctors } from '@/data/fetchers';
import { filterDoctors, getUniqueSpecialties, getUniqueLocations } from '@/lib/utils';

const PAGE_SIZE = 8;

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
      </div>
      <div className="mt-4 h-9 bg-slate-200 dark:bg-slate-700 rounded-xl" />
    </div>
  );
}

export default function DoctorsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') ?? '';
  const initialLocation = searchParams.get('location') ?? '';

  const [search, setSearch] = useState(initialSearch);
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState(initialLocation);

  // Sync location filter when URL param changes (e.g. clicking different hospital locations)
  useEffect(() => {
    const loc = searchParams.get('location') ?? '';
    setLocation(loc);
    setPage(1);
  }, [searchParams]);
  const [page, setPage] = useState(1);

  const { data: doctors = [], isLoading } = useQuery({
    queryKey: ['doctors'],
    queryFn: fetchDoctors,
  });

  const specialties = useMemo(() => getUniqueSpecialties(doctors), [doctors]);
  const locations = useMemo(() => getUniqueLocations(doctors), [doctors]);

  const filtered = useMemo(
    () => filterDoctors(doctors, search, specialty, location),
    [doctors, search, specialty, location]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const hasFilters = search !== '' || specialty !== '' || location !== '';

  function clearFilters() {
    setSearch('');
    setSpecialty('');
    setLocation('');
    setPage(1);
    setSearchParams({});
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
    if (value) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Find a Doctor</h1>

        {/* Filters row */}
        <div className="flex flex-wrap gap-3 mb-8 items-center">
          <Input
            placeholder="Search by name or specialty..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full sm:w-72"
          />

          <select
            value={specialty}
            onChange={(e) => { setSpecialty(e.target.value); setPage(1); }}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Specialties</option>
            {specialties.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={location}
            onChange={(e) => { setLocation(e.target.value); setPage(1); }}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Locations</option>
            {locations.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>

          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }, (_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-slate-500 dark:text-slate-400 text-lg mb-4">
              No doctors match your filters.
            </p>
            <Button variant="ghost" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {paginated.map((doctor) => (
              <motion.div key={doctor.id} variants={itemVariants}>
                <DoctorCard doctor={doctor} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {!isLoading && filtered.length > PAGE_SIZE && (
          <div className="flex items-center justify-center gap-4 mt-10">
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
