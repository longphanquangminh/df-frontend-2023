import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useStoreActions, useStoreState } from 'easy-peasy';

export default function BookHeader() {
  const lightMode = useStoreState((state) => state.isLightMode);
  const setLightMode = useStoreActions((actions) => actions.changeLightDarkMode);
  const flexCenterAll = "flex md:flex gap-3 md:justify-between items-center place-self-center";
  return (
    <div className={`${flexCenterAll} p-3 text-xl ${lightMode ? "bg-white" : "bg-black"} duration-300 grid border-b-2 border-[#c5cfd9]`}>
      <h1 className={`capitalize font-bold text-black text-3xl ${flexCenterAll} ${lightMode ? "" : "text-white"} duration-300`}>bookstore</h1>
      <div className={`${flexCenterAll} grid`}>
        <div className={flexCenterAll}>
          <div
            onClick={() => setLightMode(!lightMode)}
            className={`cursor-pointer rounded-full ${lightMode ? `bg-pink-600` : `bg-gray-500`} duration-300 w-16 h-8 relative`}
          >
            <div className={`rounded-full absolute bg-white w-7 h-7 top-0.5 ${lightMode ? `left-[53%]` : `left-0.5`} duration-300`}></div>
          </div>
          <div className={`w-auto md:w-36 ${lightMode? "" : "text-white"} duration-300`}>{lightMode ? "Light" : "Dark"} mode</div>
        </div>
        <div className={`${flexCenterAll} ${lightMode ? "" : "text-white"} duration-300`}>
          <FontAwesomeIcon icon={faCircleUser} />
          John Doe
        </div>
      </div>
    </div>
  );
}
