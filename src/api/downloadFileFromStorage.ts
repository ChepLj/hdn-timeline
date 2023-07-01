import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase/firebaseConfig";


export default function downloadFileFromStorage(item:any) {
  // Create a reference to the file we want to download
  var starsRef = ref(storage, item.urlFileStore);

  // Get the download URL
  getDownloadURL(starsRef).then((url) => {
    // This can be downloaded directly:
    const xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    xhr.onload = (event) => {
      const blob = xhr.response;
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.target = "_blank";
      link.download = `${item.idCode}-v${item.version}-${item.name}`;
      link.click();
    };
    xhr.open("GET", url);
    xhr.send();
  });
}
