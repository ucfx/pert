import "./style.css";

const style = {
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
    },
    loader = {
        width: "100px",
        height: "100px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
    },
    loaderItem = {
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        backgroundColor: "#fff",
        margin: "5px",
        animation: "loader 1s ease-in-out infinite",
    },
    loaderItem1 = {
        animationDelay: "0s",
    },
    loaderItem2 = {
        animationDelay: "0.1s",
    },
    loaderItem3 = {
        animationDelay: "0.2s",
    },
    loaderItem4 = {
        animationDelay: "0.3s",
    },
    loaderItem5 = {
        animationDelay: "0.4s",
    },
    loaderItem6 = {
        animationDelay: "0.5s",
    },
    loaderItem7 = {
        animationDelay: "0.6s",
    },
    loaderItem8 = {
        animationDelay: "0.7s",
    },
    loaderItem9 = {
        animationDelay: "0.8s",
    },
    loaderItem10 = {
        animationDelay: "0.9s",
    },
    keyframes = {
        "0%": {
            transform: "scale(1)",
            opacity: 1,
        },
        "50%": {
            transform: "scale(0.5)",
            opacity: 0.5,
        },
        "100%": {
            transform: "scale(1)",
            opacity: 1,
        },
    };

const Loader = () => {
    return (
        <div className="loader" style={style}>
            <div className="loader__container">
                <div className="loader__container__item"> </div>
                <div className="loader__container__item"> </div>
                <div className="loader__container__item"> </div>
                <div className="loader__container__item"> </div>
                <div className="loader__container__item"> </div>
                <div className="loader__container__item"> </div>
                <div className="loader__container__item"> </div>
                <div className="loader__container__item"> </div>
                <div className="loader__container__item"> </div>
                <div className="loader__container__item"> </div>
            </div>
        </div>
    );
};

export default Loader;
