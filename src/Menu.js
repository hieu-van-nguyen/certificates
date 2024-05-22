import React from "react";
import IntroductionToFrontEndDevelopment from "./pdf/Introduction-to-Front-End-Development.pdf";
import ProgrammingWithJavaScript from "./pdf/Programming-with-JavaScript.pdf";
import IntroductionToBackEndDevelopment from "./pdf/Introduction-to-Back-End-Development.pdf";
import ProgrammingInPython from "./pdf/Programming-in-Python.pdf";

const Menu = ({ items }) => {
  const getCertificate = (certificate) => {
    switch (certificate) {
      case "Introduction-to-Front-End-Development.pdf":
        return IntroductionToFrontEndDevelopment;
      case "Programming-with-JavaScript.pdf":
        return ProgrammingWithJavaScript;
      case "Introduction-to-Back-End-Development.pdf":
        return IntroductionToBackEndDevelopment;
      case "Programming-in-Python.pdf":
        return ProgrammingInPython;
      default:
        return IntroductionToFrontEndDevelopment;
    }
  };

  return (
    <div className="section-center">
      {items.map((menuItem) => {
        const { id, title, img, desc, certificate } = menuItem;
        return (
          <article key={id} className="menu-item">
            <img
              src={process.env.PUBLIC_URL + img}
              alt={title}
              className="photo"
            />
            <div className="item-info">
              <header>
                <h4>{title}</h4>
              </header>
              <p className="item-text">{desc}</p>
              <a
                onClick={() => {
                  const certificatePdf = getCertificate(certificate);
                  window.open(certificatePdf);
                }}
              >
                View Certificate
              </a>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default Menu;
