import Image from 'next/image'
import React from 'react'

interface Props {
  title: string
  iconSrc: string
  value: string
  borderColor: string
}

const PriceInfoCard = ({ title, iconSrc, value, borderColor }: Props) => {
  return (
    <div
      className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 
                 border-l-4 flex flex-col gap-3"
      style={{ borderLeftColor: borderColor }}>
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-gray-50">
          <Image
            src={iconSrc}
            alt={title}
            width={20}
            height={20}
            className="opacity-75"
          />
        </div>
        <p className="text-sm font-medium text-gray-600">
          {title}
        </p>
      </div>

      <p className="text-2xl font-bold text-gray-900 ml-1">
        {value}
      </p>
    </div>
  )
}

export default PriceInfoCard