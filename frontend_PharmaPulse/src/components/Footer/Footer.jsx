import logo from '../../assets/Logo.jpg';

const Footer = () => {
  return (
    <footer className='bg-[#c1ddc1] text-[#333] p-4 fixed bottom-0 left-0 w-full box-border flex justify-center items-center z-50 h-[70px]'>
      <div className='flex justify-between items-center w-full max-w-[1800px]'>
        <div className='flex items-center'>
          <img src={logo} alt='Logo' className='h-[30px] mr-2' />
        </div>
        <div className='text-sm text-left'>
          &copy; A &amp; K Agencies PharmaPulse. All Rights Reserved.
        </div>
        <div className='flex gap-5 items-center text-sm font-bold'>
          Developed by: Team PharmaPulse
        </div>
      </div>
    </footer>
  );
};

export default Footer;
