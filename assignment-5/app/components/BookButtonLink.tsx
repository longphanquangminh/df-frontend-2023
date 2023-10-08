import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

type Props = {
  hasChevronLeft?: boolean
  className?: string
  children: React.ReactNode
  href: string
}

export default function BookButtonLink({
  hasChevronLeft,
  className,
  children,
  href,
}: Props) {
  return (
    <Link
      className={`underline text-[#d2455b] hover:text-[#FF5571] duration-300 ${className}`}
      href={href}
    >
      <span className="flex items-center">
        {hasChevronLeft && (
          <span className="mr-1">
            <ChevronLeft />
          </span>
        )}
        <span>{children}</span>
      </span>
    </Link>
  )
}
