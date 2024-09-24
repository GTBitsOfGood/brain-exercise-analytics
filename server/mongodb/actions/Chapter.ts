import { IChapter, RecursivePartial } from "@/common_utils/types";
import Chapter from "../models/Chapter";





export const getChapterByName = async (name: string): Promise<IChapter | null> => {
    const chapter = await Chapter.findOne<IChapter>({ name: name });
    return chapter;
  };


export const deleteChapter = async (name: string): Promise<void> => {
    await Chapter.findOneAndDelete({name: name});
}


export const updateChapter = async (
    name: string, 
    newFields: RecursivePartial<IChapter>
): Promise<void> => {

    
        

}