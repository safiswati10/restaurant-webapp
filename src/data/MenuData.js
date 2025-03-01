const menuData = {
    "Pizza Hut": [
      { id: 1, name: "Pepperoni Pizza", price: "$12", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
      { id: 2, name: "BBQ Chicken Pizza", price: "$14", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
      { id: 3, name: "Veggie Pizza", price: "$10", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    ],
    "McDonald's": [
      { id: 1, name: "Big Mac", price: "$6", image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
      { id: 2, name: "McChicken", price: "$5", image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
      { id: 3, name: "French Fries", price: "$3", image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    ],
    "KFC": [
      { id: 1, name: "Fried Chicken Bucket", price: "$20", image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
      { id: 2, name: "Zinger Burger", price: "$7", image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
      { id: 3, name: "Chicken Popcorn", price: "$5", image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    ],
    "Subway": [
      { id: 1, name: "Turkey Sandwich", price: "$8", image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
      { id: 2, name: "Veggie Delight", price: "$6", image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
      { id: 3, name: "Chicken Teriyaki", price: "$9", image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    ],
    "Domino's Pizza": [
      { id: 1, name: "Cheese Pizza", price: "$11", image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
      { id: 2, name: "Meat Lovers Pizza", price: "$15", image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
      { id: 3, name: "Garlic Bread", price: "$4", image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    ],
    "Starbucks": [
      { id: 1, name: "Cappuccino", price: "$5", image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
      { id: 2, name: "Iced Latte", price: "$6", image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
      { id: 3, name: "Mocha", price: "$5.50", image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    ],
  };
  
  export default menuData;
  