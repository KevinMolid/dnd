import H1 from "./H1";
import H2 from "./H2";
import Container from "./Container";

import { Link } from "react-router-dom";

function Header() {
  return (
    <div className="bg-slate-200">
      <Container>
        <div className="flex justify-between items-end">
          <Link to="/">
            <H2>Dungeons & Dragons</H2>
            <H1>Den Tapte Gruven i Phandelver</H1>
          </Link>

          <nav>
            <ul className="flex gap-4">
              <li>
                <Link to="/historien">Historien</Link>
              </li>
              <li>
                <Link to="/tips">Tips og triks</Link>
              </li>
              <li>
                <Link to="/reglene">Reglene</Link>
              </li>
              <li>
                <Link to="/spillerne">Spillerne</Link>
              </li>
              <li>
                <Link to="/npcene">NPCene</Link>
              </li>
            </ul>
          </nav>
        </div>
      </Container>
    </div>
  );
}

export default Header;
