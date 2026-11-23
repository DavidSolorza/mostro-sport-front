import React from 'react';

export const CampoDeportivoSvg: React.FC = () => {
  return (
    <svg className="absolute inset-0 w-full h-full select-none pointer-events-none" viewBox="0 0 1000 625">
      <defs>
        {/* Patrón de césped a franjas verticales alternadas */}
        <pattern id="grassStripes" width="100" height="625" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="50" height="625" fill="#15803d" />
          <rect x="50" y="0" width="50" height="625" fill="#166534" />
        </pattern>
        {/* Malla de portería */}
        <pattern id="goalNet" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
        </pattern>
      </defs>

      {/* Fondo de césped realista */}
      <rect x="0" y="0" width="1000" height="625" fill="url(#grassStripes)" />

      {/* Redes de portería detrás de la línea */}
      <rect x="6" y="272.5" width="24" height="80" fill="url(#goalNet)" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
      <rect x="970" y="272.5" width="24" height="80" fill="url(#goalNet)" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />

      {/* Borde exterior del campo */}
      <rect x="30" y="30" width="940" height="565" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="3.5" rx="2" />

      {/* Línea media y círculo central */}
      <line x1="500" y1="30" x2="500" y2="595" stroke="rgba(255,255,255,0.85)" strokeWidth="3.5" />
      <circle cx="500" cy="312.5" r="91.5" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="3.5" />
      <circle cx="500" cy="312.5" r="4.5" fill="rgba(255,255,255,0.95)" />

      {/* Área grande Local */}
      <rect x="30" y="145" width="165" height="335" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="3.5" />
      {/* Área chica Local */}
      <rect x="30" y="225" width="55" height="175" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="3.5" />
      {/* Punto de penal Local */}
      <circle cx="140" cy="312.5" r="4.5" fill="rgba(255,255,255,0.95)" />
      {/* Arco de penal Local */}
      <path d="M 195 252.5 A 91.5 91.5 0 0 1 195 372.5" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="3.5" />

      {/* Área grande Visitante */}
      <rect x="805" y="145" width="165" height="335" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="3.5" />
      {/* Área chica Visitante */}
      <rect x="915" y="225" width="55" height="175" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="3.5" />
      {/* Punto de penal Visitante */}
      <circle cx="860" cy="312.5" r="4.5" fill="rgba(255,255,255,0.95)" />
      {/* Arco de penal Visitante */}
      <path d="M 805 252.5 A 91.5 91.5 0 0 0 805 372.5" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="3.5" />

      {/* Tiros de esquina (arcos en los 4 vértices) */}
      <path d="M 30 45 A 15 15 0 0 0 45 30" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="3" />
      <path d="M 30 580 A 15 15 0 0 1 45 595" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="3" />
      <path d="M 970 45 A 15 15 0 0 1 955 30" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="3" />
      <path d="M 970 580 A 15 15 0 0 0 955 595" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="3" />
    </svg>
  );
};
