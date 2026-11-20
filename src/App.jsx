import React, { useState } from "react";
import Menu from "./Menu";
import Categories from "./Categories";
import items from "./data";

const allCategories = ["all", ...new Set(items.map((item) => item.category))];

function App() {
  const [activeCategory, setActiveCategory] = useState("all");

  const menuItems =
    activeCategory === "all"
      ? items
      : items.filter((item) => item.category === activeCategory);

  return (
    <main>
      <section className="menu section">
        <div className="title">
          <h2>My Certificates</h2>
          <div className="underline"></div>
        </div>
        <Categories
          categories={allCategories}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />
        <Menu items={menuItems} />
      </section>
    </main>
  );
}

export default App;
