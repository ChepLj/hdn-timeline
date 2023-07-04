import { useEffect, useState } from 'react';
import getDataFromDB from '../../api/getDataFromDB';
import banner from '../../media/image/banner.png';
import style from './MainPage.module.css';
import deleteDataFromStorage from '../../api/deleteFolderDataFromStorage';
import deleteFolderDataFromStorage from '../../api/deleteFolderDataFromStorage';
import postDataToDB from '../../api/postDataToDB';

interface ITF_MainDataItem {
   key: string;
   class: number;
   timeUpload: string;
   comment: string;
   images: string[];
   status: string;
}
export default function MainPage() {
   const [mainData, setMainData] = useState<any>();
   const [idLogin, setIdLogin] = useState('lock');
   const [resetPage, setResetPage] = useState(false);
   useEffect(() => {
      const idLoginTemp = window.sessionStorage.getItem('idLogin');
      switch (idLoginTemp) {
         case 'thao': {
            setIdLogin('admin');
            break;
         }
         case 'guest': {
            setIdLogin('guest');

            break;
         }
         default: {
            setIdLogin('lock');
         }
      }
   }, [resetPage]);
   //TODO: get Data from DB
   useEffect(() => {
      const callback = (result: any) => {
         if (result.type === 'SUCCESSFUL') {
            const mainDataArray = [];
            const dataObjectTemp = result.payload;
            for (const item in dataObjectTemp) {
               mainDataArray.push(dataObjectTemp[item]);
            }
            setMainData(mainDataArray.reverse());
         } else {
            alert('something is wrong ! please refresh page again');
         }
      };
      getDataFromDB('Main', callback);
   }, []);
   //TODO_END: get Data from DB
   return (
      <section className={style.mainContainer}>
         <div className={style.mainImage}>
            {idLogin === 'admin' && (
               <div className={style.mainButtonCreateNew} onClick={() => (window.location.href = '/create')}>
                  create new +
               </div>
            )}
         </div>
         <div className={style.mainBanner}>
            <img className={style.mainBannerImage} src={banner} />
         </div>
         {mainData?.map((crr: ITF_MainDataItem, index: number) => {
            return <PostElement data={crr} key={index} idLogin={idLogin} />;
         })}
         {idLogin === 'lock' && <Login setResetPage={setResetPage} />}
      </section>
   );
}

//JSX: post element
function PostElement({ data, idLogin }: { data: ITF_MainDataItem; idLogin: string }) {
   return (
      <section className={style.postElementContainer}>
         <LeftSide data={data} idLogin={idLogin} />
         <span className={style.border} style={{ height: 'auto', width: 1, borderLeft: '1px solid gray' }} />
         <RightSide data={data} />
      </section>
   );
}
//JSX_END: post element

//JSX: LeftSide element
function LeftSide({ data, idLogin }: { data: ITF_MainDataItem; idLogin: string }) {
   const [imageIndex, setImageIndex] = useState(0);
   const arrayImage = data.images;
   //TODO: handle back  forward Image

   const handleBackForwardImage = (type: string) => {
      //:scroll in to view
      const listImageElm = document.getElementById(`mainPage-imageList-${data.key}`) as HTMLImageElement;
      const itemImageElm = document.getElementById(`mainPage-imageItem-${data.key}-${imageIndex}`);
      const offsetLeftItem = itemImageElm?.offsetLeft;
      listImageElm?.scrollTo({ left: offsetLeftItem, behavior: 'smooth' });

      if (arrayImage.length) {
         switch (type) {
            case 'back': {
               if (imageIndex > 0) {
                  setImageIndex((pre) => pre - 1);
               } else if (imageIndex === 0) {
                  setImageIndex(arrayImage.length - 1);
               }
               break;
            }
            case 'forward': {
               if (imageIndex < arrayImage.length - 1) {
                  setImageIndex((pre) => pre + 1);
               } else if (imageIndex === arrayImage.length - 1) {
                  setImageIndex(0);
               }
               break;
            }
         }
      }
   };
   //TODO_END: handle back forward Image
   //TODO: handle delete all data
   const handleDeleteAllData = (data:ITF_MainDataItem) => {
      const callback = (messenger: string) => {
         if(messenger === 'delete successfully'){
            const uploadContainer = [{
               ref:'Main/' + data.key,
               data: null
            }]
            const callbackDeleteSuccess =(messenger:string)=> {
               if( messenger === 'post successfully!'){
                  alert('Xóa thành công !')
                  window.location.href = '/'
               }
               else {
                  alert('Xóa thất bại !')
               }

            }
            postDataToDB(uploadContainer, callbackDeleteSuccess)
         }
      };
      const ref = `Image/${data.class}/${data.key}`
      deleteFolderDataFromStorage(ref, callback);
   };
   //TODO_END: handle delete all data

   return (
      <section className={style.leftSideContainer}>
         <div className={style.lsHeader}>
            <div className={style.lsHeaderTitle}>
               <span>&#x26AF; {data.timeUpload}</span> <span style={{ paddingLeft: '20px', color: 'violet' }}>Lớp {data.class}</span>
            </div>
            {idLogin === 'admin' && (
               <div className={style.lsHeaderButton}>
                  <span className={style.lsHeaderButtonDelete} onClick={()=>handleDeleteAllData(data)}>
                     delete
                  </span>
                  <span className={style.lsHeaderButtonEdit}>edit</span>
               </div>
            )}
         </div>

         <div className={style.lsMainImageContainer}>
            <div className={style.lsMainImageBackForward} onClick={(e) => handleBackForwardImage('back')}>
               <span className="material-icons-outlined" style={{ userSelect: 'none' }}>
                  arrow_back_ios
               </span>
            </div>
            <div className={style.lsMainImageBox} style={{ backgroundImage: `url(${arrayImage[imageIndex]})` }}>
               <span>{imageIndex}</span>
            </div>
            <div className={style.lsMainImageBackForward} onClick={() => handleBackForwardImage('forward')}>
               <span className="material-icons-outlined" style={{ userSelect: 'none' }}>
                  arrow_forward_ios
               </span>
            </div>
         </div>
         <div className={style.lsImageList} id={`mainPage-imageList-${data.key}`}>
            {arrayImage?.map((crr, index) => {
               return (
                  <div
                     className={style.lsImageListItem}
                     id={`mainPage-imageItem-${data.key}-${index}`}
                     key={index}
                     style={{
                        backgroundImage: `url(${crr})`,
                        boxShadow: imageIndex === index ? '-1px 1px 15px rgb(58, 138, 39)' : '',
                     }}
                     onClick={(e) => setImageIndex(index)}
                  ></div>
               );
            })}
         </div>
      </section>
   );
}
//JSX_END: LeftSide element

//JSX: RightSide element
function RightSide({ data }: { data: ITF_MainDataItem }) {
   return (
      <section className={style.rightSideContainer}>
         <div className={style.rsComment}>{data.comment}</div>
      </section>
   );
}
//JSX_END: RightSide element

//JSX: Login element
function Login({ setResetPage }: { setResetPage: Function }) {
   const [login, setLogin] = useState('flex');
   //TODO: handle login
   const handleLogin = () => {
      const loginInputElm = document.getElementById('login-input') as HTMLInputElement;
      switch (loginInputElm.value) {
         case '776402': {
            // Set a value in session storage
            window.sessionStorage.setItem('idLogin', 'thao');
            setLogin('none');
            setResetPage((e: boolean) => !e);
            break;
         }
         case 'hoa dong noi': {
            // Set a value in session storage
            window.sessionStorage.setItem('idLogin', 'guest');
            setLogin('none');
            setResetPage((e: boolean) => !e);
            break;
         }
         default: {
            setLogin('wrong');
            loginInputElm.value = '';
         }
      }
   };
   //TODO_END: handle login
   return (
      <section className={style.loginContainer} style={{ display: `${login}` }}>
         <div className={style.loginBox}>
            <div className={style.loginHeader}>Nhập mật mã truy cập</div>
            <input
               className={style.loginInput}
               id="login-input"
               onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                     handleLogin();
                  }
               }}
            />
            <button className={style.loginButton} onClick={handleLogin}>
               {' '}
               OK
            </button>
            {login === 'wrong' && <div style={{ color: 'red', fontStyle: 'italic' }}>sai mật mã !!!</div>}
         </div>
      </section>
   );
}
//JSX_END: Login element
