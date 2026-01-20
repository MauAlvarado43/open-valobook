'use client';

import { useState, useEffect } from 'react';
import { useEditorStore } from '@/lib/store/editorStore';
import Image from 'next/image';
import { Search, ChevronDown, ChevronRight, User } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { getAgentColor } from '@/lib/constants/agentColors';
import { slugifyAbilityName } from '@/lib/utils/stringUtils';
import { getAbilityShape, getAbilityDefinition } from '@/lib/constants/abilityDefinitions';

const IGNORED_ABILITIES = ['Astral Form', 'Drift', 'Heating Up', 'Uncanny Marksman', 'Toxic'];

interface Ability {
  slot: string;
  name: string;
  description: string;
  icon: string;
  displayName?: string;
}

interface Agent {
  id: string;
  name: string;
  icon: string;
  role: {
    name: string;
    icon: string;
  };
  abilities: Ability[];
}

export function AgentSelector() {
  const { t } = useTranslation();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [search, setSearch] = useState('');
  const [expandedAgentId, setExpandedAgentId] = useState<string | null>(null);
  const {
    tool,
    setTool,
    selectedAgentId,
    setSelectedAgentId,
    setSelectedAbilityIcon,
    selectedAbilityIcon,
    clearSelection,
  } = useEditorStore();

  useEffect(() => {
    fetch('/assets/agents-metadata.json')
      .then((res) => res.json())
      .then((data: Agent[]) => {
        const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
        setAgents(sorted);
      })
      .catch((err) => console.error('Failed to load agents', err));
  }, []);

  const filteredAgents = agents.filter((agent) => {
    const nameMatch = agent.name.toLowerCase().includes(search.toLowerCase());
    const abilityMatch = agent.abilities.some((a) =>
      a.name.toLowerCase().includes(search.toLowerCase())
    );
    return nameMatch || abilityMatch;
  });

  const handleSelectAgent = (agent: Agent) => {
    clearSelection();
    setSelectedAgentId(agent.icon.replace('.png', ''));
    setTool('agent');
  };

  const handleSelectAbility = (agent: Agent, ability: Ability) => {
    clearSelection();
    const subType = getAbilityShape(ability.name, ability.description);
    const definition = getAbilityDefinition(ability.name);
    const color = getAgentColor(agent.name);
    setSelectedAbilityIcon(ability.icon, ability.name, subType, color, definition?.isGlobal);
    setTool('ability');
  };

  const toggleExpand = (agentId: string) => {
    setExpandedAgentId(expandedAgentId === agentId ? null : agentId);
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 border-t border-gray-700">
      <div className="p-4 border-b border-gray-700 bg-gray-900/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
          <input
            type="text"
            placeholder={t('editor', 'searchAgents')}
            className="w-full bg-gray-800 border border-gray-700 rounded-md py-1.5 pl-9 pr-4 text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredAgents.map((agent) => (
          <div key={agent.id} className="border-b border-gray-700/50">
            <button
              onClick={() => toggleExpand(agent.id)}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-700/50 transition text-left"
            >
              <div className="flex items-center gap-2">
                <div className="relative w-7 h-7 rounded-full overflow-hidden bg-gray-900 border border-gray-600">
                  <Image
                    src={`/assets/${agent.icon}`}
                    alt={agent.name}
                    fill
                    sizes="32px"
                    className="object-contain"
                  />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">
                    {t('editor', agent.name.toLowerCase() as any)}
                  </div>
                  <div className="text-[10px] text-gray-400">
                    {t('editor', agent.role.name.toLowerCase() as any)}
                  </div>
                </div>
              </div>
              {expandedAgentId === agent.id ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>

            {expandedAgentId === agent.id && (
              <div className="bg-gray-900/30 p-2 pl-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
                {/* Place Agent Button */}
                <button
                  onClick={() => {
                    handleSelectAgent(agent);
                    setSelectedAbilityIcon(null, '', 'default', '', false);
                  }}
                  className={`w-full flex items-center gap-2 p-1.5 rounded-md transition-all group text-left ${
                    tool === 'agent' && selectedAgentId === agent.icon.replace('.png', '')
                      ? 'bg-blue-600/30 ring-1 ring-blue-500/50 text-blue-200'
                      : 'hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  <div
                    className={`relative w-6 h-6 rounded bg-black/40 p-1 border flex-shrink-0 transition-colors ${
                      tool === 'agent' && selectedAgentId === agent.icon.replace('.png', '')
                        ? 'border-blue-400'
                        : 'border-gray-700 group-hover:border-gray-500'
                    }`}
                  >
                    <User
                      size={14}
                      className={
                        tool === 'agent' && selectedAgentId === agent.icon.replace('.png', '')
                          ? 'text-blue-400'
                          : ''
                      }
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-medium truncate">
                      {t('editor', 'placeAgentIcon')}
                    </div>
                  </div>
                  {tool === 'agent' && selectedAgentId === agent.icon.replace('.png', '') && (
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                  )}
                </button>

                {/* Abilities */}
                <div className="pt-2 border-t border-gray-700/50 space-y-1">
                  <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold px-1 mb-1">
                    {t('editor', 'abilitySelection')}
                  </div>
                  {agent.abilities
                    .filter(
                      (ability) =>
                        !IGNORED_ABILITIES.some(
                          (ignored) =>
                            ability.name.toLowerCase().trim() === ignored.toLowerCase().trim()
                        )
                    )
                    .sort((a, b) => {
                      const order: Record<string, number> = {
                        Ability1: 1,
                        Ability2: 2,
                        Grenade: 3,
                        Ultimate: 4,
                        Passive: 5,
                      };
                      return (order[a.slot] || 99) - (order[b.slot] || 99);
                    })
                    .map((ability) => {
                      const isSelected = selectedAbilityIcon === ability.icon;
                      // Find the key in ABILITY_DEFINITIONS that matches this ability name
                      const constantKey = slugifyAbilityName(ability.name);

                      const translatedName = t('abilities', constantKey as any);
                      const displayName =
                        translatedName !== constantKey
                          ? translatedName
                          : ability.displayName || ability.name;
                      return (
                        <button
                          key={ability.slot}
                          onClick={() => handleSelectAbility(agent, ability)}
                          className={`w-full flex items-center gap-2 p-1.5 rounded-md transition-all group text-left ${
                            isSelected
                              ? 'bg-blue-600/30 ring-1 ring-blue-500/50 text-blue-200'
                              : 'hover:bg-gray-700 text-gray-300'
                          }`}
                        >
                          <div
                            className={`relative w-6 h-6 rounded bg-black/40 p-0.5 border flex-shrink-0 transition-colors ${
                              isSelected
                                ? 'border-blue-400'
                                : 'border-gray-700 group-hover:border-gray-500'
                            }`}
                          >
                            <Image
                              src={`/assets/${ability.icon}`}
                              alt={ability.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[11px] font-medium truncate">{displayName}</div>
                          </div>
                          {isSelected && (
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                          )}
                        </button>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredAgents.length === 0 && (
          <div className="text-center py-12 text-gray-500 text-xs">
            {t('editor', 'noResultsFound', { search })}
          </div>
        )}
      </div>
    </div>
  );
}
