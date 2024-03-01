export const PRODUCT_CATEGORIES=[
    {
        label: "Food",
        value: "food" as const,
        details:[
            {
                name: "Chinese",
                href: "#",
                imageSrc: "/nav/food/chinese.jpg"
            },
            {
                name: "Itallian",
                href: "#",
                imageSrc: "/nav/food/itallian.jpg"
            },
            {
                name: "Korean",
                href: "#",
                imageSrc: "/nav/food/korean.jpg"
            },          
        ]
    },

    {
        label: "Sport",
        value: "sport" as const,
        details:[
            {
                name: "Football",
                href: "#",
                imageSrc: "/nav/sport/football.jpg"
            },
            {
                name: "BasketBall",
                href: "#",
                imageSrc: "/nav/sport/basketball.jpg"
            },
            {
                name: "Swimming",
                href: "#",
                imageSrc: "/nav/sport/swimming.jpg"
            },          
        ]
    },

    {
        label: "UI Kits",
        value: "ui_kits" as const,//"ui_kits" is not just a generic string, but the exact string literal "ui_kits"
        details:[
         {
             name: "Editor picks",
             href: '#',
             imageSrc: '/nav/ui-kits/mixed.jpg',
         },
         {
             name: "New Arrivals",
             href: '#',
             imageSrc: '/nav/ui-kits/blue.jpg',
         },
         {
             name: "Best sellers",
             href: '#',
             imageSrc: '/nav/ui-kits/purple.jpg',
         },
 
        ]
     },
]