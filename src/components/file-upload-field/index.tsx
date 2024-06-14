
import clsx from "clsx";
import React, { useRef, useState } from "react";

type FileUploadFieldProps = {
  onFileChosen: (file: File[]) => void;
  filetypes: string[];
  errorMessage?: string;
  placeholder?: React.ReactElement | string;
  className?: string;
  multiple?: boolean;
  text?: React.ReactElement | string;
};

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  onFileChosen,
  filetypes,
  errorMessage,
  className,
  text = "",
  placeholder = "",
  multiple = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileUploadError, setFileUploadError] = useState(false);
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filelist = e.target.files;

    if (filelist) {
      onFileChosen(Array.from(filelist));
    }
  };

  const hadnleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    setFileUploadError(false);
    e.preventDefault();
    const files: File[] = [];
    if (e.dataTransfer.items) {
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        if (e.dataTransfer.items[i]?.kind === "file") {
          const file = e.dataTransfer.items[i]?.getAsFile();
          if (file && filetypes.indexOf(file.type) > -1) {
            files.push(file);
          }
        }
      }
    } else {
      
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        const file = e.dataTransfer.files[i];
        if (file && filetypes.includes(file.type)) {
          files.push(file);
        }
      }
    }
    if (files.length > 1) {
      onFileChosen(files);
    } else {
      setFileUploadError(true);
    }
  };

  return (
    <div
    onClick={() => inputRef?.current?.click()}
    onDrop={hadnleFileDrop}
      onDragOver={(e)=>e.preventDefault()}
      className={clsx(
        "inter-base-regular flex  w-full cursor-pointer select-none flex-col items-center justify-center overflow-y-auto overflow-x-auto rounded border border-grey-20 py-[12px] text-grey-50 transition-colors hover:border-violet-60  hover:text-grey-40",
        className
      )}
    >
      <div className="w-full  overflow-x-auto items-center justify-center flex flex-col overflow-y-auto whitespace-no-wrap">
        <p>{text}</p>
        <p>{placeholder}</p>
      </div>
      {fileUploadError && (
        <span className="text-rose-60">
          {errorMessage || "Please upolad image file"}
        </span>
      )}
      <input ref={inputRef} type="file" accept={filetypes.join(", ")} multiple={multiple} onChange={handleFileUpload} className="hidden" />
      <a className="border-t border-white w-2/3 text-center mt-11">Upload</a>
    </div>
  );
};

export default FileUploadField;


