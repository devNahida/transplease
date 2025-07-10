import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Page } from '../App';
import { v4 as uuidv4 } from 'uuid';
import ReactModal from 'react-modal';
import emailjs from 'emailjs-com';

const STATUS_OPTIONS = ['En attente', 'En traitement', 'Accepté', 'Refusé', 'Archivé'];

interface AdminPageProps {
  onNavigate?: (page: Page) => void;
  setShowAdminModal?: (open: boolean) => void;
}

export default function AdminPage({ onNavigate, setShowAdminModal }: AdminPageProps) {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [noteInputs, setNoteInputs] = useState<{ [id: string]: string }>({});
  const [editingNote, setEditingNote] = useState<{ [quoteId: string]: string | null }>({});
  const [contactNoteInputs, setContactNoteInputs] = useState<{ [id: string]: string }>({});
  const [editingContactNote, setEditingContactNote] = useState<{ [contactId: string]: string | null }>({});
  const [admins, setAdmins] = useState<any[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<string | null>(null);
  const [showQuoteEmailModal, setShowQuoteEmailModal] = useState(false);
  const [emailForm, setEmailForm] = useState<any>({});
  const [emailTemplate, setEmailTemplate] = useState('confirmation');
  const [emailBody, setEmailBody] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState('');
  const [emailError, setEmailError] = useState('');

  // Liste des services connus (id => label)
  const SERVICE_LABELS: Record<string, string> = {
    delivery: 'Livraison Express',
    moving: 'Déménagement',
    document: 'Envoi de Plis',
    freight: 'Transport de Marchandises',
    errands: 'Courses Personnalisées',
    event: 'Transport Événementiel',
  };

  const EMAIL_TEMPLATES = [
    {
      id: 'confirmation',
      label: 'Confirmation de devis',
      generate: (data: any) => `Bonjour ${data.name},\n\nNous avons le plaisir de vous confirmer la réception de votre demande de devis (N°${data.id}).\n\nVoici le récapitulatif :\n- Service : ${data.service}\n- Date/heure : ${data.date}\n- Prix proposé : ${data.amount}\n- Adresse de départ : ${data.pickup}\n- Adresse d'arrivée : ${data.delivery}\n- Options : ${data.options || '-'}\n- Remarques : ${data.remarks || '-'}\n\nMerci de nous confirmer votre accord ou de nous indiquer toute modification souhaitée.\n\nCordialement,\nL'équipe Transplease`,
    },
    {
      id: 'info',
      label: "Demande d'information supplémentaire",
      generate: (data: any) => `Bonjour ${data.name},\n\nNous avons bien reçu votre demande de devis (N°${data.id}).\n\nAfin de finaliser votre devis, pourriez-vous nous préciser :\n[Votre question ici]\n\nRécapitulatif :\n- Service : ${data.service}\n- Date/heure : ${data.date}\n- Adresse de départ : ${data.pickup}\n- Adresse d'arrivée : ${data.delivery}\n\nMerci d'avance pour votre retour.\n\nCordialement,\nL'équipe Transplease`,
    },
    {
      id: 'modification',
      label: 'Modification du devis',
      generate: (data: any) => `Bonjour ${data.name},\n\nSuite à votre demande, nous vous proposons la modification suivante sur votre devis (N°${data.id}) :\n[Précisez la modification]\n\nRécapitulatif :\n- Service : ${data.service}\n- Date/heure : ${data.date}\n- Prix proposé : ${data.amount}\n- Adresse de départ : ${data.pickup}\n- Adresse d'arrivée : ${data.delivery}\n\nMerci de nous confirmer votre accord.\n\nCordialement,\nL'équipe Transplease`,
    },
  ];

  const fetchData = async () => {
    setRefreshing(true);
    const quotesSnap = await getDocs(query(collection(db, 'quotes'), orderBy('createdAt', 'desc')));
    const contactsSnap = await getDocs(query(collection(db, 'contacts'), orderBy('createdAt', 'desc')));
    setQuotes(quotesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setContacts(contactsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setRefreshing(false);
  };

  const fetchAdmins = async () => {
    try {
      const snap = await getDocs(query(collection(db, 'admins'), orderBy('email')));
      setAdmins(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Erreur lors de la récupération des admins:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      console.log("USER EMAIL CONNECTÉ :", u?.email);
      if (!u) {
        window.location.href = '/';
        return;
      }
      // Vérifier si l'utilisateur est dans la collection 'admins'
      const adminsSnap = await getDocs(collection(db, 'admins'));
      const adminEmails = adminsSnap.docs.map(doc => doc.data().email);
      if (adminEmails.includes(u.email)) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        window.location.href = '/';
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !isAdmin) return;
    fetchData();
    fetchAdmins();
    // eslint-disable-next-line
  }, [user, isAdmin]);

  const handleDelete = async (type: 'quotes' | 'contacts', id: string) => {
    if (!window.confirm('Supprimer cet élément ?')) return;
    await deleteDoc(doc(db, type, id));
    fetchData();
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    await updateDoc(doc(db, 'quotes', id), { status: newStatus });
    fetchData();
  };

  const handleAddNote = async (quoteId: string) => {
    if (!noteInputs[quoteId] || !user) return;
    const quoteRef = doc(db, 'quotes', quoteId);
    const quoteSnap = await getDoc(quoteRef);
    const quoteData = quoteSnap.data();
    if (!quoteData) return;
    const newNote = {
      id: uuidv4(),
      author: user.email,
      text: noteInputs[quoteId],
      createdAt: new Date(),
    };
    const updatedNotes = [...(quoteData.internalNotes || []), newNote];
    await updateDoc(quoteRef, { internalNotes: updatedNotes });
    setNoteInputs((prev) => ({ ...prev, [quoteId]: '' }));
    fetchData();
  };

  const handleEditNote = (quoteId: string, noteId: string, text: string) => {
    setEditingNote((prev) => ({ ...prev, [quoteId]: noteId }));
    setNoteInputs((prev) => ({ ...prev, [quoteId]: text }));
  };

  const handleSaveEditNote = async (quoteId: string, noteId: string) => {
    if (!noteInputs[quoteId] || !user) return;
    const quoteRef = doc(db, 'quotes', quoteId);
    const quoteSnap = await getDoc(quoteRef);
    const quoteData = quoteSnap.data();
    if (!quoteData) return;
    const updatedNotes = (quoteData.internalNotes || []).map((n: any) =>
      n.id === noteId ? { ...n, text: noteInputs[quoteId] } : n
    );
    await updateDoc(quoteRef, { internalNotes: updatedNotes });
    setEditingNote((prev) => ({ ...prev, [quoteId]: null }));
    setNoteInputs((prev) => ({ ...prev, [quoteId]: '' }));
    fetchData();
  };

  const handleDeleteNote = async (quoteId: string, noteId: string) => {
    const quoteRef = doc(db, 'quotes', quoteId);
    const quoteSnap = await getDoc(quoteRef);
    const quoteData = quoteSnap.data();
    if (!quoteData) return;
    const updatedNotes = (quoteData.internalNotes || []).filter((n: any) => n.id !== noteId);
    await updateDoc(quoteRef, { internalNotes: updatedNotes });
    fetchData();
  };

  const handleAddContactNote = async (contactId: string) => {
    if (!contactNoteInputs[contactId] || !user) return;
    const contactRef = doc(db, 'contacts', contactId);
    const contactSnap = await getDoc(contactRef);
    const contactData = contactSnap.data();
    if (!contactData) return;
    const newNote = {
      id: uuidv4(),
      author: user.email,
      text: contactNoteInputs[contactId],
      createdAt: new Date(),
    };
    const updatedNotes = [...(contactData.internalNotes || []), newNote];
    await updateDoc(contactRef, { internalNotes: updatedNotes });
    setContactNoteInputs((prev) => ({ ...prev, [contactId]: '' }));
    fetchData();
  };

  const handleEditContactNote = (contactId: string, noteId: string, text: string) => {
    setEditingContactNote((prev) => ({ ...prev, [contactId]: noteId }));
    setContactNoteInputs((prev) => ({ ...prev, [contactId]: text }));
  };

  const handleSaveEditContactNote = async (contactId: string, noteId: string) => {
    if (!contactNoteInputs[contactId] || !user) return;
    const contactRef = doc(db, 'contacts', contactId);
    const contactSnap = await getDoc(contactRef);
    const contactData = contactSnap.data();
    if (!contactData) return;
    const updatedNotes = (contactData.internalNotes || []).map((n: any) =>
      n.id === noteId ? { ...n, text: contactNoteInputs[contactId] } : n
    );
    await updateDoc(contactRef, { internalNotes: updatedNotes });
    setEditingContactNote((prev) => ({ ...prev, [contactId]: null }));
    setContactNoteInputs((prev) => ({ ...prev, [contactId]: '' }));
    fetchData();
  };

  const handleDeleteContactNote = async (contactId: string, noteId: string) => {
    const contactRef = doc(db, 'contacts', contactId);
    const contactSnap = await getDoc(contactRef);
    const contactData = contactSnap.data();
    if (!contactData) return;
    const updatedNotes = (contactData.internalNotes || []).filter((n: any) => n.id !== noteId);
    await updateDoc(contactRef, { internalNotes: updatedNotes });
    fetchData();
  };

  const handleAssignQuote = async (quoteId: string, adminEmail: string) => {
    await updateDoc(doc(db, 'quotes', quoteId), { assignedTo: adminEmail });
    fetchData();
  };

  const handleAssignContact = async (contactId: string, adminEmail: string) => {
    await updateDoc(doc(db, 'contacts', contactId), { assignedTo: adminEmail });
    fetchData();
  };

  // Extraction du service depuis le message
  function extractServiceFromMessage(message: string) {
    const match = message.match(/Service: ([^\n]+)/);
    return match ? match[1] : '';
  }

  // Extraction dynamique des services présents dans les devis
  const serviceIds = Array.from(new Set(quotes.map(q => extractServiceFromMessage(q.message)))).filter(Boolean);

  // Récap statuts
  const statusCounts = STATUS_OPTIONS.reduce((acc, status) => {
    acc[status] = quotes.filter(q => (q.status || 'En attente') === status).length;
    return acc;
  }, {} as Record<string, number>);

  // Calcul du nombre de devis par service (filtré par statut si besoin)
  const serviceCounts = Object.keys(SERVICE_LABELS).reduce((acc, serviceId) => {
    acc[serviceId] = quotes.filter(q => extractServiceFromMessage(q.message) === serviceId && (!selectedStatus || (q.status || 'En attente') === selectedStatus)).length;
    return acc;
  }, {} as Record<string, number>);

  // Calcul du nombre de devis par admin assigné (filtré par statut/service si besoin)
  const adminList = Array.from(new Set(quotes.map(q => q.assignedTo).filter(Boolean)));
  const adminCounts = adminList.reduce((acc, adminEmail) => {
    acc[adminEmail] = quotes.filter(q => q.assignedTo === adminEmail && (!selectedStatus || (q.status || 'En attente') === selectedStatus) && (!selectedService || extractServiceFromMessage(q.message) === selectedService)).length;
    return acc;
  }, {} as Record<string, number>);

  const handleOpenQuoteEmail = (quote: any) => {
    const form = {
      name: quote.name,
      email: quote.email,
      id: quote.id,
      amount: quote.amount || '',
      date: quote.date || '',
      pickup: quote.pickup || '',
      delivery: quote.delivery || '',
      service: extractServiceFromMessage(quote.message) || '',
      options: '',
      remarks: '',
    };
    setEmailForm(form);
    const template = EMAIL_TEMPLATES.find(t => t.id === emailTemplate) || EMAIL_TEMPLATES[0];
    setEmailBody(template.generate(form));
    setShowQuoteEmailModal(true);
    setEmailSuccess('');
    setEmailError('');
  };

  const handleChangeEmailForm = (field: string, value: string) => {
    const updated = { ...emailForm, [field]: value };
    setEmailForm(updated);
    const template = EMAIL_TEMPLATES.find(t => t.id === emailTemplate) || EMAIL_TEMPLATES[0];
    setEmailBody(template.generate(updated));
  };

  const handleChangeEmailTemplate = (id: string) => {
    setEmailTemplate(id);
    const template = EMAIL_TEMPLATES.find(t => t.id === id) || EMAIL_TEMPLATES[0];
    setEmailBody(template.generate(emailForm));
  };

  const handleSendQuoteEmail = async () => {
    setSendingEmail(true);
    setEmailSuccess('');
    setEmailError('');
    const SERVICE_ID = 'service_qqy2dyt';
    const TEMPLATE_ID = 'template_0sj0xzi'; // À créer dans EmailJS
    const PUBLIC_KEY = 'cJLZ2seExTX8_8gRp';
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          to_email: emailForm.email,
          objet: emailForm.objet,
          name: emailForm.name,
          id: emailForm.id,
          amount: emailForm.amount,
          date: emailForm.date,
          pickup: emailForm.pickup,
          delivery: emailForm.delivery,
          service: emailForm.service,
          options: emailForm.options,
          remarks: emailForm.remarks,
          from_name: 'Transplease',
          client_name: emailForm.name,
          quote_id: emailForm.id,
          quote_amount: emailForm.amount,
          quote_date: emailForm.date,
          quote_pickup: emailForm.pickup,
          quote_delivery: emailForm.delivery,
          quote_service: emailForm.service,
          quote_options: emailForm.options,
          quote_remarks: emailForm.remarks,
          message: emailBody,
        },
        PUBLIC_KEY
      );
      setEmailSuccess('E-mail envoyé avec succès !');
      setShowQuoteEmailModal(false);
    } catch (err) {
      setEmailError("Erreur lors de l'envoi de l'e-mail. Veuillez réessayer ou vérifier la configuration EmailJS.");
    } finally {
      setSendingEmail(false);
    }
  };

  // Ajout état pour la modale d'aperçu complet
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Synchronise l'état des modales avec App pour le z-index de la navbar
  useEffect(() => {
    if (setShowAdminModal) {
      setShowAdminModal(showQuoteEmailModal || showPreviewModal);
    }
  }, [showQuoteEmailModal, showPreviewModal, setShowAdminModal]);

  if (!user || !isAdmin) {
    return null;
  }

    return (
    <div className="bg-white dark:bg-primary-dark min-h-screen transition-colors duration-300">
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-white dark:bg-secondary-green rounded-lg p-6 mb-8 shadow-md border border-divider-grey transition-colors duration-300">
          <div className="flex items-center justify-center mb-6">
            <img src="/logo-transplease-noir.svg" alt="Logo Transplease" className="h-16 mr-4" />
            <h1 className="text-4xl font-bold text-primary-dark dark:text-text-light">Dashboard Administrateur</h1>
          </div>
          {user && user.email === 'dev.hamhami@gmail.com' && (
            <div className="text-right">
              <button
                onClick={() => onNavigate && onNavigate('superadmin')}
                className="text-accent-gold underline font-semibold hover:text-primary-dark dark:hover:text-text-light transition-colors"
              >
                Gestion des admins
              </button>
            </div>
          )}
          <div className="flex justify-end">
            <button
              onClick={() => { setRefreshing(true); fetchData(); }}
              className="px-6 py-3 bg-accent-gold text-primary-dark rounded-lg hover:bg-secondary-green hover:text-text-light font-semibold flex items-center transition-colors"
              disabled={refreshing}
            >
              {refreshing ? 'Rafraîchissement...' : 'Rafraîchir'}
            </button>
          </div>
        </div>
        {/* Tableau récap statuts */}
        <div className="mb-8 bg-white dark:bg-secondary-green rounded-lg p-6 shadow-md border border-divider-grey transition-colors duration-300">
          <h2 className="text-xl font-semibold mb-4 text-primary-dark dark:text-text-light">Récapitulatif des statuts</h2>
          <div className="flex gap-2 mb-2 flex-wrap">
            <button
              className={`px-4 py-2 rounded-lg font-semibold border transition-colors ${selectedStatus === null ? 'bg-accent-gold text-primary-dark border-accent-gold' : 'bg-transparent text-primary-dark border-primary-dark dark:text-text-light dark:border-text-light hover:bg-accent-gold hover:text-primary-dark'}`}
              onClick={() => setSelectedStatus(null)}
            >
              Tout
            </button>
            {STATUS_OPTIONS.map(status => (
              <button
                key={status}
                className={`px-4 py-2 rounded-lg font-semibold border transition-colors ${selectedStatus === status ? 'bg-accent-gold text-primary-dark border-accent-gold' : 'bg-transparent text-primary-dark border-primary-dark dark:text-text-light dark:border-text-light hover:bg-accent-gold hover:text-primary-dark'}`}
                onClick={() => setSelectedStatus(status)}
              >
                {status} ({statusCounts[status]})
              </button>
            ))}
          </div>
        </div>
        {/* Tableau récap services */}
        <div className="mb-8 bg-white dark:bg-secondary-green rounded-lg p-6 shadow-md border border-divider-grey transition-colors duration-300">
          <h2 className="text-xl font-semibold mb-4 text-primary-dark dark:text-text-light">Récapitulatif des services</h2>
          <div className="flex gap-2 mb-2 flex-wrap">
            <button
              className={`px-4 py-2 rounded-lg font-semibold border transition-colors ${selectedService === null ? 'bg-accent-gold text-primary-dark border-accent-gold' : 'bg-transparent text-primary-dark border-primary-dark dark:text-text-light dark:border-text-light hover:bg-accent-gold hover:text-primary-dark'}`}
              onClick={() => setSelectedService(null)}
            >
              Tout
            </button>
            {Object.keys(SERVICE_LABELS).map(serviceId => (
              <button
                key={serviceId}
                className={`px-4 py-2 rounded-lg font-semibold border transition-colors ${selectedService === serviceId ? 'bg-accent-gold text-primary-dark border-accent-gold' : 'bg-transparent text-primary-dark border-primary-dark dark:text-text-light dark:border-text-light hover:bg-accent-gold hover:text-primary-dark'}`}
                onClick={() => setSelectedService(serviceId)}
              >
                {SERVICE_LABELS[serviceId]} ({serviceCounts[serviceId]})
              </button>
            ))}
          </div>
        </div>
        {/* Tableau récap admins assignés */}
        <div className="mb-8 bg-white dark:bg-secondary-green rounded-lg p-6 shadow-md border border-divider-grey transition-colors duration-300">
          <h2 className="text-xl font-semibold mb-4 text-primary-dark dark:text-text-light">Récapitulatif par admin assigné</h2>
          <div className="flex gap-2 mb-2 flex-wrap">
            <button
              className={`px-4 py-2 rounded-lg font-semibold border transition-colors ${selectedAdmin === null ? 'bg-accent-gold text-primary-dark border-accent-gold' : 'bg-transparent text-primary-dark border-primary-dark dark:text-text-light dark:border-text-light hover:bg-accent-gold hover:text-primary-dark'}`}
              onClick={() => setSelectedAdmin(null)}
            >
              Tout
            </button>
            {adminList.length === 0 && <span className="text-text-grey">Aucun admin assigné</span>}
            {adminList.map(adminEmail => (
              <button
                key={adminEmail}
                className={`px-4 py-2 rounded-lg font-semibold border transition-colors ${selectedAdmin === adminEmail ? 'bg-accent-gold text-primary-dark border-accent-gold' : 'bg-transparent text-primary-dark border-primary-dark dark:text-text-light dark:border-text-light hover:bg-accent-gold hover:text-primary-dark'}`}
                onClick={() => setSelectedAdmin(adminEmail)}
              >
                {admins.find(a => a.email === adminEmail)?.name ? `${admins.find(a => a.email === adminEmail)?.name} (${adminEmail})` : adminEmail} ({adminCounts[adminEmail]})
              </button>
            ))}
          </div>
        </div>
        {/* Devis par service */}
        {(selectedService ? [selectedService] : serviceIds).map(serviceId => (
          <section className="mb-12" key={serviceId}>
            <h2 className="text-2xl font-semibold mb-4 text-primary-dark dark:text-text-light">{SERVICE_LABELS[serviceId] || serviceId}</h2>
            <div className="bg-white dark:bg-secondary-green rounded-lg shadow-lg p-6 border border-divider-grey transition-colors duration-300">
              {quotes.filter(q =>
                extractServiceFromMessage(q.message) === serviceId &&
                (!selectedStatus || (q.status || 'En attente') === selectedStatus) &&
                (!selectedAdmin || q.assignedTo === selectedAdmin)
              ).length === 0 ? (
                <div className="text-text-grey">Aucune demande.</div>
              ) : (
                <ul className="divide-y divide-divider-grey">
                  {quotes.filter(q =>
                    extractServiceFromMessage(q.message) === serviceId &&
                    (!selectedStatus || (q.status || 'En attente') === selectedStatus) &&
                    (!selectedAdmin || q.assignedTo === selectedAdmin)
                  ).map(q => (
                    <li key={q.id} className="py-6 flex justify-between items-start gap-4">
                      <div className="w-full">
                        <div className="font-semibold text-text-light text-lg">{q.name} ({q.email})</div>
                        <div className="text-sm text-text-grey whitespace-pre-line mt-2">{q.message}</div>
                        <div className="text-xs text-text-grey mt-2">{q.createdAt?.toDate ? q.createdAt.toDate().toLocaleString() : ''}</div>
                        <div className="mt-4 flex items-center gap-2">
                          <span className="text-sm font-semibold text-text-light">Attribué à :</span>
                          <span className="text-sm text-accent-gold font-semibold">{q.assignedTo || 'Non attribué'}</span>
                          {user && user.email === 'dev.hamhami@gmail.com' && (
                            <select
                              value={q.assignedTo || ''}
                              onChange={e => handleAssignQuote(q.id, e.target.value)}
                              className="border border-divider-grey rounded px-3 py-1 text-sm ml-2 bg-primary-dark text-text-light"
                            >
                              <option value="">Non attribué</option>
                              {admins.map(a => (
                                <option key={a.email} value={a.email}>{a.name ? `${a.name} (${a.email})` : a.email}</option>
                              ))}
                            </select>
                          )}
                        </div>
                        {user && user.email === 'dev.hamhami@gmail.com' && (
                          <div className="mt-3">
                            <label className="text-sm font-semibold mr-2 text-text-light">Statut :</label>
                            <select
                              value={q.status || 'En attente'}
                              onChange={e => handleStatusChange(q.id, e.target.value)}
                              className="border border-divider-grey rounded px-3 py-1 text-sm bg-primary-dark text-text-light"
                            >
                              {STATUS_OPTIONS.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </div>
                        )}
                        <div className="mt-4">
                          <label className="text-sm font-semibold mr-2 text-text-light">Notes internes :</label>
                          <ul className="mb-3">
                            {(q.internalNotes || []).map((note: any) => (
                              <li key={note.id} className="mb-2 flex items-center gap-2 bg-primary-dark p-3 rounded">
                                <span className="text-xs text-accent-gold font-semibold">{note.author}</span>
                                <span className="text-xs text-text-grey">{note.createdAt?.toDate ? note.createdAt.toDate().toLocaleString() : new Date(note.createdAt).toLocaleString()}</span>
                                {editingNote[q.id] === note.id ? (
                                  <>
                                    <input
                                      type="text"
                                      value={noteInputs[q.id] || ''}
                                      onChange={e => setNoteInputs(prev => ({ ...prev, [q.id]: e.target.value }))}
                                      className="border border-divider-grey rounded px-2 py-1 text-xs w-1/2 bg-primary-dark text-text-light"
                                    />
                                    <button onClick={() => handleSaveEditNote(q.id, note.id)} className="text-accent-gold text-xs hover:text-text-light transition-colors">Enregistrer</button>
                                    <button onClick={() => setEditingNote(prev => ({ ...prev, [q.id]: null }))} className="text-text-grey text-xs hover:text-text-light transition-colors">Annuler</button>
                                  </>
                                ) : (
                                  <span className="text-xs text-text-light">{note.text}</span>
                                )}
                                {(user.email === note.author || user.email === 'dev.hamhami@gmail.com') && editingNote[q.id] !== note.id && (
                                  <>
                                    <button onClick={() => handleEditNote(q.id, note.id, note.text)} className="text-accent-gold text-xs hover:text-text-light transition-colors">Modifier</button>
                                    <button onClick={() => handleDeleteNote(q.id, note.id)} className="text-red-400 text-xs hover:text-red-300 transition-colors">Supprimer</button>
                                  </>
                                )}
                              </li>
                            ))}
                          </ul>
                          <div className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={noteInputs[q.id] || ''}
                              onChange={e => setNoteInputs(prev => ({ ...prev, [q.id]: e.target.value }))}
                              placeholder="Ajouter une note..."
                              className="border border-divider-grey rounded px-3 py-2 text-sm w-full bg-primary-dark text-text-light placeholder-text-grey"
                            />
                            <button
                              onClick={() => handleAddNote(q.id)}
                              className="px-4 py-2 bg-accent-gold text-primary-dark rounded-lg hover:bg-secondary-green hover:text-text-light font-semibold text-sm transition-colors"
                            >
                              Ajouter
                            </button>
                          </div>
                        </div>
                        <button className="mt-4 px-4 py-2 bg-accent-gold text-primary-dark rounded-lg hover:bg-secondary-green hover:text-text-light font-semibold text-sm transition-colors" onClick={() => handleOpenQuoteEmail(q)}>
                          Envoyer un e-mail au client
                        </button>
                      </div>
                      {user && user.email === 'dev.hamhami@gmail.com' && (
                        <button
                          onClick={() => handleDelete('quotes', q.id)}
                          className="ml-4 px-4 py-2 bg-red-600 text-text-light rounded-lg hover:bg-red-700 text-sm transition-colors"
                        >
                          Supprimer
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        ))}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-primary-dark dark:text-text-light">Messages de contact</h2>
          <div className="bg-white dark:bg-secondary-green rounded-lg shadow-lg p-6 border border-divider-grey transition-colors duration-300">
            {contacts.length === 0 ? <div className="text-text-grey">Aucun message.</div> : (
              <ul className="divide-y divide-divider-grey">
                {contacts.map(c => (
                  <li key={c.id} className="py-6 flex justify-between items-start gap-4">
                    <div className="w-full">
                      <div className="font-semibold text-text-light text-lg">{c.name} ({c.email})</div>
                      <div className="text-sm text-text-grey whitespace-pre-line mt-2">{c.message}</div>
                      <div className="text-xs text-text-grey mt-2">{c.createdAt?.toDate ? c.createdAt.toDate().toLocaleString() : ''}</div>
                      <div className="mt-4 flex items-center gap-2">
                        <span className="text-sm font-semibold text-text-light">Attribué à :</span>
                        <span className="text-sm text-accent-gold font-semibold">{c.assignedTo || 'Non attribué'}</span>
                        {user && user.email === 'dev.hamhami@gmail.com' && (
                          <select
                            value={c.assignedTo || ''}
                            onChange={e => handleAssignContact(c.id, e.target.value)}
                            className="border border-divider-grey rounded px-3 py-1 text-sm ml-2 bg-primary-dark text-text-light"
                          >
                            <option value="">Non attribué</option>
                            {admins.map(a => (
                              <option key={a.email} value={a.email}>{a.name ? `${a.name} (${a.email})` : a.email}</option>
                            ))}
                          </select>
                        )}
                      </div>
                      <div className="mt-4">
                        <label className="text-sm font-semibold mr-2 text-text-light">Notes internes :</label>
                        <ul className="mb-3">
                          {(c.internalNotes || []).map((note: any) => (
                            <li key={note.id} className="mb-2 flex items-center gap-2 bg-primary-dark p-3 rounded">
                              <span className="text-xs text-accent-gold font-semibold">{note.author}</span>
                              <span className="text-xs text-text-grey">{note.createdAt?.toDate ? note.createdAt.toDate().toLocaleString() : new Date(note.createdAt).toLocaleString()}</span>
                              {editingContactNote[c.id] === note.id ? (
                                <>
                                  <input
                                    type="text"
                                    value={contactNoteInputs[c.id] || ''}
                                    onChange={e => setContactNoteInputs(prev => ({ ...prev, [c.id]: e.target.value }))}
                                    className="border border-divider-grey rounded px-2 py-1 text-xs w-1/2 bg-primary-dark text-text-light"
                                  />
                                  <button onClick={() => handleSaveEditContactNote(c.id, note.id)} className="text-accent-gold text-xs hover:text-text-light transition-colors">Enregistrer</button>
                                  <button onClick={() => setEditingContactNote(prev => ({ ...prev, [c.id]: null }))} className="text-text-grey text-xs hover:text-text-light transition-colors">Annuler</button>
                                </>
                              ) : (
                                <span className="text-xs text-text-light">{note.text}</span>
                              )}
                              {(user.email === note.author || user.email === 'dev.hamhami@gmail.com') && editingContactNote[c.id] !== note.id && (
                                <>
                                  <button onClick={() => handleEditContactNote(c.id, note.id, note.text)} className="text-accent-gold text-xs hover:text-text-light transition-colors">Modifier</button>
                                  <button onClick={() => handleDeleteContactNote(c.id, note.id)} className="text-red-400 text-xs hover:text-red-300 transition-colors">Supprimer</button>
                                </>
                              )}
                            </li>
                          ))}
                        </ul>
                        <div className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={contactNoteInputs[c.id] || ''}
                            onChange={e => setContactNoteInputs(prev => ({ ...prev, [c.id]: e.target.value }))}
                            placeholder="Ajouter une note..."
                            className="border border-divider-grey rounded px-3 py-2 text-sm w-full bg-primary-dark text-text-light placeholder-text-grey"
                          />
                          <button
                            onClick={() => handleAddContactNote(c.id)}
                            className="px-4 py-2 bg-accent-gold text-primary-dark rounded-lg hover:bg-secondary-green hover:text-text-light font-semibold text-sm transition-colors"
                          >
                            Ajouter
                          </button>
                        </div>
                      </div>
                    </div>
                    {user && user.email === 'dev.hamhami@gmail.com' && (
                      <button
                        onClick={() => handleDelete('contacts', c.id)}
                        className="ml-4 px-4 py-2 bg-red-600 text-text-light rounded-lg hover:bg-red-700 text-sm transition-colors"
                      >
                        Supprimer
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
      {/* Modale d'envoi d'e-mail */}
      <ReactModal
        isOpen={showQuoteEmailModal}
        onRequestClose={() => setShowQuoteEmailModal(false)}
        contentLabel="Envoyer un e-mail au client"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-40 z-40"
      >
        <div className="bg-white dark:bg-primary-dark rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-4 sm:p-6 md:p-8 relative border border-divider-grey overflow-y-auto max-h-[90vh] transition-colors duration-300">
          <button className="absolute top-2 right-2 text-text-grey hover:text-primary-dark dark:hover:text-text-light transition-colors" onClick={() => setShowQuoteEmailModal(false)}>&times;</button>
          <h2 className="text-xl font-bold mb-4 text-primary-dark dark:text-text-light">Générer et envoyer un e-mail au client</h2>
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary-dark dark:text-text-light">Nom du client</label>
              <input type="text" className="w-full border border-divider-grey rounded px-3 py-2 bg-white text-primary-dark placeholder:text-gray-500 dark:bg-secondary-green dark:text-text-light dark:placeholder:text-text-grey" value={emailForm.name || ''} onChange={e => handleChangeEmailForm('name', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-dark dark:text-text-light">Email</label>
              <input type="email" className="w-full border border-divider-grey rounded px-3 py-2 bg-white text-primary-dark placeholder:text-gray-500 dark:bg-secondary-green dark:text-text-light dark:placeholder:text-text-grey" value={emailForm.email || ''} onChange={e => handleChangeEmailForm('email', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-dark dark:text-text-light">Numéro de devis</label>
              <input type="text" className="w-full border border-divider-grey rounded px-3 py-2 bg-white text-primary-dark placeholder:text-gray-500 dark:bg-secondary-green dark:text-text-light dark:placeholder:text-text-grey" value={emailForm.id || ''} onChange={e => handleChangeEmailForm('id', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-dark dark:text-text-light">Prix proposé</label>
              <input type="text" className="w-full border border-divider-grey rounded px-3 py-2 bg-white text-primary-dark placeholder:text-gray-500 dark:bg-secondary-green dark:text-text-light dark:placeholder:text-text-grey" value={emailForm.amount || ''} onChange={e => handleChangeEmailForm('amount', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-dark dark:text-text-light">Date/heure de la prestation</label>
              <input type="text" className="w-full border border-divider-grey rounded px-3 py-2 bg-white text-primary-dark placeholder:text-gray-500 dark:bg-secondary-green dark:text-text-light dark:placeholder:text-text-grey" value={emailForm.date || ''} onChange={e => handleChangeEmailForm('date', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-dark dark:text-text-light">Adresse de départ</label>
              <input type="text" className="w-full border border-divider-grey rounded px-3 py-2 bg-white text-primary-dark placeholder:text-gray-500 dark:bg-secondary-green dark:text-text-light dark:placeholder:text-text-grey" value={emailForm.pickup || ''} onChange={e => handleChangeEmailForm('pickup', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-dark dark:text-text-light">Adresse d'arrivée</label>
              <input type="text" className="w-full border border-divider-grey rounded px-3 py-2 bg-white text-primary-dark placeholder:text-gray-500 dark:bg-secondary-green dark:text-text-light dark:placeholder:text-text-grey" value={emailForm.delivery || ''} onChange={e => handleChangeEmailForm('delivery', e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-primary-dark dark:text-text-light">Options spécifiques</label>
              <input type="text" className="w-full border border-divider-grey rounded px-3 py-2 bg-white text-primary-dark placeholder:text-gray-500 dark:bg-secondary-green dark:text-text-light dark:placeholder:text-text-grey" value={emailForm.options || ''} onChange={e => handleChangeEmailForm('options', e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-primary-dark dark:text-text-light">Remarques ou instructions personnalisées</label>
              <input type="text" className="w-full border border-divider-grey rounded px-3 py-2 bg-white text-primary-dark placeholder:text-gray-500 dark:bg-secondary-green dark:text-text-light dark:placeholder:text-text-grey" value={emailForm.remarks || ''} onChange={e => handleChangeEmailForm('remarks', e.target.value)} />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-primary-dark dark:text-text-light">Objet de l'e-mail</label>
            <input
              type="text"
              className="w-full border border-divider-grey rounded px-3 py-2 bg-white text-primary-dark placeholder:text-gray-500 dark:bg-secondary-green dark:text-text-light dark:placeholder:text-text-grey"
              value={emailForm.objet || ''}
              onChange={e => handleChangeEmailForm('objet', e.target.value)}
              placeholder="Ex : Confirmation de devis"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-primary-dark dark:text-text-light">Modèle d'e-mail</label>
            <select className="w-full border border-divider-grey rounded px-3 py-2 bg-white text-primary-dark placeholder:text-gray-500 dark:bg-secondary-green dark:text-text-light dark:placeholder:text-text-grey" value={emailTemplate} onChange={e => handleChangeEmailTemplate(e.target.value)}>
              {EMAIL_TEMPLATES.map(t => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-primary-dark dark:text-text-light">Message généré</label>
            <textarea className="w-full border border-divider-grey rounded px-3 py-2 min-h-[120px] bg-white text-primary-dark placeholder:text-gray-500 dark:bg-secondary-green dark:text-text-light dark:placeholder:text-text-grey" value={emailBody} onChange={e => setEmailBody(e.target.value)} />
          </div>
          {emailError && <div className="text-red-400 mb-2">{emailError}</div>}
          {emailSuccess && <div className="text-green-400 mb-2">{emailSuccess}</div>}
          <EmailPreview subject={emailForm.objet || EMAIL_TEMPLATES.find(t => t.id === emailTemplate)?.label || ''} body={emailBody} data={emailForm} />
          <div className="flex justify-end mt-4">
            <button
              className="px-4 py-2 bg-accent-gold text-primary-dark rounded-lg hover:bg-secondary-green hover:text-text-light transition-colors"
              onClick={() => setShowPreviewModal(true)}
            >
              Aperçu complet du mail
            </button>
          </div>
        </div>
      </ReactModal>
      {/* Modale d'aperçu complet */}
      <ReactModal
        isOpen={showPreviewModal}
        onRequestClose={() => setShowPreviewModal(false)}
        contentLabel="Aperçu complet du mail"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-40 z-40"
      >
        <div className="bg-white dark:bg-primary-dark rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-6 sm:p-8 relative border border-divider-grey overflow-y-auto max-h-[90vh] transition-colors duration-300">
          <button className="absolute top-2 right-2 text-text-grey hover:text-primary-dark dark:hover:text-text-light transition-colors text-3xl" onClick={() => setShowPreviewModal(false)}>&times;</button>
          <EmailPreview subject={emailForm.objet || EMAIL_TEMPLATES.find(t => t.id === emailTemplate)?.label || ''} body={emailBody} data={emailForm} />
          <div className="flex justify-end gap-2 mt-6">
            <button
              className="px-4 py-2 bg-secondary-green text-text-light rounded-lg hover:bg-accent-gold hover:text-primary-dark transition-colors"
              onClick={() => setShowPreviewModal(false)}
            >
              Modifier
            </button>
            <button
              className="px-4 py-2 bg-accent-gold text-primary-dark rounded-lg hover:bg-secondary-green hover:text-text-light transition-colors"
              onClick={handleSendQuoteEmail}
              disabled={sendingEmail}
            >
              {sendingEmail ? 'Envoi...' : "Envoyer maintenant"}
            </button>
          </div>
          {emailError && <div className="text-red-400 mt-2">{emailError}</div>}
          {emailSuccess && <div className="text-green-400 mt-2">{emailSuccess}</div>}
        </div>
      </ReactModal>
    </div>
  );
}

// Composant d'aperçu d'email stylisé
function EmailPreview({ subject, body, data }: { subject: string, body: string, data: any }) {
  return (
    <div className="bg-white dark:bg-primary-dark border border-divider-grey rounded-xl shadow p-6 max-w-2xl mx-auto my-6 transition-colors duration-300">
      <div className="flex items-center mb-4">
        <img src="/logo-transplease-blanc.svg" alt="Logo Transplease" className="h-12 mr-4" />
        <div>
          <div className="text-lg font-bold text-primary-dark dark:text-text-light">Transplease</div>
          <div className="text-xs text-text-grey">contact@transplease.fr | 01 48 61 15 64</div>
        </div>
      </div>
      <div className="mb-2 text-sm text-text-grey"><span className="font-semibold">Objet :</span> {subject}</div>
      <div className="bg-gray-50 dark:bg-secondary-green border border-gray-100 dark:border-divider-grey rounded p-4 whitespace-pre-line text-gray-900 dark:text-text-light text-base mb-4 transition-colors duration-300" style={{fontFamily:'Segoe UI,Arial,sans-serif'}}>
        {body}
      </div>
      <div className="mt-6 border-t border-divider-grey pt-4 text-sm text-text-grey">
        <div className="font-semibold">Cordialement,</div>
        <div>L'équipe Transplease</div>
        <div className="text-xs text-text-grey mt-2">contact@transplease.fr | 01 48 61 15 64</div>
      </div>
    </div>
  );
}