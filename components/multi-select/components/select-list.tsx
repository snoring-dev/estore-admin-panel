"use client"

import FormSelectListItem, { SelectListItemProps } from "./select-list-item";

export type SelectListProps = {
  optionList: SelectListItemProps[];
  activeItem?: SelectListItemProps;
  onSelect?: (label: string, value: string | number) => void;
};

export default function SelectList(props: SelectListProps) {
  return (
    <ul className="max-h-44 overflow-y-auto max-w-full" tabIndex={0}>
      {props.optionList.map((option) => (
        <FormSelectListItem
          key={option.label}
          {...option}
          active={option.value === props.activeItem?.value}
          hasActive={!!props.activeItem}
          onClick={props.onSelect}
          selected={option.value === props.activeItem?.value}
        />
      ))}
    </ul>
  );
}
