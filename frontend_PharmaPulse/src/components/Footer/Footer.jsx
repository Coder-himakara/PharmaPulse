import logo from '../../assets/Logo.jpg';

const Footer = () => {
  return (
    <footer className='bg-green-200 text-gray-800 dark:bg-gray-900 dark:text-gray-200 p-4 fixed bottom-0 left-0 w-full box-border flex items-center z-50 h-[70px]'>
      <div className='relative flex items-center justify-between w-full px-6 max-w-7xl'>
        {/* Left Section - Logo */}
        <div className='flex items-center justify-start flex-1 gap-2'>
          <img src={logo} alt='Logo' className='h-8' />
          <span className='text-sm font-semibold whitespace-nowrap'>
            PharmaPulse
          </span>
        </div>

        {/* Center Section - Copyright */}
        <div className='absolute text-sm font-medium transform -translate-x-1/2 left-1/2'>
          &copy; {new Date().getFullYear()} A & K Agencies PharmaPulse. All
          Rights Reserved.
        </div>

        {/* Right Section - Developed By */}
        <div className='flex items-center justify-end flex-1 gap-2'>
          <span>Developed by:</span>
          <span className='font-semibold text-green-600 dark:text-green-400'>
            Team PharmaPulse
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
