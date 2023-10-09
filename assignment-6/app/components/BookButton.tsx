type Props = {
  isNegative?: boolean;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
  title?: string;
  disabled?: boolean;
};

export default function BookButton({
  isNegative,
  onClick,
  className,
  children,
  title,
  disabled,
}: Props) {
  const confliction = isNegative
    ? 'bg-transparent text-gray-500 hover:text-black'
    : 'bg-pink-600 hover:bg-pink-500 text-white';
  const checkDisable = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'opacity-100 cursor-pointer';

  return (
    <button
      disabled={disabled}
      title={title || 'bookButton'}
      type="button"
      onClick={onClick}
      className={`flex justify-center items-center px-9 py-3 border-0 rounded-lg duration-300 h-10 ${confliction} ${checkDisable} ${className}`}
    >
      {children}
    </button>
  );
}
