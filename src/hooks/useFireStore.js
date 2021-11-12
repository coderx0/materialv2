import { useState, useEffect } from "react";
import { getDocs } from "firebase/firestore";

const useFireStore = (q) => {
    const [docs, setDocs] = useState(null);
    const [docSnap, setDocSnap] = useState(null);
    useEffect(() => {
        
        (async () => {
            let documents = [];
            const docSnapshots = await getDocs(q);
            docSnapshots.forEach(element => {
                documents.push({ ...element.data(), id: element.id })
            });
            setDocs(documents);
            setDocSnap(docSnapshots);
        })();
    }, [q]);


    return {docs,docSnap};
}

export default useFireStore;