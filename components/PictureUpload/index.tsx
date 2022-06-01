import React, {useState} from 'react';
import {gql, useMutation} from "@apollo/client";
import classes from "./PictureUpload.module.css"
const UPLOAD_USER_PICTURE = gql`
    mutation uploadUserPicture (
        $picture: Upload!
    ) {
        uploadUserPicture(picture: $picture) {
            login
        }
    }


`


const PictureUpload = () => {
    const [file,setFile] = useState<any>(null);
    const [image,setImage] = useState<any>(null);
    const [disabled, setDisabled] = useState(true);
    const [uploadUserPicture] = useMutation(UPLOAD_USER_PICTURE);
    const addPicture = (e:any) => {
        e.preventDefault();
        console.log(file);
        uploadUserPicture({
            variables: {
                picture: file
            }
        }).then(()=>{
            console.log('success');
        }).catch(err => {
            console.log('err: ' +err.message);
        })
    }
    return (
        <form className={classes.container}>
            <h3>Изменить аватар</h3>

            {!disabled && <img src={image}
                              alt="preview image"
                              width={90}
                              height={90}
            />
            }

        <div className={classes.moveDown}>
            <input type="file"
                   id ="file"
                   placeholder={'загрузить'}
                   style={{visibility: "hidden"}}
                   onChange={ ({target: {files}}) => {
                       const file = files![0];
                       setFile(files![0]);
                       setImage(URL.createObjectURL(files![0]));
                       setDisabled(false);
                        }
                   }
            />

                <label htmlFor="file">Выбрать файл</label>
            <button onClick={addPicture}>
                Изменить

            </button>
        </div>
        </form>
    );
};

export default PictureUpload;