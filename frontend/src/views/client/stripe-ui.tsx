import { useEffect, useState } from "react";

import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./checkout-form";
import { loadStripe } from "@stripe/stripe-js";
import { useAxios } from "../../hooks/fetch-api.hook";
import Payment from "./payment";
import { Cart } from "../../types";

function StripeUI(props: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  data: Cart;
}) {
  const { isOpen, onOpenChange, data } = props;
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const { paymentStripe } = useAxios(
    "payment/payment-stripe",
    "POST",
    {},
    "paymentStripe",
    true
  );
  const { paymentCredentials } = useAxios(
    "payment/payment-stripe-credentials",
    "GET",
    {},
    "paymentCredentials",
    true
  );

  useEffect(() => {
    if (paymentCredentials.responseData) {
      console.log(paymentCredentials.responseData);
      setStripePromise(
        loadStripe(paymentCredentials.responseData?.STRIPE_PUBLIC_KEY)
      );
    }
  }, [paymentCredentials.responseData]);

  useEffect(() => {
    if (paymentStripe.responseData && !paymentStripe.error) {
      setClientSecret(paymentStripe.responseData?.clientSecret);
    }
  }, [paymentStripe.responseData]);

  return (
    <>
      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <Payment data={data} isOpen={isOpen} onOpenChange={onOpenChange} />
        </Elements>
      )}
    </>
  );
}

export default StripeUI;
