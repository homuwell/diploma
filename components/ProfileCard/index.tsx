import {FC} from 'react';
import {Role} from "../../generated/apollo/globalTypes";
import classes from './ProfileCard.module.css'
import PictureUpload from "../PictureUpload";
type ProfileCardProps = {
    name: string,
    surname: string,
    email: string,
    phoneNumber: string
    role: Role
}

const ProfileCard: FC<ProfileCardProps> = ({name,surname,email,phoneNumber,role}) => {
    return (
        <div className={classes.container}>
            <PictureUpload/>
            <div className={classes.dataCard}>
                <ul>
                    <li>
                        {'Имя: '}
                    </li>
                    <li>
                        {`Фамилия: `}
                    </li>
                    <li>
                        {`Адрес почты: `}
                    </li>
                    <li>
                        {`Номер телефона: `}
                    </li>
                    <li>
                        {`Тип аккаунта: `}
                    </li>
                </ul>
                <ul>
                    <li>
                        <div>{name}</div>
                    </li>
                    <li>
                        {surname}
                    </li>
                    <li>
                        {email}
                    </li>
                    <li>
                        {phoneNumber}
                    </li>
                    <li>
                        {role === 'USER' ? 'Пользователь' : 'Администратор'}
                    </li>
                </ul>
            </div>

        </div>

    );
}

export default ProfileCard;