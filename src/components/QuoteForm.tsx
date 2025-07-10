import React, { useState } from 'react';
import { CheckCircle2, User, Package, MapPin, Calendar, Mail, Phone, MessageSquare } from 'lucide-react';
import { Page } from '../App';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface QuoteFormProps {
  onNavigate: (page: Page) => void;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    serviceType: '',
    pickupAddress: '',
    deliveryAddress: '',
    date: '',
    time: '',
    description: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    movingDetails: {
      surface: '',
      rooms: '',
      floorFrom: '',
      floorTo: '',
      elevatorFrom: '',
      elevatorTo: '',
      access: [] as string[],
      volume: '',
      volumeAuto: '',
      specificItems: [] as string[],
      specificOther: '',
      packing: '',
      comments: ''
    },
    expressDetails: {
      parcelType: '',
      weight: '',
      dimensions: '',
      value: '',
      urgent: '',
      instructions: ''
    },
    documentDetails: {
      numPlis: '',
      confidential: '',
      ar: '',
      weight: '',
      instructions: ''
    }
  });
  const [error, setError] = useState('');

  const steps = [
    { number: 1, title: 'Service', icon: Package },
    { number: 2, title: 'Détails', icon: MapPin },
    { number: 3, title: 'Contact', icon: User },
    { number: 4, title: 'Confirmation', icon: CheckCircle2 }
  ];

  const serviceTypes = [
    { id: 'delivery', label: 'Livraison Express', description: 'Livraison rapide de colis' },
    { id: 'moving', label: 'Déménagement', description: 'Service complet de déménagement' },
    { id: 'document', label: 'Envoi de Plis', description: 'Transport sécurisé de documents' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMovingDetailChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      movingDetails: {
        ...prev.movingDetails,
        [field]: value as any
      }
    }));
  };

  const handleExpressDetailChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, expressDetails: { ...prev.expressDetails, [field]: value } }));
  };

  const handleDocumentDetailChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, documentDetails: { ...prev.documentDetails, [field]: value } }));
  };

  const nextStep = () => {
    setError('');
    switch (currentStep) {
      case 1:
        if (!formData.serviceType) {
          setError('Veuillez sélectionner un service.');
          return;
        }
        break;
      case 2:
        if (!formData.pickupAddress || !formData.deliveryAddress || !formData.date) {
          setError('Veuillez remplir toutes les informations de trajet.');
          return;
        }
        break;
      case 3:
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
          setError('Veuillez remplir toutes les informations de contact.');
          return;
        }
        break;
      default:
        break;
    }
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.serviceType !== '';
      case 2:
        return formData.pickupAddress && formData.deliveryAddress && formData.date;
      case 3:
        return formData.firstName && formData.lastName && formData.email && formData.phone;
      default:
        return true;
    }
  };

  // Suggestion automatique du volume
  function suggestedVolume(surface: string, rooms: string) {
    const s = parseInt(surface || '0', 10);
    const r = rooms === '5+' ? 5 : parseInt(rooms || '0', 10);
    if (!s && !r) return '';
    // Suggestion simple : 0.4m³/m² ou 6m³/pièce
    const v1 = s ? Math.round(s * 0.4) : 0;
    const v2 = r ? r * 6 : 0;
    return Math.max(v1, v2).toString();
  }

  // Ajout des infos déménagement dans le message Firestore
  const buildMovingDetailsMessage = (md: any) => {
    if (!md) return '';
    return [
      `--- Détails déménagement ---`,
      `Surface: ${md.surface} m²`,
      `Nombre de pièces: ${md.rooms}`,
      `Étage départ: ${md.floorFrom}, arrivée: ${md.floorTo}`,
      `Ascenseur départ: ${md.elevatorFrom}, arrivée: ${md.elevatorTo}`,
      `Accès: ${(md.access||[]).join(', ')}`,
      `Volume estimé: ${md.volume} m³ (suggestion: ${suggestedVolume(md.surface, md.rooms)} m³)`,
      `Objets spécifiques: ${(md.specificItems||[]).join(', ')}${md.specificOther ? ' - ' + md.specificOther : ''}`,
      `Besoin emballage/démontage: ${md.packing}`,
      `Commentaires: ${md.comments}`
    ].join('\n');
  };

  // Ajout des infos livraison express dans le message Firestore
  const buildExpressDetailsMessage = (ed: any) => {
    if (!ed) return '';
    return [
      `--- Détails livraison express ---`,
      `Type de colis: ${ed.parcelType}`,
      `Poids: ${ed.weight} kg`,
      `Dimensions: ${ed.dimensions}`,
      `Valeur estimée: ${ed.value} €`,
      `Urgent: ${ed.urgent}`,
      `Instructions: ${ed.instructions}`
    ].join('\n');
  };

  // Ajout des infos envoi de plis dans le message Firestore
  const buildDocumentDetailsMessage = (dd: any) => {
    if (!dd) return '';
    return [
      `--- Détails envoi de plis ---`,
      `Nombre de plis: ${dd.numPlis}`,
      `Confidentialité: ${dd.confidential}`,
      `Accusé de réception: ${dd.ar}`,
      `Poids total: ${dd.weight} kg`,
      `Instructions: ${dd.instructions}`
    ].join('\n');
  };

  const submitQuote = async () => {
    setError('');
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      setError('Veuillez remplir toutes les informations de contact.');
      return;
    }
    try {
      await addDoc(collection(db, 'quotes'), {
        name: formData.firstName + ' ' + formData.lastName,
        email: formData.email,
        phone: formData.phone,
        message: `Service: ${formData.serviceType}\nTrajet: ${formData.pickupAddress} -> ${formData.deliveryAddress}\nDate: ${formData.date} ${formData.time}\nTéléphone: ${formData.phone}\nDescription: ${formData.description}${formData.serviceType === 'moving' ? '\n' + buildMovingDetailsMessage(formData.movingDetails) : ''}${formData.serviceType === 'delivery' ? '\n' + buildExpressDetailsMessage(formData.expressDetails) : ''}${formData.serviceType === 'document' ? '\n' + buildDocumentDetailsMessage(formData.documentDetails) : ''}`,
        createdAt: new Date(),
        status: 'En attente',
        internalNote: ''
      });
    alert('Devis envoyé avec succès ! Nous vous recontacterons dans les plus brefs délais.');
      if (onNavigate) onNavigate('home');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'envoi du devis. Vérifiez votre connexion ou contactez-nous.');
      console.error('Erreur Firebase:', err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            
            return (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  isCompleted ? 'bg-green-500 text-white' :
                  isActive ? 'bg-blue-800 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  isActive ? 'text-blue-800' : isCompleted ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`h-px w-16 ml-4 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-96">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
        )}
        {currentStep === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quel service vous intéresse ?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {serviceTypes.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleInputChange('serviceType', service.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-colors ${
                    formData.serviceType === service.id
                      ? 'border-blue-800 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900">{service.label}</h3>
                  <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Détails du transport</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Adresse de prise en charge
                </label>
                <input
                  type="text"
                  value={formData.pickupAddress}
                  onChange={(e) => handleInputChange('pickupAddress', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Adresse complète de départ"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Adresse de livraison
                </label>
                <input
                  type="text"
                  value={formData.deliveryAddress}
                  onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Adresse complète d'arrivée"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Date souhaitée
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heure préférée
                  </label>
                  <select
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner une heure</option>
                    <option value="morning">Matin (8h-12h)</option>
                    <option value="afternoon">Après-midi (12h-18h)</option>
                    <option value="evening">Soirée (18h-20h)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MessageSquare className="inline h-4 w-4 mr-1" />
                  Description détaillée
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Décrivez votre demande en détail (objets à transporter, contraintes particulières...)"
                />
              </div>

              {/* Section Livraison Express */}
              {formData.serviceType === 'delivery' && (
                <div className="bg-blue-50 border-l-4 border-blue-800 p-4 rounded-lg space-y-6 mt-6">
                  <h3 className="text-xl font-semibold text-blue-800 mb-2">Informations pour la livraison express</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type de colis</label>
                    <select value={formData.expressDetails.parcelType} onChange={e => handleExpressDetailChange('parcelType', e.target.value)} className="w-full px-4 py-2 border rounded">
                      <option value="">Sélectionner</option>
                      <option value="document">Document</option>
                      <option value="petit">Petit colis</option>
                      <option value="volumineux">Colis volumineux</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Poids approximatif (kg)</label>
                    <input type="number" min="0" value={formData.expressDetails.weight} onChange={e => handleExpressDetailChange('weight', e.target.value)} className="w-full px-4 py-2 border rounded" placeholder="Ex: 5" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dimensions (L x l x h en cm, optionnel)</label>
                    <input type="text" value={formData.expressDetails.dimensions} onChange={e => handleExpressDetailChange('dimensions', e.target.value)} className="w-full px-4 py-2 border rounded" placeholder="Ex: 40x30x20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Valeur estimée (€)</label>
                    <input type="number" min="0" value={formData.expressDetails.value} onChange={e => handleExpressDetailChange('value', e.target.value)} className="w-full px-4 py-2 border rounded" placeholder="Ex: 200" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Livraison urgente ?</label>
                    <select value={formData.expressDetails.urgent} onChange={e => handleExpressDetailChange('urgent', e.target.value)} className="w-full px-4 py-2 border rounded">
                      <option value="">Sélectionner</option>
                      <option value="oui">Oui</option>
                      <option value="non">Non</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Instructions de livraison</label>
                    <textarea value={formData.expressDetails.instructions} onChange={e => handleExpressDetailChange('instructions', e.target.value)} rows={2} className="w-full px-4 py-2 border rounded" placeholder="Ex: Laisser à la loge, appeler avant, etc." />
                  </div>
                </div>
              )}
              {/* Section Envoi de Plis */}
              {formData.serviceType === 'document' && (
                <div className="bg-blue-50 border-l-4 border-blue-800 p-4 rounded-lg space-y-6 mt-6">
                  <h3 className="text-xl font-semibold text-blue-800 mb-2">Informations pour l'envoi de plis</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de plis</label>
                    <input type="number" min="1" value={formData.documentDetails.numPlis} onChange={e => handleDocumentDetailChange('numPlis', e.target.value)} className="w-full px-4 py-2 border rounded" placeholder="Ex: 3" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confidentialité requise ?</label>
                    <select value={formData.documentDetails.confidential} onChange={e => handleDocumentDetailChange('confidential', e.target.value)} className="w-full px-4 py-2 border rounded">
                      <option value="">Sélectionner</option>
                      <option value="oui">Oui</option>
                      <option value="non">Non</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Accusé de réception ?</label>
                    <select value={formData.documentDetails.ar} onChange={e => handleDocumentDetailChange('ar', e.target.value)} className="w-full px-4 py-2 border rounded">
                      <option value="">Sélectionner</option>
                      <option value="oui">Oui</option>
                      <option value="non">Non</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Poids total (kg)</label>
                    <input type="number" min="0" value={formData.documentDetails.weight} onChange={e => handleDocumentDetailChange('weight', e.target.value)} className="w-full px-4 py-2 border rounded" placeholder="Ex: 1.2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Instructions spéciales</label>
                    <textarea value={formData.documentDetails.instructions} onChange={e => handleDocumentDetailChange('instructions', e.target.value)} rows={2} className="w-full px-4 py-2 border rounded" placeholder="Ex: Remettre en main propre, etc." />
                  </div>
                </div>
              )}
              {/* Section déménagement détaillée */}
              {formData.serviceType === 'moving' && (
                <div className="bg-blue-50 border-l-4 border-blue-800 p-4 rounded-lg space-y-6 mt-6">
                  <h3 className="text-xl font-semibold text-blue-800 mb-2">Informations détaillées pour le déménagement</h3>
                  {/* 1. Surface */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Surface à déménager (m²)</label>
                    <input type="number" min="0" value={formData.movingDetails.surface} onChange={e => handleMovingDetailChange('surface', e.target.value)} className="w-full px-4 py-2 border rounded" placeholder="Ex: 50" />
                  </div>
                  {/* 2. Nombre de pièces */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de pièces</label>
                    <select value={formData.movingDetails.rooms} onChange={e => handleMovingDetailChange('rooms', e.target.value)} className="w-full px-4 py-2 border rounded">
                      <option value="">Sélectionner</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5+">5 ou +</option>
                    </select>
                  </div>
                  {/* 3. Étages */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Étage de départ</label>
                      <input type="number" min="0" value={formData.movingDetails.floorFrom} onChange={e => handleMovingDetailChange('floorFrom', e.target.value)} className="w-full px-4 py-2 border rounded" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Étage d'arrivée</label>
                      <input type="number" min="0" value={formData.movingDetails.floorTo} onChange={e => handleMovingDetailChange('floorTo', e.target.value)} className="w-full px-4 py-2 border rounded" />
                    </div>
                  </div>
                  {/* 4. Ascenseur */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ascenseur au départ</label>
                      <select value={formData.movingDetails.elevatorFrom} onChange={e => handleMovingDetailChange('elevatorFrom', e.target.value)} className="w-full px-4 py-2 border rounded">
                        <option value="">Sélectionner</option>
                        <option value="oui">Oui</option>
                        <option value="non">Non</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ascenseur à l'arrivée</label>
                      <select value={formData.movingDetails.elevatorTo} onChange={e => handleMovingDetailChange('elevatorTo', e.target.value)} className="w-full px-4 py-2 border rounded">
                        <option value="">Sélectionner</option>
                        <option value="oui">Oui</option>
                        <option value="non">Non</option>
                      </select>
                    </div>
                  </div>
                  {/* 5. Accès au logement */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Accès au logement</label>
                    <div className="flex flex-wrap gap-2">
                      {['Accès parking proche','Accès possible par monte-charge','Rue étroite','Pente difficile','Marches ou escaliers extérieurs','Nécessite autorisation de stationnement'].map(opt => (
                        <label key={opt} className="flex items-center gap-1 text-sm">
                          <input type="checkbox" checked={formData.movingDetails.access.includes(opt)} onChange={e => {
                            const checked = e.target.checked;
                            handleMovingDetailChange('access', checked ? [...formData.movingDetails.access,opt] : formData.movingDetails.access.filter(a => a!==opt));
                          }} /> {opt}
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* 6. Volume estimé */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Volume estimé (m³)</label>
                    <div className="flex gap-2 items-center">
                      <input type="number" min="0" value={formData.movingDetails.volume} onChange={e => handleMovingDetailChange('volume', e.target.value)} className="w-32 px-4 py-2 border rounded" placeholder="Ex: 20" />
                      <span className="text-xs text-gray-500">Suggestion : {suggestedVolume(formData.movingDetails.surface, formData.movingDetails.rooms)} m³</span>
                      <button type="button" className="text-blue-700 underline text-xs" onClick={() => handleMovingDetailChange('volume', suggestedVolume(formData.movingDetails.surface, formData.movingDetails.rooms))}>Utiliser la suggestion</button>
                    </div>
                  </div>
                  {/* 7. Objets spécifiques */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Objets spécifiques à déménager</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {['Piano','Électroménager (frigo, machine…)','Meubles lourds','Objets fragiles','Autres'].map(opt => (
                        <label key={opt} className="flex items-center gap-1 text-sm">
                          <input type="checkbox" checked={formData.movingDetails.specificItems.includes(opt)} onChange={e => {
                            const checked = e.target.checked;
                            handleMovingDetailChange('specificItems', checked ? [...formData.movingDetails.specificItems,opt] : formData.movingDetails.specificItems.filter(a => a!==opt));
                          }} /> {opt}
                        </label>
                      ))}
                    </div>
                    {formData.movingDetails.specificItems.includes('Autres') && (
                      <input type="text" value={formData.movingDetails.specificOther} onChange={e => handleMovingDetailChange('specificOther', e.target.value)} className="w-full px-4 py-2 border rounded mt-2" placeholder="Précisez les objets particuliers" />
                    )}
                  </div>
                  {/* 8. Besoin d'emballage ou démontage */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Avez-vous besoin d'emballage ou de démontage ?</label>
                    <select value={formData.movingDetails.packing} onChange={e => handleMovingDetailChange('packing', e.target.value)} className="w-full px-4 py-2 border rounded">
                      <option value="">Sélectionner</option>
                      <option value="oui">Oui</option>
                      <option value="non">Non</option>
                    </select>
                  </div>
                  {/* 10. Commentaires supplémentaires */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Commentaires ou précisions supplémentaires</label>
                    <textarea value={formData.movingDetails.comments} onChange={e => handleMovingDetailChange('comments', e.target.value)} rows={3} className="w-full px-4 py-2 border rounded" placeholder="Ex: Besoin de cartons, accès difficile, objets précieux, etc." />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Vos coordonnées</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Votre prénom"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Votre nom"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline h-4 w-4 mr-1" />
                  Email
                </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="votre@email.com"
                  />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline h-4 w-4 mr-1" />
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="06 12 34 56 78"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Récapitulatif de votre demande</h2>
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900">Service demandé</h3>
                <p className="text-gray-600">
                  {serviceTypes.find(s => s.id === formData.serviceType)?.label}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900">Trajet</h3>
                <p className="text-gray-600">
                  De : {formData.pickupAddress}<br />
                  Vers : {formData.deliveryAddress}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900">Date et heure</h3>
                <p className="text-gray-600">
                  {formData.date} - {formData.time}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900">Contact</h3>
                <p className="text-gray-600">
                  {formData.firstName} {formData.lastName}<br />
                  {formData.email} - {formData.phone}
                </p>
              </div>

              {formData.description && (
                <div>
                  <h3 className="font-semibold text-gray-900">Description</h3>
                  <p className="text-gray-600">{formData.description}</p>
                </div>
              )}

              {formData.serviceType === 'moving' && (
                <div className="mt-4 bg-blue-50 border-l-4 border-blue-800 p-4 rounded-lg space-y-2">
                  <h3 className="font-semibold text-blue-800">Détails déménagement</h3>
                  <div className="text-gray-700 text-sm">
                    <div>Surface : {formData.movingDetails.surface} m²</div>
                    <div>Nombre de pièces : {formData.movingDetails.rooms}</div>
                    <div>Étage départ : {formData.movingDetails.floorFrom}, arrivée : {formData.movingDetails.floorTo}</div>
                    <div>Ascenseur départ : {formData.movingDetails.elevatorFrom}, arrivée : {formData.movingDetails.elevatorTo}</div>
                    <div>Accès : {(formData.movingDetails.access||[]).join(', ')}</div>
                    <div>Volume estimé : {formData.movingDetails.volume} m³ (suggestion : {suggestedVolume(formData.movingDetails.surface, formData.movingDetails.rooms)} m³)</div>
                    <div>Objets spécifiques : {(formData.movingDetails.specificItems||[]).join(', ')}{formData.movingDetails.specificOther ? ' - ' + formData.movingDetails.specificOther : ''}</div>
                    <div>Besoin emballage/démontage : {formData.movingDetails.packing}</div>
                    <div>Commentaires : {formData.movingDetails.comments}</div>
                  </div>
                </div>
              )}

              {formData.serviceType === 'delivery' && (
                <div className="mt-4 bg-blue-50 border-l-4 border-blue-800 p-4 rounded-lg space-y-2">
                  <h3 className="font-semibold text-blue-800">Détails livraison express</h3>
                  <div className="text-gray-700 text-sm">
                    <div>Type de colis : {formData.expressDetails.parcelType}</div>
                    <div>Poids : {formData.expressDetails.weight} kg</div>
                    <div>Dimensions : {formData.expressDetails.dimensions}</div>
                    <div>Valeur estimée : {formData.expressDetails.value} €</div>
                    <div>Urgent : {formData.expressDetails.urgent}</div>
                    <div>Instructions : {formData.expressDetails.instructions}</div>
                  </div>
                </div>
              )}

              {formData.serviceType === 'document' && (
                <div className="mt-4 bg-blue-50 border-l-4 border-blue-800 p-4 rounded-lg space-y-2">
                  <h3 className="font-semibold text-blue-800">Détails envoi de plis</h3>
                  <div className="text-gray-700 text-sm">
                    <div>Nombre de plis : {formData.documentDetails.numPlis}</div>
                    <div>Confidentialité : {formData.documentDetails.confidential}</div>
                    <div>Accusé de réception : {formData.documentDetails.ar}</div>
                    <div>Poids total : {formData.documentDetails.weight} kg</div>
                    <div>Instructions : {formData.documentDetails.instructions}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:text-gray-400"
        >
          Précédent
        </button>
        
        {currentStep < 3 && (
          <button
            onClick={nextStep}
            disabled={!canProceed()}
            className="px-6 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors disabled:bg-gray-400"
          >
            Suivant
          </button>
        )}

        {currentStep === 3 && (
          <button
            onClick={nextStep}
            disabled={!canProceed()}
            className="px-6 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors disabled:bg-gray-400"
          >
            Récapitulatif
          </button>
        )}

        {currentStep === 4 && (
          <button
            onClick={submitQuote}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Envoyer la demande
          </button>
        )}
      </div>
    </div>
  );
};

export default QuoteForm;