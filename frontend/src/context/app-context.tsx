import { jwtDecode } from "jwt-decode";
import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { Cart, Company, Menu, User } from "../types";
import { toast } from "react-toastify";
import { api } from "../utils/interceptor";

interface AppContextProps {
  user: User | null;
  token: string | null;
  role: string | null;
  cart: Cart | null;
  currentCompany: Company | null;
  displayChatBot: boolean | null;
  login: (user: User, token: string, role: string) => void;
  logout: () => void;
  refreshContext: (user: User, role: string) => void;
  addToCart: (item: Menu) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  setCompany: (company: Company) => void;
  removeChatBot: () => void;
  addChatBot: () => void;
  removeCartOnPayment: () => void;
  refreshUserCredential:(user:User)=> void,
  isAuthenticated: boolean;
}

export const AppContext = createContext<AppContextProps>({
  user: null,
  token: null,
  role: null,
  cart: null,
  currentCompany: null,
  displayChatBot: null,
  login: () => {},
  logout: () => {},
  refreshContext: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  setCompany: () => {},
  removeChatBot: () => {},
  addChatBot: () => {},
  removeCartOnPayment: () => {},
  refreshUserCredential:()=> {},
  isAuthenticated: false,
});

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [cart, setCart] = useState<Cart>({ items: [], totalPrice: 0 });
  const [expirationTime, setExpirationTime] = useState<number | null>(null);
  const [displayChatBot, setDisplayChatBot] = useState(false);

  const navigate = useNavigate();

  const calculateTotalPrice = (items: { item: Menu; quantity: number }[]) => {
    return items.reduce(
      (total, cartItem) => total + cartItem.item.price * cartItem.quantity,
      0
    );
  };

  useEffect(() => {
    if (user && currentCompany) {
      const storedCart = localStorage.getItem(
        `cart-${user.id}-${currentCompany.id}`
      );
      if (storedCart && user.role === "CLIENT") {
        setCart(JSON.parse(storedCart));
      } else {
        setCart({ items: [], totalPrice: 0 });
      }
    }
  }, [user, currentCompany]);

  const addChatBot = () => {
    setDisplayChatBot(!displayChatBot);
  };

  const removeChatBot = () => {
    setDisplayChatBot(false);
  };
  const addToCart = (item: Menu) => {
    const existingItemIndex = cart.items.findIndex(
      (cartItem) => cartItem.item.id === item.id
    );

    let updatedItems;

    if (existingItemIndex !== -1) {
      updatedItems = cart.items.map((cartItem, index) =>
        index === existingItemIndex
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
    } else {
      updatedItems = [
        ...cart.items,
        {
          item,
          quantity: 1,
        },
      ];
    }

    const updatedCart = {
      items: updatedItems,
      totalPrice: calculateTotalPrice(updatedItems),
    };

    setCart(updatedCart);
    localStorage.setItem(
      `cart-${user?.id}-${currentCompany?.id}`,
      JSON.stringify(updatedCart)
    );
  };

  const removeCartOnPayment = () => {
    localStorage.removeItem(`cart-${user?.id}-${currentCompany?.id}`);
    setCart({ items: [], totalPrice: 0 });
  };

  useEffect(() => {
    if (user?.role == "CLENT" && cart) {
      localStorage.setItem(
        `cart-${user?.id}-${currentCompany?.id}`,
        JSON.stringify(cart)
      );
    }
  }, [cart, user]);

  const setCompany = (company: Company) => {
    setCurrentCompany(company);
    localStorage.setItem("currentCompany", JSON.stringify(company));
  };

  const updateQuantity = (id: number, quantity: number) => {
    const updatedItems = cart.items.map((cartItem) =>
      cartItem.item.id === id ? { ...cartItem, quantity } : cartItem
    );

    setCart({
      items: updatedItems,
      totalPrice: calculateTotalPrice(updatedItems),
    });
    localStorage.setItem(
      `cart-${user?.id}-${currentCompany?.id}`,
      JSON.stringify({
        id: id,
        items: updatedItems,
        totalPrice: calculateTotalPrice(updatedItems),
      })
    );
  };

  const removeFromCart = (id: number) => {
    const updatedItems = cart.items.filter(
      (cartItem) => cartItem.item.id !== id
    );

    setCart({
      items: updatedItems,
      totalPrice: calculateTotalPrice(updatedItems),
    });
    localStorage.setItem(
      `cart-${user?.id}-${currentCompany?.id}`,
      JSON.stringify({
        id: id,
        items: updatedItems,
        totalPrice: calculateTotalPrice(updatedItems),
      })
    );
  };

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setRole(null);
    setExpirationTime(null);
    setCart({ items: [], totalPrice: 0 });
    setCurrentCompany(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("expirationTime");
    localStorage.removeItem("currentCompany");
    navigate("/login");
    toast.info("Logging out...", {
      autoClose: 900,
      pauseOnHover: false,
      closeOnClick: true,
      draggable: false,
    });
  }, [navigate]);

 
  const login = (user: User, token: string, role: string) => {
    try {
      const payload: any = jwtDecode(token);
      setToken(token);
      setRole(role);
      setUser(user);

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      const expirationTime = (payload.exp * 1000).toString();
      localStorage.setItem("expirationTime", expirationTime);

      if (role === "MANAGER") {
        if (user.company) {
          setCurrentCompany(user.company);
          navigate("/manager/dashboard");
        } else {
          navigate("/company");
        }
      } else if(role ==="CLIENT") {
        const storedCart = localStorage.getItem(
          `cart-${user?.id}-${currentCompany?.id}`
        );
        if (storedCart) {
          setCart(JSON.parse(storedCart));
        } else {
          setCart({ items: [], totalPrice: 0 });
        }
        navigate("/places");
      }else if (role==="ADMIN"){
        navigate("/admin/dashboard");

      }

      toast.success(`Logged in successfully`, {
        autoClose: 900,
        pauseOnHover: false,
        closeOnClick: true,
        draggable: false,
      });
    } catch (error) {
      toast.error(`Failed to login`, {
        autoClose: 900,
        pauseOnHover: false,
        closeOnClick: true,
        draggable: false,
      });
      console.error("Error during login process:", error);
    }
  };

  const refreshUserCredential=(user:User)=>{
    setUser(user);
    localStorage.removeItem("user");
    localStorage.setItem("user", JSON.stringify(user));
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    const storedExpirationTime = localStorage.getItem("expirationTime");

    if (storedUser && storedToken && storedRole && storedExpirationTime) {
      const expiration = parseInt(storedExpirationTime, 10);
      const currentTime = new Date().getTime();

      if (currentTime >= expiration) {
        logout();
      } else {
        setToken(storedToken);
        setRole(storedRole);
        setExpirationTime(expiration);
        setUser(JSON.parse(storedUser));
        if (user?.role == "ADMIN") {
          setCurrentCompany(JSON.parse(storedUser).company);
        } else if (user?.role == "CLIENT") {
          const storedCompany = localStorage.getItem("currentCompany");
          setCurrentCompany(JSON.parse(storedCompany!));
        }
      }
    }
  }, [logout]);

  useEffect(() => {
    if (token && expirationTime) {
      const remainingTime = expirationTime - new Date().getTime();
      const timer = setTimeout(logout, remainingTime);

      return () => clearTimeout(timer);
    }
  }, [token, expirationTime, logout]);

  const refreshContext = (user: User, role: string) => {
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    setRole(role);
    setUser(user);

    localStorage.setItem("role", role);
    localStorage.setItem("user", JSON.stringify(user));
  };

  return (
    <AppContext.Provider
      value={{
        token,
        role,
        user,
        cart,
        currentCompany,
        displayChatBot,
        login,
        logout,
        addToCart,
        refreshContext,
        removeFromCart,
        updateQuantity,
        setCompany,
        addChatBot,
        removeChatBot,
        removeCartOnPayment,
        refreshUserCredential,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
