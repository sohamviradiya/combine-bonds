import Image from 'next/image';

export default function Background({ src }: { src: any }) {
    return (<Image alt="Background Image" src={src} placeholder="empty" quality={100} fill sizes="100%" style={{ objectFit: 'cover', position: 'absolute', zIndex: -1, }} />);
};