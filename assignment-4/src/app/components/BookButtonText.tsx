type Props = {
  onClick: () => void
  className?: string
  children: React.ReactNode
  title?: string
}

export default function BookButtonText({
  onClick,
  className,
  children,
  title,
}: Props) {
  return (
    <button
      title={title || 'bookButton'}
      type="button"
      onClick={onClick}
      className={`underline text-[#d2455b] hover:text-[#FF5571] duration-300 ${className}`}
    >
      {children}
    </button>
  )
}
