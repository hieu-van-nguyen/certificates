import React from "react";
import { assetUrl } from "./assetUrl";

const Menu = ({ items }) => {
  return (
    <div className="section-center">
      {items.map((menuItem) => {
        const { id, title, img, desc, certificate } = menuItem;
        return (
          <article key={id} className="menu-item">
            <img
              src={assetUrl(img)}
              alt={title}
              className="photo"
            />
            <div className="item-info">
              <header>
                <h4>{title}</h4>
              </header>
              <p className="item-text">{desc}</p>
              <a
                className="btn btn-success"
                href={assetUrl(`pdf/${certificate}`)}
                target="_blank"
                rel="noopener noreferrer"
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
