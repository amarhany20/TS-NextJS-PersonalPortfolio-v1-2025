'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import type { Project } from '@/types/portfolio';

interface PortfolioReorderBoardProps {
  projects: Project[];
  onOrderSaved?: (projects: Project[]) => void;
}

type SortableProject = Project & { displayOrder: number };

const sortProjects = (projects: Project[]): SortableProject[] =>
  projects
    .slice()
    .sort((a, b) => (a.displayOrder ?? Number.MAX_SAFE_INTEGER) - (b.displayOrder ?? Number.MAX_SAFE_INTEGER))
    .map((project, index) => ({
      ...project,
      displayOrder: index + 1,
    }));

export function PortfolioReorderBoard({ projects, onOrderSaved }: PortfolioReorderBoardProps) {
  const initialItems = useMemo(() => sortProjects(projects), [projects]);
  const [items, setItems] = useState<SortableProject[]>(initialItems);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    setItems(initialItems);
    setDirty(false);
    setStatus('idle');
    setError(null);
  }, [initialItems]);

  if (items.length === 0) {
    return null;
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    setItems((current) => {
      const oldIndex = current.findIndex((item) => item.slug === active.id);
      const newIndex = current.findIndex((item) => item.slug === over.id);
      const next = arrayMove(current, oldIndex, newIndex).map((item, index) => ({
        ...item,
        displayOrder: index + 1,
      }));
      setDirty(true);
      setStatus('idle');
      return next;
    });
  };

  const handleSave = async () => {
    setStatus('saving');
    setError(null);
    try {
      const response = await fetch('/api/v1/portfolio/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slugs: items.map((item) => item.slug) }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const description = payload?.error?.message ?? 'Unable to save new order.';
        throw new Error(description);
      }

      const orderedProjects = items.map((item, index) => ({
        ...item,
        displayOrder: index + 1,
      }));

      onOrderSaved?.(orderedProjects);
      setItems(orderedProjects);
      setDirty(false);
      setStatus('saved');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Unable to save new order.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold">Reorder portfolio projects</p>
          <p className="text-sm text-muted-foreground">
            Drag cards or focus a card and press space, then use arrow keys to move.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={!dirty || status === 'saving'}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'saving' ? 'Saving…' : dirty ? 'Save order' : 'Saved'}
          </button>
          <span className="text-xs text-muted-foreground" aria-live="polite">
            {status === 'saved' ? 'Order updated.' : status === 'error' ? error : null}
          </span>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((item) => item.slug)} strategy={verticalListSortingStrategy}>
          <ol className="space-y-3" aria-label="Portfolio ordering">
            {items.map((project) => (
              <SortableProjectCard key={project.slug} project={project} />
            ))}
          </ol>
        </SortableContext>
      </DndContext>

      {status === 'error' ? (
        <p className="text-sm text-amber-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SortableProjectCard({ project }: { project: SortableProject }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.slug });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <li>
      <div
        ref={setNodeRef}
        style={style}
        className={`flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 shadow-sm ${
          isDragging ? 'cursor-grabbing ring-2 ring-accent' : 'cursor-grab'
        }`}
        {...attributes}
        {...listeners}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-muted-foreground">#{project.displayOrder}</p>
            <p className="text-lg font-semibold">{project.title}</p>
            <p className="text-sm text-muted-foreground">{project.tagline}</p>
          </div>
          <div className="flex flex-col items-end text-xs text-muted-foreground">
            <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase ${project.published ? 'bg-emerald-500/15 text-emerald-600' : 'bg-amber-500/15 text-amber-600'}`}>
              {project.published ? 'Published' : 'Draft'}
            </span>
            <span className="rounded-full bg-muted px-2 py-0.5">{project.slug}</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">{project.summary}</p>
      </div>
    </li>
  );
}
