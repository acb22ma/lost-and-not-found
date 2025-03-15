import lottie from "lottie-web";

export const loadLottieAnimation = async (containerId: string, animationPath: string) => {
  try {
    const response = await fetch(animationPath);
    const animationData = await response.json(); // Ensure it's properly parsed

    return lottie.loadAnimation({
      container: document.getElementById(containerId) as Element,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData, // Pass parsed JSON instead of path
    });
  } catch (error) {
    console.error("Lottie animation failed to load:", error);
  }
};

