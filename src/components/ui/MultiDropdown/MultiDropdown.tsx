import { useState, useRef, useEffect } from 'react';
import { cc } from 'utils/combineClasses';
import styles from './styles.module.scss';

interface Option {
  value: string;
  label: string;
}

interface Props {
  options: Option[];
  value: string[];
  onChange: (selected: string[]) => void;
  className?: string;
  optionsClassName?: string;
  selectClassName?: string;
}

const MultiDropdown = ({ options, value, onChange, className, optionsClassName, selectClassName }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleOption = (optionValue: string) => {
    const updated = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(updated);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={cc(styles.multiDropdownRoot, className)} ref={dropdownRef}>
      <button
  className={cc(selectClassName, styles.multiDropdownS)}
  data-open={isOpen}
  onClick={() => setIsOpen(!isOpen)}
>

        {value.length > 0
          ? options.filter(opt => value.includes(opt.value)).map(opt => opt.label).join(', ')
          : 'Languages'}
      </button>

      {isOpen && (
        <div className={optionsClassName}>
          {options.map(option => (
            <button
              key={option.value}
              className={value.includes(option.value) ? styles.selected : ''}
              onClick={() => toggleOption(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiDropdown;
