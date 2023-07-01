import { get, ref } from "firebase/database";
import { database } from '../api/firebase/firebaseConfig';

function getDataFromDB (childRef:any, disPatch?:any){
   const mainRef = ref(database, childRef)
   get(mainRef).then((snapshot) => {
    if (snapshot.exists()) {
      // console.log("🚀 ~ file: getDataFromDB.ts:8 ~ get ~ snapshot:", snapshot.val())
      disPatch({type: "SUCCESSFUL", payload: snapshot.val()}) //: disPatch đẻ render lại
    } else {
      disPatch({type: "No data available", payload: ''})
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
}

export default getDataFromDB