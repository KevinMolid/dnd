import Container from "./Container";
import NavTab from "./NavTab";

import logo from "/black-spider.png";

import { Link } from "react-router-dom";

function Header() {
  return (
    <div className="bg-paper-100">
      <Container>
        <div className="flex flex-wrap justify-between items-end">
          <Link to="/">
            <div className="flex items-center gap-4">
              <img src={logo} alt="Black Spider logo" className="h-14" />
              <div>
                <p>Dungeons & Dragons</p>
                <p className="font-bold text-xl sm:text-2xl md:text-3xl">
                  Den Tapte Gruven i Phandelver
                </p>
              </div>
            </div>
          </Link>

          <nav>
            <ul className="flex">
              <NavTab to="/historien">Historien</NavTab>
              <NavTab to="/tips">Tips</NavTab>
              <NavTab to="/reglene">Reglene</NavTab>
              <NavTab to="/spillerne">Spillerne</NavTab>
              <NavTab to="/npcene">NPCene</NavTab>
            </ul>
          </nav>
        </div>
      </Container>
    </div>
  );
}

export default Header;
