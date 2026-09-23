import React, { useState } from 'react';
import { EntityDefinition, EntityRelationship } from '../types/lld';
import { Plus, Trash2, Edit2, Check, X, Box, ArrowRight, Layers, Sparkles } from 'lucide-react';

interface EntityModelerProps {
  entities: EntityDefinition[];
  onChangeEntities: (entities: EntityDefinition[]) => void;
}

export const EntityModeler: React.FC<EntityModelerProps> = ({ entities, onChangeEntities }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // New entity form state
  const [name, setName] = useState('');
  const [type, setType] = useState<EntityDefinition['type']>('class');
  const [responsibilities, setResponsibilities] = useState('');
  const [fieldsRaw, setFieldsRaw] = useState('');
  const [methodsRaw, setMethodsRaw] = useState('');
  const [targetEntity, setTargetEntity] = useState('');
  const [relationType, setRelationType] = useState<EntityRelationship['type']>('association');

  const startAdd = () => {
    setName('');
    setType('class');
    setResponsibilities('');
    setFieldsRaw('');
    setMethodsRaw('');
    setTargetEntity('');
    setIsAdding(true);
    setEditingId(null);
  };

  const startEdit = (ent: EntityDefinition) => {
    setEditingId(ent.id);
    setIsAdding(false);
    setName(ent.name);
    setType(ent.type);
    setResponsibilities(ent.responsibilities || '');
    setFieldsRaw((ent.fields || []).join('\n'));
    setMethodsRaw((ent.methods || []).join('\n'));
    if (ent.relationships && ent.relationships.length > 0) {
      setTargetEntity(ent.relationships[0].target);
      setRelationType(ent.relationships[0].type);
    } else {
      setTargetEntity('');
    }
  };

  const cancelForm = () => {
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSave = () => {
    if (!name.trim()) return;

    const fields = fieldsRaw
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);
    const methods = methodsRaw
      .split('\n')
      .map((m) => m.trim())
      .filter(Boolean);

    const relationships: EntityRelationship[] = targetEntity.trim()
      ? [
          {
            source: name.trim(),
            target: targetEntity.trim(),
            type: relationType,
          },
        ]
      : [];

    if (isAdding) {
      const newEntity: EntityDefinition = {
        id: `ent-${Date.now()}`,
        name: name.trim(),
        type,
        responsibilities: responsibilities.trim(),
        fields,
        methods,
        relationships,
      };
      onChangeEntities([...entities, newEntity]);
    } else if (editingId) {
      const updated = entities.map((e) => {
        if (e.id === editingId) {
          return {
            ...e,
            name: name.trim(),
            type,
            responsibilities: responsibilities.trim(),
            fields,
            methods,
            relationships,
          };
        }
        return e;
      });
      onChangeEntities(updated);
    }

    cancelForm();
  };

  const handleDelete = (id: string) => {
    onChangeEntities(entities.filter((e) => e.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header with Title and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-card border border-white/40 dark:border-white/10">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Box className="w-5 h-5 text-indigo-500" />
            Domain Entities &amp; Class Hierarchy
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Specify your classes, interfaces, attributes, and structural relationships.
          </p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={startAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/25 transition-all self-start sm:self-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Entity
          </button>
        )}
      </div>

      {/* Add / Edit Form Card with Frosted Glass Styling */}
      {(isAdding || editingId) && (
        <div className="p-6 sm:p-7 rounded-3xl glass-panel border border-indigo-400/40 dark:border-indigo-500/30 shadow-2xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/30 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                {isAdding ? 'Define New Domain Entity' : `Edit Entity: ${name}`}
              </h4>
            </div>
            <button
              onClick={cancelForm}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-200 font-semibold mb-1.5">
                Entity Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. ParkingSpot, Ticket, Strategy"
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-indigo-500/40 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-200 font-semibold mb-1.5">
                Type / Stereotype
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500/40 outline-none"
              >
                <option value="class" className="bg-slate-50 dark:bg-slate-900">Concrete Class</option>
                <option value="interface" className="bg-slate-50 dark:bg-slate-900">Interface (&laquo;interface&raquo;)</option>
                <option value="abstract_class" className="bg-slate-50 dark:bg-slate-900">Abstract Class (&laquo;abstract&raquo;)</option>
                <option value="enum" className="bg-slate-50 dark:bg-slate-900">Enum</option>
              </select>
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-slate-700 dark:text-slate-200 font-semibold mb-1.5">
              Primary Responsibilities (Single Responsibility Principle)
            </label>
            <input
              type="text"
              value={responsibilities}
              onChange={(e) => setResponsibilities(e.target.value)}
              placeholder="e.g. Manages parking spot state transitions and vehicle allocation"
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500/40 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-200 font-semibold mb-1.5">
                Fields / Attributes (one per line)
              </label>
              <textarea
                rows={4}
                value={fieldsRaw}
                onChange={(e) => setFieldsRaw(e.target.value)}
                placeholder="- id: string&#10;- isOccupied: boolean&#10;- vehicle: Vehicle"
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-indigo-500/40 outline-none resize-none leading-relaxed"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-200 font-semibold mb-1.5">
                Methods / APIs (one per line)
              </label>
              <textarea
                rows={4}
                value={methodsRaw}
                onChange={(e) => setMethodsRaw(e.target.value)}
                placeholder="+ assignVehicle(v: Vehicle): void&#10;+ vacate(): void"
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-indigo-500/40 outline-none resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Relationship Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-white/20 dark:border-white/10">
            <div>
              <label className="block text-slate-700 dark:text-slate-200 font-semibold mb-1.5">
                Related Target Entity
              </label>
              <input
                type="text"
                value={targetEntity}
                onChange={(e) => setTargetEntity(e.target.value)}
                placeholder="e.g. Vehicle, ParkingFloor"
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-indigo-500/40 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-200 font-semibold mb-1.5">
                Relationship Type
              </label>
              <select
                value={relationType}
                onChange={(e) => setRelationType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500/40 outline-none"
              >
                <option value="association" className="bg-slate-50 dark:bg-slate-900">Association (uses / knows)</option>
                <option value="composition" className="bg-slate-50 dark:bg-slate-900">Composition (owns / part-of)</option>
                <option value="aggregation" className="bg-slate-50 dark:bg-slate-900">Aggregation (has-a reference)</option>
                <option value="inheritance" className="bg-slate-50 dark:bg-slate-900">Inheritance (is-a subclass / implements)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={cancelForm}
              className="px-4 py-2 rounded-xl glass-card text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-white/60 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-500/25 transition-all"
            >
              <Check className="w-4 h-4" />
              Save Entity
            </button>
          </div>
        </div>
      )}

      {/* Spacious Entity Cards List */}
      <div className="space-y-4">
        {entities.map((ent) => (
          <div
            key={ent.id}
            className="p-5 sm:p-6 rounded-2xl glass-card glass-card-hover border border-white/50 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  {ent.name}
                </span>
                <span className="text-[10px] uppercase font-mono font-bold px-2.5 py-0.5 rounded-full border bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20">
                  {ent.type}
                </span>
                {ent.methods && ent.methods.length > 0 && (
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    ({ent.methods.length} methods, {ent.fields?.length || 0} fields)
                  </span>
                )}
              </div>

              {ent.responsibilities && (
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {ent.responsibilities}
                </p>
              )}

              {ent.relationships && ent.relationships.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-mono pt-1">
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  <span className="p-1 px-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                    {ent.relationships.map((r) => `${r.type} &rarr; ${r.target}`).join(', ')}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              <button
                onClick={() => startEdit(ent)}
                className="p-2.5 rounded-xl glass-card text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/60 transition-colors"
                title="Edit Entity"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(ent.id)}
                className="p-2.5 rounded-xl glass-card text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-white/60 transition-colors"
                title="Delete Entity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
