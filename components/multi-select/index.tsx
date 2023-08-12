"use client"

import React, {
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { SelectListItemProps } from "./components/select-list-item";
import { useInputContentWidth } from "./hooks";
import TimesIcon from "./components/times-icon";
import SelectList from "./components/select-list";

export type MultiSelectOptionItem = {
  label: string;
  value: string | number;
};

type SelectItem = { label: string; value: string | number };

export type MultiSelectProps = {
  name: string;
  label?: string;
  size?: "normal" | "small";
  optionList: MultiSelectOptionItem[];
  placeholder?: string;
  value?: SelectItem[];
  valueChange?: (newValue: SelectItem[]) => void;
};

export default function MultiSelect(props: MultiSelectProps) {
  const [value, setValue] = useState<SelectItem[]>(props.value || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeItem, setActiveItem] = useState<SelectListItemProps>();
  const [extraOptions, setExtraOptions] = useState<SelectListItemProps[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const inputContentWidth = useInputContentWidth(searchTerm, inputRef);
  const inputWidth = useMemo(() => {
    const listWidth = listRef.current?.offsetWidth || 0;
    return listWidth > inputContentWidth ? inputContentWidth : listWidth;
  }, [inputContentWidth]);

  const optionList: SelectListItemProps[] = useMemo(() => {
    const defaultOptionList = [...props.optionList, ...extraOptions]
      .filter(
        (option) =>
          option.label.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
      )
      .map((option) => ({
        ...option,
        selected: value?.includes(option.label) || false,
      }));
    const tempOptions: SelectListItemProps[] = [
      { label: searchTerm, selected: false },
    ];
    if (defaultOptionList.length === 0) {
      setActiveItem(tempOptions[0]);
      return tempOptions;
    } else if (
      !defaultOptionList.find((opt) => opt.label === searchTerm) &&
      searchTerm.length
    ) {
      setActiveItem(tempOptions[0]);
      return [...tempOptions, ...defaultOptionList];
    } else if (defaultOptionList.length === 1) {
      setActiveItem(defaultOptionList[0]);
    }
    return defaultOptionList;
  }, [props.optionList, value, searchTerm, extraOptions]);

  const mappedValue: SelectListItemProps[] = useMemo(
    () =>
      value
        .map((label) =>
          [...props.optionList, ...extraOptions].find(
            (option) => option.value === label.value
          )
        )
        .filter((option) => !!option) as SelectListItemProps[],
    [props.optionList, value, extraOptions]
  );

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const changeValue = (item?: SelectListItemProps) => {
    const usedItem = item || activeItem;
    if (usedItem) {
      setSearchTerm("");
      let newValue: SelectItem[] = [];
      const existingValue = value.find(v => v.value === usedItem.value);

      if (existingValue) {
        newValue = value.filter((v) => v.value !== usedItem.value);
        if (extraOptions.find((opt) => opt.value === usedItem.value)) {
          setExtraOptions(
            extraOptions.filter((v) => v.value !== usedItem.value)
          );
        }
      } else {
        newValue = [...value, { label: usedItem.label, value: usedItem.value }];
        if (
          !props.optionList.find((opt) => opt.value === usedItem.value) &&
          !extraOptions.find((opt) => opt.value === usedItem.value)
        ) {
          setExtraOptions([...extraOptions, usedItem]);
        }
      }
      setValue(newValue);
      if (props.valueChange) {
        props.valueChange(newValue);
      }
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      if (!activeItem) {
        setActiveItem(optionList[0]);
      } else if (optionList.indexOf(activeItem) !== optionList.length - 1) {
        setActiveItem(optionList[optionList.indexOf(activeItem) + 1]);
      }
    } else if (event.key === "ArrowUp") {
      if (!activeItem) {
        setActiveItem(optionList[optionList.length - 1]);
      } else if (optionList.indexOf(activeItem) !== 0) {
        setActiveItem(optionList[optionList.indexOf(activeItem) - 1]);
      }
    } else if (event.key === "Enter") {
      changeValue();
    } else if (event.key === "Escape") {
      inputRef.current?.blur();
    } else if (event.key === "Backspace") {
      if (searchTerm === "") {
        if (extraOptions.find((opt) => opt.label === value[value.length - 1].label)) {
          setExtraOptions(
            extraOptions.filter((v) => v.label !== value[value.length - 1].label)
          );
        }
        setValue(value.slice(0, value.length - 1));
      }
    }
  };

  const selectItem = (label: string, value: string | number) => {
    let item = [
      ...props.optionList.map((opt) => ({ ...opt, selected: false })),
      ...extraOptions,
    ].find((opt) => opt.label === label);
    if (!item) {
      item = { label: searchTerm, selected: false, value };
    }
    changeValue(item);
  };

  const removeActiveItem = () => {
    setActiveItem(undefined);
  };

  const changeSearchTerm = useCallback(
    (change: ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(change.target.value);
    },
    []
  );

  useEffect(() => {
    if (activeItem) {
      setActiveItem(
        optionList.find((option) => option.label === activeItem.label)
      );
    }
  }, [optionList, activeItem]);

  return (
    <div className={"relative " + (props.size === "small" ? "text-sm" : "")}>
      {props.label && (
        <label htmlFor={props.name} className="text-sm font-semibold block">
          {props.label}
        </label>
      )}
      <div
        onClick={focusInput}
        onKeyDown={handleKeyDown}
        onMouseMove={removeActiveItem}
        className={
          "group cursor-text relative flex justify-start gap-2 w-full rounded-lg border border-solid py-1 my-2 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-offset-white focus-within:ring-blue-900 focus-within:ring-offset-0 px-1 " +
          (props.size === "small" ? " text-sm" : "")
        }
      >
        <ul
          className="flex items-center justify-start gap-1 flex-wrap max-w-full w-full"
          ref={listRef}
        >
          {(mappedValue || []).map((item) => (
            <li
              key={item.value}
              className="flex items-center justify-between bg-black rounded-lg p-2 gap-4 max-w-full"
            >
              <span className="text-white font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                {item.label}
              </span>
              <span
                className="text-white cursor-pointer"
                onClick={() => changeValue(item)}
              >
                <TimesIcon className="text-opacity-90 text-sm w-2 hover:text-opacity-100" />
              </span>
            </li>
          ))}
          <li className="min-w-max py-2 pl-2" style={{ width: inputWidth }}>
            <input
              ref={inputRef}
              type="text"
              className="p-0 m-0 border-transparent focus:border-transparent focus:ring-0 w-full outline-none"
              id={props.name}
              name={props.name}
              autoComplete="off"
              value={searchTerm}
              onChange={changeSearchTerm}
              placeholder={value.length ? "" : props.placeholder}
            />
          </li>
        </ul>
        <div className="invisible max-w-full min-w-0 group-focus-within:visible left-0 shadow-lg rounded-lg bg-white border-borderGray border absolute top-full w-full mt-1">
          <SelectList
            optionList={optionList}
            activeItem={activeItem}
            onSelect={selectItem}
          />
        </div>
      </div>
    </div>
  );
}
