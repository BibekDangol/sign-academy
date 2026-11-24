import { Link } from 'react-router-dom';
import PageLayout from '../layout/PageLayout';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import './AuthForm.css';

export function FormError({ id, children }) {
  return children ? <p id={id} role="alert" className="m-0 text-left text-sm text-red-700">{children}</p> : null;
}

export function AuthField({ id, label, error, errorId = `${id}-error`, ...props }) {
  return <div className="auth-field">
    <Label htmlFor={id}>{label}</Label>
    <Input {...props} id={id} name={id} required className="auth-input"
      aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} />
    <FormError id={errorId}>{error}</FormError>
  </div>;
}

export default function AuthForm({ title, description, label, onSubmit, submitting,
  submitLabel, pendingLabel, error, children, linkPrompt, linkTo, linkLabel }) {
  return <PageLayout>
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="auth-title">
        <header className="auth-heading">
          <p className="auth-eyebrow">Sign Academy</p>
          <h1 id="auth-title">{title}</h1>
          <p className="auth-description">{description}</p>
        </header>
        <form onSubmit={onSubmit} noValidate aria-label={label} aria-busy={submitting} className="auth-form">
          {children}
          <FormError>{error}</FormError>
          <Button type="submit" disabled={submitting} className="auth-submit">
            {submitting ? pendingLabel : submitLabel}
          </Button>
          <p className="auth-switch">
            {linkPrompt} <Link to={linkTo}>{linkLabel}</Link>
          </p>
        </form>
      </section>
    </main>
  </PageLayout>;
}
