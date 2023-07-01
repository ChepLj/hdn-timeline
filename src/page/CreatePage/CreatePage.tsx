import { useEffect, useState } from 'react';
import { handelOpenImageFile } from '../../component/FCComponent/browserFile';

import getDataFromDB from '../../api/getDataFromDB';
import postDataToDB from '../../api/postDataToDB';
import postDataToStorage from '../../api/postDataToStorage';
import handleNowTime from '../../component/FCComponent/handleTime';
import style from './CreatePage.module.css';

export default function CreatePage() {
   const [imageArray, setImageArray] = useState([]);
   const [isUpLoad, setIsUpLoad] = useState(false);
   const classElm = document.querySelector('[name="create-classInput"]') as HTMLInputElement;
   const commentElm = document.querySelector('[name="create-commentInput"]') as HTMLInputElement;
   useEffect(()=>{
      const idLogin = window.sessionStorage.getItem('idLogin')
      if(idLogin !== 'thao'){
         window.location.href = '/'
      }
   },[])
   //TODO: handle upload button click
   const handleUploadButtonClick = () => {
      if (classElm.value != '' && imageArray.length > 0) {
         setIsUpLoad(true);
      } else {
         alert('Chưa chọn Lớp hoặc không có hình ảnh !');
      }
   };
   return (
      <section className={style.mainContainer}>
         <header className={style.header}>
            <div
               className={style.headerBackButton}
               onClick={() => {
                  window.location.href = '/';
               }}
            >
               Back to home
            </div>
            <div className={style.headerTitle}>Upload new Image</div>
            <div className={style.headerUploadButton} onClick={handleUploadButtonClick}>
               Upload to server
            </div>
         </header>
         <div className={style.contentContainer}>
            <LeftSide setImageArray={setImageArray} imageArray={imageArray} />
            <RightSide imageArray={imageArray} setImageArray={setImageArray} />
         </div>
         {isUpLoad && <ProgressUpload imageArray={imageArray} class={classElm.value} comment={commentElm.value} />}
      </section>
   );
}

//JSX: left side
function LeftSide(prop: any) {
   //TODO: handle choose image
   const handleChooseImage = () => {
      const callback = (fileArray: File[]) => {
         const imageArrayTemp = [...prop.imageArray, ...fileArray];
         prop?.setImageArray(imageArrayTemp);
      };
      handelOpenImageFile(callback);
   };
   //TODO_END: handle choose image

   return (
      <section className={style.leftSideContainer}>
         <div className={style.lsItem}>
            <span className={style.lsItemLabel}>Lớp</span>
            <select className={style.lsItemSelect} name="create-classInput">
               <option value={''}></option>
               <option value={1}>1</option>
               <option value={2}>2</option>
               <option value={3}>3</option>
               <option value={4}>4</option>
               <option value={5}>5</option>
               <option value={6}>6</option>
               <option value={7}>7</option>
               <option value={8}>8</option>
            </select>
            <div className={style.lsChooseImageButton} onClick={handleChooseImage}>
               Chọn ảnh
            </div>
         </div>
         <div className={style.lsItemStatus}>
            <textarea name="create-commentInput" className={style.lsItemStatusTextArea} spellCheck="false" placeholder="Viết trạng thái vào đây"></textarea>
         </div>
      </section>
   );
}
//JSX_END: left side

//JSX: right side
function RightSide(prop: any) {
   const [imageModalView, setImageModalView] = useState<{ isActive: boolean; image?: any }>({ isActive: false, image: '' });
   //TODO: handle delete image item
   const handleDeleteImageItem = (e: any, index: number) => {
      e.stopPropagation();
      const newArray = [...prop.imageArray];
      newArray.splice(index, 1);
      prop.setImageArray(newArray);
   };
   //TODO_END: handle delete image item
   return (
      <>
         <section className={style.rightSideContainer}>
            {prop?.imageArray.map((crr: File, index: number) => {
               return (
                  <div className={style.rsImageItem} key={index} style={{ backgroundImage: `url(${URL.createObjectURL(crr)})` }} onClick={() => setImageModalView({ isActive: true, image: crr })}>
                     <span className={style.rsImageItemLabel}>{index}</span>
                     <span className={style.rsImageItemDeleteIcon} onClick={(e) => handleDeleteImageItem(e, index)}>
                        &times;
                     </span>
                  </div>
               );
            })}
         </section>
         {imageModalView.isActive && (
            <div className={style.rsModalImageBox} onClick={()=> setImageModalView({isActive:false})}>
               <div className={style.rsModalImageView} style={{ backgroundImage: `url(${URL.createObjectURL(imageModalView.image)})` }} />
            </div>
         )}
      </>
   );
}
//JSX_END: right side

//JSX: progress upload
function ProgressUpload(prop: any) {
   //TODO: mount
   console.log('%cProgressUpload Render', 'color:green');
   useEffect(() => {
      return () => {
         console.log('%cProgressUpload Unmount', 'color:red');
      };
   }, []);
   //TODO_EMD: mount

   const [state, setState] = useState<{ message: string; key?: string }>({
      message: 'waiting',
   });
   console.log('🚀 ~ file: ProgressUpload.tsx:9 ~ ProgressUpload ~ state:', state);

   const [imageBlobArray, setImageBlobArray] = useState<
      {
         index: number;
         image: any;
         status?: string;
         process: { bytesTransferred: '0'; totalBytes: '0' };
      }[]
   >([]);
   //TODO: create new Array image
   useEffect(() => {
      const arrayTemp: any = [];
      for (let i = 0; i < prop.imageArray.length; i++) {
         arrayTemp.push({
            index: i,
            image: prop.imageArray[i],
            process: { bytesTransferred: '0', totalBytes: '0' },
         });
      }
      setImageBlobArray(arrayTemp);
      setState({
         message: 'data upload',
      });
   }, []);

   //TODO_END: create new Array image

   //TODO: handle upload
   useEffect(() => {
      switch (state.message) {
         case 'data upload': {
            const date = Date.now();
            const key = date.toString();
            const objectData = {
               key: key,
               timeUpload: handleNowTime(),
               comment: prop.comment,
               status: 'normal',
               images: [''],
               class: prop.class,
            };
            const uploadContainer = [
               {
                  ref: `Main/${key}`,
                  data: objectData,
               },
            ];
            const callback = (message: string) => {
               if (message === 'post successfully!') {
                  setState({
                     message: 'image Upload',
                     key: key,
                  });
               } else {
                  setState({
                     message: 'error',
                     key: key,
                  });
               }
            };
            postDataToDB(uploadContainer, callback);
            break;
         }
         case 'image Upload': {
            const finishArrayCheck = [];
            imageBlobArray.forEach((crr, index) => {
               const file = crr.image;
               const fileName = `image-${crr.index}`;
               const ref = `Image/${prop.class}/${state.key}`;
               const callback = (messenger: string, resultPostImage: any) => {
                  if (messenger === 'Upload completed successfully') {
                     //TODO: get data from DB
                     const refChild = `Main/${state.key}/images`;
                     const callbackGetData = (resultGetData: any) => {
                        let arrayImageTemp: any = [];
                        if (resultGetData.payload[0] != '') {
                           arrayImageTemp = resultGetData.payload;
                        }
                        const dataPost = [...arrayImageTemp, resultPostImage];
                        const uploadContainer = [
                           {
                              ref: `Main/${state.key}/images`,
                              data: dataPost,
                           },
                        ];
                        const callbackPostDataToDB = () => {
                           const arrayTemp = [...imageBlobArray];
                           arrayTemp[index].status = 'done';
                           setImageBlobArray(arrayTemp);
                        };
                        resultGetData.type === 'SUCCESSFUL' && postDataToDB(uploadContainer, callbackPostDataToDB);
                     };
                     getDataFromDB(refChild, callbackGetData);
                     //TODO_END: get data from DB

                     finishArrayCheck.push(index);
                     finishArrayCheck.length === imageBlobArray.length &&
                        setState({
                           message: 'done',
                        });
                  } else if (messenger === 'Upload Failed') {
                     const arrayTemp = [...imageBlobArray];
                     arrayTemp[index].status = 'failed';
                     setImageBlobArray(arrayTemp);
                  }
               };
               const handleProgressUpload = (progressState: any) => {
                  const arrayTemp = [...imageBlobArray];
                  arrayTemp[index].process.bytesTransferred = progressState.bytesTransferred;
                  arrayTemp[index].process.totalBytes = progressState.totalBytes;
                  arrayTemp[index].status = 'uploading';
                  setImageBlobArray(arrayTemp);
               };
               postDataToStorage(file, ref, fileName, callback, handleProgressUpload);
            });

            break;
         }

         case 'error': {
            alert('Something is wrong, Upload failed !!!');
            break;
         }
      }
   }, [state.message]);

   //TODO_END: handle upload
   return (
      <section className={style.progressUploadContainer}>
         <div className={style.proUpBox}>
            <header className={style.proUpBoxHeader}>Uploading...</header>
            <div>{imageBlobArray.length} image</div>
            <ul className={style.proUpBoxList}>
               {imageBlobArray.map((crr, index) => {
                  return (
                     <li className={style.proUpBoxItem} key={index}>
                        <span>
                           {`image ${crr.index + 1}`}
                           {crr.status === 'failed' && <span style={{ color: 'red', paddingLeft: '15px' }}>Failed</span>}
                           {crr.status === 'uploading' && <span style={{ color: 'violet', paddingLeft: '15px' }}>Uploading...</span>}
                           {crr.status === 'done' && <span style={{ color: 'green', paddingLeft: '15px' }}>Done</span>}
                        </span>
                        <span>
                           {crr.process.bytesTransferred}/{crr.process.totalBytes} byte
                        </span>
                     </li>
                  );
               })}
            </ul>
            {state.message === 'done' && (
               <div className={style.proUpDoneBox}>
                  Upload completely !
                  <div
                     className={style.proUpDoneButton}
                     onClick={() => {
                        window.location.href = '/';
                     }}
                  >
                     OK
                  </div>
               </div>
            )}
         </div>
      </section>
   );
}
//JSX_END: progress upload
