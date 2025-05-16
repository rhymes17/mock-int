const Button = ({
  title,
  disabled,
  handleClick,
  isLoading,
}: {
  title: string;
  handleClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}) => {
  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`cursor-pointer rounded-lg px-4 py-2 ${
        disabled ? "bg-black/30" : "bg-black"
      } text-white`}
    >
      {isLoading ? "Processing..." : title}
    </button>
  );
};

export default Button;
