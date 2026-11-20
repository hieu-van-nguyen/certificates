import React from "react";

const Categories = ({ categories, activeCategory, onSelect }) => {
  return (
    <div className="btn-container" role="group" aria-label="Filter certificates by category">
      {categories.map((category) => {
        const isActive = category === activeCategory;
        return (
          <button
            type="button"
            className={isActive ? "filter-btn active" : "filter-btn"}
            key={category}
            aria-pressed={isActive}
            onClick={() => onSelect(category)}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
};

export default Categories;
