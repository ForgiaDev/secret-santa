import { Player } from "@lottiefiles/react-lottie-player";

const Loading: React.FC = () => {
  return (
    <Player
      src="https://lottie.host/903fe366-65e1-44e3-a50e-35fc9940690f/D86ZG9Mfak.json"
      autoplay
      loop
      className="w-3/5 object-cover"
    />
  );
};

export default Loading;
