import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useMultiplePokemon } from '../hooks/usePokemon';
import { useUserStore } from '../stores/userStore';
import { usePokemonStore } from '../stores/pokemonStore';
import { X, Plus, Save, Users, BarChart3, Trash2 } from 'lucide-react';
import PokemonCard from './PokemonCard';
import LoadingSpinner from './LoadingSpinner';
import type { Pokemon, UserTeam } from '../types';

interface TeamBuilderProps {
  className?: string;
}

export default function TeamBuilder({ className = '' }: TeamBuilderProps) {
  const { pokemonList } = usePokemonStore();
  const { teams, createTeam, updateTeam, deleteTeam, getTeam } = useUserStore();
  const [selectedTeam, setSelectedTeam] = useState<UserTeam | null>(null);
  const [teamPokemon, setTeamPokemon] = useState<Pokemon[]>([]);
  const [showPokemonSelector, setShowPokemonSelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [teamName, setTeamName] = useState('');

  // Fetch detailed data for team Pokémon
  const teamIds = teamPokemon.map(p => p.id);
  const { data: detailedPokemon, isLoading } = useMultiplePokemon(teamIds);

  // Update team Pokémon with detailed data
  useEffect(() => {
    if (detailedPokemon && detailedPokemon.length > 0) {
      setTeamPokemon(prev => 
        prev.map(pokemon => 
          detailedPokemon.find(detailed => detailed.id === pokemon.id) || pokemon
        )
      );
    }
  }, [detailedPokemon]);

  // Load team when selected
  useEffect(() => {
    if (selectedTeam) {
      setTeamName(selectedTeam.name);
      // Convert team IDs to Pokémon objects
      const teamPokemonData = selectedTeam.pokemonIds
        .map(id => pokemonList.find(p => p.id === id))
        .filter((p): p is Pokemon => p !== undefined);
      setTeamPokemon(teamPokemonData);
    } else {
      setTeamName('');
      setTeamPokemon([]);
    }
  }, [selectedTeam, pokemonList]);

  // Filter Pokémon for selection
  const filteredPokemon = pokemonList.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pokemon.id.toString().includes(searchTerm)
  );

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    if (source.droppableId === 'pokemon-list' && destination.droppableId === 'team') {
      // Adding Pokémon to team
      const pokemon = filteredPokemon[source.index];
      if (pokemon && teamPokemon.length < 6) {
        setTeamPokemon(prev => [...prev, pokemon]);
      }
    } else if (source.droppableId === 'team' && destination.droppableId === 'team') {
      // Reordering team Pokémon
      const newTeamPokemon = Array.from(teamPokemon);
      const [removed] = newTeamPokemon.splice(source.index, 1);
      newTeamPokemon.splice(destination.index, 0, removed);
      setTeamPokemon(newTeamPokemon);
    } else if (source.droppableId === 'team' && destination.droppableId === 'pokemon-list') {
      // Removing Pokémon from team
      setTeamPokemon(prev => prev.filter((_, index) => index !== source.index));
    }
  };

  const addPokemonToTeam = (pokemon: Pokemon) => {
    if (teamPokemon.length < 6 && !teamPokemon.find(p => p.id === pokemon.id)) {
      setTeamPokemon(prev => [...prev, pokemon]);
    }
  };

  const removePokemonFromTeam = (index: number) => {
    setTeamPokemon(prev => prev.filter((_, i) => i !== index));
  };

  const saveTeam = () => {
    if (!teamName.trim()) return;

    const teamData = {
      name: teamName.trim(),
      pokemonIds: teamPokemon.map(p => p.id),
    };

    if (selectedTeam) {
      updateTeam(selectedTeam.id, teamData);
    } else {
      createTeam(teamData.name);
      // Note: In a real app, you'd want to update the team with Pokémon after creation
    }
  };

  const deleteCurrentTeam = () => {
    if (selectedTeam) {
      deleteTeam(selectedTeam.id);
      setSelectedTeam(null);
    }
  };

  const createNewTeam = () => {
    setSelectedTeam(null);
    setTeamName('');
    setTeamPokemon([]);
  };

  const getTypeCoverage = () => {
    const types = new Set<string>();
    teamPokemon.forEach(pokemon => {
      pokemon.types.forEach(type => types.add(type.type.name));
    });
    return Array.from(types);
  };

  const getTotalBST = () => {
    return teamPokemon.reduce((total, pokemon) => 
      total + pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0), 0
    );
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading team data..." />;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Team Builder</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Build and manage your Pokémon teams
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={createNewTeam}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Team</span>
          </button>
          <button
            onClick={() => setShowPokemonSelector(!showPokemonSelector)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Pokémon</span>
          </button>
        </div>
      </div>

      {/* Team Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Select Team</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => setSelectedTeam(team)}
              className={`p-4 rounded-lg border-2 transition-colors text-left ${
                selectedTeam?.id === team.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{team.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {team.pokemonIds.length} Pokémon
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTeam(team.id);
                  }}
                  className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Team Builder */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Team Builder</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {teamPokemon.length}/6 Pokémon
            </p>
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Team name..."
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              onClick={saveTeam}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Team Slots */}
            <div>
              <h4 className="font-medium mb-4 text-gray-900 dark:text-white">Team</h4>
              <Droppable droppableId="team" direction="vertical">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[400px] p-4 rounded-lg border-2 border-dashed transition-colors ${
                      snapshot.isDraggingOver
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {teamPokemon.map((pokemon, index) => (
                      <Draggable key={pokemon.id} draggableId={`team-${pokemon.id}`} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`mb-2 ${snapshot.isDragging ? 'opacity-50' : ''}`}
                          >
                            <div className="relative">
                              <PokemonCard pokemon={pokemon} />
                              <button
                                onClick={() => removePokemonFromTeam(index)}
                                className="absolute top-2 right-2 z-10 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {teamPokemon.length === 0 && (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        Drag Pokémon here to build your team
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>

            {/* Pokémon Selector */}
            {showPokemonSelector && (
              <div>
                <h4 className="font-medium mb-4 text-gray-900 dark:text-white">Available Pokémon</h4>
                <div className="mb-4">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search Pokémon..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <Droppable droppableId="pokemon-list" direction="vertical">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`max-h-96 overflow-y-auto p-2 rounded-lg border-2 border-dashed transition-colors ${
                        snapshot.isDraggingOver
                          ? 'border-green-500 bg-green-50 dark:bg-green-900'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      {filteredPokemon.slice(0, 20).map((pokemon, index) => (
                        <Draggable key={pokemon.id} draggableId={`pokemon-${pokemon.id}`} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`mb-2 ${snapshot.isDragging ? 'opacity-50' : ''}`}
                            >
                              <PokemonCard pokemon={pokemon} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            )}
          </div>
        </DragDropContext>

        {/* Team Stats */}
        {teamPokemon.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-medium mb-3 text-gray-900 dark:text-white">Team Analysis</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Type Coverage</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {getTypeCoverage().length} types
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {getTypeCoverage().join(', ')}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total BST</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {getTotalBST()}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Average: {Math.round(getTotalBST() / teamPokemon.length)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Team Size</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {teamPokemon.length}/6
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {6 - teamPokemon.length} slots remaining
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
