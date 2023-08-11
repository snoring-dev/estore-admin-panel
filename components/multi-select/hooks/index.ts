import { RefObject, useCallback, useEffect, useState } from "react";

function useInputContentWidth(
  inputValue: string,
  inputRef: RefObject<HTMLInputElement | null>
) {
  const [width, setWidth] = useState(0);

  const setWidthValue = useCallback(() => {
    const span = document.createElement("span");
    span.style.visibility = "hidden";
    if (inputRef.current?.parentElement) {
      inputRef.current?.parentElement.appendChild(span);
    }
    span.innerHTML = "&nbsp;&nbsp;" + inputValue + "&nbsp;&nbsp;";
    setWidth(span.offsetWidth + 20);
    span.remove();
  }, [inputValue, inputRef]);

  useEffect(() => {
    setWidthValue();
  }, [setWidthValue]);

  return width;
}

export { useInputContentWidth };
