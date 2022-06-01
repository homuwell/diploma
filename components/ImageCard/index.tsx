import {FC} from 'react';
import classes from './ImageCard.module.css'
type ImageCardProps = {
    login: string
    imageURL: string
}
import Image from 'next/image'

const ImageCard: FC<ImageCardProps> = ({login,imageURL}) => {
    return (
        <div className={classes.container}>
            <Image
                src={imageURL}
                width={200}
                height={200}
            >
            </Image>
            <h2>{login}</h2>

        </div>
    );
}

export default ImageCard;