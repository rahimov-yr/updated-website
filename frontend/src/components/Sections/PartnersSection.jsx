import { useState, useEffect } from 'react'
import { useLanguage } from '../../context/LanguageContext'

export default function PartnersSection() {
  const { t } = useLanguage()
  const [partners, setPartners] = useState([])

  useEffect(() => {
    fetch('/api/partners')
      .then(res => res.json())
      .then(data => {
        // Filter out the organizer's emblem from partners list
        const filtered = data.filter(p =>
          !p.logo?.includes('emblem-tajikistan') &&
          !p.name?.toLowerCase().includes('таджикистан') &&
          !p.name?.toLowerCase().includes('tajikistan')
        )
        setPartners(filtered)
      })
      .catch(() => {})
  }, [])

  return (
    <section className="partners section section--light" id="partners" style={{ position: 'relative', zIndex: 10 }}>
      <div className="partners-section__pattern"></div>
      <div className="container">
        <div className="text-center">
          <h2 className="section-title reveal">{t('partnersSection.organizerTitle')}</h2>
        </div>

        <div className="organizer__content reveal">
          <img
            src="/assets/images/emblem-tajikistan.png"
            alt={t('partnersSection.emblemAlt')}
            className="organizer__emblem"
          />
          <h3 className="organizer__name">{t('partnersSection.governmentName')}</h3>
        </div>

        <div className="text-center" style={{ marginTop: 'var(--space-16)' }}>
          <h2 className="section-title reveal">{t('partnersSection.partnersTitle')}</h2>
        </div>

        <div className="partners__logos-row reveal">
          {partners.map((partner) => (
            <div key={partner.id} className="partners__logo">
              <img src={partner.logo} alt={partner.name} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}