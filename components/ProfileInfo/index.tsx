import {FC} from 'react';
import ImageCard from "../ImageCard";
import ProfileCard from "../ProfileCard";
import {getUserDataProfile_getUserData} from "../../generated/apollo/getUserDataProfile";
import classes from './ProfileInfo.module.css'
type ProfileInfoProps = {
    data: getUserDataProfile_getUserData
}

const ProfileInfo: FC<ProfileInfoProps> = ({data}) => {
    return (
        <div className={classes.container}>
            <ImageCard login={data.login} imageURL={data.picture}/>
            <ProfileCard name={data.name} surname={data.surname} email={data.email} phoneNumber={data.phoneNumber} role={data.role}/>
        </div>
    );
};

export default ProfileInfo;