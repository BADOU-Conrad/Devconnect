import { useState } from 'react'

type SignupPayload = {
  username: string
  email: string
  password: string
}

export default function Signup() {
  const [form, setForm] = useState<SignupPayload>({ username: '', email: '', password: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const API_BASE = 'https://widowly-unsmoothly-latonia.ngrok-free.dev/api/auth'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage(null)
    setIsSubmitting(true)
    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || 'Inscription échouée')
      }
      setMessage('Inscription réussie. Vous pouvez vous connecter.')
      setForm({ username: '', email: '', password: '' })
    } catch (err) {
      const error = err as Error
      setMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  function onChange<K extends keyof SignupPayload>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }))
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">INSCRIPTION</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <input type="text" placeholder="Pseudo" value={form.username} onChange={onChange('username')} className="auth-input" required />
          <input type="email" placeholder="Email" value={form.email} onChange={onChange('email')} className="auth-input" required />
          <input type="password" placeholder="Mot de passe" value={form.password} onChange={onChange('password')} className="auth-input" required />
          <button type="submit" className="auth-button" disabled={isSubmitting}>{isSubmitting ? 'En cours…' : 'Inscription'}</button>
        </form>
        {message && <p className="auth-message">{message}</p>}
      </div>
    </div>
  )
}


