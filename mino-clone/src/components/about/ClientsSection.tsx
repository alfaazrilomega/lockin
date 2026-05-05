const CLIENTS = [
  { name: 'Autonomy Capital', country: 'uk' },
  { name: 'Aires Mateus',     country: 'pt' },
  { name: 'Astet Studio',     country: 'es' },
  { name: 'Civilria',         country: 'pt' },
  { name: 'CostaTerra',       country: 'pt' },
  { name: 'Dekalo Real Estate', country: 'isr' },
  { name: 'Discovery Land',   country: 'usa' },
  { name: 'Dominio Capital',  country: 'pt' },
  { name: 'Emerge',           country: 'pt' },
  { name: 'Eva Architects',   country: 'cn' },
  { name: 'Francisco Tojal',  country: 'pt' },
  { name: 'Gulf Craft',       country: 'uae' },
  { name: 'Isaac Safdie',     country: 'br' },
  { name: 'Joppe Kusters',    country: 'nl' },
  { name: 'Rawajeh Group',    country: 'ksa' },
  { name: 'Nomad Capital',    country: 'pt' },
  { name: 'Masslab',          country: 'pt' },
  { name: 'Maven Investment', country: 'pt' },
  { name: 'Morim Hummitzsch', country: 'no' },
  { name: 'OODA',             country: 'pt' },
  { name: 'Risco',            country: 'pt' },
  { name: 'Saraiva e Associados', country: 'pt' },
  { name: 'Souto de Moura',   country: 'pt' },
  { name: 'Tabnit S.A.',      country: 'pt' },
  { name: 'Ventura + Partners', country: 'pt' },
  { name: 'Wayne',            country: 'ch' },
]

export default function ClientsSection() {
  // Duplicate for seamless loop
  const doubled = [...CLIENTS, ...CLIENTS]

  return (
    <section className="section-py" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', overflow: 'hidden' }}>
      <div className="container" style={{ marginBottom: '40px' }}>
        <p className="text-label" style={{ color: 'var(--text-muted)' }}>Clients &amp; Partners</p>
      </div>

      {/* Scrolling ticker */}
      <div
        style={{
          display: 'flex',
          overflow: 'hidden',
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '48px',
            animation: 'ticker 30s linear infinite',
            whiteSpace: 'nowrap',
          }}
        >
          {doubled.map((client, i) => (
            <span
              key={`${client.name}-${i}`}
              style={{
                fontSize: 'clamp(20px, 3vw, 36px)',
                fontWeight: 500,
                color: i % 4 === 0 ? 'var(--text-primary)' : 'var(--text-muted)',
                letterSpacing: '-0.01em',
                flexShrink: 0,
              }}
            >
              {client.name}{' '}
              <span style={{ fontSize: '0.5em', color: 'var(--accent)', verticalAlign: 'super', letterSpacing: '0.05em' }}>
                {client.country}
              </span>
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}
