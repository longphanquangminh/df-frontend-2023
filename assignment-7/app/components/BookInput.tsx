import { Topic } from 'app/generated/bookstore';
import classNames from 'classnames';
import { useState } from 'react';

type Props = {
  name?: string;
  label?: string;
  required?: boolean;
  type?: string;
  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => void;
  placeholder?: string;
  value?: string | number;
  icon?: React.ReactNode;
  iconClassName?: string;
  className?: string;
  selectOptionValues?: Topic[] | undefined;
  seePasswordOption?: boolean;
  seePasswordOptionClassName?: string;
};

export default function BookInput(props: Props) {
  const {
    name,
    label,
    required,
    type,
    onChange,
    placeholder,
    value,
    icon,
    iconClassName,
    className,
    selectOptionValues,
    seePasswordOption,
    seePasswordOptionClassName,
  } = props;
  const notSelectOption =
    !selectOptionValues || selectOptionValues.length === 0;
  const inputClass = classNames(
    'w-full',
    'border-2',
    'text-lg',
    'border-[#c5cfd9]',
    'h-10',
    'rounded-lg',
    'px-2.5',
    {
      'pl-9': icon,
    },
    {
      'pr-12': seePasswordOption,
    },
    className
  );
  const labelHidePassword = type === 'password' && seePasswordOption && 'Hide';
  const labelShowPassword = type === 'password' && seePasswordOption && 'Show';

  const [hidePassword, setHidePassword] = useState(true);
  const checkType = () => {
    if (type === 'password') {
      if (hidePassword) {
        return type;
      }
      return 'text';
    }
    return type;
  };
  const checkTypeValue = checkType();
  return (
    <div className="relative">
      <label className="space-y-1" htmlFor={name}>
        <span className="text-left font-bold">
          {label} {required && '(*)'}
        </span>
        {notSelectOption ? (
          <input
            id={name}
            name={name}
            type={checkTypeValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e)}
            className={inputClass}
            placeholder={placeholder}
            value={value}
          />
        ) : (
          <select
            className={inputClass}
            value={value}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e)}
            id={name}
            name={name}
          >
            {selectOptionValues.map((item: Topic, index) => (
              <option key={index} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        )}
        <div
          className={`${iconClassName || ''} top-1.5 left-2.5 absolute text-lg`}
        >
          {icon}
        </div>
        {seePasswordOption && (
          <button
            onClick={() => setHidePassword(!hidePassword)}
            className={`${
              seePasswordOptionClassName || ''
            } top-8 right-2.5 absolute text-sm cursor-pointer`}
          >
            {hidePassword ? labelShowPassword : labelHidePassword}
          </button>
        )}
      </label>
    </div>
  );
}
