import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { adminService, GlobalStats, UsersPerDay, CategoryStat, CityStat, RevenuePerDay, TopUser, TopListing } from '../lib/adminService';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#7C3AED', '#2DD4BF', '#F59E0B', '#EF4444', '#10B981', '#3B82F6'];

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [usersPerDay, setUsersPerDay] = useState<UsersPerDay[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [cityStats, setCityStats] = useState<CityStat[]>([]);
  const [revenuePerDay, setRevenuePerDay] = useState<RevenuePerDay[]>([]);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [topListings, setTopListings] = useState<TopListing[]>([]);

  // Vérifier si l'utilisateur est admin
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.is_admin !== true) {
      alert('Accès refusé. Vous devez être administrateur pour accéder à cette page.');
      navigate('/');
      return;
    }
  }, [user, navigate]);

  // Charger toutes les statistiques
  useEffect(() => {
    loadAllStats();
  }, []);

  const loadAllStats = async () => {
    setLoading(true);
    
    const [
      globalStats,
      usersData,
      categoryData,
      cityData,
      revenueData,
      topUsersData,
      topListingsData,
    ] = await Promise.all([
      adminService.getGlobalStats(),
      adminService.getUsersPerDay(30),
      adminService.getListingsByCategory(),
      adminService.getListingsByCity(),
      adminService.getRevenuePerDay(30),
      adminService.getTopUsers(5),
      adminService.getTopListings(5),
    ]);

    setStats(globalStats);
    setUsersPerDay(usersData);
    setCategoryStats(categoryData);
    setCityStats(cityData);
    setRevenuePerDay(revenueData);
    setTopUsers(topUsersData);
    setTopListings(topListingsData);
    
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Erreur lors du chargement des statistiques</p>
          <button onClick={loadAllStats} className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 Dashboard Admin</h1>
          <p className="text-gray-600">Vue d'ensemble des statistiques de la plateforme</p>
        </div>

        {/* Navigation Admin */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            <Link
              to="/admin/dashboard"
              className="px-4 py-2 rounded-lg font-semibold bg-primary-600 text-white"
            >
              📊 Dashboard
            </Link>
            <Link
              to="/admin/moderation"
              className="px-4 py-2 rounded-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            >
              🛡️ Modération
              {(stats.pending_reports + stats.pending_user_reports) > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {stats.pending_reports + stats.pending_user_reports}
                </span>
              )}
            </Link>
            <Link
              to="/admin/support"
              className="px-4 py-2 rounded-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            >
              📧 Support Client
            </Link>
          </div>
        </div>

        {/* KPIs - Cartes statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Utilisateurs */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold uppercase opacity-90">Utilisateurs</h3>
              <span className="text-3xl">👥</span>
            </div>
            <p className="text-4xl font-bold mb-2">{stats.total_users}</p>
            <div className="text-sm opacity-90">
              <p>+{stats.users_today} aujourd'hui</p>
              <p>+{stats.users_week} cette semaine</p>
            </div>
          </div>

          {/* Annonces */}
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold uppercase opacity-90">Annonces</h3>
              <span className="text-3xl">📋</span>
            </div>
            <p className="text-4xl font-bold mb-2">{stats.total_listings}</p>
            <div className="text-sm opacity-90">
              <p>+{stats.listings_today} aujourd'hui</p>
              <p>+{stats.listings_week} cette semaine</p>
            </div>
          </div>

          {/* Boosts & Revenus */}
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold uppercase opacity-90">Boosts & Revenus</h3>
              <span className="text-3xl">🚀</span>
            </div>
            <p className="text-4xl font-bold mb-2">{stats.active_boosts}</p>
            <div className="text-sm opacity-90">
              <p>{stats.total_boosts} boosts total</p>
              <p>{stats.total_revenue} ₪ de revenus</p>
            </div>
          </div>

          {/* Conversations */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold uppercase opacity-90">Conversations</h3>
              <span className="text-3xl">💬</span>
            </div>
            <p className="text-4xl font-bold mb-2">{stats.total_conversations}</p>
            <div className="text-sm opacity-90">
              <p>+{stats.conversations_today} aujourd'hui</p>
            </div>
          </div>

          {/* Signalements en attente */}
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold uppercase opacity-90">Signalements</h3>
              <span className="text-3xl">⚠️</span>
            </div>
            <p className="text-4xl font-bold mb-2">{stats.pending_reports + stats.pending_user_reports}</p>
            <div className="text-sm opacity-90">
              <p>{stats.pending_reports} annonces</p>
              <p>{stats.pending_user_reports} utilisateurs</p>
            </div>
          </div>

          {/* Utilisateurs bannis */}
          <div className="bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold uppercase opacity-90">Bannis</h3>
              <span className="text-3xl">🚫</span>
            </div>
            <p className="text-4xl font-bold mb-2">{stats.banned_users}</p>
            <div className="text-sm opacity-90">
              <p>{stats.hidden_listings} annonces masquées</p>
            </div>
          </div>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Graphique inscriptions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📈 Inscriptions (30 derniers jours)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={usersPerDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#7C3AED" strokeWidth={2} name="Inscriptions" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Graphique revenus */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">💰 Revenus boosts (30 derniers jours)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenuePerDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} name="Revenus (₪)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Graphique annonces par catégorie */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Annonces par catégorie</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#2DD4BF" name="Annonces" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Graphique annonces par ville */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🏙️ Top 10 villes</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={cityStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.city} (${entry.count})`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {cityStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top listes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top utilisateurs */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🏆 Top utilisateurs</h3>
            <div className="space-y-3">
              {topUsers.map((user, index) => (
                <div key={user.user_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{user.user_name}</p>
                      <p className="text-sm text-gray-500">{user.user_email}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full font-semibold">
                    {user.listings_count} annonces
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top annonces */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">⭐ Top annonces (favoris)</h3>
            <div className="space-y-3">
              {topListings.map((listing, index) => (
                <div key={listing.listing_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{listing.title}</p>
                      <Link
                        to={`/listing/${listing.listing_id}`}
                        className="text-sm text-primary-600 hover:underline"
                      >
                        Voir l'annonce →
                      </Link>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full font-semibold">
                    ❤️ {listing.favorites_count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
