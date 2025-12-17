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
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import type { Service } from '@/types/service';

interface Props {
  services: Service[];
}

type SortableService = Service & { displayOrder: number };

export function ServiceReorderBoard({ services }: Props) {
  const initialItems = useMemo(() => {
    return services
      .slice()
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
      .map((service, index) => ({
        ...service,
        displayOrder: index + 1,
      }));
  }, [services]);

  const [items, setItems] = useState<SortableService[]>(initialItems);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      pressDelay: 150,
      activationConstraint: { delay: 150, tolerance: 8 },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    setItems(initialItems);
    setDirty(false);
    setStatus('idle');
  }, [initialItems]);

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
      const response = await fetch('/api/v1/services/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slugs: items.map((item) => item.slug) }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message = payload?.error?.message ?? 'Unable to save new order.';
        throw new Error(message);
      }

      setDirty(false);
      setStatus('saved');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Unable to save new order.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--card-bg)]/40 p-6 text-sm text-[var(--text-secondary)]">
        No services found. Create a service to enable drag-and-drop ordering.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold">Reorder services</p>
          <p className="text-sm text-muted-foreground">
            Drag cards or focus a card and press space/enter, then use arrow keys to move.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={!dirty || status === 'saving'}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
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
          <ol className="space-y-3" aria-label="Service ordering">
            {items.map((service) => (
              <ServiceCard key={service.slug} service={service} />
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

function ServiceCard({ service }: { service: SortableService }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: service.slug });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li>
      <div
        ref={setNodeRef}
        style={style}
        className={`flex ${isDragging ? 'cursor-grabbing opacity-80 ring-2 ring-accent' : 'cursor-grab'} items-start justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-sm focus-visible:ring-2 focus-visible:ring-accent`}
        {...attributes}
        {...listeners}
        role="option"
        aria-roledescription="Sortable service"
        aria-label={`${service.title} — position ${service.displayOrder}`}
      >
        <div>
          <p className="text-sm font-semibold text-muted-foreground">#{service.displayOrder}</p>
          <h3 className="text-lg font-semibold">{service.title}</h3>
          <p className="text-sm text-muted-foreground">{service.description}</p>
        </div>
        <div className="text-xs text-muted-foreground">
          <span className="rounded-full bg-muted px-2 py-0.5">{service.slug}</span>
        </div>
      </div>
    </li>
  );
}
