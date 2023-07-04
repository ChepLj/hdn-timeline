import { deleteObject, listAll, ref } from 'firebase/storage';
import { storage } from './firebase/firebaseConfig';

const deleteFolderDataFromStorage = async (folder: string, callback: Function) => {
   // Create a reference under which you want to list
   const listRef = ref(storage, folder);

   // Find all the prefixes and items.
   listAll(listRef)
      .then((res) => {
         let count = 0;
         let total = res.items.length;
         res.items.forEach((itemRef: any) => {
            deleteObject(ref(storage, itemRef.fullPath))
               .then(() => {
                  count++;
                  if (count === total) {
                     callback('delete successfully');
                  }
               })
               .catch((error) => {
                  callback('error');
                  console.log('🚀 ~ file: deleteDataFromStorage.ts:24 ~ res.items.forEach ~ error:', error);
                  // Uh-oh, an error occurred!
               });
         });
      })
      .catch((error) => {
         // Uh-oh, an error occurred!
      });
};

export default deleteFolderDataFromStorage;
