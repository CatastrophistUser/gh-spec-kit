import { Link } from 'react-router-dom';
import type { EvolutionChain, EvolutionDetail, EvolutionDetails } from '../types';

interface EvolutionTreeProps {
  chain: EvolutionChain;
}

function renderDetails(details: EvolutionDetails) {
  const parts: string[] = [];
  if (details.min_level) parts.push(`Lv. ${details.min_level}`);
  if (details.item) parts.push(details.item.name.replace('-', ' '));
  if (details.trigger && details.trigger.name !== 'level-up') parts.push(details.trigger.name.replace('-', ' '));
  return parts.join(' • ');
}

function renderChain(node: EvolutionDetail, depth = 0): React.ReactElement {
  return (
    <div key={node.species.name} className="flex items-start space-x-4">
      <div className="flex flex-col items-center">
        <Link to={`/pokemon/${node.species.name}`} className="capitalize font-medium text-blue-600 dark:text-blue-300">
          {node.species.name}
        </Link>
        {node.evolution_details && node.evolution_details[0] && (
          <div className="text-xs text-gray-500 mt-1">{renderDetails(node.evolution_details[0])}</div>
        )}
      </div>

      <div className="ml-4">
        {node.evolves_to && node.evolves_to.length > 0 && (
          <div className="flex flex-col space-y-2">
            {node.evolves_to.map(child => (
              <div key={child.species.name} className="pl-4 border-l border-gray-200 dark:border-gray-700">
                {renderChain(child, depth + 1)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function EvolutionTree({ chain }: EvolutionTreeProps) {
  if (!chain || !chain.chain) {
    return <div className="text-sm text-gray-500">No evolution chain available</div>;
  }

  return (
    <div className="space-y-4">
      {renderChain(chain.chain)}
    </div>
  );
}
