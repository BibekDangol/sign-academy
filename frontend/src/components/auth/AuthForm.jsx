import { Link } from 'react-router-dom';
import PageLayout from '../layout/PageLayout';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';

export function FormError({ id, children }) {
  return children ? <p id={id} role="alert" className="m-0 text-left text-sm text-red-700">{children}</p> : null;
}

export function AuthField({ id, label, error, errorId = `${id}-error`, ...props }) {
  return <>
    <Label htmlFor={id}>{label}</Label>
    <Input {...props} id={id} required className="w-full"
      aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined}
      style={{ border: error ? '1px solid #b91c1c' : '1px solid #ccc' }} />
    <FormError id={errorId}>{error}</FormError>
  </>;
}

export default function AuthForm({ title, label, backgroundImage, width, onSubmit, submitting,
  submitLabel, pendingLabel, error, children, linkPrompt, linkTo, linkLabel }) {
  return <PageLayout>
    <div style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover',
      backgroundPosition: 'center', minHeight: '100vh', display: 'flex',
      justifyContent: 'center', alignItems: 'center', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '8px',
        width: `min(${width}px, calc(100% - 2rem))`, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ marginBottom: '20px' }}>{title}</h1>
        <form onSubmit={onSubmit} noValidate aria-label={label} aria-busy={submitting} className="space-y-4">
          {children}
          <FormError>{error}</FormError>
          <Button type="submit" disabled={submitting} className="w-full bg-[#0fb400] hover:bg-[#0bbf3a] text-white">
            {submitting ? pendingLabel : submitLabel}
          </Button>
          <p style={{ marginTop: '15px', fontSize: '14px' }}>
            {linkPrompt} <Link to={linkTo} style={{ color: '#007bff' }}>{linkLabel}</Link>
          </p>
        </form>
      </div>
    </div>
  </PageLayout>;
}
