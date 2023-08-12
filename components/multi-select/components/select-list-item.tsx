"use client"

import React, { useEffect, useRef } from "react";
import CheckIcon from "./check-icon";

export type SelectListItemProps = {
  label: string;
  value: string | number;
  selected: boolean;
  active?: boolean;
  hasActive?: boolean;
  onClick?: (label: string, value: string | number) => void;
};

export default function FormSelectListItem(props: SelectListItemProps) {
  const listItemRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (props.active) {
      listItemRef.current?.scrollIntoView();
    }
  }, [props]);
  return (
    <li
      onClick={() => props.onClick?.(props.label, props.value)}
      ref={listItemRef}
      className={
        "flex items-center justify-between cursor-pointer mx-1 px-4 rounded-lg py-2 my-1 transition-colors max-w-full" +
        (props.active && " bg-gray-200 bg-opacity-25") +
        (props.selected
          ? " bg-blue-100 hover:bg-blue-100 font-semibold"
          : ` ${
              !props.hasActive ? " hover:bg-gray-200 hover:bg-opacity-25" : ""
            }`)
      }
    >
      <span className="whitespace-nowrap overflow-hidden text-ellipsis">
        {props.label}
      </span>
      {props.selected && <CheckIcon className="text-blue-900 w-4" />}
    </li>
  );
}
