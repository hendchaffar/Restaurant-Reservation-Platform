import { Button } from "@nextui-org/react";
import { IoCart } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const CartIcon = (props: { cartNumber: number; size: number }) => {
  const { cartNumber, size } = props;
  const navigate = useNavigate();

  return (
    <>
    
      <div className="relative cursor-pointer" >
        <Button isIconOnly variant="light" className="text-white" onPress={(()=>{navigate('/client/cart')})}>
          <IoCart size={size} />
        </Button>

        {cartNumber > 0 && (
          <div className="absolute -top-1 bottom-3 left-5 w-5 h-5 flex items-center justify-center rounded-full bg-red-500">
            <span className="text-white text-xs font-bold">{cartNumber}</span>
          </div>
        )}
      </div>
    </>
  );
};

export default CartIcon;
