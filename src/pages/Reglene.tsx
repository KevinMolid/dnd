import Container from "../components/Container";
import H1 from "../components/H1";
import H2 from "../components/H2";

const Reglene = () => {
  return (
    <div>
      <Container>
        <H1>Reglene</H1>
        <H2>Generelt</H2>
        <p>
          <span className="font-bold">Advantage</span>: Trill 2x D20. Det
          høyeste kastet gjelder.
          <br />
          <span className="font-bold">Disadvantage</span>: Trill 2x D20. Det
          høyeste kastet gjelder.
          <br />
          <span className="font-bold">Difficulty Class (DC)</span>: Et tall som
          Dungeon Master bruker for å avgjøre vanskelighetsgraden på en oppgave.
          For å utføre oppgaven må du gjøre en Ability Check som Dungeon Master
          bestemmer.
          <br />
          <span className="font-bold">Ability Check</span>: Trill en D20 +
          Ability-bonus mot en DC som Dungeon Master bestemmer for å utøfre en
          utfordrende handling (Se Difficulty Class).
        </p>

        <H2>Kamp (Grunnleggende)</H2>
        <p>
          <span className="font-bold">Surprise</span>: Ved starten av en kamp
          kan spillerne overraske motstanderne eller omvendt vedd å snike, eller
          ved at motstanderen er distrahert. Trill D20 + Stealth mot
          motstandernes Passive Perception. Karakterer som er Surprised kan ikke
          bruke action eller reaction den første runden.
        </p>
        <p>
          <span className="font-bold">Initiative</span>: Alle triller D20 + DEX.
          Rekkefølgen i kamp går fra høyeste til laveste kast.
        </p>
        <p>
          <span className="font-bold">Runder</span>: En runde representerer 6
          sekunder av kampen. Du kan bevege deg en distanse tilsvarende din
          Speed. Du kan utøre en action, en bonus action og en reaction. Du kan
          også kommunisere gjennom korte setninger eller bevegelser.
        </p>

        <H2>Kamp (Actions)</H2>
        <p>
          <span className="font-bold">Attack</span>: Angrip på kloss hold eller
          fra avstand.
          <br />
          <span className="font-bold">Cast Spell</span>: Cast en spell med
          casting time: 1 action.
          <br />
          <span className="font-bold">Dash</span>: Beveg deg en ekstra avstand
          tilsvarende din Speed.
          <br />
          <span className="font-bold">Disengage</span>: Bevegelse denne turen
          forårsaker ikke Opportunity Attacks.
          <br />
          <span className="font-bold">Dodge</span>: Angrep mot deg har
          Disadvantage. DEX saves har Advantage.
          <br />
          <span className="font-bold">Help</span>: Du kan hjelpe en annen
          karakter med en oppgave. Vedkommende har Advantage på oppgaven eller
          angrepet på sin tur.
          <br />
          <span className="font-bold">Hide</span>: Gjør en Stealth Check for å
          forsøke å gjemme deg.
          <br />
          <span className="font-bold">Ready</span>: Forbered en reaksjon på en
          motstanders action.
          <br />
        </p>

        <H2>Død</H2>
        <p>
          <span className="font-bold">Umiddelbar død</span>: Dersom skade
          reduserer deg til 0 HP, og resterende skade overgår din HP Maximum,
          dør du umiddelbart.
          <br />
          <span className="font-bold">Bevistløs</span>: Dersom skade reduserer
          deg til 0 HP uten å drepe deg, vil du bli bevistløs. Du blir bevisst
          dersom du får tilbake HP.
          <br />
          <span className="font-bold">Death Saving Throws</span>: Hver tur du
          begynner med 0 HP, dersom du ikke er Stabil, er du Døende. Trill D20.
          10 eller mer = suksess (20 = heal 1 HP). 9 eller mindre = feilet (1 =
          2 feilet). Dersom du får 3 suksess vil du bli Stabil. Du dør ved 3
          feilede kast. All skade du mottar når du har 0 HP teller som ett
          feilet kast.
          <br />
          <span className="font-bold">Stabilisere andre</span>: En spiller kan
          bruke en action for å stabilisere en døende spiller ved å trille en
          DC10 Medicine Check.
          <br />
          <span className="font-bold">Stabil</span>: Du er fortsatt bevistløs og
          har 0 HP, men er ikke lenger Døende. Dersom du tar skade vil du igjen
          være Døende, og prosessen med Death Saving Throws starter på nytt.
        </p>
      </Container>
    </div>
  );
};

export default Reglene;
