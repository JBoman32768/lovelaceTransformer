"use client";

import { useState } from "react";
import yaml from "js-yaml";

const LovelaceTransformer = () => {
  const [yamlInput, setYamlInput] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [yamlOutput, setYamlOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleTransform = () => {
    try {
      const data: any = yaml.load(yamlInput);
      const transformedData = applyTransform(data);

      setJsonOutput(JSON.stringify(transformedData, null, 2));
      setYamlOutput(yaml.dump(transformedData));
      setError(null);
    } catch (err) {
      setError(`Invalid YAML format. ${err}`);
      setJsonOutput("");
      setYamlOutput("");
    }
  };

  function applyTransform(lovelaceData: any) {
    var transformedData: any = {
      ...lovelaceData,
    };

    transformedData.elements.forEach((element: any) => {
      element = transformElement(element);
    });

    transformedData.image = (transformedData.image as string).replace(
      ".png",
      "-vert.png"
    );
    transformedData.dark_mode_image = (
      transformedData.dark_mode_image as string
    ).replace(".png", "-vert.png");

    return transformedData;
  }

  function transformElement(element: any) {
    var newElement = { ...element };

    //does this element have sub elements
    if (typeof newElement.elements === "undefined") {
      var top = parseInt((newElement.style.top as string).replace("%", ""), 10);
      var left = parseInt((newElement.style.left as string).replace("%", ""), 10);

      var newTop = 100 - left;
      var newLeft = top;

      newElement.style.top = `${newTop}%`;
      newElement.style.left = `${newLeft}%`;
    } else {
      newElement.elements.forEach((subElement: any) => {
        subElement = transformElement(subElement);
      });      
    }

    return newElement;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">YAML Transformer</h1>
      <textarea
        rows={10}
        placeholder="Enter YAML here"
        value={yamlInput}
        onChange={(e) => setYamlInput(e.target.value)}
        className="font-mono w-full p-4 text-black bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <br />
      <button
        onClick={handleTransform}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Transform
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <h2 className="text-xl font-semibold mt-6">Output:</h2>
      <div className="flex space-x-4 mt-4">
        {/* JSON Output Textarea */}
        <div className="w-1/2">
          <label className="block text-lg font-semibold mb-2">JSON</label>
          <textarea
            readOnly
            rows={10}
            value={jsonOutput}
            className="w-full p-4 text-black bg-gray-100 border border-gray-300 rounded-md focus:outline-none"
          />
        </div>
        {/* YAML Output Textarea */}
        <div className="w-1/2">
          <label className="block text-lg font-semibold mb-2">YAML</label>
          <textarea
            readOnly
            rows={10}
            value={yamlOutput}
            className="font-mono w-full p-4 text-black bg-gray-100 border border-gray-300 rounded-md focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default LovelaceTransformer;
