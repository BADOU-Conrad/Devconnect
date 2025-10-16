import { useState } from 'react'

type LoginPayload = {
  email: string
  password: string
}

type Props = { onSwitchToSignup?: () => void }

export default function Login({ onSwitchToSignup }: Props) {
  const [form, setForm] = useState<LoginPayload>({ email: '', password: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const API_BASE = 'https://widowly-unsmoothly-latonia.ngrok-free.dev/api/auth'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage(null)
    setIsSubmitting(true)
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || 'Connexion échouée')
      }
      setMessage('Connexion réussie.')
    } catch (err) {
      const error = err as Error
      setMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  function onChange<K extends keyof LoginPayload>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }))
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="logo-diamond">Dev</div>
        <form onSubmit={handleSubmit} className="auth-form">
          <input type="email" placeholder="Email" value={form.email} onChange={onChange('email')} className="auth-input" required />
          <input type="password" placeholder="Mot de passe" value={form.password} onChange={onChange('password')} className="auth-input" required />
          <button type="submit" className="auth-button" disabled={isSubmitting}>{isSubmitting ? 'En cours…' : 'Connexion'}</button>
        </form>
        {message && <p className="auth-message">{message}</p>}
        <div style={{ marginTop: 8 }}>
          <button type="button" className="auth-link" onClick={onSwitchToSignup}>
            Pas encore inscrit ? S'inscrire
          </button>
        </div>
      </div>
    </div>
  )
}


