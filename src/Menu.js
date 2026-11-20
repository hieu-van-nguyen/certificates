import React from "react";
import Button from "react-bootstrap/Button";

import IntroductionToFrontEndDevelopment from "./pdf/Introduction-to-Front-End-Development.pdf";
import ProgrammingWithJavaScript from "./pdf/Programming-with-JavaScript.pdf";
import IntroductionToBackEndDevelopment from "./pdf/Introduction-to-Back-End-Development.pdf";
import ProgrammingInPython from "./pdf/Programming-in-Python.pdf";
import GoogleAI from "./pdf/Google-AI.pdf";

const certificates = {
  "Introduction-to-Front-End-Development.pdf": IntroductionToFrontEndDevelopment,
  "Programming-with-JavaScript.pdf": ProgrammingWithJavaScript,
  "Introduction-to-Back-End-Development.pdf": IntroductionToBackEndDevelopment,
  "Programming-in-Python.pdf": ProgrammingInPython,
  "Google-AI.pdf": GoogleAI,
};

const Menu = ({ items }) => {
  return (
    <div className="section-center">
      {items.map((menuItem) => {
        const { id, title, img, desc, certificate } = menuItem;
        const certificatePdf = certificates[certificate];
        if (!certificatePdf) {
          console.error(`No PDF registered for certificate "${certificate}"`);
        }
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
              <Button
                as="a"
                variant="success"
                disabled={!certificatePdf}
                onClick={() => {
                  if (certificatePdf) window.open(certificatePdf);
                }}
              >
                View Certificate
              </Button>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default Menu;
