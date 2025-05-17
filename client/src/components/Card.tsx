import { ReactNode } from "react";
import Button from "./Button";

const Card = ({
  children,
  buttonTitle,
  handleButtonClick,
  buttonDisabled,
}: {
  children: ReactNode;
  buttonTitle: string;
  handleButtonClick: () => void;
  buttonDisabled?: boolean;
}) => {
  return (
    <div className="col-span-1 aspect-[4/3] shadow-lg rounded-xl px-5 py-5 relative bg-[#FFFFFD]/30 cursor-pointer">
      {children}

      <div className="absolute bottom-2 right-2">
        <Button
          disabled={buttonDisabled}
          title={buttonTitle}
          handleClick={handleButtonClick}
        />
      </div>
    </div>
  );
};

export default Card;
