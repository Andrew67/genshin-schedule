import { h } from "preact";
import { FaCog } from "react-icons/fa";
import { Link } from "preact-router";

const Header = () => {
  return (
    <nav className="container mx-auto p-4 flex flex-row">
      <Link href="/" className="font-bold truncate">
        <img
          src="/assets/favicon-32x32.png"
          className="w-6 h-6 inline mr-1 rounded"
        />

        <span className="align-middle">Genshin Schedule</span>
      </Link>

      <div className="flex-1" />

      <Link href="/customize" className="text-sm flex-shrink-0">
        <FaCog className="inline" />
        <span className="align-middle"> Customize</span>
      </Link>
    </nav>
  );
};

export default Header;