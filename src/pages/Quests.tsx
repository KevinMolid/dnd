import Container from "../components/Container";
import H1 from "../components/H1";
import H2 from "../components/H2";
import H3 from "../components/H3";
import H4 from "../components/H4";

import Description from "../components/Description";
import Info from "../components/Info";

import { useState } from "react";

const Quests = () => {
  const [showAgatha, setShowAgatha] = useState(false);
  const [showOrcs, setShowOrcs] = useState(false);
  const [showNecromancer, setShowNecromancer] = useState(false);
  const [showReidoth, setShowReidoth] = useState(false);
  const [showDragon, setShowDragon] = useState(false);
  const [showRedbrands, setShowRedbrands] = useState(false);
  const [showCragmawCastle, setShowCragmawCastle] = useState(false);
  const [showWaveEcho, setShowWaveEcho] = useState(false);

  return (
    <Container>
      <H1>Quests</H1>
      <div
        onClick={() => setShowAgatha(!showAgatha)}
        className="cursor-pointer select-none"
      >
        <H2>
          {showAgatha ? (
            <i className="fa-solid fa-caret-down mr-4"></i>
          ) : (
            <i className="fa-solid fa-caret-right mr-4"></i>
          )}
          Bansheen Agatha{" "}
        </H2>
      </div>
      <div
        className={`overflow-hidden transition-all duration-400 ease-in-out ${
          showAgatha
            ? "max-h-[5000px] opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-2"
        }`}
      >
        <div className="pt-2">
          <H3>1. Møte med Søster Garaele</H3>

          <p className="mb-2">Når spillerne kommer inn i helligdommen:</p>
          <Description>
            <p className="mb-2">
              Når dere kommer inn i helligdommen, lukter rommet sterkt av
              røkelse.
              <br />
              Flere lys brenner rundt et bord midt i rommet.
            </p>
            <p className="mb-2">
              På bordet ligger en død mann i røde klær – en av Redbrands.
            </p>
            <p>
              Søster Garaele kneler ved siden av kroppen med hendene løftet i
              bønn.
            </p>
          </Description>

          <p className="mb-2">Magien begynner å virke:</p>
          <Description>
            <p className="mb-2">
              Luften blir kald.
              <br />
              Flammene på lysene blafrer voldsomt.
            </p>
            <p>
              Den døde mannens munn åpner seg svakt… som om han prøver å snakke.
            </p>
          </Description>

          <p className="mb-2">Så skjer det noe:</p>
          <Description>
            <p className="mb-2">
              Plutselig høres et svakt, sørgmodig skrik i det fjerne – som en
              stemme som bæres av vinden.
            </p>
            <p className="mb-2">Lyset i rommet blafrer.</p>
            <p>Kroppen faller livløs tilbake.</p>
          </Description>

          <p className="mb-2">Søster Garaele forklarer hva som har skjedd:</p>
          <Description>
            <p className="mb-2">
              Søster Garaele trekker pusten dypt og ser ned på den døde mannen.
            </p>
            <p className="mb-2">
              «Dette har aldri skjedd før. Magien som lar de døde tale svikter
              meg.»
            </p>
            <p className="mb-2">Hun reiser seg og ser alvorlig på dere.</p>
            <p className="mb-2">
              «Ikke langt øst for byen ligger ruinene av en forlatt landsby som
              heter Conyberry. I skogen ved ruinene sies det at en banshee ved
              navn Agatha vandrer.»
            </p>
            <p className="mb-2">
              «Jeg tror sorgen hennes fyller landet rundt henne og forstyrrer
              magien som lar de døde tale.»
            </p>
            <p>
              «Jeg trenger deres hjelp. Dere må finne Agatha og få svar fra
              henne.»
            </p>
          </Description>

          <H4 className="mb-2">Hva Søster Garaele vet:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Hun har tidligere kunnet tale med de døde uten problemer, men
                evnen har nylig sluttet å virke.
              </li>
              <li>
                Hun tror Agathas sorg og overnaturlige nærvær forstyrrer magi
                som har med døde sjeler å gjøre.
              </li>
              <li>
                Agatha holder til ved ruinene av Conyberry, øst for Phandalin.
              </li>
              <li>
                Agatha er farlig, lunefull og svarer ikke nødvendigvis på
                spørsmål uten videre.
              </li>
              <li>Det er viktig å møte Agatha med respekt.</li>
              <li>
                Hun mener at en gave kan gjøre Agatha mer villig til å lytte.
              </li>
              <li>
                Hun tror Agatha kjenner mange hemmeligheter fra gamle tider.
              </li>
              <li>
                Hun forsøkte å spørre den døde Redbrand-en hvem som egentlig
                leder Redbrands, men ritualet feilet før hun fikk svar.
              </li>
            </ul>
          </Info>

          <H4 className="mb-2">Hvis spillerne spør Søster Garaele om mer:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Hvis de spør hvem Agatha er:</strong> Garaele vet at
                Agatha er en banshee, en rastløs ånd fylt av sorg, stolthet og
                bitterhet.
              </li>
              <li>
                <strong>Hvis de spør hvorfor Agatha forstyrrer magien:</strong>{" "}
                Garaele vet ikke sikkert, men tror Agathas klage drukner stemmen
                til de døde og river dem bort før de kan svare.
              </li>
              <li>
                <strong>
                  Hvis de spør hva hun vil at de skal spørre Agatha om:
                </strong>{" "}
                Garaele vil først og fremst vite hvorfor hennes evne til å tale
                med de døde har sluttet å virke, og hva som må til for å få den
                tilbake.
              </li>
              <li>
                <strong>Hvis de spør om Agatha kan stoles på:</strong> Garaele
                vil si at Agatha ikke kan stoles på som en venn, men at hun kan
                gi sanne svar dersom hun blir behandlet med respekt.
              </li>
              <li>
                <strong>Hvis de spør hva slags gave de bør ta med:</strong>{" "}
                Garaele anbefaler noe vakkert, personlig eller gammelt – noe som
                viser omtanke i stedet for verdi alene.
              </li>
              <li>
                <strong>Hvis de spør om Agatha angriper uten grunn:</strong>{" "}
                Garaele tror ikke det, men hun advarer om at Agatha kan bli
                rasende dersom hun føler seg krenket, presset eller kommandert.
              </li>
              <li>
                <strong>
                  Hvis de spør om hvor mange spørsmål de kan stille:
                </strong>{" "}
                Garaele sier at slike ånder ofte bare gir ett tydelig svar før
                de lukker seg eller jager besøkende bort, så de bør velge
                spørsmålet med omhu.
              </li>
            </ul>
          </Info>

          <H3>2. Oppdraget fra Søster Garaele</H3>

          <p className="mb-2">Søster Garaele gir dem følgende beskjed:</p>
          <Description>
            <p className="mb-2">
              «Dersom dere drar til Conyberry, må dere vise respekt. Ikke krev
              svar av henne.»
            </p>
            <p className="mb-2">
              «Gi henne en gave. Tal rolig. Still spørsmålet deres tydelig.»
            </p>
            <p>
              «Og vær varsomme. Slike vesener tåler dårlig å bli fornærmet.»
            </p>
          </Description>

          <H4 className="mb-2">DM-info:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Søster Garaele sender spillerne til Conyberry fordi dette er den
                eneste ledetråden hun har til hvorfor evnen hennes har sviktet.
              </li>
              <li>
                Hun følger ikke med dem selv. Hun blir igjen i Phandalin for å
                be, forske videre og vente på svar.
              </li>
              <li>
                Hvis spillerne virker usikre, kan Garaele understreke at møtet
                med Agatha ikke trenger å ende i kamp dersom de oppfører seg
                klokt.
              </li>
            </ul>
          </Info>

          <H3>3. Reisen til Conyberry</H3>

          <p className="mb-2">Når gruppen nærmer seg ruinene:</p>
          <Description>
            <p className="mb-2">
              Ruinene av Conyberry ligger stille under krokete trær.
            </p>
            <p className="mb-2">
              Husene er knust av tid og vær, og vinden blåser gjennom tomme
              døråpninger.
            </p>
            <p>Ingen fugler synger her. Alt virker forlatt, kaldt og feil.</p>
          </Description>

          <p className="mb-2">
            Når de beveger seg videre inn mot Agathas område:
          </p>
          <Description>
            <p className="mb-2">
              Mellom ruinene leder en smal sti videre mot et gammelt sammenrast
              steintårn, halvt skjult av busker og trær.
            </p>
            <p>Luften kjennes kaldere jo nærmere dere kommer.</p>
          </Description>

          <H4 className="mb-2">DM-info:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Bruk rolig og dyster stemning her. Dette er et sted som skal
                føles overnaturlig og ubehagelig.
              </li>
              <li>
                Ikke hast videre til selve møtet. La stillheten og stemningen
                bygge seg opp.
              </li>
            </ul>
          </Info>

          <H3>4. Tilkalle Agatha</H3>

          <p className="mb-2">
            Når spillerne forsøker å rope på Agatha eller få kontakt:
          </p>
          <Description>
            <p className="mb-2">Luften blir plutselig iskald.</p>
            <p className="mb-2">Vinden stopper helt opp.</p>
            <p>
              En svak hvisking høres mellom ruinene, som om stemmen kommer fra
              alle kanter samtidig.
            </p>
          </Description>

          <p className="mb-2">Agatha begynner å vise seg:</p>
          <Description>
            <p className="mb-2">
              En blek skikkelse tar langsomt form i luften foran dere.
            </p>
            <p className="mb-2">
              Ansiktet hennes er vakkert, men fylt av sorg og raseri.
            </p>
            <p className="mb-2">
              Langt hvitt hår flyter rundt henne som om det svever i vann.
            </p>
            <p>Øynene hennes gløder svakt mens hun stirrer på dere.</p>
          </Description>

          <H4 className="mb-2">DM-info:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>Snakk rolig og lavt når du spiller Agatha.</li>
              <li>
                Hun skal føles gammel, sørgende og farlig, ikke som en vanlig
                NPC.
              </li>
              <li>
                Hun er ikke automatisk fiendtlig, men hun tåler dårlig
                respektløshet og press.
              </li>
            </ul>
          </Info>

          <H3>5. Samtalen med Agatha</H3>

          <p className="mb-2">Agatha åpner samtalen slik:</p>
          <Description>
            <p>«Hvorfor forstyrrer dere min ensomhet?»</p>
          </Description>

          <H4 className="mb-2">Hvis spillerne oppfører seg respektfullt:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>Agatha blir roligere og lytter til hva de har å si.</li>
              <li>
                Hvis de tilbyr en gave, kan hun se på den med stille interesse
                før hun svarer.
              </li>
              <li>
                Du kan la henne si: <em>«En gave… hvor uventet.»</em>
              </li>
            </ul>
          </Info>

          <H4 className="mb-2">
            Hvis spillerne er uhøflige, krevende eller truende:
          </H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>Agathas uttrykk blir skarpere og mer fiendtlig.</li>
              <li>
                Stemmen hennes blir kald og hard, og du kan la henne advare dem
                én gang før situasjonen blir farlig.
              </li>
              <li>
                Hvis gruppen presser for langt, kan møtet ende i kamp eller at
                Agatha jager dem bort uten svar.
              </li>
            </ul>
          </Info>

          <H3>6. Ett spørsmål</H3>

          <p className="mb-2">Når Agatha er villig til å lytte, sier hun:</p>
          <Description>
            <p>«Still spørsmålet deres… og forsvinn deretter.»</p>
          </Description>

          <H4 className="mb-2">DM-info:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                La spillerne diskutere hva de vil spørre om. Det er en viktig
                del av scenen.
              </li>
              <li>
                Hold Agatha taus og observerende mens de bestemmer seg, så lenge
                de ikke begynner å misbruke situasjonen.
              </li>
              <li>
                Hvis du vil holde fokus på Søster Garaeles oppdrag, kan du
                belønne spørsmål som handler om hennes mistede evne eller om den
                overnaturlige forstyrrelsen i området.
              </li>
            </ul>
          </Info>

          <H3>7. Agathas svar</H3>

          <p className="mb-2">
            Hvis spillerne spør hvorfor Søster Garaele ikke lenger kan tale med
            de døde:
          </p>
          <Description>
            <p className="mb-2">
              Agatha senker blikket et øyeblikk, og stemmen hennes blir som et
              ekko i kald luft.
            </p>
            <p className="mb-2">
              «De døde kan ikke hviske når min sorg fyller dalen…»
            </p>
            <p>«Min klage drukner deres stemmer.»</p>
          </Description>

          <H4 className="mb-2">Hvis spillerne spør videre om hva det betyr:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Agatha svarer bare på ett spørsmål. Hun utdyper ikke utover
                dette med mindre du som DM ønsker å være ekstra generøs.
              </li>
              <li>
                Svaret betyr at Agathas tilstedeværelse og sorg forstyrrer
                nekromantisk eller åndelig kommunikasjon i området.
              </li>
              <li>
                Når spillerne bringer dette tilbake til Søster Garaele, kan du
                la henne tolke resten og bekrefte at dette sannsynligvis er
                årsaken.
              </li>
            </ul>
          </Info>

          <H4 className="mb-2">Hvis spillerne stiller et annet spørsmål:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>La Agatha gi et sant, men gjerne litt kryptisk svar.</li>
              <li>
                Svarene hennes bør være nyttige, men formulert på en måte som
                fortsatt føles overnaturlig og mystisk.
              </li>
              <li>
                Unngå å gjøre henne pratete. Hun svarer kort, tungt og med
                autoritet.
              </li>
            </ul>
          </Info>

          <H3>8. Avslutningen på møtet</H3>

          <p className="mb-2">Etter at Agatha har svart:</p>
          <Description>
            <p className="mb-2">Ansiktet hennes blir kaldere igjen.</p>
            <p className="mb-2">
              Luften rundt dere blir enda skarpere og kaldere.
            </p>
            <p className="mb-2">«Dere har fått svaret deres.»</p>
            <p>«Forsvinn.»</p>
          </Description>

          <p className="mb-2">Så forsvinner hun:</p>
          <Description>
            <p className="mb-2">
              Kroppen hennes løses opp i tåke og bleke skygger.
            </p>
            <p>Vinden begynner å blåse igjen gjennom ruinene.</p>
          </Description>

          <H4 className="mb-2">DM-info:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>Møtet bør avsluttes kort og tydelig etter svaret.</li>
              <li>
                Målet er at scenen føles som et møte med noe gammelt og
                overnaturlig, ikke som en lang samtale.
              </li>
            </ul>
          </Info>

          <H3>9. Tilbake til Søster Garaele</H3>

          <p className="mb-2">
            Når spillerne vender tilbake og forteller hva Agatha har sagt:
          </p>
          <Description>
            <p className="mb-2">
              Søster Garaele lytter nøye og blir stille mens hun tenker over
              ordene.
            </p>
            <p className="mb-2">
              «Da hadde jeg rett… det er hennes sorg som forstyrrer magien.»
            </p>
            <p>Hun takker dere oppriktig for hjelpen.</p>
          </Description>

          <H4 className="mb-2">
            Hvis du vil vise at spillerne har gjort en forskjell:
          </H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Senere kan Søster Garaele fortelle at hun igjen klarer å bruke
                magien sin.
              </li>
              <li>
                Du kan la dette bli en liten, tydelig konsekvens av spillernes
                handlinger i verden.
              </li>
            </ul>
          </Info>
        </div>
      </div>

      <div onClick={() => setShowOrcs(!showOrcs)} className="cursor-pointer">
        <H2>
          {showOrcs ? (
            <i className="fa-solid fa-caret-down mr-4"></i>
          ) : (
            <i className="fa-solid fa-caret-right mr-4"></i>
          )}
          Orkene ved Wyvern Tor
        </H2>
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out transform ${
          showOrcs
            ? "max-h-[5000px] opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-2"
        }`}
      >
        <div className="pt-2">
          <H3>1. Møte med Sildar Hallwinter</H3>

          <p className="mb-2">Når spillerne møter Sildar på kontoret hans:</p>
          <Description>
            <p className="mb-2">
              Sildar sitter ved et enkelt skrivebord i et lånt rom i
              borgermesterens bygning.
            </p>
            <p className="mb-2">
              På bordet ligger et sammenbrettet brev med segl, noen notater og
              et grovt kart over området rundt Phandalin.
            </p>
            <p>Når dere kommer inn, ser Sildar opp og nikker alvorlig.</p>
          </Description>

          <p className="mb-2">Sildar presenterer oppdraget:</p>
          <Description>
            <p className="mb-2">
              «Jeg har fått en henvendelse fra borgermesteren. Flere reisende og
              bønder har meldt om orker i området ved Wyvern Tor.»
            </p>
            <p className="mb-2">
              «De har angrepet folk på veiene og utgjør en reell fare for
              Phandalin.»
            </p>
            <p>
              «Jeg trenger noen som kan dra dit, finne ut hvor alvorlig
              trusselen er, og om mulig stanse den.»
            </p>
          </Description>

          <p className="mb-2">Sildar gir dem brevet:</p>
          <Description>
            <p className="mb-2">Sildar skyver brevet over bordet mot dere.</p>
            <p>«Dette er den formelle anmodningen fra borgermesteren.»</p>
          </Description>

          <H4 className="mb-2">Hva Sildar vet:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Han vet at det har kommet flere rapporter om orker ved Wyvern
                Tor.
              </li>
              <li>
                Han vet at de har angrepet reisende og forstyrret ferdselen i
                området.
              </li>
              <li>Han vet ikke nøyaktig hvor mange orker det er.</li>
              <li>
                Han vet ikke om de bare er vanlige røvere, eller om de handler
                på vegne av noen andre.
              </li>
              <li>
                Han mistenker at økt uro i området kan henge sammen med andre
                hendelser rundt Phandalin.
              </li>
              <li>
                Han ønsker først og fremst at trusselen fjernes før noen flere
                blir drept.
              </li>
            </ul>
          </Info>

          <H4 className="mb-2">Hvis spillerne spør Sildar om mer:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Hvis de spør hvor Wyvern Tor ligger:</strong> Sildar kan
                peke ut den generelle retningen på kartet og forklare at det
                ligger i de steinete høydene øst/sørøst for Phandalin.
              </li>
              <li>
                <strong>Hvis de spør hvor mange orker det er:</strong> Sildar
                vet ikke sikkert, bare at det er nok til at folk har blitt jaget
                bort og angrepet.
              </li>
              <li>
                <strong>Hvis de spør om belønning:</strong> Sildar viser til
                borgermesterens brev og forklarer at byen vil betale dersom
                trusselen fjernes.
              </li>
              <li>
                <strong>Hvis de spør hvorfor han ikke drar selv:</strong> Sildar
                forklarer at han prøver å etablere orden i byen og følge opp
                flere alvorlige saker samtidig.
              </li>
              <li>
                <strong>Hvis de spør om orkene kan forhandles med:</strong>{" "}
                Sildar tviler på det, men utelukker det ikke dersom gruppen
                finner en klok måte å håndtere situasjonen på.
              </li>
              <li>
                <strong>
                  Hvis de spør om dette kan ha sammenheng med gobliner,
                  Redbrands eller andre fiender:
                </strong>{" "}
                Sildar vet ikke, men han synes tidspunktet er mistenkelig.
              </li>
            </ul>
          </Info>

          <H3>2. Brevet fra borgermesteren</H3>

          <p className="mb-2">Brevet sier følgende:</p>
          <Description>
            <p className="mb-2">
              Flere meldinger har kommet inn om at orker har slått seg ned ved
              Wyvern Tor og angrepet reisende i området.
            </p>
            <p className="mb-2">
              Trusselen vurderes som alvorlig, og enhver som kan fjerne den vil
              bli belønnet av byen.
            </p>
            <p>
              Oppdraget er å oppsøke stedet, undersøke situasjonen og sørge for
              at orkene ikke lenger utgjør en fare for Phandalin.
            </p>
          </Description>

          <H4 className="mb-2">DM-info:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Dette er et offisielt oppdrag, og det bør føles annerledes enn
                Mollys rykter og Garaeles personlige bønn.
              </li>
              <li>
                Sildar gir gruppen dette som et konkret og legitimt oppdrag på
                vegne av byen.
              </li>
              <li>Du kan gi spillerne et fysisk handout her dersom du vil.</li>
            </ul>
          </Info>

          <H3>3. Reisen mot Wyvern Tor</H3>

          <p className="mb-2">Når gruppen forlater Phandalin:</p>
          <Description>
            <p className="mb-2">
              Landskapet blir gradvis villere jo lenger dere kommer fra byen.
            </p>
            <p className="mb-2">
              Trærne står spredt mellom steinete høyder og tørr mark, og vinden
              drar støv og tørt gress over bakken.
            </p>
            <p>Etter hvert blir terrenget brattere og mer uveisomt.</p>
          </Description>

          <p className="mb-2">Når de nærmer seg området rundt Wyvern Tor:</p>
          <Description>
            <p className="mb-2">
              Foran dere reiser mørke steinformasjoner seg mellom lave åser og
              smale stier.
            </p>
            <p className="mb-2">Området føles øde, men ikke tomt.</p>
            <p>
              Det ligger en anspent stillhet over stedet, som om noen følger
              med.
            </p>
          </Description>

          <H4 className="mb-2">DM-info:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Bygg opp følelsen av at dette er farlig terreng hvor gruppen kan
                bli observert før de ser fienden.
              </li>
              <li>
                Du kan legge inn spor etter orker dersom spillerne leter:
                fotavtrykk, gamle bålplasser, knokler eller rester av plyndret
                utstyr.
              </li>
            </ul>
          </Info>

          <H3>4. Tegn på orkenes nærvær</H3>

          <p className="mb-2">
            Før spillerne når selve leiren, kan de oppdage:
          </p>
          <Description>
            <p className="mb-2">
              Mellom steinene finner dere tegn på at væpnede skapninger nylig
              har passert her.
            </p>
            <p className="mb-2">
              Jorden er tråkket opp, og en svak lukt av røyk og gammelt blod
              henger i luften.
            </p>
            <p>
              Ikke langt unna ligger knokler og ødelagt reiseutstyr halvveis
              gjemt i gresset.
            </p>
          </Description>

          <H4 className="mb-2">Hvis spillerne undersøker området nøye:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>De kan finne spor som leder mot orkenes skjulested.</li>
              <li>
                De kan få inntrykk av omtrent hvor mange som holder til der.
              </li>
              <li>
                De kan få en bedre mulighet til å nærme seg leiren forsiktig i
                stedet for å storme rett inn.
              </li>
            </ul>
          </Info>

          <H3>5. Orkenes leir</H3>

          <p className="mb-2">Når spillerne får øye på leiren:</p>
          <Description>
            <p className="mb-2">
              Mellom høye steiner og ujevnt terreng ser dere en grov leirplass.
            </p>
            <p className="mb-2">
              Det brenner rester av et bål, og primitive våpen, skinn og
              forsyninger ligger spredt omkring.
            </p>
            <p>Dette er uten tvil stedet orkene har brukt som base.</p>
          </Description>

          <H4 className="mb-2">DM-info:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Her kan du la spillerne velge hvordan de vil gå frem: snike,
                observere, legge en plan, forhandle eller angripe.
              </li>
              <li>
                Orkene bør føles brutale og farlige, men ikke nødvendigvis
                dumdristige. De kan reagere på støy, inntrengere og svakhet.
              </li>
              <li>
                Hvis du vil knytte oppdraget tettere til hovedhistorien, kan
                orkene ha hørt rykter om uro i området eller være presset ut i
                aktivitet av større hendelser.
              </li>
            </ul>
          </Info>

          <H3>6. Hvis spillerne vil snike eller speide</H3>

          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Belønn forsiktig spill med informasjon om antall orker,
                plasseringer og mulige innganger eller fluktruter.
              </li>
              <li>
                La dem oppdage detaljer som gjør at de kan planlegge et bedre
                angrep eller et bakhold.
              </li>
              <li>
                Hvis de gjør det godt, bør de føle at de har oppnådd en tydelig
                fordel før kamp.
              </li>
            </ul>
          </Info>

          <H3>7. Hvis spillerne angriper</H3>

          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Kampen bør føles røff og voldelig. Orkene er en direkte fysisk
                trussel.
              </li>
              <li>
                Bruk terrenget: steiner, høydeforskjeller, smale passasjer og
                dekning.
              </li>
              <li>Hvis orkene innser at de taper, kan noen prøve å flykte.</li>
              <li>
                Flukt kan gi spillerne et valg: jage dem, sikre leiren, eller
                trekke seg tilbake og regroupere.
              </li>
            </ul>
          </Info>

          <H3>8. Hvis spillerne forsøker å snakke med orkene</H3>

          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Dette er mulig hvis du ønsker det, men orkene bør være truende,
                stolte og raske til å ty til vold.
              </li>
              <li>
                Forhandling kan fungere dersom spillerne viser styrke, tilbyr
                noe nyttig eller skaper frykt.
              </li>
              <li>
                Selv hvis samtalen mislykkes, kan den gi spillerne innsikt i hva
                orkene vil og hvor desperate de er.
              </li>
            </ul>
          </Info>

          <H3>9. Bevis på at trusselen er fjernet</H3>

          <p className="mb-2">Etter at spillerne har håndtert orkene:</p>
          <Description>
            <p className="mb-2">Leiren ligger stille.</p>
            <p className="mb-2">
              Bålet brenner lavt eller har sluknet helt, og stedet virker
              forlatt.
            </p>
            <p>
              Dere sitter igjen med tydelige tegn på at orkene ikke lenger
              holder til her.
            </p>
          </Description>

          <H4 className="mb-2">DM-info:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Spillerne trenger noe de kan bringe tilbake som bevis dersom du
                vil gjøre det konkret: våpen, trofeer, et merke fra leiren,
                eller bare en troverdig rapport.
              </li>
              <li>
                Hvis noen orker slapp unna, kan du avgjøre om oppdraget likevel
                regnes som fullført eller bare delvis løst.
              </li>
            </ul>
          </Info>

          <H3>10. Tilbake til Sildar</H3>

          <p className="mb-2">Når gruppen returnerer til Phandalin:</p>
          <Description>
            <p className="mb-2">
              Sildar lytter oppmerksomt mens dere forteller hva som skjedde ved
              Wyvern Tor.
            </p>
            <p className="mb-2">Når dere er ferdige, nikker han langsomt.</p>
            <p>«Bra arbeid. Da er i det minste én trussel mindre for byen.»</p>
          </Description>

          <H4 className="mb-2">Hvis oppdraget er fullført:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Sildar bekrefter at han vil sørge for at gruppen får belønningen
                byen har lovet.
              </li>
              <li>
                Han kan også bruke dette som et tegn på at spillerne er til å
                stole på i større og farligere saker senere.
              </li>
            </ul>
          </Info>

          <H4 className="mb-2">Hvis oppdraget bare er delvis løst:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Sildar kan være takknemlig for informasjonen, men understreke at
                problemet kanskje ikke er helt over.
              </li>
              <li>
                Dette kan gi deg en åpning for at orkene dukker opp igjen
                senere, hvis du ønsker det.
              </li>
            </ul>
          </Info>
        </div>
      </div>

      <div
        onClick={() => setShowNecromancer(!showNecromancer)}
        className="cursor-pointer"
      >
        <H2>
          {showNecromancer ? (
            <i className="fa-solid fa-caret-down mr-4"></i>
          ) : (
            <i className="fa-solid fa-caret-right mr-4"></i>
          )}
          Necromanceren ved Old Owl Well
        </H2>
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out transform ${
          showNecromancer
            ? "max-h-[5000px] opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-2"
        }`}
      >
        <div className="pt-2">
          <H3>1. Hvordan spillerne får oppdraget</H3>

          <p className="mb-2">Hvis Molly viser frem tegningen sin:</p>
          <Description>
            <p className="mb-2">
              Molly blar frem en tegning av en tynn mann i røde kapper, stående
              blant graver og knokler.
            </p>
            <p className="mb-2">
              Rundt ham har hun tegnet skjeletter med stive armer og tomme øyne.
            </p>
            <p>
              «Jeg så ham en natt,» sier hun lavt. «Han tok med seg bein fra
              gravplassen.»
            </p>
          </Description>

          <H4 className="mb-2">DM-info:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Dette fungerer best som et rykte og et urovekkende spor, ikke
                som en full forklaring.
              </li>
              <li>Molly vet ikke hvem mannen er, bare hva hun så.</li>
              <li>
                Dette gir spillerne en grunn til å undersøke Old Owl Well.
              </li>
            </ul>
          </Info>

          <H3>2. Reisen til Old Owl Well</H3>

          <p className="mb-2">Når gruppen nærmer seg stedet:</p>
          <Description>
            <p className="mb-2">
              Landskapet blir tørrere og mer øde jo nærmere dere kommer.
            </p>
            <p className="mb-2">
              Til slutt ser dere restene av et gammelt vakttårn som reiser seg
              over sammenraste steinmurer og ujevnt terreng.
            </p>
            <p>
              Rundt ruinene er bakken hard og livløs, og stedet føles stille på
              en måte som ikke virker naturlig.
            </p>
          </Description>

          <p className="mb-2">Når de kommer nærmere ruinene:</p>
          <Description>
            <p className="mb-2">
              Ved foten av det gamle tårnet ser dere ferske spor i støvet.
            </p>
            <p className="mb-2">
              Nakne knokler ligger delvis synlige i jorden, og flere av dem ser
              ut til å ha blitt gravd frem nylig.
            </p>
            <p>
              Luften er tørr, men det ligger en merkelig, råtten lukt over
              området.
            </p>
          </Description>

          <H4 className="mb-2">DM-info:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Dette stedet skal føles gammelt, dødt og forstyrret, ikke bare
                som en vanlig ruin.
              </li>
              <li>
                Bygg opp følelsen av at noen bruker stedet aktivt til mørk magi.
              </li>
            </ul>
          </Info>

          <H3>3. Første syn av necromanceren</H3>

          <p className="mb-2">Når spillerne får øye på området:</p>
          <Description>
            <p className="mb-2">
              I skyggen av ruinene står en mager mann i røde kapper bøyd over en
              samling bein og gamle gravrester.
            </p>
            <p className="mb-2">
              I nærheten står flere skjeletter urørlige, som vakter som venter
              på ordre.
            </p>
            <p>
              Mannen ser ikke ut til å være overrasket over å ha fått besøk.
            </p>
          </Description>

          <p className="mb-2">Hvis han får øye på spillerne:</p>
          <Description>
            <p>
              Han retter seg opp, støtter seg rolig til staven sin og ser mot
              dere med et kjølig, vurderende blikk.
            </p>
          </Description>

          <H4 className="mb-2">Hva necromanceren er:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Dette er Hamun Kost, en necromancer som undersøker ruinene og
                områdets gamle hemmeligheter.
              </li>
              <li>Han er ikke automatisk fiendtlig.</li>
              <li>
                Han kan være urovekkende og moralsk tvilsom, men han er også
                intelligent og villig til å snakke hvis spillerne ikke går rett
                til angrep.
              </li>
            </ul>
          </Info>

          <H3>4. Samtalen med Hamun Kost</H3>

          <p className="mb-2">Hamun Kost åpner samtalen slik:</p>
          <Description>
            <p className="mb-2">«Dere er langt hjemmefra.»</p>
            <p>«De fleste holder seg unna slike steder. Klokt, vanligvis.»</p>
          </Description>

          <H4 className="mb-2">Hvis spillerne holder seg rolige:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>Hamun Kost er villig til å føre en samtale.</li>
              <li>
                Han fremstår rolig, arrogant og litt fascinert av mennesker som
                ikke flykter fra ham.
              </li>
              <li>Han vil heller bruke ord enn å starte en unødvendig kamp.</li>
            </ul>
          </Info>

          <H4 className="mb-2">Hvis spillerne er truende eller angriper:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Hamun Kost trekker seg ikke nødvendigvis umiddelbart tilbake.
              </li>
              <li>Skjelettene reagerer på ordre eller tydelig fare.</li>
              <li>
                Dette kan raskt eskalere til kamp dersom spillerne presser
                situasjonen.
              </li>
            </ul>
          </Info>

          <H3>5. Hva Hamun Kost vet og kan fortelle</H3>

          <H4 className="mb-2">Hvis spillerne spør ham om hva han gjør her:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Han undersøker gamle ruiner og søker kunnskap som har ligget
                begravet lenge.
              </li>
              <li>
                Han har gravd frem levninger for å bruke dem som tjenere og
                vakter mens han arbeider.
              </li>
              <li>
                Han ser ikke på dette som noe galt, men som et praktisk verktøy.
              </li>
            </ul>
          </Info>

          <H4 className="mb-2">Hvis spillerne spør om Old Owl Well:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Han vet at stedet er gammelt og at ruinene stammer fra en eldre
                tid.
              </li>
              <li>
                Han tror området skjuler glemt kunnskap og spor etter gammel
                magi.
              </li>
              <li>
                Han er mer interessert i det som ligger under historien enn i
                selve tårnet.
              </li>
            </ul>
          </Info>

          <H4 className="mb-2">Hvis spillerne spør om farer i området:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Hamun Kost kjenner til at området rundt Phandalin er preget av
                uro og vold.
              </li>
              <li>
                Han kan ha hørt om orker, gobliner eller andre trusler, men han
                bryr seg lite så lenge de ikke forstyrrer arbeidet hans.
              </li>
              <li>
                Han kan nevne at det finnes mørkere ting i regionen enn vanlige
                banditter, hvis du vil bygge stemning.
              </li>
            </ul>
          </Info>

          <H4 className="mb-2">
            Hvis spillerne spør om han står bak noe i Phandalin:
          </H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Hamun Kost har ingen grunn til å skjule at han ikke har noe med
                Redbrands å gjøre.
              </li>
              <li>Han er sin egen aktør og opererer etter egne interesser.</li>
              <li>
                Dette kan være en fin måte å vise spillerne at ikke alle mørke
                skikkelser i området nødvendigvis jobber sammen.
              </li>
            </ul>
          </Info>

          <H3>6. Hvis spillerne vil samarbeide eller hjelpe ham</H3>

          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Hamun Kost kan gi dem en oppgave eller be om hjelp hvis du vil
                utvide questen.
              </li>
              <li>
                Han kan for eksempel be dem undersøke et annet sted, hente en
                gjenstand, eller komme tilbake med informasjon.
              </li>
              <li>
                Hvis de hjelper ham, bør det føles litt ubehagelig moralsk, men
                ikke nødvendigvis åpenbart ondt.
              </li>
            </ul>
          </Info>

          <H3>7. Hvis spillerne vil stoppe ham</H3>

          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Hvis gruppen mener at oppgraving av de døde og kontroll over
                skjeletter er grunn nok til å gripe inn, er det en helt naturlig
                reaksjon.
              </li>
              <li>
                Kampen bør da føles som et oppgjør med mørk magi i et åpent, øde
                ruinområde.
              </li>
              <li>
                Bruk skjelettene aktivt som vakter og forlengelser av hans
                vilje.
              </li>
            </ul>
          </Info>

          <H3>8. Hvis spillerne lar ham være i fred</H3>

          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>Dette er også et gyldig utfall.</li>
              <li>
                Da forlater spillerne stedet med ny informasjon, men uten å ha
                fjernet ham som mulig fremtidig faktor.
              </li>
              <li>
                Hamun Kost kan da brukes senere igjen dersom du vil la ham dukke
                opp som en nyttefull, farlig eller tvetydig NPC.
              </li>
            </ul>
          </Info>

          <H3>9. Hva spillerne kan ta med seg herfra</H3>

          <p className="mb-2">
            Når møtet er over, kan gruppen sitte igjen med:
          </p>
          <Description>
            <p className="mb-2">
              Ny kunnskap om at gamle ruiner i området fortsatt blir oppsøkt av
              folk som leter etter skjult makt.
            </p>
            <p className="mb-2">
              En forståelse av at ikke alle farer i regionen er direkte knyttet
              til hverandre.
            </p>
            <p>
              Og et sterkt inntrykk av at landet rundt Phandalin er fullt av
              gamle ting som burde fått ligge i fred.
            </p>
          </Description>

          <H4 className="mb-2">DM-info:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Dette questet trenger ikke nødvendigvis å ende med kamp eller en
                tydelig seier.
              </li>
              <li>
                Det fungerer veldig godt som et stemningsquest som utvider
                verdenen og viser at spillerne beveger seg i et farlig område
                med flere uavhengige trusler.
              </li>
            </ul>
          </Info>

          <H3>10. Tilbake i Phandalin</H3>

          <p className="mb-2">Hvis spillerne forteller andre om det de fant:</p>
          <Description>
            <p className="mb-2">
              Historien om en rødkledd mann som graver opp de døde ved gamle
              ruiner, er ikke en historie folk i Phandalin liker å høre.
            </p>
            <p>
              Reaksjonene er preget av uro, skepsis og den stille frykten som
              sprer seg når noe føles for gammelt og for galt.
            </p>
          </Description>

          <H4 className="mb-2">DM-info:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Sildar, Garaele eller andre NPC-er kan reagere forskjellig
                avhengig av hva spillerne faktisk gjorde der ute.
              </li>
              <li>
                Hvis Hamun Kost fortsatt er i live, kan hans tilstedeværelse bli
                et uløst problem eller et fremtidig spor.
              </li>
            </ul>
          </Info>
        </div>
      </div>

      <div
        onClick={() => setShowReidoth(!showReidoth)}
        className="cursor-pointer"
      >
        <H2>
          {showReidoth ? (
            <i className="fa-solid fa-caret-down mr-4"></i>
          ) : (
            <i className="fa-solid fa-caret-right mr-4"></i>
          )}
          Druiden Reidoth
        </H2>
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out transform ${
          showReidoth
            ? "max-h-[5000px] opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-2"
        }`}
      >
        <div className="pt-2">
          <H3>1. Hvordan spillerne finner Reidoth</H3>

          <Description>
            <p className="mb-2">
              Når spillerne utforsker ruinene av Thundertree, finner de tegn på
              at noen fortsatt bor i området.
            </p>
            <p className="mb-2">
              Spor etter bål, urter og små symboler laget av grener tyder på at
              en skogsvandrer holder til her.
            </p>
            <p>
              Etter hvert kan dere finne en liten, skjult hytte blant ruinene.
            </p>
          </Description>

          <H4 className="mb-2">DM-info:</H4>

          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>Reidoth er en druid som studerer området.</li>
              <li>
                Han forsøker å forstå hva som skjer med naturen i Thundertree.
              </li>
              <li>Han er forsiktig, men ikke fiendtlig.</li>
            </ul>
          </Info>

          <H3>2. Møtet med Reidoth</H3>

          <Description>
            <p className="mb-2">
              En eldre mann med værbitt ansikt trer frem mellom trærne.
            </p>
            <p className="mb-2">
              Klærne hans er en blanding av lær, pels og naturlige materialer.
            </p>
            <p>
              Han studerer dere stille før han sier: «Dere hører ikke hjemme i
              denne delen av skogen.»
            </p>
          </Description>

          <H4 className="mb-2">Hvordan Reidoth oppfører seg:</H4>

          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>Han er rolig og observant.</li>
              <li>Han bryr seg mer om naturen enn om politikk.</li>
              <li>Han vurderer først om spillerne er en trussel.</li>
            </ul>
          </Info>

          <H3>3. Hva Reidoth vet om Thundertree</H3>

          <Description>
            <p className="mb-2">
              Reidoth forklarer at Thundertree en gang var en blomstrende
              landsby.
            </p>
            <p className="mb-2">
              Etter en katastrofe ble stedet forlatt, og naturen tok gradvis
              tilbake ruinene.
            </p>
            <p>Nå er stedet hjem for farligere ting.</p>
          </Description>

          <H4 className="mb-2">Informasjon Reidoth kan gi:</H4>

          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                En ung grønn drage har gjort ruinene til sitt territorium.
              </li>
              <li>Flere farlige skapninger har flyttet inn i området.</li>
              <li>Skogen rundt Thundertree er i ubalanse.</li>
            </ul>
          </Info>

          <H3>4. Dragen i ruinene</H3>

          <Description>
            <p className="mb-2">Reidoth peker mot ruinene i det fjerne.</p>
            <p className="mb-2">
              «Den skapningen der ute vil vokse seg sterkere hvis ingen stopper
              den.»
            </p>
            <p>
              «En grønn drage er ikke bare et monster. Den er et rovdyr som
              liker å manipulere og kontrollere.»
            </p>
          </Description>

          <H4 className="mb-2">DM-info:</H4>

          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>Reidoth advarer spillerne mot å angripe dragen uten plan.</li>
              <li>Han forstår hvor farlig en drage kan være.</li>
              <li>
                Han kan gi råd om å bruke list eller diplomati hvis spillerne
                ønsker det.
              </li>
            </ul>
          </Info>

          <H3>5. En avtale</H3>

          <Description>
            <p className="mb-2">Reidoth sier til slutt:</p>
            <p className="mb-2">
              «Hvis dere driver dragen bort fra ruinene, vil naturen her få en
              sjanse til å lege seg.»
            </p>
            <p>
              «Og jeg kan kanskje hjelpe dere med informasjon dere trenger.»
            </p>
          </Description>

          <H4 className="mb-2">Hvis spillerne hjelper Reidoth:</H4>

          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>Han blir en verdifull alliert.</li>
              <li>Han deler mer kunnskap om området.</li>
              <li>Han kan gi dem viktig informasjon om Cragmaw Castle.</li>
            </ul>
          </Info>

          <H3>6. Informasjon om Cragmaw Castle</H3>

          <Description>
            <p className="mb-2">
              Etter å ha hørt om spillernes oppdrag, nikker Reidoth sakte.
            </p>
            <p className="mb-2">
              «Goblinene dere leter etter samler seg ved et gammelt slott i
              skogen.»
            </p>
            <p>«Det stedet kalles Cragmaw Castle.»</p>
          </Description>

          <H4 className="mb-2">Hva Reidoth kan fortelle:</H4>

          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>Cragmaw Castle ligger dypt i Neverwinter-skogen.</li>
              <li>Det er bebodd av gobliner og bugbears.</li>
              <li>Det fungerer som base for Cragmaw-goblinene.</li>
              <li>
                Han kan forklare omtrent hvor spillerne må reise for å finne
                det.
              </li>
            </ul>
          </Info>

          <H3>7. Hvis spillerne spør Reidoth om mer</H3>

          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Om Black Spider:</strong> Reidoth kjenner ikke navnet,
                men han vet at mørke krefter beveger seg i området.
              </li>
              <li>
                <strong>Om drager:</strong> Han forklarer at grønne drager er
                spesielt listige og manipulerende.
              </li>
              <li>
                <strong>Om skogen:</strong> Neverwinter Wood er gammel og full
                av hemmeligheter.
              </li>
            </ul>
          </Info>

          <H3>8. Hvis spillerne hjelper ham</H3>

          <Description>
            <p className="mb-2">
              Når trusselen i Thundertree blir redusert, virker Reidoth tydelig
              lettet.
            </p>
            <p>«Naturen vil langsomt finne balansen igjen,» sier han.</p>
          </Description>

          <H4 className="mb-2">Belønning</H4>

          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>Reidoth gir spillerne nyttig informasjon.</li>
              <li>Han kan tilby urter eller naturkunnskap.</li>
              <li>Han kan bli en fremtidig alliert.</li>
            </ul>
          </Info>

          <H3>9. Videre i historien</H3>

          <Description>
            <p className="mb-2">
              Etter samtalen med Reidoth har spillerne fått et viktig spor.
            </p>
            <p>
              Reisen deres fører nå videre mot Cragmaw Castle og kampen om Wave
              Echo Cave.
            </p>
          </Description>
        </div>
      </div>

      <div
        onClick={() => setShowDragon(!showDragon)}
        className="cursor-pointer"
      >
        <H2>
          {showDragon ? (
            <i className="fa-solid fa-caret-down mr-4"></i>
          ) : (
            <i className="fa-solid fa-caret-right mr-4"></i>
          )}
          Den grønne dragen i Thundertree
        </H2>
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out transform ${
          showDragon
            ? "max-h-[5000px] opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-2"
        }`}
      >
        <div className="pt-2">
          <H3>1. Hvordan spillerne får oppdraget</H3>

          <p className="mb-2">Hvis Molly viser frem tegningen sin:</p>
          <Description>
            <p className="mb-2">
              Molly holder opp en tegning av en stor grønn drage med brede
              vinger og åpen kjeft.
            </p>
            <p className="mb-2">
              Under dragen har hun tegnet ødelagte hus, trær som vokser mellom
              ruinene og et gammelt steintårn.
            </p>
            <p>
              «Folk sier den holder til i Thundertree,» sier hun. «Og at ingen
              som går for nær, vil være der lenge.»
            </p>
          </Description>

          <H4 className="mb-2">DM-info:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Dette fungerer best som et rykte og et visuelt spor, ikke som en
                full forklaring.
              </li>
              <li>
                Molly vet ikke dragens navn, bare at folk har snakket om en stor
                grønn drage i ruinene.
              </li>
              <li>
                Dette bør føles som et farlig og spennende spor, ikke et vanlig
                oppdrag fra en oppdragsgiver.
              </li>
            </ul>
          </Info>

          <H3>2. Reisen til Thundertree</H3>

          <p className="mb-2">Når gruppen nærmer seg området:</p>
          <Description>
            <p className="mb-2">
              Landskapet blir tettere og villere jo nærmere dere kommer
              Thundertree.
            </p>
            <p className="mb-2">
              Gamle stier forsvinner mellom tett vegetasjon, og naturen virker
              som om den sakte har tatt området tilbake.
            </p>
            <p>
              Luften er fuktig og stille, og det hviler en ubehagelig ro over
              området.
            </p>
          </Description>

          <p className="mb-2">Når ruinene kommer til syne:</p>
          <Description>
            <p className="mb-2">
              Mellom trær og villgrodd vegetasjon ser dere restene av en gammel
              landsby.
            </p>
            <p className="mb-2">
              Halvt sammenraste bygninger står tomme mellom røtter, kratt og
              stein.
            </p>
            <p>Et gammelt tårn reiser seg over ruinene i det fjerne.</p>
          </Description>

          <H4 className="mb-2">DM-info:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Bygg opp Thundertree som et sted som både er vakkert og sykt.
              </li>
              <li>
                Området skal føles forlatt, men ikke dødt. Det er som om natur
                og råte lever side om side.
              </li>
              <li>
                Hvis du ønsker det, kan du legge inn tegn på at noe stort og
                farlig dominerer ruinene lenge før spillerne ser dragen.
              </li>
            </ul>
          </Info>

          <H3>3. Første tegn på dragen</H3>

          <p className="mb-2">Når spillerne utforsker ruinene:</p>
          <Description>
            <p className="mb-2">
              Flere steder ser dere spor av noe stort som har beveget seg mellom
              ruinene.
            </p>
            <p className="mb-2">
              Stein er skrapt opp, tak er knust ovenfra, og enkelte steder
              lukter luften skarpt og giftig.
            </p>
            <p>
              Fugler og dyr holder seg unna de innerste delene av landsbyen.
            </p>
          </Description>

          <H4 className="mb-2">Hvis spillerne undersøker sporene:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>De kan forstå at en svært stor skapning holder til her.</li>
              <li>
                De kan få inntrykk av at skapningen er intelligent og bruker
                ruinene som et territorium, ikke bare som et tilfeldig
                skjulested.
              </li>
              <li>
                Dette er en fin mulighet til å gjøre det tydelig at dette ikke
                er en vanlig kamp.
              </li>
            </ul>
          </Info>

          <H3>4. Første syn av dragen</H3>

          <p className="mb-2">Når spillerne får øye på dragen:</p>
          <Description>
            <p className="mb-2">
              Høyt oppe blant ruinene, på toppen av det gamle tårnet, ser dere
              en stor grønn drage.
            </p>
            <p className="mb-2">
              Den ligger som om stedet tilhører den alene, med vingene delvis
              foldet og hodet hevet over ruinene.
            </p>
            <p>
              De grønne skjellene fanger lyset, og selv på avstand er det noe
              rovdyraktig, intelligent og truende ved blikket dens.
            </p>
          </Description>

          <p className="mb-2">Hvis dragen oppdager dem:</p>
          <Description>
            <p>
              Dragen løfter hodet sakte og vender blikket mot dere, som om den
              allerede visste at dere var der.
            </p>
          </Description>

          <H4 className="mb-2">DM-info:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>Dette er Venomfang, en ung grønn drage.</li>
              <li>
                Han bør føles farlig nok til at spillerne forstår at kamp kan
                være katastrofalt.
              </li>
              <li>
                Grønn drage betyr manipulasjon, stolthet, løgn, kontroll og
                gift.
              </li>
            </ul>
          </Info>

          <H3>5. Samtalen med dragen</H3>

          <p className="mb-2">Hvis dragen velger å snakke først:</p>
          <Description>
            <p className="mb-2">
              «Så. Endelig noen med mot nok til å komme nærmere.»
            </p>
            <p>
              Stemmen er rolig, nesten silkemyk, men bærer lett over hele
              ruinområdet.
            </p>
          </Description>

          <H4 className="mb-2">Hvordan dragen oppfører seg:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Dragen er arrogant og ser på seg selv som den naturlige
                herskeren over stedet.
              </li>
              <li>
                Han liker å snakke hvis det gir ham kontroll over situasjonen.
              </li>
              <li>
                Han kan være høflig på overflaten, men alt han sier er farget av
                ego, manipulasjon eller skjulte hensikter.
              </li>
              <li>
                Han er ikke en trygg samtalepartner selv om han ikke angriper
                med en gang.
              </li>
            </ul>
          </Info>

          <H4 className="mb-2">Hvis spillerne snakker respektfullt:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>Dragen lytter og lar seg underholde av dem.</li>
              <li>
                Han kan spørre hvem de er, hvorfor de er her, og hva de kan
                tilby ham.
              </li>
              <li>
                Han kan forsøke å spille dem mot andre fiender i området, eller
                lokke dem til å tjene hans interesser.
              </li>
            </ul>
          </Info>

          <H4 className="mb-2">
            Hvis spillerne er uhøflige, dumdristige eller truende:
          </H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>Dragen mister raskt tålmodigheten.</li>
              <li>
                Han tåler dårlig fornærmelser eller utfordringer mot stoltheten
                hans.
              </li>
              <li>
                Hvis gruppen presser for langt, kan situasjonen gå direkte over
                i kamp eller et voldsomt maktdemonstrerende angrep.
              </li>
            </ul>
          </Info>

          <H3>6. Hva dragen vil</H3>

          <H4 className="mb-2">Hvis spillerne prøver å forstå ham:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>Han vil eie og dominere territoriet sitt.</li>
              <li>Han liker at andre frykter ham.</li>
              <li>
                Han er interessert i informasjon, verdifulle ting og muligheter
                til å utvide makten sin.
              </li>
              <li>
                Han foretrekker at andre tar risikoen, mens han selv høster
                gevinsten.
              </li>
            </ul>
          </Info>

          <H4 className="mb-2">
            Hvis spillerne spør hva han gjør i Thundertree:
          </H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Han ser på ruinene som et passende sted å hvile, vokse i styrke
                og bygge sitt eget domene.
              </li>
              <li>
                Han trenger ikke gi hele sannheten. Det er helt i karakter at
                han skjuler mer enn han sier.
              </li>
            </ul>
          </Info>

          <H3>7. Hvis spillerne vil forhandle</H3>

          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>Dette er ofte den tryggeste måten å håndtere møtet på.</li>
              <li>
                Dragen kan la seg underholde av gaver, smiger, informasjon eller
                forslag som gagner ham.
              </li>
              <li>
                Han kan love ting uten å ha noen sterk intensjon om å holde dem.
              </li>
              <li>
                Hvis gruppen virker nyttig, kan han gi dem et tilbud eller prøve
                å sende dem mot en annen fiende.
              </li>
            </ul>
          </Info>

          <H3>8. Hvis spillerne vil flykte eller trekke seg tilbake</H3>

          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>Dette er et helt legitimt utfall.</li>
              <li>
                Dragen kan la dem gå hvis han ikke føler seg truet, særlig hvis
                han synes frykten deres er tilfredsstillende.
              </li>
              <li>
                Han kan også rope noe etter dem for å ydmyke eller skremme dem.
              </li>
            </ul>
          </Info>

          <H3>9. Hvis spillerne angriper</H3>

          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>Denne kampen skal føles ekstremt farlig.</li>
              <li>
                Bruk høyde, bevegelse, gift og dragens intelligens aktivt.
              </li>
              <li>
                Dragen slåss ikke som et dyr; han slåss som et overlegent rovdyr
                som vet at han er farligere enn dem.
              </li>
              <li>
                Hvis du vil gi spillerne en sjanse til å overleve, kan dragen
                velge å trekke seg unna eller leke med dem i stedet for å kjempe
                til døden.
              </li>
            </ul>
          </Info>

          <H3>10. Hva spillerne kan ta med seg herfra</H3>

          <p className="mb-2">
            Uansett hvordan møtet ender, kan gruppen sitte igjen med:
          </p>
          <Description>
            <p className="mb-2">
              Et sterkt inntrykk av at Thundertree er dominert av en skapning
              som er langt mer intelligent og farlig enn vanlige monstre.
            </p>
            <p className="mb-2">
              En forståelse av at ikke alle trusler i området bør møtes med
              sverd først.
            </p>
            <p>
              Og følelsen av at ruinene fortsatt skjuler makt, råte og gamle
              hemmeligheter.
            </p>
          </Description>

          <H4 className="mb-2">DM-info:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Dette questet fungerer best som et høyrisiko-møte med en stor og
                minneverdig trussel.
              </li>
              <li>Det trenger ikke ende med at spillerne dreper dragen.</li>
              <li>
                Ofte er det mer interessant om de forhandler, flykter, blir
                lurt, eller får en ny fiende de må forholde seg til senere.
              </li>
            </ul>
          </Info>

          <H3>11. Tilbake i Phandalin</H3>

          <p className="mb-2">Hvis spillerne forteller andre hva de fant:</p>
          <Description>
            <p className="mb-2">
              Bare det å høre at en grønn drage holder til i Thundertree er nok
              til å gjøre folk i Phandalin urolige.
            </p>
            <p>
              Reaksjonene preges av frykt, vantro og den tunge stillheten som
              oppstår når noen nevner noe som er altfor stort til å ignoreres.
            </p>
          </Description>

          <H4 className="mb-2">DM-info:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Hvis dragen fortsatt lever, forblir dette en uløst trussel i
                regionen.
              </li>
              <li>
                Hvis spillerne har snakket med ham, kan du bruke informasjonen
                eller avtalene derfra senere i kampanjen.
              </li>
              <li>
                Hvis de har ydmyket ham eller truet ham, kan du la dragen huske
                det.
              </li>
            </ul>
          </Info>
        </div>
      </div>

      <div
        onClick={() => setShowRedbrands(!showRedbrands)}
        className="cursor-pointer"
      >
        <H2>
          {showRedbrands ? (
            <i className="fa-solid fa-caret-down mr-4"></i>
          ) : (
            <i className="fa-solid fa-caret-right mr-4"></i>
          )}
          Redbrand Hideout
        </H2>
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out transform ${
          showRedbrands
            ? "max-h-[5000px] opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-2"
        }`}
      >
        <div className="pt-2">
          <H3>1. Hvordan spillerne får oppdraget</H3>

          <p className="mb-2">Når spillerne snakker med Sildar om Redbrands:</p>
          <Description>
            <p className="mb-2">
              Sildar står ved skrivebordet sitt med armene i kors og et hardt
              uttrykk i ansiktet.
            </p>
            <p className="mb-2">
              «Denne byen kommer ikke til å få fred så lenge Redbrands får gjøre
              som de vil,» sier han.
            </p>
            <p>
              «Hvis vi skal få kontroll over Phandalin, må noen finne hvor de
              holder til og stanse dem.»
            </p>
          </Description>

          <p className="mb-2">
            Hvis spillerne allerede har hatt en konflikt med Redbrands:
          </p>
          <Description>
            <p>
              Det er tydelig at konflikten allerede er i gang, og at Redbrands
              nå ser på dere som et problem.
            </p>
          </Description>

          <H4 className="mb-2">Hva Sildar vet:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Redbrands terroriserer byen gjennom trusler, vold og frykt.
              </li>
              <li>Flere innbyggere tør ikke stå imot dem åpent.</li>
              <li>
                Sildar vet at de holder til et sted nær eller under Tresendar
                Manor.
              </li>
              <li>Han vet ikke nøyaktig hvordan skjulestedet er bygget opp.</li>
              <li>
                Han mistenker at Redbrands har en leder som ikke bare er en
                vanlig gatebølle.
              </li>
              <li>
                Han ønsker at spillerne skal bryte Redbrands kontroll over byen.
              </li>
            </ul>
          </Info>

          <H4 className="mb-2">Hvis spillerne spør Sildar om mer:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Hvis de spør hvem som leder Redbrands:</strong> Sildar
                vet ikke sikkert, men han tror gjengen styres av noen med både
                ressurser og plan.
              </li>
              <li>
                <strong>
                  Hvis de spør hvorfor ingen i byen har stoppet dem:
                </strong>{" "}
                Sildar forklarer at Redbrands har fått folk til å tro at
                motstand bare gjør situasjonen verre.
              </li>
              <li>
                <strong>Hvis de spør hvor skjulestedet ligger:</strong> Sildar
                tror det har tilknytning til de gamle ruinene ved Tresendar
                Manor.
              </li>
              <li>
                <strong>Hvis de spør om støtte:</strong> Sildar ønsker å hjelpe,
                men han har verken nok folk eller kontroll til å storme stedet
                selv.
              </li>
              <li>
                <strong>Hvis de spør om målet:</strong> Målet er å ødelegge
                Redbrands som trussel og finne ut hvem som står bak dem.
              </li>
            </ul>
          </Info>

          <H3>2. Tegn på Redbrands kontroll i byen</H3>

          <p className="mb-2">Før spillerne drar til skjulestedet:</p>
          <Description>
            <p className="mb-2">
              Rundt omkring i Phandalin merkes Redbrands innflytelse overalt.
            </p>
            <p className="mb-2">
              Folk senker stemmen når navnet deres nevnes, og flere unngår å
              møte blikket deres når temaet kommer opp.
            </p>
            <p>
              Det er tydelig at frykten for Redbrands har blitt en del av
              hverdagen i byen.
            </p>
          </Description>

          <H4 className="mb-2">DM-info:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Dette er en fin mulighet til å gjøre Redbrands til mer enn bare
                fiender i et dungeon.
              </li>
              <li>
                La spillerne merke at dette handler om å frigjøre byen, ikke
                bare vinne en kamp.
              </li>
              <li>
                Hvis du vil, kan Molly, Bart, Sildar eller andre NPC-er gi små
                hint om forsvinninger, trusler eller folk som er blitt dratt av
                gårde.
              </li>
            </ul>
          </Info>

          <H3>3. Veien til Tresendar Manor</H3>

          <p className="mb-2">Når spillerne nærmer seg ruinene:</p>
          <Description>
            <p className="mb-2">
              På en høyde i utkanten av byen ligger ruinene av Tresendar Manor.
            </p>
            <p className="mb-2">
              De gamle steinmurene står fortsatt delvis igjen, men stedet virker
              forlatt og forfallent ved første øyekast.
            </p>
            <p>
              Likevel hviler det noe urolig over området, som om ruinene skjuler
              mer enn det byen liker å snakke om.
            </p>
          </Description>

          <H4 className="mb-2">Hvis spillerne undersøker området utenfor:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                De kan finne spor av aktivitet: fotavtrykk, tomflasker, rester
                av mat eller tegn på at folk går inn og ut av området.
              </li>
              <li>
                De kan oppdage en inngang, kjellerdør eller annet skjult spor
                som peker mot at ruinene brukes aktivt.
              </li>
              <li>
                Belønn forsiktig utforsking med bedre oversikt før de går inn.
              </li>
            </ul>
          </Info>

          <H3>4. Inngangen til skjulestedet</H3>

          <p className="mb-2">Når spillerne finner veien ned:</p>
          <Description>
            <p className="mb-2">
              En mørk trapp eller passasje leder ned under ruinene.
            </p>
            <p className="mb-2">
              Luften under bakken er kjøligere og tyngre, og lukten av fuktig
              stein, gammel jord og menneskelig nærvær blir raskt tydelig.
            </p>
            <p>
              Det er ingen tvil om at dette ikke bare er gamle ruiner. Noen
              lever og arbeider her nede nå.
            </p>
          </Description>

          <H4 className="mb-2">DM-info:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Overgangen fra by til underjordisk skjulested bør føles tydelig.
              </li>
              <li>
                Dette er et sted der spillerne skal kjenne at de går inn i
                fiendens område.
              </li>
            </ul>
          </Info>

          <H3>5. Første inntrykk av hideoutet</H3>

          <p className="mb-2">Når spillerne beveger seg innover:</p>
          <Description>
            <p className="mb-2">
              Gangene og rommene under Tresendar Manor bærer preg av både gammel
              ruin og nylig bruk.
            </p>
            <p className="mb-2">
              Her og der står møbler, forsyninger, drikkevarer og utstyr som
              viser at Redbrands har gjort stedet til sitt eget.
            </p>
            <p>
              Samtidig ligger mørket tett mellom veggene, og det er lett å
              forstå hvordan en gjeng kan styre byen ovenfra og skjule seg her
              nede.
            </p>
          </Description>

          <H4 className="mb-2">DM-info:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Spill opp kontrasten mellom gammel adelsruin og kriminelt
                gjemmested.
              </li>
              <li>
                Hideoutet bør føles som et sted Redbrands er komfortable i, men
                som samtidig fortsatt bærer på eldre hemmeligheter og farer.
              </li>
            </ul>
          </Info>

          <H3>6. Hvordan spillerne kan gå frem</H3>

          <H4 className="mb-2">Hvis spillerne vil snike:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Belønn dem med informasjon om vakter, rom, fanger, lagre eller
                mulige bakveier.
              </li>
              <li>
                De kan få sjansen til å plukke av fiender enkeltvis eller unngå
                unødvendige kamper.
              </li>
              <li>
                La spenningen bygge seg opp gjennom lyder, stemmer og skygger i
                gangene.
              </li>
            </ul>
          </Info>

          <H4 className="mb-2">Hvis spillerne vil gå direkte til kamp:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Redbrands er arrogante, men ikke helt dumme. De reagerer på
                støy, roper på hjelp og prøver å samle seg.
              </li>
              <li>
                Dette kan utvikle seg til flere sammenhengende kamper hvis
                spillerne går høyt ut.
              </li>
              <li>
                La stedet føles som et levende skjulested, ikke en serie helt
                isolerte rom.
              </li>
            </ul>
          </Info>

          <H4 className="mb-2">
            Hvis spillerne vil ta fanger eller presse frem informasjon:
          </H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Redbrands på lavere nivå kan vite ting om lederen, skjulestedet,
                eller hvem de har fått ordre fra.
              </li>
              <li>
                Ikke alle Redbrands er like modige når de mister overtaket.
              </li>
              <li>
                Dette er en fin måte å gi spillerne informasjon uten at de må
                ransake hvert rom perfekt.
              </li>
            </ul>
          </Info>

          <H3>7. Ting spillerne kan oppdage i hideoutet</H3>

          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                At Redbrands ikke bare er bøller, men del av en større struktur
                med en tydelig leder.
              </li>
              <li>
                At folk har blitt truet, bortført eller holdt fanget av gjengen.
              </li>
              <li>
                At skjulestedet rommer mer enn bare sovesteder og lagerrom.
              </li>
              <li>
                At det finnes spor som peker mot større planer, hemmelige
                forbindelser eller koblinger til hovedhistorien.
              </li>
            </ul>
          </Info>

          <H3>8. Møtet med lederen</H3>

          <p className="mb-2">
            Når spillerne nærmer seg den som styrer stedet:
          </p>
          <Description>
            <p className="mb-2">
              Etter hvert blir det tydelig at dette stedet ikke drives av ren
              kaos. Noen har organisert det.
            </p>
            <p className="mb-2">
              Sporene leder mot personen som holder Redbrands samlet og gir dem
              retning.
            </p>
            <p>
              Dette er øyeblikket hvor spillerne kan avsløre hvem som egentlig
              står bak Redbrands i Phandalin.
            </p>
          </Description>

          <H4 className="mb-2">DM-info:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Dette er møtet med Glasstaff / Iarno Albrek hvis du følger LMoP
                tett.
              </li>
              <li>
                Han bør føles som mer enn en vanlig bandittleder: smartere, mer
                unnvikende og med egne hemmeligheter.
              </li>
              <li>Hvis du vil, kan han forsøke å rømme fremfor å dø i kamp.</li>
              <li>
                Rømning kan være mer interessant enn død fordi det lar ham dukke
                opp senere.
              </li>
            </ul>
          </Info>

          <H3>9. Hvis spillerne finner brev, notater eller spor</H3>

          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>Dette er et perfekt sted å avsløre mer om Black Spider.</li>
              <li>
                Brev kan nevne den savnede dvergen, Cragmaw Castle, gruven eller
                ordre gitt til Redbrands.
              </li>
              <li>
                Hvis du vil ha en sterk reveal, kan spillerne her for første
                gang se navnet <strong>The Black Spider</strong> i skrift.
              </li>
              <li>Dette knytter Redbrands tettere til hovedplottet.</li>
            </ul>
          </Info>

          <H3>10. Hvis spillerne redder noen eller frigjør skjulestedet</H3>

          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>La det få tydelig betydning for Phandalin.</li>
              <li>
                Folk i byen bør merke forskjellen når Redbrands ikke lenger går
                rundt som før.
              </li>
              <li>
                Hvis en fange blir reddet, kan det også gi spillerne ny
                informasjon, takknemlighet eller et nytt spor.
              </li>
            </ul>
          </Info>

          <H3>11. Når hideoutet er ryddet eller Redbrands er slått tilbake</H3>

          <Description>
            <p className="mb-2">
              Når trusselen under Tresendar Manor er brutt, kjennes stedet
              annerledes.
            </p>
            <p className="mb-2">
              Lydene av stemmer, støy og aktivitet er borte, og ruinene føles
              tommere enn før.
            </p>
            <p>
              For første gang virker det som om Redbrands grep om byen kan være
              i ferd med å løsne.
            </p>
          </Description>

          <H4 className="mb-2">DM-info:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Dette trenger ikke bety at absolutt alle Redbrands er borte.
              </li>
              <li>
                Men spillernes handlinger bør tydelig svekke eller knuse
                gjengens makt i byen.
              </li>
            </ul>
          </Info>

          <H3>12. Tilbake i Phandalin</H3>

          <p className="mb-2">Når spillerne vender tilbake etter oppgjøret:</p>
          <Description>
            <p className="mb-2">
              Stemningen i byen er ikke nødvendigvis jubel med en gang, men noe
              har forandret seg.
            </p>
            <p className="mb-2">
              Folk ser mer direkte på dere. Stemmer er litt mindre dempet.
              Frykten virker ikke lenger like total.
            </p>
            <p>
              Det er tydelig at det dere har gjort under Tresendar Manor betyr
              noe for Phandalin.
            </p>
          </Description>

          <H4 className="mb-2">Hvis oppdraget er vellykket:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>Sildar ser dette som et viktig vendepunkt for byen.</li>
              <li>
                Han får enda større tillit til spillerne og kan bruke dem i
                videre oppdrag.
              </li>
              <li>
                Dette er også et godt tidspunkt å skyve hovedhistorien videre
                med nye spor om Gundren, Cragmaw Castle eller Black Spider.
              </li>
            </ul>
          </Info>

          <H4 className="mb-2">Hvis lederen slapp unna:</H4>
          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Da kan spillerne ha vunnet over Redbrands lokalt, men likevel
                etterlatt en farlig fiende i live.
              </li>
              <li>
                Dette er en god åpning for senere hevn, fluktspor eller nye
                avsløringer.
              </li>
            </ul>
          </Info>
        </div>
      </div>

      <div
        onClick={() => setShowCragmawCastle(!showCragmawCastle)}
        className="cursor-pointer"
      >
        <H2>
          {showCragmawCastle ? (
            <i className="fa-solid fa-caret-down mr-4"></i>
          ) : (
            <i className="fa-solid fa-caret-right mr-4"></i>
          )}
          Cragmaw Castle
        </H2>
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out transform ${
          showCragmawCastle
            ? "max-h-[5000px] opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-2"
        }`}
      >
        <div className="pt-2">
          <H3>1. Hvordan spillerne får sporet</H3>

          <p className="mb-2">
            Når spillerne etterforsker hva som skjedde med Gundren:
          </p>

          <Description>
            <p className="mb-2">
              Etter hvert som dere samler flere spor, blir det tydelig at
              goblinene som angrep dere ikke handlet alene.
            </p>
            <p className="mb-2">
              Flere tegn peker mot en større goblinleir som styrer
              Cragmaw-goblinene i området.
            </p>
            <p>
              Navnet <strong>Cragmaw Castle</strong> dukker opp som stedet hvor
              viktige fanger og ordre sendes.
            </p>
          </Description>

          <H4 className="mb-2">Mulige kilder til informasjon:</H4>

          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                En fanget goblin kan avsløre at Gundren ble sendt til slottet.
              </li>
              <li>Et brev med edderkoppsymbol kan nevne Cragmaw Castle.</li>
              <li>Sildar kan ha hørt rykter om en goblinhøvding der.</li>
              <li>
                Andre NPC-er kan ha hørt om gamle ruiner i skogen hvor gobliner
                samler seg.
              </li>
            </ul>
          </Info>

          <H3>2. Reisen til slottet</H3>

          <p className="mb-2">Når spillerne nærmer seg området:</p>

          <Description>
            <p className="mb-2">
              Skogen blir tettere og mørkere jo nærmere dere kommer.
            </p>
            <p className="mb-2">
              Trærne står tett, og bakken er ujevn av røtter og mose.
            </p>
            <p>
              Etter hvert kan dere se ruinene av et gammelt slott mellom
              trestammene.
            </p>
          </Description>

          <p className="mb-2">Når slottet kommer tydelig til syne:</p>

          <Description>
            <p className="mb-2">
              Murene er delvis sammenrast, og tårnene er ødelagt av tid og vær.
            </p>
            <p className="mb-2">Likevel virker ruinene langt fra forlatt.</p>
            <p>
              Røyk stiger opp fra et sted inne i slottet, og dere kan høre svake
              stemmer og lyder fra skapninger som bor der.
            </p>
          </Description>

          <H4 className="mb-2">DM-info:</H4>

          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Cragmaw Castle er ikke bare et dungeon, men en levende
                goblinbase.
              </li>
              <li>
                Spill opp følelsen av at spillerne sniker seg inn i fiendens
                territorium.
              </li>
              <li>
                Gobliner, ulver og bugbears kan bevege seg rundt i området.
              </li>
            </ul>
          </Info>

          <H3>3. Første tegn på aktivitet</H3>

          <Description>
            <p className="mb-2">
              Rundt ruinene kan dere se spor av mange skapninger som beveger seg
              inn og ut.
            </p>
            <p className="mb-2">
              Nakne bein ligger i gresset enkelte steder, og gamle våpenrester
              ligger strødd.
            </p>
            <p>
              Det er tydelig at dette stedet har blitt tatt over av en brutal og
              uorganisert styrke.
            </p>
          </Description>

          <H4 className="mb-2">Hvis spillerne speider området:</H4>

          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>De kan oppdage vakter eller patruljer før de går inn.</li>
              <li>
                De kan finne svakere punkter i murene eller alternative
                innganger.
              </li>
              <li>Dette kan gi dem en fordel når de går inn i slottet.</li>
            </ul>
          </Info>

          <H3>4. Inne i ruinene</H3>

          <Description>
            <p className="mb-2">
              Inne i slottet er korridorene mørke og fuktige.
            </p>
            <p className="mb-2">
              Flere rom er fylt med gobliner, ulver eller bugbears som bruker
              ruinene som base.
            </p>
            <p>
              Lyden av stemmer, knurring og grove lattere ekkoer gjennom de
              gamle murene.
            </p>
          </Description>

          <H4 className="mb-2">DM-info:</H4>

          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>Goblinene er ikke perfekt organisert.</li>
              <li>
                Spillere kan bruke sniking, list eller forvirring til sin
                fordel.
              </li>
              <li>
                Dette stedet skal føles kaotisk og farlig, men ikke umulig.
              </li>
            </ul>
          </Info>

          <H3>5. Kong Grol</H3>

          <p className="mb-2">Til slutt når spillerne rommet til lederen:</p>

          <Description>
            <p className="mb-2">
              I et større rom sitter en massiv bugbear på en grov stol av
              treverk og bein.
            </p>
            <p className="mb-2">
              Dette er <strong>Kong Grol</strong>, herskeren over
              Cragmaw-goblinene.
            </p>
            <p>I nærheten holdes en bundet dverg – Gundren Rockseeker.</p>
          </Description>

          <H4 className="mb-2">DM-info:</H4>

          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>Kong Grol er brutal, men ikke dum.</li>
              <li>Han vet at Gundren er verdifull for noen andre.</li>
              <li>
                Han kan forsøke å forhandle hvis situasjonen virker farlig.
              </li>
            </ul>
          </Info>

          <H3>6. Doppelgjengeren</H3>

          <Description>
            <p className="mb-2">
              I nærheten av Kong Grol befinner det seg en annen skikkelse.
            </p>
            <p className="mb-2">
              Ved første øyekast ser personen ut som en vanlig menneskelig
              kriger eller utsending.
            </p>
            <p>
              Men dette er i virkeligheten en <strong>doppelganger</strong>{" "}
              sendt av The Black Spider.
            </p>
          </Description>

          <H4 className="mb-2">DM-info:</H4>

          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Doppelgjengeren er der for å hente Gundren og kartet til gruven.
              </li>
              <li>Hvis kampen går dårlig, kan den forsøke å flykte.</li>
              <li>
                Dette er en perfekt mulighet til å koble historien tettere til
                Black Spider.
              </li>
            </ul>
          </Info>

          <H3>7. Redde Gundren</H3>

          <Description>
            <p className="mb-2">
              Når Gundren blir frigjort, er han sliten, skadet og tydelig
              rystet.
            </p>
            <p className="mb-2">
              Han forklarer at fiendene forsøkte å få informasjon om gruven fra
              ham.
            </p>
            <p>
              Til slutt forteller han at gruven dere leter etter heter
              <strong>Wave Echo Cave</strong>.
            </p>
          </Description>

          <H4 className="mb-2">Hva Gundren vet:</H4>

          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>Han og brødrene hans fant kartet til gruven.</li>
              <li>The Black Spider forsøker å finne den før noen andre.</li>
              <li>Gruven inneholder den legendariske Forge of Spells.</li>
              <li>
                Hvis spillerne vil stoppe Black Spider, må de finne gruven
                først.
              </li>
            </ul>
          </Info>

          <H3>8. Etter oppdraget</H3>

          <Description>
            <p className="mb-2">
              Når spillerne forlater ruinene med Gundren, ligger Cragmaw Castle
              bak dere i skogen.
            </p>
            <p className="mb-2">
              Goblinenes makt i området har fått et hardt slag.
            </p>
            <p>Men kampen om gruven er langt fra over.</p>
          </Description>

          <H4 className="mb-2">Neste steg i historien:</H4>

          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>Gundren kan lede spillerne mot Wave Echo Cave.</li>
              <li>The Black Spider vil forsøke å nå gruven før dem.</li>
              <li>Kampanjen beveger seg nå mot sitt siste kapittel.</li>
            </ul>
          </Info>
        </div>
      </div>

      <div
        onClick={() => setShowWaveEcho(!showWaveEcho)}
        className="cursor-pointer"
      >
        <H2>
          {showWaveEcho ? (
            <i className="fa-solid fa-caret-down mr-4"></i>
          ) : (
            <i className="fa-solid fa-caret-right mr-4"></i>
          )}
          Wave Echo Cave
        </H2>
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out transform ${
          showWaveEcho
            ? "max-h-[5000px] opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-2"
        }`}
      >
        <div className="pt-2">
          <H3>1. Hvordan spillerne finner gruven</H3>

          <Description>
            <p className="mb-2">
              Etter hendelsene ved Cragmaw Castle forklarer Gundren endelig hva
              alt dette har handlet om.
            </p>
            <p className="mb-2">
              Han og brødrene hans har oppdaget den legendariske gruven kjent
              som <strong>Wave Echo Cave</strong>.
            </p>
            <p>
              Gruven inneholder den mystiske <strong>Forge of Spells</strong>,
              et sted hvor magiske våpen en gang ble smidd.
            </p>
          </Description>

          <H4 className="mb-2">Hva Gundren vet:</H4>

          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>Gruven var en gang en stor dverggruve.</li>
              <li>Den ble ødelagt i et stort slag for mange år siden.</li>
              <li>
                Forge of Spells gjorde det mulig å lage magiske gjenstander.
              </li>
              <li>
                The Black Spider prøver å ta kontroll over gruven før noen
                andre.
              </li>
            </ul>
          </Info>

          <H3>2. Reisen til gruven</H3>

          <Description>
            <p className="mb-2">
              Etter en lang reise gjennom fjell og skog kommer dere til en
              bortgjemt dal.
            </p>
            <p className="mb-2">
              I fjellsiden ser dere åpningen til en enorm hule.
            </p>
            <p>
              Kald luft strømmer ut fra mørket innenfor, som om fjellet puster.
            </p>
          </Description>

          <H4 className="mb-2">DM-info:</H4>

          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Spill opp følelsen av at dette er et gammelt og viktig sted.
              </li>
              <li>
                Dette er slutten på reisen – alt spillerne har gjort leder hit.
              </li>
            </ul>
          </Info>

          <H3>3. Første steg inn i gruven</H3>

          <Description>
            <p className="mb-2">
              Inne i fjellet åpner en enorm hule seg foran dere.
            </p>
            <p className="mb-2">
              Gamle steinbroer, smale tunneler og sammenraste ganger sprer seg
              gjennom området.
            </p>
            <p>
              Lyden av vann som slår mot stein skaper en merkelig, ekkoende
              rytme i mørket.
            </p>
          </Description>

          <H4 className="mb-2">Hvor navnet kommer fra:</H4>

          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Lyden av bølger som slår mot stein inne i hulen gir stedet
                navnet Wave Echo Cave.
              </li>
              <li>Ekkoene gjør at lyder kan bære langt gjennom tunneler.</li>
            </ul>
          </Info>

          <H3>4. Tegn på at noen allerede er her</H3>

          <Description>
            <p className="mb-2">
              Flere steder i gruven finner dere spor av nyere aktivitet.
            </p>
            <p className="mb-2">
              Fotspor, fakler og utstyr viser at noen allerede har begynt å
              utforske ruinene.
            </p>
            <p>Det virker som om dere ikke er de første som har kommet hit.</p>
          </Description>

          <H4 className="mb-2">DM-info:</H4>

          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>Dette er spor etter Black Spider og hans folk.</li>
              <li>La spillerne føle at de følger etter en rival.</li>
            </ul>
          </Info>

          <H3>5. Farene i gruven</H3>

          <Description>
            <p className="mb-2">Wave Echo Cave er langt fra tom.</p>
            <p className="mb-2">
              De gamle tunnelene er hjem til skapninger som har flyttet inn
              etter at gruven ble forlatt.
            </p>
            <p>
              Noen av dem er rester av de gamle krigene som en gang ødela dette
              stedet.
            </p>
          </Description>

          <H4 className="mb-2">Mulige farer:</H4>

          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>Undøde dverger som fortsatt vokter ruinene.</li>
              <li>Monstre som har tatt over deler av hulen.</li>
              <li>Magiske farer fra den ødelagte smia.</li>
              <li>Sammenraste tunneler og farlig terreng.</li>
            </ul>
          </Info>

          <H3>6. The Forge of Spells</H3>

          <Description>
            <p className="mb-2">
              Til slutt finner dere det som en gang var hjertet av hele gruven.
            </p>
            <p className="mb-2">
              Et gammelt smieområde ligger inne i et stort kammer omgitt av
              ruinene av gamle verksteder.
            </p>
            <p>Her ble en gang magiske våpen og gjenstander smidd.</p>
          </Description>

          <H4 className="mb-2">DM-info:</H4>

          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>Dette er kampanjens viktigste sted.</li>
              <li>
                Forge of Spells er svekket, men rester av magien finnes
                fortsatt.
              </li>
              <li>
                Dette kan være stedet hvor spillerne finner magiske gjenstander
                eller historiske spor.
              </li>
            </ul>
          </Info>

          <H3>7. Møtet med The Black Spider</H3>

          <Description>
            <p className="mb-2">
              I nærheten av smia møter dere endelig personen som har vært
              ansvarlig for så mye av det som har skjedd.
            </p>
            <p className="mb-2">
              Den mørkkledde drowen dere har hørt om – kjent som
              <strong>The Black Spider</strong>.
            </p>
            <p>Hun har kommet hit for å ta kontroll over Forge of Spells.</p>
          </Description>

          <H4 className="mb-2">DM-info:</H4>

          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Hun kan forsøke å snakke først hvis hun tror det gir henne en
                fordel.
              </li>
              <li>
                Hun kan forsøke å manipulere spillerne eller kjøpe seg tid.
              </li>
              <li>Hvis hun føler seg truet, går hun raskt over til kamp.</li>
            </ul>
          </Info>

          <H3>8. Den siste kampen</H3>

          <Description>
            <p className="mb-2">Kampen om gruven avgjøres her.</p>
            <p className="mb-2">
              Rundt dere ligger ruinene av en gammel sivilisasjon, og magien fra
              Forge of Spells pulserer svakt gjennom rommet.
            </p>
            <p>
              Utfallet av denne kampen vil avgjøre hvem som kontrollerer gruven.
            </p>
          </Description>

          <H4 className="mb-2">DM-info:</H4>

          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Black Spider kan bruke magi, hjelpere eller terrenget til sin
                fordel.
              </li>
              <li>
                Hvis hun taper, kan hun forsøke å flykte hvis du vil bruke henne
                senere.
              </li>
              <li>Dette bør føles som et klimaks på hele kampanjen.</li>
            </ul>
          </Info>

          <H3>9. Etter seieren</H3>

          <Description>
            <p className="mb-2">
              Når kampen er over, faller en merkelig stillhet over Wave Echo
              Cave.
            </p>
            <p className="mb-2">
              Ekkoet av vannet mot stein fyller igjen hulen.
            </p>
            <p>
              Gruven er fri fra fienden som forsøkte å ta kontroll over den.
            </p>
          </Description>

          <H4 className="mb-2">Hva dette betyr:</H4>

          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>Gruven kan nå bli gjenåpnet.</li>
              <li>Gundren og brødrene hans kan starte gruvedrift igjen.</li>
              <li>
                Phandalin kan bli en rik og voksende by takket være gruven.
              </li>
              <li>Spillerne blir kjent som heltene som reddet området.</li>
            </ul>
          </Info>

          <H3>10. Kampanjens slutt</H3>

          <Description>
            <p className="mb-2">
              Eventyret som startet med et enkelt oppdrag på veien til Phandalin
              har ført dere helt hit.
            </p>
            <p className="mb-2">
              Dere har stoppet banditter, gobliner, monstre og en mektig fiende
              som ønsket å kontrollere gruven.
            </p>
            <p>
              Historien om Wave Echo Cave vil bli fortalt lenge i området rundt
              Phandalin.
            </p>
          </Description>

          <H4 className="mb-2">DM-info:</H4>

          <Info>
            <ul className="list-disc pl-5 space-y-1">
              <li>Dette er et naturlig sted å avslutte kampanjen.</li>
              <li>
                Du kan også bruke dette som starten på nye eventyr hvis du
                ønsker å fortsette historien.
              </li>
            </ul>
          </Info>
        </div>
      </div>
    </Container>
  );
};

export default Quests;
