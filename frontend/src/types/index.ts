export type UseApiResponse<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  create: (payload: T) => Promise<void>;
  read: (id?: string) => Promise<void>;
  update: (id: string, payload: Partial<T>) => Promise<void>;
  remove: (id: string) => Promise<void>;
};

export type User = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: string;
  carts: any[];
  enable: boolean;
  payments: any[];
  reservation: any;
  company: any;
  isConfirmedByAdministrator:boolean;
  notifications: Notification[];
};

export type Order = {
  id: string;
  status: string;
  menus: {
    item: Menu;
    quantity: number;
  }[];
  totalPrice: number;
  orderType:
    | "Preparing"
    | "ReadyForPickup"
    | "OutForDelivery"
    | "Delivered"
    | "Completed";
  paymentStatus: string;
  payments: any;
};

export type Reservation = {
  id: number;
  date: Date;
  time: string;
  numberOfPeople: string;
  table: Table;
  status: string;
  user: User;
  company: Company;
};

export type Category = {
  id: number;
  color: string;
  icon: string;
  categoryName: string;
  menus: any[];
  company: any;
};

export type Menu = {
  id: number;
  name: string;
  description: string;
  imageURL: any;
  price: number;
  ingredients: any[];
  preparationTime: number;
  stockNumber: number;
  isAvailable: boolean;
  category: any;
  orders: any[];
  cart: any;
  company: any;
};

export type Cart = {
  items: {
    item: Menu;
    quantity: number;
  }[];
  totalPrice: number;
};

export type Company = {
  id: number;
  name: string;
  address: string;
  phone: string;
  logo: string;
  startHour: string;
  endHour: string;
  totalRating: number;
  type: CompanyType;
  reviews:any[];
  manager: User;
  tables: Table[];
};

export enum CompanyType {
  Restaurant = "Restaurant",
  Coffeshop = "Coffeshop",
  Bakery = "Bakery",
}

export type Table = {
  id: number;
  tableNumber: string;
  tableSize: number;
  available: boolean;
  company: Company;
  reservation: Reservation;
};

export type Notifications = {
  id: number;
  description: string;
  notificationFor: "client notifications" | "manager notifications";
  notificationType: "ReservationStatusChange" | "OrderStatusChange";
  company: Company;
  user: User;
  readed: boolean;
  createdAt: any;
  modifiedAt: any;
};

export type Payment = {
  user: User;
  order: Order;
  menus: {
    item: Menu;
    quantity: number;
  }[];
  amount: number;
  paymentType: "CreditCard" | "CashOnDelivery";
  createdAt: Date;
  transactionDate: Date;
};

export type Chat = {
  id?:number;
  client: User;
  manager: User;
  messages: Message[];
};

export type Message = {
  id?:number;
  content: string;
  timestamp: Date;
  read_status: boolean;
  chat: Chat;
  sender:User;
};
