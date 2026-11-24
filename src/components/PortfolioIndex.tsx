import { useEffect, useRef, useState } from 'react';

export interface PortfolioItem {
  title: string;
  slug: string;
  subtitle: string;
  location: string;
  category: 'Hospitality' | 'F&B' | 'Real Estate & Platforms' | 'Archive';
  year: string;
  summary: string;
  services: string[];
  techStack: string[];
  accentColor: string;
  featured: boolean;
  thumbnail?: string;
  reel?: string;
  logo?: string;
}

interface Props {
  projects: PortfolioItem[];
  showAllByDefault?: boolean;
}

const CATEGORIES = ['All', 'Hospitality', 'F&B', 'Archive'] as const;

export default function PortfolioIndex({ projects, showAllByDefault = false }: Props) {
  const [activeCategory, setActiveCategory] = useState<(typeof CATEGORIES)[number]>('All');
  const [hovered, setHovered] = useState<PortfolioItem | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const filtered = projects.filter((p) => {
    if (activeCategory === 'All') {
      return showAllByDefault ? true : p.featured;
    }
    return p.category === activeCategory;
  });

  useEffect(() => {
    if (hovered) {
      document.documentElement.style.setProperty('--ambient-accent', hovered.accentColor);
    } else {
      document.documentElement.style.setProperty('--ambient-accent', '#d4a373');
    }
  }, [hovered]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!previewRef.current) return;
    const x = Math.min(window.innerWidth - 360, Math.max(24, e.clientX + 28));
    const y = Math.min(window.innerHeight - 260, Math.max(24, e.clientY - 120));
    previewRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  return (
    <div className="relative" onMouseMove={handleMouseMove}>
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-6">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`border px-4 py-1.5 text-[11px] font-medium tracking-[0.16em] uppercase transition ${
                isActive
                  ? 'border-[#F5F5F3] bg-[#F5F5F3] text-[#0A0A0B]'
                  : 'border-white/15 text-neutral-400 hover:border-white/40 hover:text-white'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Project Rows */}
      <div className="divide-y divide-white/10 border-b border-white/10">
        {filtered.map((project, idx) => (
          <a
            key={project.slug}
            href={`/work/${project.slug}/`}
            data-cursor-label="View Case"
            onMouseEnter={() => setHovered(project)}
            onMouseLeave={() => setHovered(null)}
            className="group grid grid-cols-1 gap-4 py-7 transition-colors hover:bg-white/[0.02] md:grid-cols-12 md:items-center md:px-3"
          >
            <div className="flex items-center gap-4 md:col-span-5">
              <span className="w-7 text-xs font-medium text-neutral-500">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <div>
                <h3
                  className="text-xl font-semibold tracking-tight text-[#F5F5F3] transition-transform duration-300 group-hover:translate-x-1.5 sm:text-2xl"
                  style={{ viewTransitionName: `project-title-${project.slug}` }}
                >
                  {project.title}
                </h3>
                <p className="mt-1 text-xs text-neutral-400">{project.subtitle}</p>
              </div>
            </div>

            <div className="text-xs tracking-[0.12em] text-neutral-400 uppercase md:col-span-3">
              {project.location}
            </div>

            <div className="flex flex-wrap gap-1.5 md:col-span-3">
              {project.techStack.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="border border-white/10 px-2.5 py-0.5 text-[10px] tracking-[0.1em] text-neutral-300 uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-400 md:col-span-1 md:justify-end">
              <span>{project.year}</span>
              <span className="ml-3 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white md:hidden">
                →
              </span>
            </div>
          </a>
        ))}
      </div>

      {/* Hover-Tracking Floating Preview Card (Desktop) */}
      <div
        ref={previewRef}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 z-40 hidden w-[320px] overflow-hidden border border-white/20 bg-[#121214] shadow-2xl transition-opacity duration-200 lg:block ${
          hovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {hovered && (
          <div>
            <div
              className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900"
              style={{
                background: `radial-gradient(circle at 30% 20%, ${hovered.accentColor}33, #111113 75%)`,
              }}
            >
              {hovered.reel ? (
                <video
                  src={hovered.reel}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : hovered.thumbnail ? (
                <img
                  src={hovered.thumbnail}
                  alt={hovered.title}
                  className="h-full w-full object-cover opacity-90"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center p-6">
                  <span className="text-center text-lg font-semibold tracking-tight text-white/90">
                    {hovered.title}
                  </span>
                </div>
              )}
              <div
                className="absolute inset-x-0 bottom-0 h-1"
                style={{ backgroundColor: hovered.accentColor }}
              />
            </div>
            <div className="flex items-center justify-between px-4 py-3 text-[11px] tracking-[0.14em] text-neutral-300 uppercase">
              <span>{hovered.category}</span>
              <span style={{ color: hovered.accentColor }}>{hovered.year}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
