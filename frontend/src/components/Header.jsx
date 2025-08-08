import Button from './Button';

const Header = () => {
  return (
    <header className="flex justify-between items-center p-4 border-b">
      <h1 className="text-xl font-bold">My Portfolio</h1>
      <nav className="flex gap-4">
        <Button variant="outline">Blog</Button>
        <Button>Contact</Button>
      </nav>
    </header>
  );
};

export default Header;