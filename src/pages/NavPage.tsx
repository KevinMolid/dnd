import NavTab from "../components/NavTab"

const NavPage = () => {
  return (
    <div><nav className="-mx-1 overflow-x-auto">
                <ul className="flex min-w-max items-center gap-1 px-1 pb-1">
                  <NavTab to="/tips">Tips</NavTab>
                  <NavTab to="/reglene">Rules</NavTab>
                  <NavTab to="/karakterer">Characters</NavTab>
                  <NavTab to="/stats">Stats</NavTab>
                  <NavTab to="/kamp">Combat</NavTab>
                  <NavTab to="/spillere">Players</NavTab>
                  <NavTab to="/handouts">Handouts</NavTab>
                  <NavTab to="/quests">Quests</NavTab>
                </ul>
              </nav></div>
  )
}

export default NavPage