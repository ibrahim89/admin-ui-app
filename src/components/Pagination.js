import React, { useState, useEffect } from "react";

const Pagination = ({ showPerPage, onPaginationChange, total }) => {
  
  const [counter, setCounter] = useState(1);
  useEffect(() => {
    const value = showPerPage * counter;
    onPaginationChange(value - showPerPage, value);
  }, [counter]);

  const onButtonClick = (type) => {
    if (type === "‹") {
      if (counter === 1) {
        setCounter(1);
      } else {
        setCounter(counter - 1);
      }
    } else if (type === "›") {
      if (Math.ceil(total / showPerPage) === counter) {
        setCounter(counter);
      } else {
        setCounter(counter + 1);
      }
    }
  };
  return (
    <div className="d-flex justify-content-center">
      <nav aria-label="Page navigation example">
        <ul class="pagination">
        <li class="page-item">
            <a
              class="page-link"
              href="!#"
              onClick={() => setCounter(1)}
            >
              «
            </a>
          </li>
          <li class="page-item">
            <a
              class="page-link"
              href="!#"
              onClick={() => onButtonClick("‹")}
            >
              ‹
            </a>
          </li>

          {new Array(Math.ceil(total / showPerPage)).fill("").map((el, index) => (
            <li class={`page-item ${index + 1 === counter ? "active" : null}`}>
              <a
                class="page-link"
                href="!#"
                onClick={() => setCounter(index + 1)}
              >
                {index + 1}
              </a>
            </li>
          ))}
          <li class="page-item">
            <a
              class="page-link"
              href="!#"
              onClick={() => onButtonClick("›")}
            >
              ›
            </a>
          </li>
          <li class="page-item">
            <a
              class="page-link"
              href="!#"
              onClick={() => setCounter(Math.ceil(total/showPerPage))}
            >
              »
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;