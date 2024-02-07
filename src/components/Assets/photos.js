const photos = [
    {
        src: "/images/1.jpg",
        width: 800,
        height: 600,
        images: [
            { src: "/images/1.jpg", width: 400, height: 300 },
            { src: "/images/2.jpg", width: 200, height: 150 }
        ]
    },
    {
        src: "/images/2.jpg",
        width: 1600,
        height: 900,
        images: []
    },
    {
        src: "/images/3.jpg",
        width: 1600,
        height: 900,
        images: []
    },
    {
        src: "/images/4.png",
        width: 1600,
        height: 900,
        images: []
    },
    {
        src: '/images/5.png',
        width: 1600,
        height: 900,
        images: []
    },
    {
        src: '/images/6.jpg',
        width: 1600,
        height: 900,
        images: []
    },
    {
        src: '/images/7.png',
        width: 1600,
        height: 900,
        images: []
    },
    {
        src: '/images/8.jpg',
        width: 1600,
        height: 900,
        images: []
    },
    {
        src: '/images/9.jpg',
        width: 1600,
        height: 900,
        images: []
    },
    {
        src: '/images/10.jpg',
        width: 1600,
        height: 900,
        images: []
    },
    {
        src: '/images/11.jpg',
        width: 1600,
        height: 900,
        images: []
    },
    {
        src: '/images/14.png',
        width: 1600,
        height: 900,
        images: []
    },
]

export default photos;

export const serialize_photo = (photo) => {
    return {
        src: photo.media_url,
        images: []
    }
}