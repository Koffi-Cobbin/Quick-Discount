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

export const locations = {
  "Accra": "Greater Accra, Accra",
  "Cape Coast": "Central, Cape Coast",
  "Kumasi": "Ashanti, Kumasi",
  "Damongo": "Savannah, Damongo",
  "Tamale": "Northern, Tamale",
  "Techiman": "Bono East, Techiman",
  "Koforidua": "Eastern, Koforidua",
  "Wa": "Upper West, Wa",
  "Takoradi": "Western, Takoradi",
  "Ho": "Volta, Ho",
  "Nalerigu": "North-East, Nalerigu",
  "Bolgatanga": "Upper East, Bolgatanga",
  "Dambai": "Oti, Dambai",
  "Goaso": "Ahafo, Goaso",
  "Sunyani": "Brong Ahafo, Sunyani",
  "Wiawso": "Western North, Wiawso"
};

export const cities = [
  "Accra",
  "Cape Coast",
  "Kumasi",
  "Damongo",
  "Tamale",
  "Techiman",
  "Koforidua",
  "Wa",
  "Takoradi",
  "Ho",
  "Nalerigu",
  "Bolgatanga",
  "Dambai",
  "Goaso",
  "Sunyani",
  "Wiawso"
];

export const dateFilters = ["Today", "This week", "This month", "Next month"];

export const discountsData = {
  results: [
    {
      "url": "http://localhost:5000/discounts/1/",
      "id": 1,
      "title": "aaa aaaaaa aaaa a a a aaaaa aa a a aaaaaa aaaaa aaaa aaa",
      "organizer": {
          "url": "http://localhost:5000/discounts/organizers/1/",
          "id": 1,
          "name": "Hisense Ghana",
          "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. \n                Duis ut mollis lacus, cursus blandit purus. Integer nec sollicitudin sapien. \n                Cras odio mi, mollis vel porttitor id, iaculis nec sapien.",
          "phone_number": "1234567890",
          "email": "mytestmaillab@gmail.com",
          "location": "",
          "social_media_handles": {
              "whatsapp": " ",
              "facebook": " ",
              "instagram": " ",
              "twitter": " "
          },
          "created_by": "http://localhost:5000/users/2/",
          "followers": 0
      },
      "flyer": "http://res.cloudinary.com/thehivecloudstorage/image/upload/v1715603433/ztsw2vocl4kdljgvfetc.jpg",
      "description": "Suspendisse volutpat urna quis rhoncus semper. Fusce vel tellus faucibus, \r\n            lobortis diam in, facilisis leo. Curabitur in arcu ac mauris tempor luctus non \r\n            vel magna. Suspendisse commodo pharetra faucibus. Vestibulum pharetra eros id \r\n            lorem interdum, eu efficitur quam iaculis. Mauris eros sapien, dictum vitae sem in, \r\n            ultricies pellentesque nibh. Donec eu nulla tellus. Donec semper quis mauris nec \r\n            dapibus. Duis placerat elit vel ante rhoncus, vel porttitor purus accumsan.",
      "package_type": "daily",
      "percentage_discount": "10% discount on all products",
      "start_date": "2024-06-02",
      "end_date": "2024-06-02",
      "start_time": "13:38:12",
      "end_time": "13:56:46",
      "categories": [
          {
              "url": "http://localhost:5000/discounts/categories/2/",
              "id": 2,
              "name": "Electronics"
          }
      ],
      "created_by": "http://localhost:5000/users/2/",
      "video_url": "https://youtu.be/z65zuK3VzM0?si=Gx5yrm0t894ZqFxh",
      "website_url": "http://www.hisensegh.com/",
      "location": "Hisense Showrooms",
      "address": "Lorem ipsum dolor",
      "agreement": "agreed",
      "likes": 0,
      "status": "pending",
      "is_active": true,
      "average_rating": null,
      "total_rating": 0
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
      start_date: "2024-02-11",
      end_date: "2024-02-28",
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
      start_date: "2024-02-14",
      end_date: "2024-02-16",
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
      start_date: "2024-03-03",
      end_date: "2024-03-07",
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
      title: "Clearance Sales",
      percentage_discount: "Up to 70% off!",
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
      location: "EGL Ring Road Branch",
      start_date: "2024-03-07",
      end_date: "2024-03-07",
      flyer: "/images/7.jpg",
      status: "live",
      likes: "902",
      rate: 2.6,
      categories: [{ name: "Electronics" }],        
      organizer: {
        id: 4,
        name: "Electroland",
        description: `
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Duis ut mollis lacus, cursus blandit purus. Integer nec sollicitudin sapien. 
                Cras odio mi, mollis vel porttitor id, iaculis nec sapien.
            `,
        phone_number: "0987654321",
        websiteURL: "https://www.electrolandgh.com/",
      },
      images: [
        "/images/1.jpg",
        "/images/2.jpg",
      ],      
    },
  ],
};


export const discountMediaData = {
  results: [
    {
      id: 1,
      discount: "http://test/url1",
      media_url: "/images/4.jpg"
    },
    {
      id: 2,
      discount: "http://test/url2",
      media_url: "/images/6.jpg"
    },
    {
      id: 2,
      discount: "http://test/url3",
      media_url: "/images/5.jpg"
    },
    {
      id: 2,
      discount: "http://test/url4",
      media_url: "/images/10.jpg"
    },
    {
      id: 2,
      discount: "http://test/url5",
      media_url: "/images/7.jpg"
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
 

export const userData = {
      email: "test@email.com",
      contact: "1234567890",
      name: "Koffi Cobbin"
};
