import Container from "../components/Container";
import H1 from "../components/H1";
import H2 from "../components/H2";

import drawing1 from "/Drawing1.png";
import drawing2 from "/Drawing2.png";
import drawing3 from "/Drawing3.png";
import drawing4 from "/Drawing4.png";
import drawing5 from "/Drawing5.png";

import letter1 from "/Letter1.png";
import letter2 from "/Letter2.png";

const Handouts = () => {
  return (
    <Container>
      <H1>Handouts</H1>
      <H2>Maps</H2>
      <H2>Items</H2>
      <H2>Drawings</H2>
      <div className="flex gap-2 flex-wrap">
        <img className="w-40" src={drawing1} alt="" />
        <img className="w-40" src={drawing2} alt="" />
        <img className="w-40" src={drawing3} alt="" />
        <img className="w-40" src={drawing4} alt="" />
        <img className="w-40" src={drawing5} alt="" />
      </div>
      <H2>Letters</H2>
      <div className="flex gap-2 flex-wrap">
        <img className="w-40" src={letter1} alt="" />
        <img className="w-40" src={letter2} alt="" />
      </div>
    </Container>
  );
};

export default Handouts;
