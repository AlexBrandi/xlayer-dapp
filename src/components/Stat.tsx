interface StatProps {
  label: string
  value: string | number
  suffix?: string
  className?: string
}

export function Stat({ label, value, suffix, className = '' }: StatProps) {
  return (
    <div className={`text-center ${className}`}>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-xl font-bold">
        {value}
        {suffix && <span className="text-sm font-normal ml-1">{suffix}</span>}
      </p>
    </div>
  )
}