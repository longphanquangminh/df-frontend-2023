export default function BookInput(props) {
  const notSelectOption = !props.selectOptionValues || props.selectOptionValues.length === 0;
  const inputClass = `w-full border-2 text-lg border-[#c5cfd9] h-10 rounded-lg px-2.5 ${props.icon ? "pl-9" : ""} ${props.className}`;
  return (
    <div className='relative'>
      {notSelectOption ? (
        <input type={props.type || "text"} onChange={() => props.onChange} className={inputClass} placeholder={props.placeholder} />
      ) : (
        <select className={inputClass}>
          {props.selectOptionValues.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
      )}
      <div className={`${props.iconClassName || ""} top-1.5 left-2.5 absolute text-lg`}>{props.icon}</div>
    </div>
  );
}
