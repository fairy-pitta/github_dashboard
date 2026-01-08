import React from 'react';
import { useLanguage } from '../i18n/useLanguage';
import './styles/filter.css';

interface FilterToggleProps {
  value: 'all' | 'open';
  onChange: (value: 'all' | 'open') => void;
  disabled?: boolean;
}

export const FilterToggle: React.FC<FilterToggleProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="filter-toggle">
      <button
        onClick={() => onChange('all')}
        disabled={disabled}
        className={`filter-option ${value === 'all' ? 'active' : ''}`}
      >
        {t.all}
      </button>
      <button
        onClick={() => onChange('open')}
        disabled={disabled}
        className={`filter-option ${value === 'open' ? 'active' : ''}`}
      >
        {t.openOnly}
      </button>
    </div>
  );
};


