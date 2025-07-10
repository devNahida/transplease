import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

console.log('SuperAdminPage MONTÉ');

export default function SuperAdminPage() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ email: '', name: '', role: 'admin' });
  const [editId, setEditId] = useState<string | null>(null);
  const [editAdmin, setEditAdmin] = useState({ email: '', name: '', role: 'admin' });

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, 'admins'), orderBy('email')));
      const adminsList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('adminsList:', adminsList);
      setAdmins(adminsList);
      if (adminsList.length === 0) {
        console.warn('Aucun admin trouvé dans Firestore !');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des admins:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u === null) {
        console.log('Auth pas encore prêt, on attend...');
        return;
      }
      if (!u.email) {
        console.log('Utilisateur sans email, redirection.');
        window.location.href = '/';
        return;
      }
      // Vérifier le rôle dans Firestore
      const snap = await getDocs(query(collection(db, 'admins')));
      const allAdmins = snap.docs.map(doc => doc.data());
      console.log('Tous les emails admins Firestore:', allAdmins.map(a => a.email));
      const admin = allAdmins.find(
        a => a.email && u.email && a.email.trim().toLowerCase() === u.email.trim().toLowerCase()
      );
      console.log('Résultat comparaison superadmin:', admin);
      if (admin && admin.role === 'superadmin') {
        setIsSuperAdmin(true);
      } else {
        setIsSuperAdmin(false);
        console.log('Pas superadmin, redirection.');
        window.location.href = '/';
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !isSuperAdmin) return;
    fetchAdmins();
    // eslint-disable-next-line
  }, [user, isSuperAdmin]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdmin.email) return;
    await addDoc(collection(db, 'admins'), newAdmin);
    setNewAdmin({ email: '', name: '', role: 'admin' });
    fetchAdmins();
  };

  const handleEdit = (admin: any) => {
    setEditId(admin.id);
    setEditAdmin({ email: admin.email, name: admin.name || '', role: admin.role || 'admin' });
  };

  const handleSave = async () => {
    if (!editId) return;
    await updateDoc(doc(db, 'admins', editId), editAdmin);
    setEditId(null);
    fetchAdmins();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer cet admin ?')) return;
    await deleteDoc(doc(db, 'admins', id));
    fetchAdmins();
  };

  if (!user || !isSuperAdmin) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-primary-dark min-h-screen transition-colors duration-300">
      <div className="max-w-2xl mx-auto py-8">
        <div className="flex items-center justify-center mb-8">
          <img
            src="/logo-transplease-noir.svg"
            alt="Logo Transplease"
            className="h-16 mr-4 block dark:hidden"
          />
          <img
            src="/logo-transplease-blanc.svg"
            alt="Logo Transplease"
            className="h-16 mr-4 hidden dark:block"
          />
          <h1 className="text-3xl font-bold text-primary-dark dark:text-text-light text-center">Gestion des administrateurs</h1>
        </div>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2 mb-6 bg-white dark:bg-secondary-green p-4 rounded-lg shadow-md border border-divider-grey transition-colors">
          <input
            type="email"
            placeholder="Email de l'admin"
            value={newAdmin.email}
            onChange={e => setNewAdmin(a => ({ ...a, email: e.target.value }))}
            className="border border-divider-grey rounded px-3 py-2 flex-1 bg-primary-dark dark:bg-secondary-green text-text-light placeholder-text-grey"
            required
          />
          <input
            type="text"
            placeholder="Nom (optionnel)"
            value={newAdmin.name}
            onChange={e => setNewAdmin(a => ({ ...a, name: e.target.value }))}
            className="border border-divider-grey rounded px-3 py-2 flex-1 bg-primary-dark dark:bg-secondary-green text-text-light placeholder-text-grey"
          />
          <select
            value={newAdmin.role}
            onChange={e => setNewAdmin(a => ({ ...a, role: e.target.value }))}
            className="border border-divider-grey rounded px-3 py-2 bg-primary-dark dark:bg-secondary-green text-text-light"
          >
            <option value="admin">Admin</option>
            <option value="superadmin">Superadmin</option>
          </select>
          <button type="submit" className="bg-accent-gold text-primary-dark px-4 py-2 rounded-lg font-semibold hover:bg-secondary-green hover:text-text-light transition-colors shadow">Ajouter</button>
        </form>
        {loading ? (
          <div className="text-text-grey">Chargement...</div>
        ) : (
          admins.length === 0 ? (
            <div className="text-red-600 font-bold">Aucun administrateur trouvé dans Firestore !</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border border-divider-grey rounded-lg bg-white dark:bg-secondary-green shadow-md transition-colors">
                <thead>
                  <tr className="bg-gray-100 dark:bg-primary-dark">
                    <th className="p-2 text-left text-primary-dark dark:text-text-light">Email</th>
                    <th className="p-2 text-left text-primary-dark dark:text-text-light">Nom</th>
                    <th className="p-2 text-left text-primary-dark dark:text-text-light">Rôle</th>
                    <th className="p-2 text-primary-dark dark:text-text-light">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map(admin => (
                    <tr key={admin.id} className="border-t border-divider-grey">
                      <td className="p-2">
                        {editId === admin.id ? (
                          <input
                            type="email"
                            value={editAdmin.email}
                            onChange={e => setEditAdmin(a => ({ ...a, email: e.target.value }))}
                            className="border border-divider-grey rounded px-2 py-1 w-full bg-primary-dark dark:bg-secondary-green text-text-light"
                          />
                        ) : (
                          <span className="text-primary-dark dark:text-text-light">{admin.email}</span>
                        )}
                      </td>
                      <td className="p-2">
                        {editId === admin.id ? (
                          <input
                            type="text"
                            value={editAdmin.name}
                            onChange={e => setEditAdmin(a => ({ ...a, name: e.target.value }))}
                            className="border border-divider-grey rounded px-2 py-1 w-full bg-primary-dark dark:bg-secondary-green text-text-light"
                          />
                        ) : (
                          <span className="text-primary-dark dark:text-text-light">{admin.name || ''}</span>
                        )}
                      </td>
                      <td className="p-2">
                        {editId === admin.id ? (
                          <select
                            value={editAdmin.role}
                            onChange={e => setEditAdmin(a => ({ ...a, role: e.target.value }))}
                            className="border border-divider-grey rounded px-2 py-1 bg-primary-dark dark:bg-secondary-green text-text-light"
                          >
                            <option value="admin">Admin</option>
                            <option value="superadmin">Superadmin</option>
                          </select>
                        ) : (
                          <span className="text-primary-dark dark:text-text-light">{admin.role || 'admin'}</span>
                        )}
                      </td>
                      <td className="p-2 flex gap-2">
                        {editId === admin.id ? (
                          <>
                            <button onClick={handleSave} className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors">Enregistrer</button>
                            <button onClick={() => setEditId(null)} className="bg-gray-300 dark:bg-primary-dark text-gray-800 dark:text-text-light px-3 py-1 rounded text-xs hover:bg-gray-400 dark:hover:bg-secondary-green transition-colors">Annuler</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleEdit(admin)} className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors">Modifier</button>
                            <button onClick={() => handleDelete(admin.id)} className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors">Supprimer</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  );
} 