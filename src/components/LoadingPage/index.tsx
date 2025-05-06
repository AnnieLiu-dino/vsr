import './index.scss'

const ProgressBar = ({ progress }: { progress: number }) => {
    return (
        <div className="progress-bar">
            <div className="progress-bar__fill" style={{ width: `${progress}%` }}></div>
        </div >

    );
};

const LoadingPage = ({ progress }: { progress: number }) => {
    return (
        <div className={`loading-page ${progress === 100 && 'hidden'}`}>
            <div className="loading-content">
                <ProgressBar progress={progress} />
                <div className="loading-text">
                    {`${progress}%`}
                </div>
            </div>
        </div>

    )
}
export default LoadingPage;