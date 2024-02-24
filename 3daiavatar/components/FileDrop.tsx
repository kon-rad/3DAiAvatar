"use client";

import React, { useRef, useCallback } from "react";
import { TiDelete } from "react-icons/ti";

export const FileDrop: React.FC = ({ setFile, file }: any) => {
  const fileInputRef = useRef(null);
  // const [file, setFile] = useState<File | null>(null);

  let handleFileChange = async (event) => {
    let file = event.target.files[0];
    // let { url } = await uploadToS3(file);
    setFile(file);
    // console.log("Successfully uploaded to S3!", url);
  };
  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0 && files[0].type === "application/pdf") {
      setFile(files[0]);
    } else {
      alert("Please drop a PDF file.");
    }
  }, []);

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const onFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded p-6 max-w-md mx-auto mt-2"
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <div className="flex flex-col items-center justify-center">
        {file ? (
          <div className="flex flex-col justify-center items-center overflow-hidden">
            <p className="text-sm">Ready to upload:</p>
            <div className="flex flex-row w-full items-center">
              <p className="font-bold text-xs overflow-hidde w-full">
                {file.name}
              </p>
              <TiDelete
                className="h-6 w-6 cursor-pointer"
                onClick={removeFile}
              ></TiDelete>
            </div>
          </div>
        ) : (
          <p>
            Drag and drop a PDF file here, or
            <span
              onClick={onFileClick}
              style={{ cursor: "pointer", color: "blue" }}
            >
              {" "}
              click to select a file
            </span>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
              accept=".pdf"
            />
          </p>
        )}
      </div>
    </div>
  );
};
