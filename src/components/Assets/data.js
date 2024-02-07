export const imageSliders = [
    {
        url: '/images/8.jpg',
        title: 'the night is still young',
        description: "Bougie Fest is back again!"
    },
    {
        url: '/images/5.png',
        title: "Don't be Bored!",
        description: "All Black Party"
    },
    {
        url: '/images/11.jpg',
        title: 'Feel the magic in the air',
        description: "Valentine's Party!"
    }
]

export const locations = [
    "Accra",
    "Cape Coast",
    "Kumasi",
    "Tamale",
    "Koforidua"
]

export const dateFilters = [
    "Today",
    "This week",
    "This month",
    "Next month",
]

export const discountsData = {
    results: [
    {
        id: 1,
        name: 'November Sale',
        description: "20% discount(furniture)",
        location: "Furniture City, Spintex",
        start_date: "11-02-2024",
        end_date: "28-02-2024",
        flyer: '/images/6.jpg',
        status: "live",
        likes: "902",
        rate: 3.6,
        categories: [{name: "Restaurants"}],
        websiteURL: "http://www.novembersale.com/",
        images: ["/images/1.jpg", "/images/2.jpg", "/images/3.jpg", "/images/4.png", "/images/7.png"]
    },
    {
        id: 2,
        name: "Hisense X'Mas Promo",
        description: "Discount on all products",
        location: "Hisense Showrooms",
        start_date: "26-12-2024",
        end_date: "19-01-2025",
        flyer: '/images/4.jpg',
        status: "live",
        likes: "902",
        rate: 4.2,
        categories: [{name: "Electronics"}],
        websiteURL: "",
        images: ["/images/1.jpg", "/images/2.jpg", "/images/3.jpg", "/images/4.png", "/images/7.png"]
    },
    {
        id: 3,
        name: "Zara Discount Sale",
        description: "Up to 35% discount",
        location: "Zara Ghana (Kanda)",
        start_date: "14-02-2024",
        end_date: "16-02-2024",
        flyer: '/images/5.jpg',
        status: "live",
        likes: "902",
        rate: 2.6,
        categories: [{name: "Fashion"}],
        websiteURL: "https://www.zara.com/",
        images: ["/images/1.jpg", "/images/2.jpg", "/images/3.jpg", "/images/4.png", "/images/7.png"]
    },
    {
        id: 4,
        name: "Buy & Win Promo",
        description: "Get a 150 cedis coupon",
        location: "Electroland Showrooms",
        start_date: "03-03-2024",
        end_date: "07-03-2024",
        flyer: '/images/10.jpg',
        status: "live",
        likes: "902",
        rate: 2.6,
        categories: [{name: "Fashion"}],
        websiteURL: "",
        images: ["/images/1.jpg", "/images/2.jpg", "/images/3.jpg", "/images/4.png", "/images/7.png"]
    }
    ]
}

export const categoriesData = {results: [
    {name: "Restaurants"},
    {name: "Fashion"},
    {name: "Electronics"},
    {name: "Hotels"},
    {name: "Food"},
    {name: "Tickets"}
],
}

export const DUMMY_TICKETS = [
    {
      id: 1,
      type: 'Reg.',
      name: 'Live in Accra',
      location: 'Seats in regular stands',
      price: 22.99,
    },
    {
      id: 2,
      type: 'VIP',
      name: 'Live in Accra',
      location: '3rd row seats',
      price: 30.5,
    },
    {
      id: 3,
      type: 'VVIP',
      name: 'Live in Accra',
      location: 'Second row seats',
      price: 40.99,
    },
    {
      id: 4,
      type: 'Exec.',
      name: 'Live in Accra',
      location: 'First row seats',
      price: 99.99,
    },
  ];