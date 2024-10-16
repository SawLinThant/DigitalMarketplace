
import clsx from "clsx";
import React, { useEffect, useImperativeHandle, useState } from "react";
import { get } from "react-hook-form";

type TextAreaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "placeholder"
> & {
  
  label: string;
  errors?: Record<string, unknown>;
  touched?: Record<string, unknown>;
  name: string;

};

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({  name, label, errors, touched, required,  ...props }, ref) => {
    const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
    const [showPassword, setShowPassword] = useState(false);
    //const [textAreaType, setTextAreaType] = useState(type);
    const [hasFocus, setHasFocus] = useState(false);
    const [showLable,setShowLabel]=useState(true)

   
    const handleFocus = () => {
      // if (type === "password" && showPassword) {
      //   setTextAreaType("text");
      // }

      // if (type === "password" && !showPassword) {
      //   setTextAreaType("password");
      // }
      setHasFocus(true);
    };

    const handleBlur = () => {
      // if (type === "password" && showPassword) {
      //   setTextAreaType("text");
      // }

      // if (type === "password" && !showPassword) {
      //   setTextAreaType("password");
      // }
      setHasFocus(false);
    };

    useEffect(() => {
      // if (type === "password" && showPassword) {
      //   setTextAreaType("text");
      // }

      // if (type === "password" && !showPassword) {
      //   setTextAreaType("password");
      // }
     const inputElement = textAreaRef.current;

      if (inputElement) {
        inputElement.addEventListener("focus", handleFocus);
        inputElement.addEventListener("blur", handleBlur);

        return () => {
          inputElement.removeEventListener("focus", handleFocus);
          inputElement.removeEventListener("blur", handleBlur);
        };
      }

     
    }, []);

    useImperativeHandle(ref, () => textAreaRef.current!);

    //const hasError = get(errors, name) && get(touched, name);
    const hasError = get(errors, name);

    return (
      <>
        <div className="text-base-regular relative z-0 w-full h-full">       
          <textarea       
            name={name}
            placeholder={label}
            
            className={clsx(
              `mt-0 block w-full h-full appearance-none border rounded-[5px]  border-black bg-transparent px-4 pb-1 pt-4 text-black focus:border-black focus:text-black focus:outline-none focus:ring-0`,
              {
                "border-rose-500 focus:border-rose-500": hasError,
              },
            )}
            {...props}
            ref={textAreaRef}
          />
         
          
        </div>
        
      </>
    );
  }
);

TextArea.displayName = "TextArea";

export default TextArea;
