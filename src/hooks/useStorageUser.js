import { useState, useEffect } from "react";
import { projectStorage,projectFireStore } from "../firebase/Config";
import { ref,uploadBytesResumable,getDownloadURL } from "firebase/storage";
import { collection, doc, setDoc,serverTimestamp } from "firebase/firestore";
import { useHistory } from "react-router";

const useStorageUser = (data) => {
    const userRef = doc(collection(projectFireStore, 'users'));
    await setDoc(userRef, data);
};

export default useStorageUser;