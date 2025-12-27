import store from "@/store";
import RezTabFile from "@/store/modules/RezTabFile";

export function useDoc(): RezTabFile {
    return store.state.currentDoc as RezTabFile;
}