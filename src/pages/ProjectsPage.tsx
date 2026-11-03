import { useEffect, useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ProjectCard } from '../components/ui/ProjectCard';
import { getProjects, type Project } from '../lib/dbService';
import { SeoHead } from '../components/seo/SeoHead';
import { PAGE_SEO } from '../lib/seoConfig';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]); const [loading, setLoading] = useState(true); const [filter, setFilter] = useState<'All' | 'Coming Soon' | 'In Progress' | 'Sold Out'>('All');
  useEffect(() => { getProjects().then(setProjects).finally(() => setLoading(false)); }, []);
  const visible = filter === 'All' ? projects : projects.filter(project => (project.status === 'Under Construction' ? 'In Progress' : project.status) === filter);
  return <main className="min-h-screen bg-brand-cream"><SeoHead seo={PAGE_SEO.projects} /><Navbar/><section className="bg-brand-navy pt-36 pb-16 islamic-pattern"><div className="container-custom"><p className="text-brand-gold text-xs font-bold uppercase tracking-[.25em]">Kabul developments</p><h1 className="mt-3 text-4xl font-bold text-white">Signature Projects</h1><p className="mt-3 max-w-xl text-white/65">Explore projects by status, then open a project to see its gallery, video, master plan, and apartments by floor.</p></div></section><section className="container-custom py-14"><div className="mb-8 flex flex-wrap gap-2">{(['All','Coming Soon','In Progress','Sold Out'] as const).map(status => <button key={status} onClick={() => setFilter(status)} className={`rounded-xl px-4 py-2 text-sm font-bold ${filter === status ? 'bg-brand-navy text-white' : 'bg-white text-neutral-600 hover:text-brand-navy'}`}>{status}</button>)}</div><div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">{loading ? <p className="text-neutral-500">Loading projects…</p> : visible.length ? visible.map(project => <ProjectCard key={project.id} id={String(project.id)} name={project.name} location={project.location} deliveryDate={project.delivery_date ?? undefined} status={project.status} availableUnits={project.available_units} image={project.image_url || '/logo.png'}/>) : <p className="text-neutral-500">No projects in this category yet.</p>}</div></section><Footer/></main>;
}

