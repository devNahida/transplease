import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, CheckCircle, Clock, XCircle, LogOut, BarChart3 } from 'lucide-react';
import { Page } from '../App';
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import emailjs from 'emailjs-com';
import { updateDoc } from 'firebase/firestore';

interface AdminDashboardProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [contacts, setContacts] = useState<any[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [admins, setAdmins] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  const CONTACT_STATUS_OPTIONS = ['Nouveau', 'En cours', 'Traité', 'Archivé'];

  // Mock data for quotes
  const quotes = [
    {
      id: 'Q001',
      date: '2025-01-20',
      client: 'Marie Dubois',
      email: 'marie.dubois@email.com',
      phone: '06 12 34 56 78',
      service: 'Livraison Express',
      pickup: 'Paris 15e',
      delivery: 'Boulogne-Billancourt',
      status: 'pending',
      amount: '25€'
    },
    {
      id: 'Q002',
      date: '2025-01-19',
      client: 'Jean Martin',
      email: 'j.martin@company.fr',
      phone: '06 98 76 54 32',
      service: 'Déménagement',
      pickup: 'Levallois-Perret',
      delivery: 'Neuilly-sur-Seine',
      status: 'accepted',
      amount: '450€'
    },
    {
      id: 'Q003',
      date: '2025-01-18',
      client: 'Sophie Laurent',
      email: 'sophie.l@boutique.fr',
      phone: '06 55 44 33 22',
      service: 'Envoi de Plis',
      pickup: 'Paris 8e',
      delivery: 'Versailles',
      status: 'completed',
      amount: '12€'
    },
    {
      id: 'Q004',
      date: '2025-01-17',
      client: 'Pierre Dupont',
      email: 'p.dupont@email.com',
      phone: '06 11 22 33 44',
      service: 'Transport de Marchandises',
      pickup: 'Rungis',
      delivery: 'Saint-Denis',
      status: 'rejected',
      amount: '85€'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'accepted':
        return 'Accepté';
      case 'completed':
        return 'Terminé';
      case 'rejected':
        return 'Refusé';
      default:
        return status;
    }
  };

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: quotes.length,
    pending: quotes.filter(q => q.status === 'pending').length,
    accepted: quotes.filter(q => q.status === 'accepted').length,
    completed: quotes.filter(q => q.status === 'completed').length
  };

  useEffect(() => {
    const fetchContacts = async () => {
      setLoadingContacts(true);
      try {
        const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setContacts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (e) {
        setContacts([]);
      }
      setLoadingContacts(false);
    };
    fetchContacts();
  }, []);

  useEffect(() => {
    const fetchAdmins = async () => {
      const snap = await getDocs(collection(db, 'admins'));
      setAdmins(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchAdmins();
  }, []);

  useEffect(() => {
    setUser({ email: 'dev.hamhami@gmail.com' });
  }, []);

  const handleDeleteContact = async (id: string) => {
    if (!window.confirm('Supprimer ce message ?')) return;
    await deleteDoc(doc(db, 'contacts', id));
    setContacts(contacts => contacts.filter(c => c.id !== id));
  };

  const handleContactStatusChange = async (id: string, newStatus: string) => {
    await updateDoc(doc(db, 'contacts', id), { status: newStatus });
    setContacts(contacts => contacts.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const handleAssignContact = async (contactId: string, adminEmail: string) => {
    await updateDoc(doc(db, 'contacts', contactId), { assignedTo: adminEmail });
    setContacts(contacts => contacts.map(c => c.id === contactId ? { ...c, assignedTo: adminEmail } : c));
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return;
    const SERVICE_ID = 'service_qqy2dyt';
    const TEMPLATE_ID = 'template_0sj0xzi';
    const PUBLIC_KEY = 'cJLZ2seExTX8_8gRp';
    if ([SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY].some(v => v.startsWith('YOUR_'))) return;
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          to_email: adminEmail,
          from_name: 'Transplease',
          contact_name: contact.name,
          contact_email: contact.email,
          contact_message: contact.message,
          contact_id: contactId,
        },
        PUBLIC_KEY
      );
    } catch (err) {
      console.error('Erreur lors de l\'envoi de l\'email:', err);
    }
  };

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [emailBody, setEmailBody] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleOpenEmailModal = (quote: any) => {
    setSelectedQuote(quote);
    setEmailBody(
      `Bonjour ${quote.client},\n\nNous avons bien reçu votre demande de devis (N°${quote.id}).\n\nService : ${quote.service}\nTrajet : de ${quote.pickup} à ${quote.delivery}\nMontant : ${quote.amount}\n\nNous restons à votre disposition pour toute question.\n\nCordialement,\nL'équipe Transplease`
    );
    setShowEmailModal(true);
    setEmailSuccess('');
    setEmailError('');
  };

  const handleSendEmail = async () => {
    setSendingEmail(true);
    setEmailSuccess('');
    setEmailError('');
    try {
      await emailjs.send(
        'service_qqy2dyt', // Remplace par ton service ID
        'template_quote_reply', // Remplace par ton template ID
        {
          to_email: selectedQuote.email,
          from_name: 'Transplease',
          client_name: selectedQuote.client,
          quote_id: selectedQuote.id,
          message: emailBody,
        },
        'cJLZ2seExTX8_8gRp' // Remplace par ta clé publique
      );
      setEmailSuccess('E-mail envoyé avec succès !');
      setShowEmailModal(false);
    } catch (err) {
      setEmailError("Erreur lors de l'envoi de l'e-mail. Vérifie la configuration EmailJS.");
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-800 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Tableau de bord - Transplease</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => onNavigate('home')}
                className="text-gray-600 hover:text-gray-900"
              >
                Voir le site
              </button>
              <button 
                onClick={onLogout}
                className="flex items-center text-red-600 hover:text-red-700"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total devis</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">En attente</h3>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Acceptés</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.accepted}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Terminés</h3>
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Gestion des devis</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher par client, ID ou service..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <Filter className="h-4 w-4 text-gray-400 mr-2" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="accepted">Acceptés</option>
                  <option value="completed">Terminés</option>
                  <option value="rejected">Refusés</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quotes Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID / Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trajet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{quote.id}</p>
                        <p className="text-sm text-gray-500">{quote.date}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{quote.client}</p>
                        <p className="text-sm text-gray-500">{quote.email}</p>
                        <p className="text-sm text-gray-500">{quote.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{quote.service}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm text-gray-900">De: {quote.pickup}</p>
                        <p className="text-sm text-gray-500">À: {quote.delivery}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                        {getStatusIcon(quote.status)}
                        <span className="ml-1">{getStatusLabel(quote.status)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{quote.amount}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={() => handleOpenEmailModal(quote)}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {quote.status === 'pending' && (
                        <>
                          <button className="text-green-600 hover:text-green-900 mr-2">
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredQuotes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucun devis trouvé pour les critères sélectionnés.</p>
            </div>
          )}
        </div>

        {/* Tableau des contacts */}
        <div className="bg-white rounded-lg shadow mb-6 mt-12">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Messages de contact</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sujet</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attribué à</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loadingContacts ? (
                  <tr><td colSpan={6} className="text-center py-8 text-gray-500">Chargement...</td></tr>
                ) : contacts.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-gray-500">Aucun message de contact.</td></tr>
                ) : contacts.map(contact => (
                  <tr key={contact.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contact.createdAt?.toDate ? contact.createdAt.toDate().toLocaleString() : ''}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{contact.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{contact.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{contact.subject || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate" title={contact.message}>{contact.message}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={contact.status || 'Nouveau'}
                        onChange={e => handleContactStatusChange(contact.id, e.target.value)}
                        className="border rounded px-2 py-1 text-xs"
                      >
                        {CONTACT_STATUS_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={contact.assignedTo || ''}
                        onChange={e => handleAssignContact(contact.id, e.target.value)}
                        className="border rounded px-2 py-1 text-xs"
                      >
                        <option value="">Non attribué</option>
                        {admins.map(a => (
                          <option key={a.email} value={a.email}>{a.name ? `${a.name} (${a.email})` : a.email}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-red-600 hover:text-red-900" onClick={() => handleDeleteContact(contact.id)} title="Supprimer">
                        <XCircle className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showEmailModal && selectedQuote && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-4 sm:p-6 md:p-8 relative border border-gray-200 overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-2.5 right-2.5 text-gray-400 hover:text-gray-700 text-3xl focus:outline-none"
              onClick={() => setShowEmailModal(false)}
              aria-label="Fermer le modal"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Envoyer un e-mail de confirmation</h2>
            {/* Section Informations du devis */}
            <section className="mb-6 bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-100">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Informations du devis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-sm">
                <div>
                  <span className="block text-gray-500">Numéro de devis</span>
                  <span className="font-medium text-gray-900">{selectedQuote.id}</span>
                </div>
                <div>
                  <span className="block text-gray-500">Date</span>
                  <span className="font-medium text-gray-900">{selectedQuote.date}</span>
                </div>
                <div>
                  <span className="block text-gray-500">Client</span>
                  <span className="font-medium text-gray-900">{selectedQuote.client}</span>
                </div>
                <div>
                  <span className="block text-gray-500">E-mail</span>
                  <span className="font-medium text-gray-900">{selectedQuote.email}</span>
                </div>
                <div>
                  <span className="block text-gray-500">Téléphone</span>
                  <span className="font-medium text-gray-900">{selectedQuote.phone}</span>
                </div>
                <div>
                  <span className="block text-gray-500">Service</span>
                  <span className="font-medium text-gray-900">{selectedQuote.service}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="block text-gray-500">Trajet</span>
                  <span className="font-medium text-gray-900">De {selectedQuote.pickup} à {selectedQuote.delivery}</span>
                </div>
                <div>
                  <span className="block text-gray-500">Montant</span>
                  <span className="font-medium text-gray-900">{selectedQuote.amount}</span>
                </div>
              </div>
            </section>
            {/* Section Message */}
            <section className="mb-6">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="email-template">Modèle d'e-mail</label>
                <select
                  id="email-template"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white"
                  value="confirmation"
                  disabled
                >
                  <option value="confirmation">Confirmation de devis</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="email-body">Message généré</label>
                <textarea
                  id="email-body"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 min-h-[100px] sm:min-h-[140px] bg-gray-50 shadow-inner text-base font-mono resize-vertical focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                  value={emailBody}
                  onChange={e => setEmailBody(e.target.value)}
                  rows={6}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Aperçu</label>
                <div className="bg-gray-100 border border-gray-200 rounded-lg p-3 sm:p-4 min-h-[80px] sm:min-h-[100px] whitespace-pre-line text-gray-900 text-sm">
                  {emailBody}
                </div>
              </div>
            </section>
            {emailError && <div className="text-red-600 mb-2">{emailError}</div>}
            {emailSuccess && <div className="text-green-600 mb-2">{emailSuccess}</div>}
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6">
              <button
                className="w-full sm:w-auto px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                onClick={() => setShowEmailModal(false)}
              >
                Annuler
              </button>
              <button
                className="w-full sm:w-auto px-6 py-3 bg-blue-800 text-white rounded-lg font-semibold hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow"
                onClick={handleSendEmail}
                disabled={sendingEmail}
              >
                {sendingEmail ? 'Envoi...' : "Envoyer l'e-mail"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;