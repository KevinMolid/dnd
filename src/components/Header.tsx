import H1 from "./H1";
import Container from "./Container";
import NavTab from "./NavTab";

import logo from "/black-spider.png";

import { Link } from "react-router-dom";

function Header() {
  return (
    <div className="bg-white">
      <Container>
        <div className="flex flex-wrap justify-between items-end">
          <Link to="/">
            <div className="flex items-center gap-4">
              <img src={logo} alt="Black Spider logo" className="h-14" />
              <div>
                <p>Dungeons & Dragons</p>
                <H1>Den Tapte Gruven i Phandelver</H1>
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
