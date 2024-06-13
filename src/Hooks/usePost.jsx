import { useState } from "react";
import { GetPostsByIdPost, GetPostsByIdUser, savePost } from "../services/PostService";
import { enqueueSnackbar } from "notistack";

export const usePost = () => {

    const [misPosts, setMisPosts] = useState([]);
    const [detailsPost, setDetailsPost] = useState([]);

    const guardarPost = async ({ data }) => {

        console.log("data al usePost", data);
        try {
            const result = await savePost({ post: data });
            enqueueSnackbar('Post Registrado correctaente', { variant: 'success' });
            return true;

        } catch (error) {
            enqueueSnackbar('A ocurrido un error, favor intente mas tarde', { variant: 'error' });
            return false;
            console.log(error);
        } finally {
        }

    }

    const getUserAndPost = async ({ userId }) => {
        console.log("data al getUserAndPost", userId);
        try {
            const result = await GetPostsByIdUser({ idUser: { userId } });
            setMisPosts(result.posts);
        } catch (error) {
            enqueueSnackbar('A ocurrido un error, favor intente mas tarde', { variant: 'error' });
            console.log(error);
        } finally {
        }
    }

    const getDetailsPost = async ({ postId }) => {
        console.log("data al getDetailsPost", postId);
        try {
            const result = await GetPostsByIdPost({ postId: { postId } });
            console.log("mi result de getDetailsPost", result);
            setDetailsPost(result.post);
        } catch (error) {
            enqueueSnackbar('A ocurrido un error, favor intente mas tarde', { variant: 'error' });
            console.log(error);
        } finally {
        }
    }

    return { guardarPost, getUserAndPost, misPosts, getDetailsPost, detailsPost }
}