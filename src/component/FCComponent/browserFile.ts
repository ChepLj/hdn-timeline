import { fileOpen, directoryOpen, fileSave, supported } from "browser-fs-access";
if (supported) {
  console.log("Using the File System Access API.");
} else {
  console.log("Using the fallback implementation.");
}
//TODO: handel open Text
export const handelOpenImageFile = async (callback: Function) => {
  try {
    const blob = await fileOpen({
      description: "Image files",
      mimeTypes: ["image/jpg", "image/png", "image/gif", "image/webp"],
      extensions: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
      multiple: true,
    });
    // console.log("🚀 ~ file: CreatePage.tsx:57 ~ handelOpenFile ~ blob:", blob);
    if (blob) {
      callback(blob);
    }
  } catch {}
};

//TODO_END: handel open image


