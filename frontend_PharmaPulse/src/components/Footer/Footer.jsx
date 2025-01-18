import logo from '../../assets/Logo.jpg';

const Footer = () => {
  return (
    <footer className="bg-green-200 text-gray-800 dark:bg-gray-900 dark:text-gray-200 p-4 fixed bottom-0 left-0 w-full box-border flex justify-center items-center z-50 h-[70px]">
      <div className="flex items-center justify-between w-full px-4 mx-auto max-w-7xl">
        {/* Logo Section */}
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-8 mr-2" />
          <span className="text-sm font-semibold">PharmaPulse</span>
        </div>

        {/* Copyright Section */}
        <div className="flex-grow text-sm text-center">
          &copy; {new Date().getFullYear()} A &amp; K Agencies PharmaPulse. All Rights Reserved.
        </div>

        {/* Developer Info */}
        <div className="flex items-center gap-3 text-sm font-medium">
          <span>Developed by:</span>
          <span className="text-green-600 dark:text-green-400">Team PharmaPulse</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
