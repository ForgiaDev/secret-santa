import { Player } from "@lottiefiles/react-lottie-player";

const Loading: React.FC = () => {
  return (
    <Player
      src="https://lottie.host/11d64d95-f0a0-4133-9cc4-e9a9c342e22a/2Kih2p9dng.json"
      autoplay
      loop
      className="w-3/5 object-cover"
    />
  );
};

export default Loading;
