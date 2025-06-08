import Link from 'next/link'
import Image from 'next/image'

const Navbar = () => {
  return (
    <header className='w-full'>
      <nav className='nav'>
        <Link href="/" className="flex items-center gap-1">
          <Image
            src="/assets/icons/PriceAlertImg.png"
            width={34}
            height={34}
            alt="logo"
          />
          <p className='nav-logo'>
            <span className='text-green-500'>Price</span><span className='text-red-500'>Alert</span>
          </p>
        </Link>
      </nav>
    </header>
  )
}

export default Navbar