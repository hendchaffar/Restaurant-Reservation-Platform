import { createChatBotMessage } from 'react-chatbot-kit';
import QuestionOptions from './questions';
import React from 'react';
import IConfig from 'react-chatbot-kit/build/src/interfaces/IConfig';
import BotAvatar from './bot-avatar';

const config :IConfig= {
  botName: "Support BOT", 
  customStyles:{
    botMessageBox:{
      backgroundColor: "#00A6D6",
    },
    chatButton:{
      backgroundColor: "#00A6D6",
    },
  },
  customComponents:{
    botAvatar:(props:any)=> React.createElement(BotAvatar,props)
  },
  initialMessages: [
    createChatBotMessage("Hi! I'm your support bot please choose a question and I'll be glad to help 😊", {
      widget: "questionOptions",
    }),
  ],
  widgets: [
    {
      widgetName: "questionOptions",
      widgetFunc: (props: any) => React.createElement(QuestionOptions, props), 
    },
  ] as any,
};

export default config;
