export const imageSliders = [
  {
    url: "/images/8.jpg",
    title: "the night is still young",
    description: "Bougie Fest is back again!",
  },
  {
    url: "/images/5.png",
    title: "Don't be Bored!",
    description: "All Black Party",
  },
  {
    url: "/images/11.jpg",
    title: "Feel the magic in the air",
    description: "Valentine's Party!",
  },
];

export const locations = [
  "Accra",
  "Cape Coast",
  "Kumasi",
  "Tamale",
  "Koforidua",
];

export const dateFilters = ["Today", "This week", "This month", "Next month"];

export const discountsData = {
  results: [
    {
      id: 1,
      url: "http://test/url1",
      title: "Hisense X'Mas Promo",
      percentage_discount: "20% on all products",
      description: `
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Duis ut mollis lacus, cursus blandit purus. Integer nec sollicitudin sapien. 
            Cras odio mi, mollis vel porttitor id, iaculis nec sapien. Cras aliquet risus nibh.
            Donec hendrerit augue id lobortis pharetra. Vivamus tempus commodo augue. 
            Suspendisse volutpat urna quis rhoncus semper. Fusce vel tellus faucibus, 
            lobortis diam in, facilisis leo. Curabitur in arcu ac mauris tempor luctus non 
            vel magna. Suspendisse commodo pharetra faucibus. Vestibulum pharetra eros id 
            lorem interdum, eu efficitur quam iaculis. Mauris eros sapien, dictum vitae sem in, 
            ultricies pellentesque nibh. Donec eu nulla tellus. Donec semper quis mauris nec 
            dapibus. Duis placerat elit vel ante rhoncus, vel porttitor purus accumsan.
        `,
      location: "Hisense Showrooms",
      start_date: "26-12-2024",
      end_date: "19-01-2025",
      flyer: "/images/4.jpg",
      status: "live",
      likes: "902",
      rate: 4.2,
      categories: [{ name: "Electronics" }, { name: "Restaurants" }],
      organizer: {
        id: 1,
        name: "Hisense Ghana",
        description: `
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Duis ut mollis lacus, cursus blandit purus. Integer nec sollicitudin sapien. 
                Cras odio mi, mollis vel porttitor id, iaculis nec sapien.
            `,
        phone_number: "0987654321",
        social_media_handles: [
          {name: "whatsapp", socialMediaURL: "#"},
          {name: "facebook", socialMediaURL: "#"},
          {name: "instagram", socialMediaURL: "#"}
        ],
        website_url: "http://www.hisensegh.com/",
      },
      images: [
        "/images/1.jpg",
        "/images/2.jpg",
      ],
    },
    {
      id: 2,
      url: "http://test/url2",
      title: "Valentine Sale",
      percentage_discount: "15% on all products",
      description: `
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Duis ut mollis lacus, cursus blandit purus. Integer nec sollicitudin sapien. 
            Cras odio mi, mollis vel porttitor id, iaculis nec sapien. Cras aliquet risus nibh.
            Donec hendrerit augue id lobortis pharetra. Vivamus tempus commodo augue. 
            Suspendisse volutpat urna quis rhoncus semper. Fusce vel tellus faucibus, 
            lobortis diam in, facilisis leo. Curabitur in arcu ac mauris tempor luctus non 
            vel magna. Suspendisse commodo pharetra faucibus. Vestibulum pharetra eros id 
            lorem interdum, eu efficitur quam iaculis. Mauris eros sapien, dictum vitae sem in, 
            ultricies pellentesque nibh. Donec eu nulla tellus. Donec semper quis mauris nec 
            dapibus. Duis placerat elit vel ante rhoncus, vel porttitor purus accumsan.
        `,
      location: "Furniture City, Spintex",
      start_date: "11-02-2024",
      end_date: "28-02-2024",
      flyer: "/images/6.jpg",
      status: "live",
      likes: "902",
      rate: 3.6,     
      categories: [{ name: "Furniture" }],
      organizer: {
        id: 2,
        name: "Furniture City",
        description: `
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Duis ut mollis lacus, cursus blandit purus. Integer nec sollicitudin sapien. 
                Cras odio mi, mollis vel porttitor id, iaculis nec sapien.
            `,
        phone_number: "0987654321",
        website_url: "http://www.furniturecitygh.com/",
      },
      images: [
        "/images/1.jpg",
        "/images/2.jpg",
      ],
    },
    {
      id: 3,
      url: "http://test/url3",
      title: "Zara Discount Sale",
      percentage_discount: "10% on all products",
      description: `
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Duis ut mollis lacus, cursus blandit purus. Integer nec sollicitudin sapien. 
            Cras odio mi, mollis vel porttitor id, iaculis nec sapien. Cras aliquet risus nibh.
            Donec hendrerit augue id lobortis pharetra. Vivamus tempus commodo augue. 
            Suspendisse volutpat urna quis rhoncus semper. Fusce vel tellus faucibus, 
            lobortis diam in, facilisis leo. Curabitur in arcu ac mauris tempor luctus non 
            vel magna. Suspendisse commodo pharetra faucibus. Vestibulum pharetra eros id 
            lorem interdum, eu efficitur quam iaculis. Mauris eros sapien, dictum vitae sem in, 
            ultricies pellentesque nibh. Donec eu nulla tellus. Donec semper quis mauris nec 
            dapibus. Duis placerat elit vel ante rhoncus, vel porttitor purus accumsan.
        `,
      location: "Zara Ghana (Kanda)",
      start_date: "14-02-2024",
      end_date: "16-02-2024",
      flyer: "/images/5.jpg",
      status: "live",
      likes: "902",
      rate: 2.6,
      categories: [{ name: "Fashion" }],        
      organizer: {
        id: 3,
        name: "Zara Ghana",
        description: `
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Duis ut mollis lacus, cursus blandit purus. Integer nec sollicitudin sapien. 
                Cras odio mi, mollis vel porttitor id, iaculis nec sapien.
            `,
        phone_number: "0987654321",
        websiteURL: "https://www.zara.com/",
      },
      images: [
        "/images/1.jpg",
        "/images/2.jpg",
      ],
    },
    {
      id: 4,
      url: "http://test/url4",
      title: "Buy & Win Promo",
      percentage_discount: "Up to 30% on all products",
      description: `
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Duis ut mollis lacus, cursus blandit purus. Integer nec sollicitudin sapien. 
            Cras odio mi, mollis vel porttitor id, iaculis nec sapien. Cras aliquet risus nibh.
            Donec hendrerit augue id lobortis pharetra. Vivamus tempus commodo augue. 
            Suspendisse volutpat urna quis rhoncus semper. Fusce vel tellus faucibus, 
            lobortis diam in, facilisis leo. Curabitur in arcu ac mauris tempor luctus non 
            vel magna. Suspendisse commodo pharetra faucibus. Vestibulum pharetra eros id 
            lorem interdum, eu efficitur quam iaculis. Mauris eros sapien, dictum vitae sem in, 
            ultricies pellentesque nibh. Donec eu nulla tellus. Donec semper quis mauris nec 
            dapibus. Duis placerat elit vel ante rhoncus, vel porttitor purus accumsan.
        `,
      location: "Electroland Showrooms",
      start_date: "03-03-2024",
      end_date: "07-03-2024",
      flyer: "/images/10.jpg",
      status: "live",
      likes: "902",
      rate: 2.6,
      categories: [{ name: "Fashion" }, { name: "Restaurants" }],        
      organizer: {
        id: 4,
        name: "Electroland",
        description: `
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Duis ut mollis lacus, cursus blandit purus. Integer nec sollicitudin sapien. 
                Cras odio mi, mollis vel porttitor id, iaculis nec sapien.
            `,
        phone_number: "0987654321",
        websiteURL: "https://www.zara.com/",
      },
      images: [
        "/images/1.jpg",
        "/images/2.jpg",
      ],      
    },
    {
      id: 5,
      url: "http://test/url5",
      title: "Buy & Win Promo",
      percentage_discount: "20% on all products",
      description: `
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Duis ut mollis lacus, cursus blandit purus. Integer nec sollicitudin sapien. 
            Cras odio mi, mollis vel porttitor id, iaculis nec sapien. Cras aliquet risus nibh.
            Donec hendrerit augue id lobortis pharetra. Vivamus tempus commodo augue. 
            Suspendisse volutpat urna quis rhoncus semper. Fusce vel tellus faucibus, 
            lobortis diam in, facilisis leo. Curabitur in arcu ac mauris tempor luctus non 
            vel magna. Suspendisse commodo pharetra faucibus. Vestibulum pharetra eros id 
            lorem interdum, eu efficitur quam iaculis. Mauris eros sapien, dictum vitae sem in, 
            ultricies pellentesque nibh. Donec eu nulla tellus. Donec semper quis mauris nec 
            dapibus. Duis placerat elit vel ante rhoncus, vel porttitor purus accumsan.
        `,
      location: "Electroland Showrooms",
      start_date: "03-03-2024",
      end_date: "07-03-2024",
      flyer: "/images/10.jpg",
      status: "live",
      likes: "902",
      rate: 2.6,
      categories: [{ name: "Fashion" }, { name: "Restaurants" }],        
      organizer: {
        id: 4,
        name: "Electroland",
        description: `
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Duis ut mollis lacus, cursus blandit purus. Integer nec sollicitudin sapien. 
                Cras odio mi, mollis vel porttitor id, iaculis nec sapien.
            `,
        phone_number: "0987654321",
        websiteURL: "https://www.zara.com/",
      },
      images: [
        "/images/1.jpg",
        "/images/2.jpg",
      ],      
    },
  ],
};

export const discountReviewsData = {
  results: [
    {
      id: 1,
      discount: "http://test/review/url1",
      user: "Anarosa",
      comment: "Get your best furniture",
      rating: 2,
      likes: 0,
      total_reviews: 1,
    },
    {
      id: 2,
      discount: "http://test/review/url1",
      user: "Gilbert",
      comment: "This one dier shabosbo ooo :)",
      rating: 3.4,
      likes: 3,
      total_reviews: 6,
    },
  ],
};

export const categoriesData = {
  results: [
    { 
        id: 1,
        name: "Restaurants" 
    },
    { 
        id: 2,
        name: "Fashion" 
    },
    { 
        id: 3,
        name: "Electronics" 
    },
    { 
        id: 4,
        name: "Hotels" 
    },
    { 
        id: 5,
        name: "Food" 
    },
    { 
        id: 6,
        name: "Tickets" 
    },
  ],
};

export const DUMMY_TICKETS = [
  {
    id: 1,
    type: "Reg.",
    name: "Live in Accra",
    location: "Seats in regular stands",
    price: 22.99,
  },
  {
    id: 2,
    type: "VIP",
    name: "Live in Accra",
    location: "3rd row seats",
    price: 30.5,
  },
  {
    id: 3,
    type: "VVIP",
    name: "Live in Accra",
    location: "Second row seats",
    price: 40.99,
  },
  {
    id: 4,
    type: "Exec.",
    name: "Live in Accra",
    location: "First row seats",
    price: 99.99,
  },
];

export const packageOptionsData = {
  results: [
    {
      package_type: "daily",
      price: 20.0,
    },
    {
      package_type: "weekly",
      price: 120.0,
    },
    {
      package_type: "monthly",
      price: 450.0,
    },
  ],
};
