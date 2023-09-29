import classNames from 'classnames'

export default function BookInput(props) {
  const notSelectOption =
    !props.selectOptionValues || props.selectOptionValues.length === 0
  const inputClass = classNames(
    'w-full',
    'border-2',
    'text-lg',
    'border-[#c5cfd9]',
    'h-10',
    'rounded-lg',
    'px-2.5',
    {
      'pl-9': props.icon,
    },
    props.className,
  )
  return (
    <div className="relative">
      <label htmlFor={props.name}>
        {props.label}
        {notSelectOption ? (
          <input
            id={props.name}
            name={props.name}
            type={props.type || 'text'}
            onChange={(e) => props.onChange(e)}
            className={inputClass}
            placeholder={props.placeholder}
            value={props.value}
          />
        ) : (
          <select
            className={inputClass}
            value={props.value}
            onChange={(e) => props.onChange(e)}
            id={props.name}
            name={props.name}
          >
            {props.selectOptionValues.map((item, index) => (
              <option key={index} value={item} id={item}>
                {item}
              </option>
            ))}
          </select>
        )}
      </label>
      <div
        className={`${
          props.iconClassName || ''
        } top-1.5 left-2.5 absolute text-lg`}
      >
        {props.icon}
      </div>
    </div>
  )
}
