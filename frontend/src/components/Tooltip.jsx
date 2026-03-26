import { useState } from 'react';
import { HelpCircle } from 'lucide-react';

/**
 * Tooltip contextual con información de ayuda
 * Uso: <Tooltip content="Texto de ayuda">Trigger</Tooltip>
 */
const Tooltip = ({ 
  children, 
  content, 
  position = 'top', 
  icon = true,
  trigger = 'hover' // 'hover' | 'click'
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-800',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-800',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-800',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-800',
  };

  const handleMouseEnter = () => {
    if (trigger === 'hover') setIsVisible(true);
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') setIsVisible(false);
  };

  const handleClick = () => {
    if (trigger === 'click') setIsVisible(!isVisible);
  };

  return (
    <div className="relative inline-flex items-center group">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className="cursor-help"
      >
        {icon ? (
          <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-300 transition" />
        ) : (
          children
        )}
      </div>

      {/* Tooltip */}
      {isVisible && (
        <div
          className={`absolute z-50 ${positionClasses[position]} animate-in fade-in slide-in-from-bottom-2 duration-200`}
        >
          <div className="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-xl border border-gray-700 max-w-xs">
            {content}
          </div>
          {/* Arrow */}
          <div className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`} />
        </div>
      )}
    </div>
  );
};

/**
 * Tooltip inline con label
 * Uso: <TooltipLabel label="Campo" tooltip="Ayuda sobre el campo" />
 */
export const TooltipLabel = ({ label, tooltip, required = false }) => {
  return (
    <div className="flex items-center gap-2 mb-2">
      <label className="block text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {tooltip && <Tooltip content={tooltip} />}
    </div>
  );
};

export default Tooltip;
