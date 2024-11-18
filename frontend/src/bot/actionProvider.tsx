import React from 'react';


const ActionProvider = ({ createChatBotMessage, setState, children }: any) => {
  const handleQuestion = (question: string) => {
    let botResponse = '';

    if (question === "How can I make a reservation?") {
      botResponse = "You can make a reservation by selecting the restaurant and choosing your preferred date and time.";
    } else if (question === "How do I add meals to my cart?") {
      botResponse = "To add meals to your cart, select a restaurant, browse the menu, and click 'Add to Cart' for each item.";
    } else if (question === "Can I modify my reservation?") {
      botResponse = "Yes, you can modify your reservation by going to 'My Reservations' and adjusting the details.";
    } else if (question === "What are the available restaurants?") {
      botResponse = "You can view all available restaurants on our 'Restaurants' page by clicking on the shopping icon in the header ";
    } else if (question === "How can I cancel a reservation?") {
      botResponse = "To cancel a reservation, go to 'My Reservations' and click the 'Cancel' button next to the booking.";
    } else if (question === "How do I checkout?") {
      botResponse = "After adding meals to your cart, proceed to checkout by clicking the cart icon and completing the payment.";
    }

    const botMessage = createChatBotMessage(botResponse);

    setState((prev: any) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));

    const questionOptionsMessage = createChatBotMessage(
      "Would you like to ask another question?", 
      {

        widget: "questionOptions", 
      }
    );

    setState((prev: any) => ({
      ...prev,
      messages: [...prev.messages, questionOptionsMessage],
    }));
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: { handleQuestion },
        });
      })}
    </div>
  );
};

export default ActionProvider;
