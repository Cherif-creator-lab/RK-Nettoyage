import { useEffect, useMemo, useState, type FormEvent } from 'react'

export interface QuoteOption {
  value: string
  label: string
}

interface QuoteFormProps {
  services: QuoteOption[]
  zones: QuoteOption[]
  contactEmail?: string
  web3formsKey?: string
  formspreeUrl?: string
  calcomUrl?: string
}

const TIME_SLOTS = ['08:30', '10:00', '11:30', '14:00', '15:30', '17:00']

/** Génère les 12 prochains jours ouvrés (lundi à samedi) */
function getNextWorkingDays(count = 12) {
  const days: { iso: string; dayName: string; dayNum: string; month: string; fullLabel: string }[] = []
  const cursor = new Date()
  cursor.setHours(12, 0, 0, 0)

  while (days.length < count) {
    cursor.setDate(cursor.getDate() + 1)
    if (cursor.getDay() === 0) continue // exclut le dimanche
    const iso = cursor.toISOString().slice(0, 10)
    const dayName = new Intl.DateTimeFormat('fr-FR', { weekday: 'short' }).format(cursor).replace('.', '')
    const dayNum = new Intl.DateTimeFormat('fr-FR', { day: '2-digit' }).format(cursor)
    const month = new Intl.DateTimeFormat('fr-FR', { month: 'short' }).format(cursor).replace('.', '')
    const fullLabel = new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(cursor)
    days.push({ iso, dayName, dayNum, month, fullLabel })
  }
  return days
}

export default function QuoteForm({
  services,
  zones,
  contactEmail,
  web3formsKey,
  formspreeUrl,
  calcomUrl,
}: QuoteFormProps) {
  const workingDays = useMemo(() => getNextWorkingDays(12), [])

  const [name, setName] = useState('')
  const [clientType, setClientType] = useState('Particulier')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [service, setService] = useState('')
  const [zone, setZone] = useState('')
  const [selectedDate, setSelectedDate] = useState(workingDays[0]?.iso ?? '')
  const [selectedSlot, setSelectedSlot] = useState('10:00')
  const [message, setMessage] = useState('')
  const [botcheck, setBotcheck] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submittedInfo, setSubmittedInfo] = useState<{
    dateLabel: string
    slot: string
    serviceLabel: string
    zoneLabel: string
    mode: 'api' | 'mailto'
  } | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const preService = params.get('prestation')
    const preZone = params.get('zone')
    if (preService && services.some((s) => s.value === preService)) setService(preService)
    if (preZone && zones.some((z) => z.value === preZone)) setZone(preZone)
  }, [services, zones])

  const selectedDayObj = workingDays.find((d) => d.iso === selectedDate)
  const serviceLabel = services.find((s) => s.value === service)?.label ?? (service || 'À préciser')
  const zoneLabel = zones.find((z) => z.value === zone)?.label ?? (zone || 'À préciser')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (botcheck) return // honeypot anti-spam
    if (!name.trim() || !phone.trim() || !email.trim() || !service || !zone) {
      setError('Merci de renseigner tous les champs obligatoires (*).')
      return
    }

    const dateLabel = selectedDayObj?.fullLabel ?? selectedDate
    const rdvSummary = `${dateLabel} à ${selectedSlot}`
    const subject = `[RK Nettoyage] Devis & RDV — ${serviceLabel} (${zoneLabel})`

    const payload = {
      subject,
      from_name: name.trim(),
      name: name.trim(),
      clientType,
      phone: phone.trim(),
      email: email.trim(),
      service: serviceLabel,
      zone: zoneLabel,
      rendez_vous: rdvSummary,
      message: message.trim() || 'Aucun détail supplémentaire.',
    }

    // 1. Envoi via Web3Forms si configuré
    if (web3formsKey) {
      setSubmitting(true)
      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ access_key: web3formsKey, ...payload }),
        })
        const data = await res.json()
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Échec de l'envoi du formulaire.")
        }
        setSubmittedInfo({ dateLabel, slot: selectedSlot, serviceLabel, zoneLabel, mode: 'api' })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue lors de l'envoi.")
      } finally {
        setSubmitting(false)
      }
      return
    }

    // 2. Envoi via Formspree si configuré
    if (formspreeUrl) {
      setSubmitting(true)
      try {
        const res = await fetch(formspreeUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error("Échec de l'envoi du formulaire.")
        setSubmittedInfo({ dateLabel, slot: selectedSlot, serviceLabel, zoneLabel, mode: 'api' })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue lors de l'envoi.")
      } finally {
        setSubmitting(false)
      }
      return
    }

    // 3. Repli sans clé API : ouvre un e-mail pré-rempli si l'adresse du client est dans Sanity
    if (contactEmail) {
      const bodyLines = [
        `Bonjour,`,
        ``,
        `Je souhaite demander un devis et réserver un créneau :`,
        `- Nom : ${payload.name} (${payload.clientType})`,
        `- Téléphone : ${payload.phone}`,
        `- E-mail : ${payload.email}`,
        `- Prestation : ${payload.service}`,
        `- Ville : ${payload.zone}`,
        `- Créneau souhaité : ${payload.rendez_vous}`,
        `- Détails : ${payload.message}`,
      ].join('\n')
      window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines)}`
      setSubmittedInfo({ dateLabel, slot: selectedSlot, serviceLabel, zoneLabel, mode: 'mailto' })
      return
    }

    setError(
      "L'envoi par e-mail n'est pas encore configuré : renseignez PUBLIC_WEB3FORMS_KEY dans .env ou l'e-mail de contact dans Sanity.",
    )
  }

  if (submittedInfo) {
    return (
      <div className="card space-y-5 p-6 text-brand-dark md:p-8" role="status">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h3 className="text-2xl font-semibold">
          {submittedInfo.mode === 'api' ? 'Demande envoyée avec succès !' : 'E-mail de demande préparé'}
        </h3>
        <p className="text-sm leading-relaxed text-brand-dark/75">
          {submittedInfo.mode === 'api'
            ? `Votre demande de devis pour « ${submittedInfo.serviceLabel} » à ${submittedInfo.zoneLabel} (créneau souhaité : ${submittedInfo.dateLabel} à ${submittedInfo.slot}) a bien été transmise. Nous vous recontactons très rapidement pour confirmer.`
            : `Votre logiciel de messagerie s'est ouvert avec votre demande pré-remplie pour le ${submittedInfo.dateLabel} à ${submittedInfo.slot}. Cliquez sur Envoyer pour finaliser.`}
        </p>
        <button
          type="button"
          onClick={() => setSubmittedInfo(null)}
          className="btn btn-primary"
        >
          Faire une autre demande
        </button>
      </div>
    )
  }

  const inputClass =
    'mt-2 w-full rounded-xl border border-brand/20 bg-surface/60 px-4 py-3 text-sm text-brand-dark placeholder:text-brand-dark/40 focus:border-brand focus:bg-white focus:outline-none'

  return (
    <form onSubmit={handleSubmit} className="card space-y-6 p-6 text-brand-dark md:p-8" noValidate>
      {/* Honeypot anti-spam invisible */}
      <input
        type="text"
        name="botcheck"
        value={botcheck}
        onChange={(e) => setBotcheck(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="qf-name" className="block text-sm font-medium">
            Nom complet *
          </label>
          <input
            id="qf-name"
            name="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            placeholder="Ex. : Camille Martin"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="qf-type" className="block text-sm font-medium">
            Vous êtes
          </label>
          <select
            id="qf-type"
            name="clientType"
            value={clientType}
            onChange={(e) => setClientType(e.target.value)}
            className={inputClass}
          >
            <option value="Particulier">Particulier</option>
            <option value="Entreprise / Commerce">Entreprise / Commerce</option>
            <option value="Copropriété / Syndic">Copropriété / Syndic</option>
            <option value="Agence immobilière">Agence immobilière</option>
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="qf-phone" className="block text-sm font-medium">
            Téléphone *
          </label>
          <input
            id="qf-phone"
            name="phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            placeholder="06 00 00 00 00"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="qf-email" className="block text-sm font-medium">
            E-mail *
          </label>
          <input
            id="qf-email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="vous@exemple.fr"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="qf-service" className="block text-sm font-medium">
            Prestation souhaitée *
          </label>
          <select
            id="qf-service"
            name="service"
            required
            value={service}
            onChange={(e) => setService(e.target.value)}
            className={inputClass}
          >
            <option value="">Choisir une prestation</option>
            {services.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
            <option value="autre">Autre demande / Multi-services</option>
          </select>
        </div>

        <div>
          <label htmlFor="qf-zone" className="block text-sm font-medium">
            Ville d'intervention *
          </label>
          <select
            id="qf-zone"
            name="zone"
            required
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            className={inputClass}
          >
            <option value="">Choisir une ville</option>
            {zones.map((z) => (
              <option key={z.value} value={z.value}>
                {z.label}
              </option>
            ))}
            <option value="autre">Autre commune</option>
          </select>
        </div>
      </div>

      {/* Calendrier de prise de rendez-vous */}
      <div className="rounded-2xl border border-brand/15 bg-surface/60 p-4 md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium text-brand-dark">Choisissez votre créneau de rendez-vous</p>
          {calcomUrl && (
            <a
              href={calcomUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-brand underline decoration-accent underline-offset-4 hover:text-brand-dark"
            >
              Ouvrir l'agenda Cal.com
            </a>
          )}
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
          {workingDays.map((day) => {
            const active = day.iso === selectedDate
            return (
              <button
                key={day.iso}
                type="button"
                onClick={() => setSelectedDate(day.iso)}
                aria-pressed={active}
                className={`flex flex-col items-center rounded-xl border px-2 py-2.5 text-xs transition ${
                  active
                    ? 'border-brand bg-brand text-white'
                    : 'border-brand/15 bg-white text-brand-dark hover:border-brand/40'
                }`}
              >
                <span className={`capitalize ${active ? 'text-white/80' : 'text-brand-dark/60'}`}>{day.dayName}</span>
                <span className="mt-0.5 text-base font-semibold">{day.dayNum}</span>
                <span className={`capitalize ${active ? 'text-white/80' : 'text-brand-dark/60'}`}>{day.month}</span>
              </button>
            )
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {TIME_SLOTS.map((slot) => {
            const active = slot === selectedSlot
            return (
              <button
                key={slot}
                type="button"
                onClick={() => setSelectedSlot(slot)}
                aria-pressed={active}
                className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                  active
                    ? 'bg-accent text-brand-dark'
                    : 'border border-brand/15 bg-white text-brand-dark hover:border-brand/40'
                }`}
              >
                {slot}
              </button>
            )
          })}
        </div>

        {selectedDayObj && (
          <p className="mt-3 text-xs text-brand-dark/70">
            Créneau sélectionné : <strong className="text-brand-dark">{selectedDayObj.fullLabel} à {selectedSlot}</strong>
          </p>
        )}
      </div>

      <div>
        <label htmlFor="qf-message" className="block text-sm font-medium">
          Détails de votre besoin
        </label>
        <textarea
          id="qf-message"
          name="message"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Surface approximative, fréquence souhaitée, accès, précisions utiles…"
          className={inputClass}
        />
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <button type="submit" disabled={submitting} className="btn btn-primary w-full py-4 disabled:opacity-60 sm:w-auto sm:px-8">
        {submitting ? 'Envoi en cours…' : 'Envoyer ma demande et réserver ce créneau'}
      </button>
    </form>
  )
}
