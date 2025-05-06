import { useEffect } from "react";
import { DefaultLoadingManager } from "three";
import { useDispatch } from 'react-redux';
import { setProgress } from '../store/progress';

const LoadingManager = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const onProgress = (url: string, itemsLoaded: number, totalItems: number) => {
            console.log(url, "=>", itemsLoaded, totalItems);
            const progressPercent = Math.floor((itemsLoaded / totalItems) * 100);
            dispatch(setProgress(progressPercent))
        };

        DefaultLoadingManager.onStart = (url) => { console.log('start', url); };
        DefaultLoadingManager.onProgress = onProgress;
        DefaultLoadingManager.onLoad = () => { console.log('all resources loaded!'); };
        DefaultLoadingManager.onError = (url) => { console.log('error loading', url); };

    }, []);

    return null;
};


export default LoadingManager;
