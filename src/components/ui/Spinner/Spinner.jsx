import { CircularProgress } from "@mui/material";
const Spinner = ({ className="" ,theme, size, color = "white" }) => {
  let selectedColor = theme ? (theme === "light" ? "black" : "white") : color;
  return (
    <CircularProgress
      size={size}
      className={className}
      sx={{
        color: selectedColor, // Change to any color you prefer
      }}
    />
  );
};

export default Spinner;
