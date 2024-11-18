import {
  GiFruitBowl,
  GiHotMeal,
  GiCakeSlice,
  GiWineGlass,
  GiSandwich,
  GiBread,
  GiDrinkMe,
  GiFrenchFries,
  GiCoffeeCup,
  GiHamburger,
  GiPizzaSlice,
  GiSushis,
  GiBanana,
  GiLemon,
  GiPineapple,
  GiWatermelon,
  GiStrawberry,
  GiCherry,
  GiPear,
  GiOrange,
} from "react-icons/gi";

type IconType = {
  categoryName: string;
  icon: JSX.Element;
};

export const icons: IconType[] = [
  { categoryName: "Fruit Bowl", icon: <GiFruitBowl size={24} /> },
  { categoryName: "Coffee Cup", icon: <GiCoffeeCup size={24} /> },
  { categoryName: "Hot Meal", icon: <GiHotMeal size={24} /> },
  { categoryName: "Cake Slice", icon: <GiCakeSlice size={24} /> },
  { categoryName: "Wine Glass", icon: <GiWineGlass size={24} /> },
  { categoryName: "Sandwich", icon: <GiSandwich size={24} /> },
  { categoryName: "Bread", icon: <GiBread size={24} /> },
  { categoryName: "Drink Me", icon: <GiDrinkMe size={24} /> },
  { categoryName: "French Fries", icon: <GiFrenchFries size={24} /> },
  { categoryName: "Hamburger", icon: <GiHamburger size={24} /> },
  { categoryName: "Pizza Slice", icon: <GiPizzaSlice size={24} /> },
  { categoryName: "Sushi", icon: <GiSushis size={24} /> },
  { categoryName: "Banana", icon: <GiBanana size={24} /> },
  { categoryName: "Orange", icon: <GiOrange size={24} /> },
  { categoryName: "Lemon", icon: <GiLemon size={24} /> },
  { categoryName: "Watermelon", icon: <GiWatermelon size={24} /> },
  { categoryName: "Pineapple", icon: <GiPineapple size={24} /> },
  { categoryName: "Strawberry", icon: <GiStrawberry size={24} /> },
  { categoryName: "Pear", icon: <GiPear size={24} /> },
  { categoryName: "Cherry", icon: <GiCherry size={24} /> },
];
