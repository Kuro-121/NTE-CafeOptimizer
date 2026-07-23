const MASTER_DATA = {
  "ingredients": [
    { "name": "Coffee Beans", "category": "" },
    { "name": "Coconut", "category": "Fruit" },
    { "name": "Cocoa Powder", "category": "" },
    { "name": "Flour", "category": "" },
    { "name": "Apple", "category": "Fruit" },
    { "name": "Eggs", "category": "" },
    { "name": "Lettuce", "category": "" },
    { "name": "Fish", "category": "" },
    { "name": "Orange", "category": "Fruit" },
    { "name": "Milk", "category": "" },
    { "name": "Matcha Powder", "category": "" },
    { "name": "Whipping Cream", "category": "" },
    { "name": "Beef", "category": "" },
    { "name": "Butter", "category": "" },
    { "name": "Red Beans", "category": "" },
    { "name": "Strawberry", "category": "Fruit" },
    { "name": "Onion", "category": "" },
    { "name": "Pork", "category": "" },
    { "name": "Salt", "category": "" },
    { "name": "Cookies", "category": "" },
    { "name": "Cheese", "category": "" },
    { "name": "Ham", "category": "" },
    { "name": "Sugar", "category": "" },
    { "name": "Skibbles", "category": "" },
    { "name": "Tomato", "category": "" }
  ],
  "dishes": [
    { "name": "Coconut Latte", "type": "Beverages", "ingredients": "Coffee Beans, Coconut", "priceL1": 2.4, "priceL2": 10.2 },
    { "name": "Ice Mocha", "type": "Beverages", "ingredients": "Coffee Beans, Cocoa Powder", "priceL1": 3.0, "priceL2": 10.6 },
    { "name": "Apple Pie", "type": "Desserts", "ingredients": "Flour, Apple", "priceL1": 3.5, "priceL2": 11.0 },
    { "name": "Tomato & Fried Egg", "type": "Main Dishes", "ingredients": "Flour, Apple, Eggs", "priceL1": 4.0, "priceL2": 11.4 },
    { "name": "Tuna Sandwich", "type": "Main Dishes", "ingredients": "Flour, Lettuce, Fish", "priceL1": 4.6, "priceL2": 11.8 },
    { "name": "Amber Glamor", "type": "Beverages", "ingredients": "Coffee Beans, Milk, Skibbles, Orange", "priceL1": 5.1, "priceL2": 12.2 },
    { "name": "Matacha Lava Mousse", "type": "Desserts", "ingredients": "Flour, Milk, Matcha Powder", "priceL1": 5.5, "priceL2": 12.6 },
    { "name": "Snowy Latte", "type": "Beverages", "ingredients": "Coffee Beans, Milk, Whipping Cream, Cocoa Powder", "priceL1": 6, "priceL2": 13 },
    { "name": "Thick-Cut Fresh Beef Sandwich", "type": "Main Dishes", "ingredients": "Flour, Beef, Lettuce, Butter", "priceL1": 6.4, "priceL2": 13.5 },
    { "name": "Red Bean & Butter Crossiant", "type": "Main Dishes", "ingredients": "Flour, Butter, Red Beans", "priceL1": 7, "priceL2": 14 },
    { "name": "Strawberry Box Cake", "type": "Desserts", "ingredients": "Flour, Strawberry, Whipping Cream", "priceL1": 7.4, "priceL2": 14.5 },
    { "name": "Orange Hot Coffee", "type": "Beverages", "ingredients": "Coffee Beans, Orange, Apple", "priceL1": 7.8, "priceL2": 15 },
    { "name": "Pork Cutlet", "type": "Main Dishes", "ingredients": "Flour, Onion, Pork, Salt", "priceL1": 8.1, "priceL2": 15.5 },
    { "name": "Coconut Macchiato", "type": "Beverages", "ingredients": "Coffee Beans, Milk, Cookies, Coconut", "priceL1": 8.6, "priceL2": 16 },
    { "name": "Matcha Latte with Milk Cap", "type": "Beverages", "ingredients": "Coffee Beans, Milk, Whipping Cream, Matcha Powder", "priceL1": 9, "priceL2": 16.5 },
    { "name": "Tiramisu", "type": "Desserts", "ingredients": "Flour, Cookies, Cheese, Coffee Beans", "priceL1": 9.3, "priceL2": 17 },
    { "name": "Ham & Cheese", "type": "Main Dishes", "ingredients": "Flour, Lettuce, Ham, Cheese", "priceL1": 9.7, "priceL2": 17.5 },
    { "name": "Caramel & Cocoa Mille-Feuille", "type": "Desserts", "ingredients": "Flour, Whipping Cream, Sugar, Cocoa Powder", "priceL1": 10, "priceL2": 18 }

  
  ],
  "characters": [
    {
      "name": "Nanally",
      "skills": [
        { "level": 1, "val": 0.20, "req": 1, "type": "Price_Flat", "tag": "Main Dishes" },
        { "level": 5, "val": 0.30, "req": 2, "type": "Price_Flat", "tag": "Main Dishes" }
      ]
    },
    {
      "name": "Sakiri",
      "skills": [
        { "level": 1, "val": 0.12, "req": 0, "type": "Price_Flat", "tag": "None" },
        { "level": 5, "val": 0.30, "req": 3, "type": "Price_Flat", "tag": "Any" }
      ]
    },
    {
      "name": "Skia",
      "skills": [
        { "level": 1, "val": 18, "req": 0, "type": "Traffic_Flat", "tag": "None" },
        { "level": 5, "val": 27, "req": 0, "type": "Traffic_Flat", "tag": "None" }
      ]
    },
    {
      "name": "Baicang",
      "skills": [
        { "level": 1, "val": 18, "req": 0, "type": "Traffic_Flat", "tag": "None" },
        { "level": 5, "val": 27, "req": 0, "type": "Traffic_Flat", "tag": "None" }
      ]
    },
    {
      "name": "Mint",
      "skills": [
        { "level": 1, "val": 0.12, "req": 0, "type": "Price_Flat", "tag": "None" },
        { "level": 5, "val": 0.18, "req": 0, "type": "Price_Flat", "tag": "None" }
      ]
    },
    {
      "name": "Haniel",
      "skills": [
        { "level": 1, "val": 0.12, "req": 0, "type": "Price_Flat", "tag": "None" },
        { "level": 3, "val": 0.12, "req": 0, "type": "Price_Flat", "tag": "None" },
        { "level": 5, "val": 0.18, "req": 0, "type": "Price_Flat", "tag": "None" }
      ]
    },
    {
      "name": "Adler",
      "skills": [
        { "level": 1, "val": 0.12, "req": 0, "type": "Price_Flat", "tag": "None" },
        { "level": 5, "val": 0.18, "req": 0, "type": "Price_Flat", "tag": "None" }
      ]
    },
    {
      "name": "Dafodil",
      "skills": [
        { "level": 1, "val": 18, "req": 0, "type": "Traffic_Flat", "tag": "None" },
        { "level": 5, "val": 27, "req": 0, "type": "Traffic_Flat", "tag": "None" }
      ]
    },
    {
      "name": "Edgar",
      "skills": [
        { "level": 1, "val": 18, "req": 0, "type": "Traffic_Flat", "tag": "None" },
        { "level": 3, "val": 18, "req": 0, "type": "Traffic_Flat", "tag": "None" },
        { "level": 5, "val": 27, "req": 0, "type": "Traffic_Flat", "tag": "None" }
      ]
    },
    {
      "name": "Aurelia",
      "skills": [
        { "level": 1, "val": 0.12, "req": 0, "type": "Price_Flat", "tag": "None" },
        { "level": 2, "val": 0.01, "req": 2, "type": "Traffic_Multiply", "tag": "Beverages" },
        { "level": 5, "val": 0.015, "req": 2, "type": "Traffic_Multiply", "tag": "Beverages" }
      ]
    },
    {
      "name": "Chiz",
      "skills": [
        { "level": 1, "val": 18, "req": 0, "type": "Traffic_Flat", "tag": "None" },
        { "level": 5, "val": 27, "req": 0, "type": "Traffic_Flat", "tag": "None" }
      ]
    },
    {
      "name": "Lacrimosa",
      "skills": [
        { "level": 1, "val": 0.01, "req": 1, "type": "Price_Multiply", "tag": "Desserts" },
        { "level": 5, "val": 0.015, "req": 2, "type": "Price_Multiply", "tag": "Desserts" }
      ]
    },
    {
      "name": "Shinku",
      "skills": [
        { "level": 1, "val": 0.3, "req": 3, "type": "Price_Flat", "tag": "Beverages" },
        { "level": 2, "val": 0.3, "req": 3, "type": "Price_Flat", "tag": "Beverages" },
        { "level": 5, "val": 0.03, "req": 3, "type": "Price_Multiply", "tag": "Beverages" }
      ]
    },
    {
      "name": "Iroi",
      "skills": [
        { "level": 1, "val": 18, "req": 0, "type": "Traffic_Flat", "tag": "None" },
        { "level": 3, "val": 18, "req": 0, "type": "Traffic_Flat", "tag": "None" },
        { "level": 5, "val": 27, "req": 0, "type": "Traffic_Flat", "tag": "None" }
      ]
    }
  ]
}
