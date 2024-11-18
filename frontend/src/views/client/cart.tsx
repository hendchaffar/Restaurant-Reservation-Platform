import { useContext } from "react";
import { AppContext } from "../../context/app-context";
import { Card, CardBody, Button, Image, useDisclosure } from "@nextui-org/react";
import StripeUI from "./stripe-ui";

export default function Cart() {
  const { cart, addToCart, removeFromCart, updateQuantity } =
    useContext(AppContext);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      {!cart?.items || cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.items.map((cartItem) => (
            <Card key={cartItem.item.id} className="w-full">
              <CardBody className="flex flex-col md:flex-row items-center gap-4">
                <Image
                  src={cartItem.item.imageURL}
                  alt={cartItem.item.name}
                  width={100}
                  height={100}
                  className="rounded-lg object-cover"
                />
                <div className="flex-grow">
                  <h2 className="text-xl font-semibold">
                    {cartItem.item.name}
                  </h2>
                  <p className="text-gray-600">{cartItem.item.description}</p>
                  <p className="font-bold mt-2">{cartItem.item.price} DT</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="flat"
                    isDisabled={cartItem.quantity === 1}
                    onPress={() => {
                      updateQuantity(cartItem.item.id, cartItem.quantity - 1);
                    }}
                  >
                    -
                  </Button>
                  <span className="mx-2">{cartItem.quantity}</span>
                  <Button
                    size="sm"
                    variant="flat"
                    onPress={() =>
                      updateQuantity(cartItem.item.id, cartItem.quantity + 1)
                    }
                  >
                    +
                  </Button>
                  <Button
                    size="sm"
                    color="danger"
                    variant="flat"
                    onPress={() => removeFromCart(cartItem.item.id)}
                  >
                    Remove
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}

          <div className="mt-6 text-right flex justify-end">
            <Card className="w-60">
              <CardBody className="flex flex-col items-center  gap-2 flex-grow justify-center">
                <p className="text-xl font-bold">
                  Total: {cart.totalPrice.toFixed(2)} DT
                </p>
                <Button size="md" variant="flat" color="secondary" onPress={(()=>onOpenChange())}>
                  Continue to payment
                </Button>
              </CardBody>
            </Card>
            {isOpen && (
              //   <Elements stripe={stripePromise}>
              //      {/* <Payment isOpen={isOpen} data={cart} onOpenChange={onOpenChange} /> */}
              // </Elements>
              <StripeUI isOpen={isOpen} data={cart} onOpenChange={onOpenChange} ></StripeUI>
             )}
          </div>
        </div>
      )}
    </div>
  );
}
