import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { Sparkles, ChevronDown } from 'lucide-react';

export const MODELS = [
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
  { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash-Lite' },
];

export default function ModelSelector({ selectedModel, onSelect }) {
  return (
    <Listbox value={selectedModel} onChange={onSelect}>
      <div className="relative">
        <ListboxButton className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
          <Sparkles size={14} className="text-blue-400" />
          {selectedModel.name}
          <ChevronDown size={14} />
        </ListboxButton>
        <ListboxOptions anchor="top start" className="w-52 bg-slate-800 border border-slate-700 rounded-lg p-1 shadow-xl focus:outline-none mb-2 z-50">
          {MODELS.map((model) => (
            <ListboxOption
              key={model.id}
              value={model}
              className="group flex cursor-pointer items-center gap-2 rounded-md py-1.5 px-3 select-none data-[focus]:bg-slate-700 text-slate-300 data-[focus]:text-white text-sm"
            >
              <div className="w-2 h-2 rounded-full bg-blue-500 opacity-0 group-data-[selected]:opacity-100" />
              {model.name}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}

