import { useContext, useEffect, useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Card,
  CardBody,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { BsTruck, BsFillCreditCardFill, BsFillBagFill } from "react-icons/bs";
import { useAxios } from "../../hooks/fetch-api.hook";
import { AppContext } from "../../context/app-context";
import { Cart } from "../../types";

interface PaymentProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  data: Cart;
}

export default function Payment({ isOpen, onOpenChange, data }: PaymentProps) {
  const { currentCompany, user, removeCartOnPayment } = useContext(AppContext);
  const [paymentMethod, setPaymentMethod] = useState<"CashOnDelivery" | "CreditCard" | string>();
  const [orderType, setOrderType] = useState<"Pickup" | "Delivery" | string>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDetailsFilled, setPaymentDetailsFilled] = useState(false); 
  const stripe = useStripe();
  const elements = useElements();
  
  const [form, setForm] = useState({
    user: user?.id,
    menus: data,
    amount: data.totalPrice,
    paymentType: "",
    orderType: "Delivery",
    company: currentCompany?.id,
    paymentStatus: '',
  });
  
  const { paymentPost } = useAxios("payment", "POST", {}, "paymentPost", false);

  const handleSubmit = async () => {
    setIsProcessing(true);
  
    if (paymentMethod === "CreditCard") {
      if (!stripe || !elements) {
        console.error("Stripe has not loaded");
        setIsProcessing(false);
        return;
      }
      
      try {
        const { error } = await stripe.confirmPayment({
          elements: elements,
          redirect: 'if_required',
        });
  
        if (error) {
          console.error("Payment Error: ", error.message);
          paymentPost.submitRequest({
            ...form,
            paymentStatus: 'Failed' 
          }, "payment", false);
          removeCartOnPayment();
          toast.error(error.message);
        } else {
          toast.success("Payment successful. Your order has been placed.");
          paymentPost.submitRequest({
            ...form,
            paymentStatus: 'Paid' 
          }, "payment", false);
          removeCartOnPayment();
        }
      } catch (err) {
        toast.error(`Payment failed ${err}`);
      }
    } else {
      toast.success("Order placed. Your order will be processed shortly.");
      paymentPost.submitRequest(form, "payment", false);
      removeCartOnPayment();
    }
  
    setIsProcessing(false);
    onOpenChange(false);
    reset();
  };

  const reset = () => {
    setPaymentMethod("");
    setOrderType("");
    setPaymentDetailsFilled(false); 
    setForm({ ...form, paymentType: "", orderType: "" });
  };

 

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
      <ModalContent>
        {(onClose) => (
          <form>
            <ModalHeader className="flex flex-col gap-1">
              Choose Payment Method
            </ModalHeader>
            <ModalBody>
              <Input
                label="Total Price"
                value={`${data.totalPrice.toFixed(2)} DT`}
                readOnly
              />
              <div className="flex gap-4 mt-4">
                <Card
                  isPressable
                  isHoverable
                  className={`flex-1 ${paymentMethod === "CashOnDelivery" ? "bg-gradient-to-b from-purple-600 to-indigo-700 text-white" : ""}`}
                  onPress={() => {
                    setPaymentMethod("CashOnDelivery");
                    setForm({ ...form, paymentType: "CashOnDelivery", paymentStatus: 'Unpaid' });
                  }}
                >
                  <CardBody className="flex flex-col items-center justify-center p-4">
                    <BsTruck className="w-8 h-8 mb-2" />
                    <p>Cash on Delivery</p>
                  </CardBody>
                </Card>
                <Card
                  isPressable
                  isHoverable
                  className={`flex-1 ${paymentMethod === "CreditCard" ? "bg-gradient-to-b from-purple-600 to-indigo-700 text-white" : ""}`}
                  onPress={() => {
                    setPaymentMethod("CreditCard");
                    setForm({ ...form, paymentType: "CreditCard" });
                  }}
                >
                  <CardBody className="flex flex-col items-center justify-center p-4">
                    <BsFillCreditCardFill className="w-8 h-8 mb-2" />
                    <p>Credit Card</p>
                  </CardBody>
                </Card>
              </div>

              {paymentMethod === "CreditCard" && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Credit Card Details
                  </label>
                  <PaymentElement id="payment-element" />
                </div>
              )}

              {paymentMethod === "CreditCard"  && ( 
                <div className="flex gap-4 mt-4">
                  <Card
                    isPressable
                    isHoverable
                    className={`flex-1 ${orderType === "Pickup" ? "bg-gradient-to-b from-purple-600 to-indigo-700 text-white" : ""}`}
                    onPress={() => {
                      setOrderType("Pickup");
                      setPaymentDetailsFilled(true)
                      setForm({ ...form, orderType: "Pickup" });
                    }}
                  >
                    <CardBody className="flex flex-col items-center justify-center p-4">
                      <BsFillBagFill className="w-8 h-8 mb-2" />
                      <p>Pick Up</p>
                    </CardBody>
                  </Card>
                  <Card
                    isPressable
                    isHoverable
                    className={`flex-1 ${orderType === "Delivery" ? "bg-gradient-to-b from-purple-600 to-indigo-700 text-white" : ""}`}
                    onPress={() => {
                      setOrderType("Delivery");
                      setPaymentDetailsFilled(true)
                      setForm({ ...form, orderType: "Delivery" });
                    }}
                  >
                    <CardBody className="flex flex-col items-center justify-center p-4">
                      <BsTruck className="w-8 h-8 mb-2" />
                      <p>Delivery</p>
                    </CardBody>
                  </Card>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={() => {
                  reset();
                  onClose();
                }}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                type="submit"
                isLoading={isProcessing}
                onPress={handleSubmit}
                isDisabled={!paymentMethod || (paymentMethod === "CreditCard" && !paymentDetailsFilled)} 
              >
                {isProcessing ? "Processing..." : "Order Now"}
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
