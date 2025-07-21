"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";

type Tag = {
  id: string;
  name: string;
};

export default function TagsInput({
  title,
  tags,
  onChange,
  onNewTag,
  allowNewTag,
  isOrdered,
}: {
  title: string;
  isOrdered?: boolean;
  tags: { name: string; id: string }[];
  onChange: (e: { value: string[] }) => void;
  onNewTag?: (
    tag: string
  ) =>
    | { status: string; data?: { id: string; name: string } }
    | Promise<{ status: string; data?: { id: string; name: string } }>;
  allowNewTag?: boolean;
}) {
  const [selectableTags, setSelectableTags] = useState<Tag[]>(
    tags.map((tag) => ({ name: tag.name, id: tag.id }))
  );

  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  function removeSelectedById(id: string) {
    const stag = selectedTags.find((tag) => tag.id === id);
    if (!stag) {
      return;
    }
    const newSelected = selectedTags.filter((tag) => tag.id !== id);
    setSelectedTags(newSelected);
    setSelectableTags((prev) => [...prev, { name: stag.name, id: stag.id }]);
    onChange({
      value: newSelected.map((tag) => tag.id),
    });
  }

  function addSelectedTag(
    id: string | { id: string; name: string; isNew: boolean }
  ) {
    let newSelected = [];
    if (typeof id === "object" && id.isNew) {
      newSelected = [...selectedTags, { name: id.name, id: id.id }];
      setSelectedTags(newSelected);
    } else {
      const stag = selectableTags.find((tag) => tag.id === id);
      if (!stag) {
        return;
      }
      newSelected = [...selectedTags, { name: stag.name, id: stag.id }];
      setSelectedTags(newSelected);
      setSelectableTags((prev) => prev.filter((tag) => tag.id !== id));
    }
    onChange({
      value: newSelected.map((tag) => tag.id),
    });
  }

  async function handleNewTag(name: string) {
    const isconfirmed = confirm(
      `Are you sure you want to add "${name}" as a new option?`
    );
    if (!isconfirmed) {
      return;
    } else {
      const newtagres = await onNewTag?.(name);
      addSelectedTag({
        id: newtagres?.data?.id || "",
        name: newtagres?.data?.name || name,
        isNew: true,
      });
    }
  }

  return (
    <>
      <p>{title}</p>
      <div className=" border -mt-4 rounded-md px-1 py-1 leading-8">
        {selectedTags.map((tag, index) => (
          <TagLabel
            key={index}
            name={tag.name}
            index={index}
            onClose={() => removeSelectedById(tag.id)}
            isOrdered={isOrdered}
          />
        ))}

        <ComboBox
          options={selectableTags.sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
          )}
          onChange={({ id, name, isNew }) => {
            if (!isNew) {
              const stag = selectableTags.find((tag) => tag.id === id);
              if (stag) {
                addSelectedTag(stag.id);
              }
            } else if (isNew && name) {
              handleNewTag(name);
            }
          }}
          allowNewTag={allowNewTag}
        />
      </div>
    </>
  );
}

function ComboBox({
  options,
  onChange,
  allowNewTag = false,
}: {
  options: Tag[];
  onChange: ({
    id,
    name,
    isNew,
  }: {
    id?: string;
    name?: string;
    isNew?: boolean;
  }) => void;
  allowNewTag?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState<string | null>(null);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[150px] justify-start">
          + Add
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            onValueChange={(search) => setCurrentValue(search)}
            placeholder="Search framework..."
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>
              No entry found
              {allowNewTag && currentValue?.toLocaleLowerCase().trim() ? (
                <>
                  <br />
                  <Button
                    onClick={() => {
                      onChange({ name: currentValue, isNew: true });
                      setOpen(false);
                    }}
                    variant={"secondary"}
                    size={"sm"}
                    className=" py-0 mt-1 px-2"
                  >
                    +Add
                  </Button>
                </>
              ) : (
                <></>
              )}
            </CommandEmpty>
            <CommandGroup>
              {options.map((tag) => (
                <CommandItem
                  key={tag.id}
                  value={tag.name}
                  onSelect={() => {
                    onChange({ id: tag.id });
                    setOpen(false);
                  }}
                >
                  {tag.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function TagLabel({
  name,
  index,
  onClose,
  isOrdered = false,
}: {
  name: string;
  index: number;
  onClose: () => void;
  isOrdered?: boolean;
}) {
  return (
    <span className="items-center mr-2 whitespace-nowrap bg-gray-200 rounded-full px-2 py-1 text-sm font-semibold text-gray-700">
      {isOrdered ? `${index + 1}. ${name}` : name}
      <button
        onClick={onClose}
        className="inline-block align-middle ml-1 p-[2px] aspect-square rounded-full cursor-pointer hover:bg-gray-500 hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
    </span>
  );
}
