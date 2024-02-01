import React, { useState } from "react";

const DynamicForm = () => {
  const [inputs, setInputs] = useState([
    { tag: "", selector: "", children: [] },
  ]);

   // Function to add a new input field
   const addInput = () => {
    setInputs([...inputs, {tag:'',selector:'',children:[]}]);
  };

    // Function to remove the last input field
  const removeInput = () => {
    setInputs(inputs.slice(0, -1));
  };

  // Function to add a new input field
  const addNestedInput = (path) => {
    setInputs((prevInputs) => {
      const newInputs = JSON.parse(JSON.stringify(prevInputs)); // Deep clone the inputs
      const pathArr = path.split("-").map((x) => parseInt(x));
      let current = newInputs;

      pathArr.forEach((index) => {
        current = current[index].children;
      });

      current.push({ tag: "", selector: "", children: [] });
      return newInputs;
    });
  };

  // Function to remove the last input field
  const removeNestedInput = (path) => {
    setInputs((prevInputs) => {
      const newInputs = JSON.parse(JSON.stringify(prevInputs)); // Deep clone the inputs
      const pathArr = path.split("-").map((x) => parseInt(x));
      let current = newInputs;

      pathArr.forEach((index, i) => {
        if (i === pathArr.length - 1) {
          current = current[index].children;
          current.splice(0, 1);
        } else {
          current = current[index].children;
        }
      });

      return newInputs;
    });
  };

  // Function to handle input changes
  const handleInputChange = (path, fieldName, value) => {
    path = String(path);
    setInputs((inputs) => {
      const newInputs = JSON.parse(JSON.stringify(inputs)); // Deep clone the inputs
      let current = newInputs;
      path.split("-").forEach((index, i, arr) => {
        if (i === arr.length - 1) {
          current[index][fieldName] = value;
        } else {
          current = current[index].children;
        }
      });
      return newInputs;
    });
  };

  function renderInputs(
    inputs,
    handleInputChange,
    addNestedInput,
    path = "",
    level = 0
  ) {
    return inputs.map((input, index) => {
      const currentPath = path ? `${path}-${index}` : `${index}`;

      return (
        <div
          key={currentPath}
          className="input-container"
          style={{ marginLeft: `${level * 20}px` }}
        >
          <label
            htmlFor={`input-${currentPath}`}
          >{`Input ${currentPath}: `}</label>
          <div>
            <label>Tag: </label>
            <input
              type="text"
              value={input.tag}
              placeholder="Add Tag"
              onChange={(e) =>
                handleInputChange(currentPath, "tag", e.target.value)
              }
            />
            <label>Element Selector: </label>
            <input
              type="text"
              value={input.selector}
              placeholder="Add Element Selector"
              onChange={(e) =>
                handleInputChange(currentPath, "selector", e.target.value)
              }
            />
          </div>
          <div>
            <button onClick={() => addNestedInput(currentPath)}>
              Add Child Input
            </button>
            <button onClick={() => removeNestedInput(currentPath)}>
              remove Child Input
            </button>
          </div>
          {input.children && input.children.length > 0 && (
            <div className="nested-inputs">
              {renderInputs(
                input.children,
                handleInputChange,
                addNestedInput,

                currentPath,
                level + 1 // Increment the level for nested inputs
              )}
            </div>
          )}
        </div>
      );
    });
  }

  function createJsonObject(inputs) {
    const result = {};

    inputs.forEach((input) => {
      if (input.tag) {
        if (input.children && input.children.length > 0) {
          result[input.tag] = createJsonObject(input.children);
        } else {
          result[input.tag] = input.selector;
        }
      }
    });

    return result;
  }

  return (
    <div className="container">
      <nav>
        <h1>
          <strong>Spiralyze</strong>
        </h1>
      </nav>
      <h3>Dynamic Web Scrapper Form</h3>
      <div>
        <label htmlFor="URL">URL: </label>
        <input type="text" placeholder="Enter URL" />
      </div>
      <button onClick={addInput}>Add Input</button>

      <button onClick={removeInput} disabled={inputs.length === 1}>
         Remove Input
      </button>
      {/* Render input fields based on state */}
      {renderInputs(inputs, handleInputChange, addNestedInput)}

      <button>Scrape</button>

      <div className="json-response">
        <h2>JSON Response:</h2>
        <div className="json-response-wrapper">
          <pre>{JSON.stringify(createJsonObject(inputs), null, 4)}</pre>
        </div>
      </div>
    </div>
  );
};

export default DynamicForm;
