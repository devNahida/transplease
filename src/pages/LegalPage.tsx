import React from 'react';
import { Page } from '../App';

interface LegalPageProps {
  onNavigate?: (page: Page) => void;
}

const LegalPage: React.FC<LegalPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-white dark:bg-primary-dark min-h-screen transition-colors duration-300">
      {/* Header */}
      <section className="bg-gradient-to-r from-white to-gray-100 dark:from-primary-dark dark:to-secondary-green text-primary-dark dark:text-text-light py-20 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-6">Mentions Légales & RGPD</h1>
          <p className="text-xl text-gray-600 dark:text-text-grey">Informations légales et politique de confidentialité</p>
        </div>
      </section>

      {/* Legal Content */}
      <section className="py-20 bg-white dark:bg-primary-dark transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none dark:prose-invert">
            
            {/* Mentions Légales */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-primary-dark dark:text-text-light mb-6">Mentions Légales</h2>
              
              <div className="bg-secondary-green p-6 rounded-lg mb-8 border border-divider-grey">
                <h3 className="text-lg font-semibold text-text-light mb-4">Informations sur l'entreprise</h3>
                <div className="space-y-2 text-text-light">
                  <p><strong>Raison sociale :</strong> TRANSPLEASE</p>
                  <p><strong>Siège social :</strong> 12 AVENUE DES FAUVETTES
93420 VILLEPINTE</p>
                  <p><strong>SIRET :</strong> 42352166500020</p>
                  <p><strong>RCS :</strong> greffe de BOBIGNY , le 07/07/1999</p>
                  <p><strong>Code APE :</strong> 	49.41B  (Transports routiers de fret de proximité)</p>
                  <p><strong>TVA Intracommunautaire :</strong> FR31423521665</p>
                </div>
              </div>

              <div className="bg-secondary-green p-6 rounded-lg border border-divider-grey">
                <h3 className="text-lg font-semibold text-text-light mb-4">Assurances</h3>
                <div className="space-y-2 text-text-light">
                  <p><strong>Responsabilité civile professionnelle :</strong> AXA France</p>
                  <p><strong>Police n° :</strong> 123456789</p>
                  <p><strong>Assurance marchandises transportées :</strong> Allianz France</p>
                  <p><strong>Couverture :</strong> Jusqu'à 50 000€ par envoi</p>
                </div>
              </div>
            </div>

            {/* RGPD */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-primary-dark dark:text-text-light mb-6">Politique de Confidentialité (RGPD)</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-primary-dark dark:text-text-light mb-3">Collecte des données personnelles</h3>
                  <p className="text-primary-dark dark:text-text-light mb-4">
                    Dans le cadre de nos services de transport, nous collectons les données personnelles suivantes :
                  </p>
                  <ul className="list-disc list-inside text-primary-dark dark:text-text-light space-y-1">
                    <li>Nom, prénom et coordonnées (adresse, téléphone, email)</li>
                    <li>Adresses de prise en charge et de livraison</li>
                    <li>Informations sur les marchandises à transporter</li>
                    <li>Données de géolocalisation lors du transport</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-primary-dark dark:text-text-light mb-3">Finalités du traitement</h3>
                  <p className="text-primary-dark dark:text-text-light mb-4">
                    Vos données personnelles sont utilisées pour :
                  </p>
                  <ul className="list-disc list-inside text-primary-dark dark:text-text-light space-y-1">
                    <li>L'exécution des prestations de transport</li>
                    <li>La facturation et le suivi comptable</li>
                    <li>Le service client et le support technique</li>
                    <li>L'amélioration de nos services</li>
                    <li>Le respect de nos obligations légales</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-primary-dark dark:text-text-light mb-3">Base légale du traitement</h3>
                  <p className="text-primary-dark dark:text-text-light">
                    Le traitement de vos données personnelles est fondé sur l'exécution du contrat de transport
                    et sur nos obligations légales en tant que transporteur professionnel.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-primary-dark dark:text-text-light mb-3">Conservation des données</h3>
                  <p className="text-primary-dark dark:text-text-light">
                    Vos données sont conservées pendant la durée nécessaire à l'exécution des services,
                    puis archivées conformément aux obligations légales (10 ans pour les documents comptables).
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-primary-dark dark:text-text-light mb-3">Vos droits</h3>
                  <p className="text-primary-dark dark:text-text-light mb-4">
                    Conformément au RGPD, vous disposez des droits suivants :
                  </p>
                  <ul className="list-disc list-inside text-primary-dark dark:text-text-light space-y-1">
                    <li>Droit d'accès à vos données personnelles</li>
                    <li>Droit de rectification des données inexactes</li>
                    <li>Droit à l'effacement (sous certaines conditions)</li>
                    <li>Droit à la limitation du traitement</li>
                    <li>Droit à la portabilité des données</li>
                    <li>Droit d'opposition au traitement</li>
                  </ul>
                  <p className="text-primary-dark dark:text-text-light mt-4">
                    Pour exercer ces droits, contactez-nous à : <strong className="text-accent-gold">rgpd@transplease.fr</strong>
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-primary-dark dark:text-text-light mb-3">Sécurité des données</h3>
                  <p className="text-primary-dark dark:text-text-light">
                    Nous mettons en œuvre toutes les mesures techniques et organisationnelles appropriées
                    pour protéger vos données personnelles contre l'accès non autorisé, la perte,
                    la destruction ou la divulgation.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-primary-dark dark:text-text-light mb-3">Cookies</h3>
                  <p className="text-primary-dark dark:text-text-light">
                    Notre site utilise des cookies techniques strictement nécessaires au fonctionnement
                    du service. Aucun cookie publicitaire ou de traçage n'est utilisé sans votre consentement.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-primary-dark dark:text-text-light mb-3">Contact</h3>
                  <div className="bg-secondary-green p-4 rounded-lg border border-divider-grey">
                    <p className="text-primary-dark dark:text-text-light">
                      <strong>Délégué à la Protection des Données (DPO) :</strong><br />
                      Email : rgpd@transplease.fr<br />
                      Téléphone : 01 48 61 15 64<br />
                      Adresse : 12 AVENUE DES FAUVETTES
93420 VILLEPINTE
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Conditions Générales */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-primary-dark dark:text-text-light mb-6">Conditions Générales de Service</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-primary-dark dark:text-text-light mb-3">Article 1 - Objet</h3>
                  <p className="text-primary-dark dark:text-text-light">
                    Les présentes conditions générales définissent les modalités et conditions d'utilisation
                    des services de transport proposés par Transplease.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-primary-dark dark:text-text-light mb-3">Article 2 - Services</h3>
                  <p className="text-primary-dark dark:text-text-light">
                    Transplease propose des services de transport de marchandises, déménagement,
                    livraison express et envoi de plis sur l'ensemble de l'Île-de-France.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-primary-dark dark:text-text-light mb-3">Article 3 - Responsabilité</h3>
                  <p className="text-primary-dark dark:text-text-light">
                    Notre responsabilité est limitée à la valeur déclarée des marchandises transportées,
                    dans la limite de notre couverture d'assurance. Les objets de valeur doivent être
                    déclarés préalablement.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-primary-dark dark:text-text-light mb-3">Article 4 - Tarification</h3>
                  <p className="text-primary-dark dark:text-text-light">
                    Les tarifs sont établis selon la nature du service, la distance et le volume.
                    Un devis détaillé est fourni avant toute prestation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LegalPage;