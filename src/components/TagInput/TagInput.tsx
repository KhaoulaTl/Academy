import React, { useState, useCallback } from "react";
import { TextField, Chip, Box, IconButton } from "@mui/material";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
}

const TagInput: React.FC<TagInputProps> = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleAddTag = useCallback(() => {
    if (inputValue.trim() !== "" && !tags.includes(inputValue.trim())) {
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
  }, [inputValue, tags, setTags]);

  const handleRemoveTag = useCallback(
    (tagToRemove: string) => {
      const newTags = tags.filter((tag) => tag !== tagToRemove);
      setTags(newTags);
    },
    [tags, setTags]
  );

  const handleEditTag = (index: number) => {
    setEditIndex(index);
    setInputValue(tags[index]);
  };

  const handleSaveEdit = () => {
    if (editIndex !== null && inputValue.trim() !== "") {
      const updatedTags = [...tags];
      updatedTags[editIndex] = inputValue.trim();
      setTags(updatedTags);
      setEditIndex(null);
      setInputValue("");
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (editIndex !== null) {
        handleSaveEdit();
      } else {
        handleAddTag();
      }
    }
  };

  return (
    <Box>
      <TextField
        variant="outlined"
        fullWidth
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="Add a tag and press Enter"
        InputProps={{
          endAdornment: (
            <IconButton onClick={editIndex !== null ? handleSaveEdit : handleAddTag} color="primary">
              <AddCircleOutline />
            </IconButton>
          ),
        }}
      />
      <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
        {tags.map((tag, index) => (
          <Chip
            key={index}
            label={tag}
            onDelete={() => handleRemoveTag(tag)}
            color="primary"
            variant={index === editIndex ? "outlined" : "filled"}
            onClick={() => handleEditTag(index)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default TagInput;
