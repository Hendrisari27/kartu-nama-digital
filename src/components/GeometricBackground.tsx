import React from 'react';

export const GeometricBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      <svg
        className="absolute right-0 top-0 w-full h-full"
        viewBox="0 0 1050 600"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle gradient mask to fade geometric pattern from right to center */}
          <linearGradient id="facetFade" x1="100%" y1="50%" x2="35%" y2="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="60%" stopColor="#ffffff" stopOpacity="0.75" />
            <stop offset="85%" stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          <mask id="fadeMask">
            <rect x="0" y="0" width="1050" height="600" fill="url(#facetFade)" />
          </mask>
        </defs>

        {/* Group with fade mask */}
        <g mask="url(#fadeMask)">
          {/* Row 0 / Top edge triangles & diamonds */}
          <polygon points="550,-50 675,75 550,200 425,75" fill="#f8fafc" />
          <polygon points="675,75 800,-50 925,75 800,200" fill="#f1f5f9" />
          <polygon points="800,-50 925,75 1050,-50" fill="#e2e8f0" />
          <polygon points="925,75 1050,-50 1175,75 1050,200" fill="#f8fafc" />

          {/* Row 1 / Upper Mid */}
          <polygon points="425,75 550,200 425,325 300,200" fill="#ffffff" />
          <polygon points="550,200 675,75 800,200 675,325" fill="#e8edf2" />
          <polygon points="675,75 800,200 925,75" fill="#f4f6f9" />
          <polygon points="800,200 925,75 1050,200 925,325" fill="#edf1f5" />
          <polygon points="925,75 1050,200 1175,75" fill="#e5ebf0" />
          <polygon points="1050,200 1175,75 1250,150 1125,275" fill="#f8fafc" />

          {/* Row 2 / Center */}
          <polygon points="300,200 425,325 300,450 175,325" fill="#ffffff" />
          <polygon points="425,325 550,200 675,325 550,450" fill="#f5f7fa" />
          <polygon points="675,325 800,200 925,325 800,450" fill="#e2e8f0" />
          <polygon points="925,325 1050,200 1175,325 1050,450" fill="#ebf0f4" />

          {/* Row 3 / Lower Mid */}
          <polygon points="425,325 550,450 425,575 300,450" fill="#ffffff" />
          <polygon points="550,450 675,325 800,450 675,575" fill="#edf2f7" />
          <polygon points="675,325 800,450 925,325" fill="#dee5ec" />
          <polygon points="800,450 925,325 1050,450 925,575" fill="#e8edf3" />
          <polygon points="925,325 1050,450 1175,325" fill="#dfe5ec" />
          <polygon points="1050,450 1175,325 1250,400 1125,525" fill="#eef2f6" />

          {/* Row 4 / Bottom Edge */}
          <polygon points="550,450 675,575 550,700 425,575" fill="#f8fafc" />
          <polygon points="675,575 800,450 925,575 800,700" fill="#e2e8f0" />
          <polygon points="800,700 925,575 1050,700" fill="#cbd5e1" />
          <polygon points="925,575 1050,450 1175,575 1050,700" fill="#eaeff5" />

          {/* Additional micro facets for smooth transition & depth */}
          <polygon points="550,200 675,325 550,325" fill="#edf2f7" opacity="0.6" />
          <polygon points="800,200 925,325 800,325" fill="#cbd5e1" opacity="0.4" />
          <polygon points="675,325 800,450 675,450" fill="#cbd5e1" opacity="0.5" />
          <polygon points="925,325 1050,450 925,450" fill="#cbd5e1" opacity="0.4" />
        </g>
      </svg>
    </div>
  );
};
