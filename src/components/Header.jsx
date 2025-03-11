import ThemeToggle from './ThemeToggle';

const Header = () => {
  return (
    <header className="coral-bg dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/Osi.png" alt="OSI Logo" className="h-13 w-11 mr-3" />
          <h1 className="text-xl font-bold text-white">OSI : le chatbot de l’offre de services informatique</h1>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header; 