import Gallery from "./HomePage/Gallery";
import Images from "./HomePage/Images";

const [reload, setReload] = useState(false);

const reFetchImages = () => {
  setReload((prev) => !prev); // Toggle state to force re-render
};

return (
  <div>
    <Gallery reFetchImages={reFetchImages} />
    <Images reload={reload} />
  </div>
);

export default index;
